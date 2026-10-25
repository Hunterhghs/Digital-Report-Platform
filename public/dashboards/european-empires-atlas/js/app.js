/* European Empires — dashboard logic (Leaflet + Chart.js, no API keys) */
(function () {
  "use strict";

  var YEAR_MIN = -3000;
  var YEAR_MAX = 2026;
  var TICK_MS = 50;

  var empires = [];          // enriched features, sorted by start
  var currentYear = YEAR_MIN;
  var selectedId = null;
  var playing = false;
  var playTimer = null;
  var speed = 100;           // years per second
  var activeLayer = null;    // L.LayerGroup of active polygons
  var capitalsLayer = null;  // L.LayerGroup of capital markers
  var map = null;
  var lifespanChart = null;

  var $ = function (id) { return document.getElementById(id); };

  /* ── Formatting helpers ─────────────────────────────────── */
  function formatYear(y) {
    if (y === 0) return "1 AD"; // no year zero in the historical calendar
    if (y < 0) return (-y) + " BC";
    if (y < 1000) return y + " AD";
    return y + " AD";
  }

  function eraFor(y) {
    if (y <= -1200) return "Bronze Age";
    if (y <= -500) return "Iron Age";
    if (y <= 1) return "Classical Antiquity";
    if (y <= 476) return "Roman Era";
    if (y <= 1000) return "Early Middle Ages";
    if (y <= 1300) return "High Middle Ages";
    if (y <= 1500) return "Late Middle Ages";
    if (y <= 1789) return "Early Modern";
    if (y <= 1914) return "Long 19th Century";
    if (y <= 1945) return "World Wars";
    return "Contemporary";
  }

  function formatArea(km2) {
    if (!isFinite(km2)) return "—";
    if (km2 >= 1e6) return (km2 / 1e6).toFixed(2) + "M km²";
    return Math.round(km2).toLocaleString("en-US") + " km²";
  }

  function formatSpan(start, end) {
    return formatYear(start) + " – " + formatYear(end);
  }

  function formatDuration(start, end) {
    var yrs = end - start;
    var label = yrs + " years";
    if (yrs >= 100) label = Math.round(yrs / 100) + " centuries";
    if (yrs >= 1000) label = (yrs / 1000).toFixed(yrs % 1000 === 0 ? 0 : 1) + " millennia";
    return label;
  }

  /* ── Spherical polygon area (WGS84 approximation, km²) ──── */
  var R_EARTH = 6371.0088;
  function ringAreaKm2(ring) {
    var s = 0, n = ring.length;
    if (n < 3) return 0;
    for (var i = 0; i < n; i++) {
      var a = ring[i], b = ring[(i + 1) % n];
      var dLon = (b[0] - a[0]) * Math.PI / 180;
      s += dLon * (Math.sin(a[1] * Math.PI / 180) + Math.sin(b[1] * Math.PI / 180));
    }
    return Math.abs(s) * R_EARTH * R_EARTH / 2;
  }
  function geomAreaKm2(g) {
    if (!g) return 0;
    if (g.type === "Polygon") return ringAreaKm2(g.coordinates[0]);
    if (g.type === "MultiPolygon") {
      return g.coordinates.reduce(function (sum, poly) { return sum + ringAreaKm2(poly[0]); }, 0);
    }
    return 0;
  }

  /* ── Bootstrap ──────────────────────────────────────────── */
  function loadData() {
    return fetch("data/empires.json").then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " loading data/empires.json");
      return r.json();
    }).then(function (fc) {
      empires = (fc.features || []).map(function (f) {
        var p = f.properties;
        return {
          feature: f,
          props: p,
          area: geomAreaKm2(f.geometry),
          duration: p.end - p.start
        };
      });
      empires.sort(function (a, b) { return a.props.start - b.props.start; });
    }).catch(function (err) {
      var el = $("loadError");
      el.hidden = false;
      el.textContent = "Could not load the empire dataset (data/empires.json). " +
        "Serve this folder over HTTP (e.g. python3 -m http.server) and reload. — " + err.message;
      throw err;
    });
  }

  /* ── Map ────────────────────────────────────────────────── */
  function initMap() {
    map = L.map("map", { zoomControl: false, minZoom: 3, maxZoom: 9, worldCopyJump: true });
    map.setView([50.5, 12.5], 4);
    map.setMaxBounds([[18, -50], [74, 75]]);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Free CARTO/OSM basemap — no API key, no watermark (attribution only).
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      subdomains: "abcd",
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

    activeLayer = L.layerGroup().addTo(map);
    capitalsLayer = L.layerGroup().addTo(map);
  }

  function styleFor(empire, selected) {
    return {
      color: selected ? "#f4e6b8" : empire.props.color,
      weight: selected ? 2.5 : 1.1,
      opacity: selected ? 0.95 : 0.75,
      fillColor: empire.props.color,
      fillOpacity: selected ? 0.62 : 0.42
    };
  }

  function renderActive(year) {
    activeLayer.clearLayers();
    capitalsLayer.clearLayers();

    var active = empires.filter(function (e) {
      return e.props.start <= year && year <= e.props.end;
    });
    // Draw largest first so smaller polities stay visible on top.
    active.sort(function (a, b) { return b.area - a.area; });

    active.forEach(function (empire) {
      var layer = L.geoJSON(empire.feature, {
        style: function () { return styleFor(empire, empire.props.id === selectedId); }
      });
      layer.bindTooltip(
        "<b>" + empire.props.name + "</b><br>" + formatSpan(empire.props.start, empire.props.end),
        { sticky: true, direction: "top" }
      );
      layer.on("click", function () { selectEmpire(empire, { switchTab: true, focus: true }); });
      layer.on("mouseover", function () {
        layer.bringToFront();
        if (empire.props.id !== selectedId) layer.setStyle({ fillOpacity: 0.58, weight: 1.6 });
      });
      layer.on("mouseout", function () {
        if (empire.props.id !== selectedId) layer.setStyle(styleFor(empire, false));
      });
      layer.addTo(activeLayer);

      var cap = empire.props.capital_coords;
      if (cap && cap.length === 2) {
        var marker = L.circleMarker([cap[1], cap[0]], {
          radius: selectedId === empire.props.id ? 4 : 2.6,
          color: "#e7c966",
          weight: 1,
          opacity: 0.9,
          fillColor: "#e7c966",
          fillOpacity: 0.9
        });
        marker.bindTooltip("<b>" + empire.props.name + "</b><br>" + empire.props.capital);
        marker.on("click", function () { selectEmpire(empire, { switchTab: true, focus: false }); });
        marker.addTo(capitalsLayer);
      }
    });

    return active;
  }

  /* ── State updates ──────────────────────────────────────── */
  function updateYear(year) {
    currentYear = Math.min(YEAR_MAX, Math.max(YEAR_MIN, year));
    var active = renderActive(currentYear);
    updateChrome(active);
    highlightLifespanNow();
  }

  function updateChrome(active) {
    $("yearSlider").value = currentYear;
    $("yearDisplay").textContent = formatYear(currentYear);
    var era = eraFor(currentYear);
    $("eraBadge").textContent = era;
    $("kpiEra").textContent = era;
    $("kpiCount").textContent = active.length;

    var total = active.reduce(function (s, e) { return s + e.area; }, 0);
    $("kpiArea").textContent = formatArea(total);

    var dominant = null;
    active.forEach(function (e) { if (!dominant || e.area > dominant.area) dominant = e; });
    $("kpiDominant").textContent = dominant ? dominant.props.name : "—";
    $("kpiDominant").title = dominant ? dominant.props.name + " · " + formatArea(dominant.area) : "";

    renderActiveList(active);
  }

  function renderActiveList(active) {
    var list = $("activeList");
    list.innerHTML = "";
    var head = document.createElement("div");
    head.className = "list-head";
    head.textContent = formatYear(currentYear) + " · " + active.length + " active";
    list.appendChild(head);

    if (!active.length) {
      var empty = document.createElement("div");
      empty.className = "muted";
      empty.style.padding = "8px 14px";
      empty.textContent = "No polity in this dataset is recorded as active at this year.";
      list.appendChild(empty);
      return;
    }

    active.forEach(function (empire) {
      var item = document.createElement("div");
      item.className = "active-item" + (empire.props.id === selectedId ? " selected" : "");
      item.title = empire.props.name + " — click to inspect";

      var sw = document.createElement("span");
      sw.className = "swatch";
      sw.style.background = empire.props.color;

      var main = document.createElement("div");
      main.className = "ai-main";
      var nm = document.createElement("div");
      nm.className = "ai-name";
      nm.textContent = empire.props.name;
      var sub = document.createElement("div");
      sub.className = "ai-sub";
      sub.textContent = formatSpan(empire.props.start, empire.props.end);
      main.appendChild(nm);
      main.appendChild(sub);

      var area = document.createElement("div");
      area.className = "ai-area";
      area.textContent = formatArea(empire.area);

      item.appendChild(sw);
      item.appendChild(main);
      item.appendChild(area);
      item.addEventListener("click", function () { selectEmpire(empire, { switchTab: true, focus: true }); });
      list.appendChild(item);
    });
  }

  /* ── Selection / detail ─────────────────────────────────── */
  function selectEmpire(empire, opts) {
    opts = opts || {};
    selectedId = empire.props.id;
    renderActive(currentYear);
    renderActiveList(activeAt(currentYear));
    renderDetail(empire);
    if (opts.switchTab) switchTab("detail");
    if (opts.focus) focusEmpire(empire);
  }

  function activeAt(year) {
    return empires.filter(function (e) { return e.props.start <= year && year <= e.props.end; })
      .sort(function (a, b) { return b.area - a.area; });
  }

  function focusEmpire(empire) {
    try {
      var layer = L.geoJSON(empire.feature);
      var bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6.5 });
      }
    } catch (e) { /* non-fatal */ }
  }

  function renderDetail(empire) {
    var el = $("detailContent");
    var p = empire.props;
    var html =
      '<div class="detail-kicker">' + escapeHtml(p.type) + "</div>" +
      '<h2 class="detail-title">' + escapeHtml(p.name) + "</h2>" +
      '<div class="detail-years">' + formatSpan(p.start, p.end) +
      " · " + formatDuration(p.start, p.end) + "</div>" +
      '<dl class="detail-meta">' +
      "<dt>Capital / core</dt><dd>" + escapeHtml(p.capital) + "</dd>" +
      "<dt>Peak</dt><dd>" + formatYear(p.peak) + "</dd>" +
      "<dt>Territory shown</dt><dd>" + formatArea(empire.area) + "</dd>" +
      "</dl>" +
      '<p class="detail-desc">' + escapeHtml(p.description) + "</p>" +
      '<div class="detail-actions">' +
      '<button class="btn primary" id="btnPeak">Jump to peak (' + formatYear(p.peak) + ")</button>" +
      '<button class="btn" id="btnFocus">Focus map</button>' +
      '<button class="btn ghost" id="btnClear">Clear selection</button>' +
      "</div>";
    el.innerHTML = html;

    $("btnPeak").addEventListener("click", function () {
      jumpToYear(p.peak);
      selectEmpire(empire, { switchTab: true, focus: true });
    });
    $("btnFocus").addEventListener("click", function () { focusEmpire(empire); });
    $("btnClear").addEventListener("click", function () {
      selectedId = null;
      renderActive(currentYear);
      renderActiveList(activeAt(currentYear));
      el.innerHTML = '<p class="muted">Select an empire on the map or in a list to inspect it.</p>';
      switchTab("active");
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ── Tabs ───────────────────────────────────────────────── */
  function switchTab(name) {
    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.tab === name);
      t.setAttribute("aria-selected", t.dataset.tab === name ? "true" : "false");
    });
    document.querySelectorAll(".panel").forEach(function (pnl) {
      pnl.classList.toggle("active", pnl.id === "panel" + name.charAt(0).toUpperCase() + name.slice(1));
    });
  }
  document.querySelectorAll(".tab").forEach(function (t) {
    t.addEventListener("click", function () { switchTab(t.dataset.tab); });
  });

  /* ── Lifespan (Gantt) chart ─────────────────────────────── */
  function renderLifespans() {
    if (typeof Chart === "undefined") return;
    var labels = empires.map(function (e) { return e.props.name; });
    var data = labels.map(function (name, i) {
      return { x: [empires[i].props.start, empires[i].props.end], y: name };
    });
    var colors = empires.map(function (e) { return e.props.color; });

    var wrap = $("lifespanWrap");
    var height = Math.max(320, labels.length * 13 + 30);
    wrap.innerHTML = '<canvas id="lifespanChart"></canvas>';
    var canvas = $("lifespanChart");
    canvas.style.width = "100%";
    canvas.style.height = height + "px";

    lifespanChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          borderRadius: 2,
          barThickness: 7
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#101a2c",
            borderColor: "rgba(201,162,39,0.35)",
            borderWidth: 1,
            titleColor: "#e7c966",
            bodyColor: "#e9e3d3",
            callbacks: {
              title: function (items) { return items[0].label; },
              label: function (ctx) {
                var i = ctx.dataIndex;
                var e = empires[i];
                return formatSpan(e.props.start, e.props.end) + " · " + formatDuration(e.props.start, e.props.end);
              }
            }
          }
        },
        scales: {
          x: {
            type: "linear",
            min: YEAR_MIN,
            max: YEAR_MAX,
            grid: { color: "rgba(201,162,39,0.08)" },
            ticks: {
              color: "#8b93a5",
              font: { size: 9 },
              maxTicksLimit: 12,
              callback: function (v) { return formatYear(v); }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: "#8b93a5",
              font: { size: 9.5 },
              autoSkip: false,
              maxRotation: 0
            }
          }
        },
        onClick: function (evt, els) {
          if (els && els.length) {
            var i = els[0].index;
            var e = empires[i];
            jumpToYear(e.props.peak);
            selectEmpire(e, { switchTab: true, focus: true });
          }
        }
      }
    });
  }

  function highlightLifespanNow() {
    // Cheap visual cue: re-tint bars? Chart.js has no annotation plugin bundled,
    // so we leave the Gantt static; the active list carries the year context.
  }

  /* ── Playback controls ──────────────────────────────────── */
  function jumpToYear(y) {
    updateYear(Math.min(YEAR_MAX, Math.max(YEAR_MIN, y)));
  }

  function step(delta) {
    jumpToYear(currentYear + delta);
  }

  function setPlaying(on) {
    playing = on;
    $("btnPlay").classList.toggle("playing", playing);
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    if (playing) {
      playTimer = setInterval(function () {
        var stepY = Math.max(1, Math.round(speed * TICK_MS / 1000));
        var next = currentYear + stepY;
        if (next > YEAR_MAX) {
          updateYear(YEAR_MAX);
          setPlaying(false);
          return;
        }
        updateYear(next);
      }, TICK_MS);
    }
  }

  function wireControls() {
    $("btnPlay").addEventListener("click", function () { setPlaying(!playing); });
    $("btnBack100").addEventListener("click", function () { step(-100); });
    $("btnBack10").addEventListener("click", function () { step(-10); });
    $("btnFwd10").addEventListener("click", function () { step(10); });
    $("btnFwd100").addEventListener("click", function () { step(100); });
    $("btnStart").addEventListener("click", function () { jumpToYear(YEAR_MIN); });
    $("btnEnd").addEventListener("click", function () { jumpToYear(YEAR_MAX); });

    $("yearSlider").addEventListener("input", function () {
      jumpToYear(parseInt(this.value, 10));
    });

    $("speedSelect").addEventListener("change", function () {
      speed = parseInt(this.value, 10);
      if (playing) setPlaying(true); // restart timer with new speed
    });

    $("sidebarToggle").addEventListener("click", function () {
      $("sidebar").classList.toggle("open");
    });

    document.addEventListener("keydown", function (ev) {
      var tag = (ev.target && ev.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      if (ev.code === "Space") { ev.preventDefault(); setPlaying(!playing); }
      else if (ev.key === "ArrowLeft") { ev.preventDefault(); step(ev.shiftKey ? -10 : -1); }
      else if (ev.key === "ArrowRight") { ev.preventDefault(); step(ev.shiftKey ? 10 : 1); }
      else if (ev.key === "Home") { ev.preventDefault(); jumpToYear(YEAR_MIN); }
      else if (ev.key === "End") { ev.preventDefault(); jumpToYear(YEAR_MAX); }
      else if (ev.key === "Escape") {
        selectedId = null;
        renderActive(currentYear);
        renderActiveList(activeAt(currentYear));
        $("detailContent").innerHTML = '<p class="muted">Select an empire on the map or in a list to inspect it.</p>';
      }
    });

    window.addEventListener("resize", function () {
      if (map) map.invalidateSize();
    });
  }

  /* ── Init ───────────────────────────────────────────────── */
  loadData().then(function () {
    initMap();
    wireControls();
    renderLifespans();
    updateYear(YEAR_MIN);
  }).catch(function () { /* loadData already surfaced the error */ });
})();
