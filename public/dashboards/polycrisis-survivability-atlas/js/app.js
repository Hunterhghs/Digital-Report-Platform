(function () {
  const { DIMS, SCENARIOS, TIERS, BASE_YEAR, END_YEAR } = Model;
  const YEARS = d3.range(BASE_YEAR, END_YEAR + 1, 5);
  const THRESHOLDS = TIERS.slice(1).map((t) => t.min); // [20,35,50,65,80]

  const COUNTRIES = RAW.map((r) => Object.fromEntries(FIELDS.map((f, i) => [f, r[i]])));
  const BY_ISO = new Map(COUNTRIES.map((c) => [c.iso3, c]));
  const BY_NUM = new Map(COUNTRIES.map((c) => [String(c.num).padStart(3, "0"), c]));
  const REGIONS = [...new Set(COUNTRIES.map((c) => c.region))].sort();

  const defaultWeights = () => Object.fromEntries(DIMS.map((d) => [d.key, 1]));
  const state = {
    scen: "ssp245", year: 2050, lens: "composite",
    weights: defaultWeights(), amplify: true,
    sel: "IND", sortKey: "composite", sortDir: -1, region: "All", q: "",
  };

  // ── URL hash state ─────────────────────────────────────────────────
  function readHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    if (SCENARIOS.some((s) => s.id === p.get("s"))) state.scen = p.get("s");
    const y = +p.get("y"); if (YEARS.includes(y)) state.year = y;
    const l = p.get("l"); if (l === "composite" || DIMS.some((d) => d.key === l)) state.lens = l;
    const c = p.get("c"); if (c && BY_ISO.has(c)) state.sel = c;
    const w = p.get("w");
    if (w) {
      const parts = w.split(",").map(Number);
      if (parts.length === DIMS.length && parts.every((v) => v >= 0 && v <= 3)) DIMS.forEach((d, i) => (state.weights[d.key] = parts[i]));
    }
    if (p.get("a") === "0") state.amplify = false;
  }
  function writeHash() {
    const p = new URLSearchParams({ s: state.scen, y: state.year, l: state.lens, c: state.sel });
    const w = DIMS.map((d) => state.weights[d.key]);
    if (w.some((v) => v !== 1)) p.set("w", w.join(","));
    if (!state.amplify) p.set("a", "0");
    history.replaceState(null, "", "#" + p.toString());
  }

  // ── theme tokens ───────────────────────────────────────────────────
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  let RAMP = [], SCOL = {};
  function readTokens() {
    RAMP = [0, 1, 2, 3, 4, 5].map((i) => css(`--r${i}`));
    SCOL = Object.fromEntries(SCENARIOS.map((s, i) => [s.id, css(`--s${i + 1}`)]));
  }
  const classOf = (v) => d3.bisectRight(THRESHOLDS, v);
  const colorOf = (v) => RAMP[classOf(v)];

  // ── computation ────────────────────────────────────────────────────
  const scenById = (id) => SCENARIOS.find((s) => s.id === id);
  function evalCountry(c, scen, year) {
    const dims = Model.project(c, scen, year);
    return { dims, composite: Model.composite(dims, state.weights, state.amplify) };
  }
  const lensValue = (r) => (state.lens === "composite" ? r.composite : r.dims[state.lens]);
  const lensLabel = () => (state.lens === "composite" ? "Composite survivability risk" : DIMS.find((d) => d.key === state.lens).label);

  let current = new Map(), baseline = new Map(), globalSeries = [];
  function compute() {
    const scen = scenById(state.scen);
    current = new Map(COUNTRIES.map((c) => [c.iso3, evalCountry(c, scen, state.year)]));
    baseline = new Map(COUNTRIES.map((c) => [c.iso3, evalCountry(c, scen, BASE_YEAR)]));
  }
  function computeGlobal() {
    globalSeries = SCENARIOS.map((s) => ({
      id: s.id, label: s.label,
      values: YEARS.map((y) => {
        let num = 0, den = 0;
        for (const c of COUNTRIES) {
          const p = Model.population(c, y);
          num += p * evalCountry(c, s, y).composite; den += p;
        }
        return { year: y, value: num / den };
      }),
    }));
  }

  // ── tooltip ────────────────────────────────────────────────────────
  const tip = document.getElementById("tooltip");
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function tipRow(key, value, color, box) {
    const row = el("div", "tt-row");
    const k = el("span", "k");
    if (color) { const i = el("i", box ? "box" : ""); i.style.background = color; k.appendChild(i); }
    k.appendChild(document.createTextNode(key));
    row.append(k, el("b", null, value));
    return row;
  }
  function showTip(nodes, x, y) {
    tip.replaceChildren(...nodes);
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = x + 14, top = y + 14;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - 14;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = Math.max(8, top) + "px";
  }
  const hideTip = () => (tip.hidden = true);
  const fmt = (v) => Math.round(v).toString();

  // ── controls ───────────────────────────────────────────────────────
  function buildControls() {
    const seg = document.getElementById("scenarioSeg");
    SCENARIOS.forEach((s, i) => {
      const b = el("button");
      b.type = "button"; b.setAttribute("role", "radio"); b.dataset.id = s.id;
      b.title = `${s.name}: ${s.blurb}`;
      const k = el("i", "key"); k.style.background = `var(--s${i + 1})`;
      b.append(k, document.createTextNode(s.label));
      b.addEventListener("click", () => { state.scen = s.id; update(); });
      seg.appendChild(b);
    });

    const yr = document.getElementById("yearRange");
    yr.value = state.year;
    yr.addEventListener("input", () => { state.year = +yr.value; update({ light: true }); });

    const lens = document.getElementById("lensSelect");
    lens.appendChild(new Option("Composite risk", "composite"));
    DIMS.forEach((d) => lens.appendChild(new Option(d.label, d.key)));
    lens.value = state.lens;
    lens.addEventListener("change", () => { state.lens = lens.value; update({ light: true }); });

    const ws = document.getElementById("weightSliders");
    DIMS.forEach((d) => {
      const row = el("div", "w-row");
      const lab = el("label", null, d.label); lab.htmlFor = "w-" + d.key;
      const inp = document.createElement("input");
      Object.assign(inp, { type: "range", min: 0, max: 3, step: 0.5, id: "w-" + d.key, value: state.weights[d.key] });
      const out = el("output", null, state.weights[d.key].toFixed(1));
      inp.addEventListener("input", () => {
        state.weights[d.key] = +inp.value; out.textContent = (+inp.value).toFixed(1);
        update({ weights: true });
      });
      row.append(lab, inp, out); ws.appendChild(row);
    });
    const amp = document.getElementById("amplify");
    amp.checked = state.amplify;
    amp.addEventListener("change", () => { state.amplify = amp.checked; update({ weights: true }); });
    document.getElementById("resetWeights").addEventListener("click", () => {
      state.weights = defaultWeights(); state.amplify = true; amp.checked = true;
      DIMS.forEach((d) => { document.getElementById("w-" + d.key).value = 1; document.getElementById("w-" + d.key).nextSibling.textContent = "1.0"; });
      update({ weights: true });
    });
    document.addEventListener("click", (e) => {
      const p = document.getElementById("weightsPanel");
      if (p.open && !p.contains(e.target)) p.open = false;
    });

    // play
    let timer = null;
    const playBtn = document.getElementById("playBtn"), icon = document.getElementById("playIcon");
    const stop = () => { clearInterval(timer); timer = null; icon.setAttribute("d", "M3 1.5v11l9-5.5z"); playBtn.setAttribute("aria-label", "Play timeline"); };
    playBtn.addEventListener("click", () => {
      if (timer) return stop();
      if (state.year >= END_YEAR) state.year = BASE_YEAR - 5;
      icon.setAttribute("d", "M3 2h3v10H3zM8 2h3v10H8z"); playBtn.setAttribute("aria-label", "Pause timeline");
      timer = setInterval(() => {
        state.year = Math.min(END_YEAR, state.year + 5); yr.value = state.year; update({ light: true });
        if (state.year >= END_YEAR) stop();
      }, 650);
    });

    // table tools
    const rs = document.getElementById("regionSelect");
    rs.appendChild(new Option("All regions", "All"));
    REGIONS.forEach((r) => rs.appendChild(new Option(r, r)));
    rs.addEventListener("change", () => { state.region = rs.value; renderTable(); });
    document.getElementById("search").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); renderTable(); });

    // theme
    document.getElementById("themeToggle").addEventListener("click", () => {
      const isDark = getComputedStyle(document.documentElement).colorScheme === "dark";
      const next = isDark ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("psa-theme", next); } catch (e) {}
      readTokens(); renderAll();
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readTokens(); renderAll(); });
  }

  // ── map ────────────────────────────────────────────────────────────
  let mapSel = null, mapG = null, zoom = null;
  async function buildMap() {
    const svg = d3.select("#map");
    const status = document.getElementById("mapStatus");
    let world;
    try {
      world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json");
    } catch (e) {
      status.textContent = "Map failed to load — the table below still has every value.";
      return;
    }
    status.remove();
    const features = topojson.feature(world, world.objects.countries).features.filter((f) => f.id !== "010");
    const W = 960, H = 505;
    svg.attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");
    const projection = d3.geoEqualEarth().fitExtent([[6, 6], [W - 6, H - 6]], { type: "Sphere" });
    const path = d3.geoPath(projection);
    mapG = svg.append("g");
    mapG.append("path").attr("class", "sphere").attr("d", path({ type: "Sphere" }));
    mapG.append("path").attr("class", "graticule").attr("d", path(d3.geoGraticule10()));
    mapSel = mapG.append("g").selectAll("path").data(features).join("path")
      .attr("class", (f) => "country" + (BY_NUM.has(f.id) ? "" : " nodata"))
      .attr("d", path)
      .on("pointermove", (ev, f) => {
        const c = BY_NUM.get(f.id);
        if (!c) return showTip([el("div", "tt-title", f.properties.name), el("div", "tt-sub", "No data")], ev.clientX, ev.clientY);
        const r = current.get(c.iso3), v = lensValue(r);
        const top = DIMS.map((d) => [d, r.dims[d.key]]).sort((a, b) => b[1] - a[1]).slice(0, 2);
        showTip([
          el("div", "tt-title", c.name),
          tipRow(state.lens === "composite" ? "Composite" : DIMS.find((d) => d.key === state.lens).short, `${fmt(v)} · ${Model.tierOf(v).label}`, colorOf(v), true),
          el("div", "tt-sub", "Top stresses: " + top.map(([d, x]) => `${d.short} ${fmt(x)}`).join(", ")),
        ], ev.clientX, ev.clientY);
      })
      .on("pointerleave", hideTip)
      .on("click", (ev, f) => { const c = BY_NUM.get(f.id); if (c) { state.sel = c.iso3; update({ light: true }); } });

    // Plain wheel and one-finger swipes scroll the page; ⌘/Ctrl+wheel, pinch, drag and the buttons zoom/pan.
    zoom = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [W, H]])
      .filter((ev) => ev.type === "wheel" ? ev.ctrlKey || ev.metaKey : ev.type.startsWith("touch") ? ev.touches.length > 1 : !ev.button)
      .on("zoom", (ev) => mapG.attr("transform", ev.transform));
    svg.call(zoom).style("touch-action", "pan-x pan-y");
    document.getElementById("zoomReset").addEventListener("click", () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));
    document.getElementById("zoomIn").addEventListener("click", () => svg.transition().duration(250).call(zoom.scaleBy, 1.6));
    document.getElementById("zoomOut").addEventListener("click", () => svg.transition().duration(250).call(zoom.scaleBy, 1 / 1.6));
    renderMap();
  }
  function renderMap() {
    document.getElementById("mapTitle").textContent = `${lensLabel()} · ${scenById(state.scen).label} · ${state.year}`;
    if (!mapSel) return;
    mapSel
      .style("fill", (f) => { const c = BY_NUM.get(f.id); return c ? colorOf(lensValue(current.get(c.iso3))) : null; })
      .classed("selected", (f) => BY_NUM.get(f.id)?.iso3 === state.sel);
    mapSel.filter(".selected").raise();
  }
  function renderLegend() {
    const lg = document.getElementById("legend");
    const scale = el("div", "legend-scale");
    const sw = el("div", "legend-swatches"), lb = el("div", "legend-labels");
    TIERS.forEach((t, i) => {
      const s = el("span"); s.style.background = RAMP[i]; sw.appendChild(s);
      const l = el("span"); l.appendChild(el("b", null, t.label));
      l.appendChild(document.createTextNode(i < TIERS.length - 1 ? `${t.min}–${TIERS[i + 1].min}` : `${t.min}+`));
      lb.appendChild(l);
    });
    scale.append(sw, lb);
    const nd = el("span", "legend-nodata"); nd.append(el("i"), document.createTextNode("No data"));
    lg.replaceChildren(scale, nd);
  }

  // ── line chart ─────────────────────────────────────────────────────
  function lineChart(svgEl, series, opts) {
    const svg = d3.select(svgEl);
    const box = svgEl.getBoundingClientRect();
    const W = Math.max(260, box.width), H = Math.max(160, box.height);
    const m = { t: 10, r: 78, b: 22, l: 30 };
    svg.attr("viewBox", `0 0 ${W} ${H}`).selectAll("*").remove();
    const x = d3.scaleLinear([BASE_YEAR, END_YEAR], [m.l, W - m.r]);
    const ext = d3.extent(series.flatMap((s) => s.values.map((v) => v.value)));
    const lo = Math.max(0, Math.floor((ext[0] - 6) / 10) * 10), hi = Math.min(100, Math.ceil((ext[1] + 6) / 10) * 10);
    const y = d3.scaleLinear([lo, hi], [H - m.b, m.t]);
    const g = svg.append("g");
    const yt = y.ticks(4);
    g.append("g").selectAll("line").data(yt).join("line").attr("class", "gridline")
      .attr("x1", m.l).attr("x2", W - m.r).attr("y1", y).attr("y2", y);
    g.append("g").attr("class", "axis").selectAll("text").data(yt).join("text")
      .attr("x", m.l - 6).attr("y", y).attr("dy", "0.32em").attr("text-anchor", "end").text((d) => d);
    g.append("line").attr("class", "baseline").attr("x1", m.l).attr("x2", W - m.r).attr("y1", H - m.b).attr("y2", H - m.b);
    g.append("g").attr("class", "axis").selectAll("text").data([2025, 2050, 2075, 2100]).join("text")
      .attr("x", x).attr("y", H - 6).attr("text-anchor", (d) => (d === 2025 ? "start" : d === 2100 ? "end" : "middle")).text((d) => d);
    g.append("line").attr("class", "year-marker").attr("x1", x(state.year)).attr("x2", x(state.year)).attr("y1", m.t).attr("y2", H - m.b);

    const line = d3.line().x((d) => x(d.year)).y((d) => y(d.value)).curve(d3.curveMonotoneX);
    g.append("g").selectAll("path").data(series).join("path")
      .attr("class", (s) => "series" + (s.id === state.scen ? "" : " dim"))
      .attr("stroke", (s) => SCOL[s.id]).attr("d", (s) => line(s.values));
    // the active scenario sits on top
    g.selectAll(".series:not(.dim)").raise();

    // direct end labels with simple collision avoidance
    const ends = series.map((s) => ({ s, y: y(s.values[s.values.length - 1].value) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 12) ends[i].y = ends[i - 1].y + 12;
    g.append("g").selectAll("text").data(ends).join("text").attr("class", "end-label")
      .attr("x", W - m.r + 6).attr("y", (d) => d.y).attr("dy", "0.32em")
      .style("font-weight", (d) => (d.s.id === state.scen ? 600 : 400))
      .text((d) => `${d.s.label} ${fmt(d.s.values[d.s.values.length - 1].value)}`);

    // hover crosshair
    const cross = g.append("line").attr("class", "crosshair").attr("y1", m.t).attr("y2", H - m.b).style("display", "none");
    const dots = g.append("g").selectAll("circle").data(series).join("circle").attr("class", "dot").attr("r", 4)
      .attr("fill", (s) => SCOL[s.id]).style("display", "none");
    svg.append("rect").attr("x", m.l).attr("y", 0).attr("width", W - m.l - m.r).attr("height", H).attr("fill", "transparent")
      .on("pointermove", (ev) => {
        const [px] = d3.pointer(ev);
        const yr = Math.max(BASE_YEAR, Math.min(END_YEAR, Math.round(x.invert(px) / 5) * 5));
        const i = YEARS.indexOf(yr);
        cross.style("display", null).attr("x1", x(yr)).attr("x2", x(yr));
        dots.style("display", null).attr("cx", x(yr)).attr("cy", (s) => y(s.values[i].value));
        const rows = [...series].sort((a, b) => b.values[i].value - a.values[i].value)
          .map((s) => tipRow(s.label, fmt(s.values[i].value), SCOL[s.id]));
        showTip([el("div", "tt-title", `${opts.title} · ${yr}`), ...rows], ev.clientX, ev.clientY);
      })
      .on("pointerleave", () => { cross.style("display", "none"); dots.style("display", "none"); hideTip(); });
  }

  // ── detail panel ───────────────────────────────────────────────────
  function renderDetail() {
    const c = BY_ISO.get(state.sel); if (!c) return;
    const r = current.get(c.iso3), b = baseline.get(c.iso3);
    const tier = Model.tierOf(r.composite);
    document.getElementById("detRegion").textContent = c.region;
    document.getElementById("detName").textContent = c.name;
    document.getElementById("detValue").textContent = fmt(r.composite);
    const pill = document.getElementById("detTier");
    const sw = el("i"); sw.style.background = colorOf(r.composite);
    pill.replaceChildren(sw, document.createTextNode(`${tier.label} composite risk`));
    const delta = r.composite - b.composite;
    const meta = document.getElementById("detMeta");
    const dSpan = el("span", delta > 0.5 ? "delta-up" : delta < -0.5 ? "delta-down" : "", `${delta >= 0 ? "+" : "−"}${Math.abs(delta).toFixed(1)}`);
    meta.replaceChildren(
      document.createTextNode(`${state.year}, ${scenById(state.scen).label}: `), dSpan,
      document.createTextNode(` vs 2025 · population ≈ ${d3.format(",.1~f")(Model.population(c, state.year))}M`)
    );

    const bars = document.getElementById("detBars");
    bars.replaceChildren(...DIMS.map((d) => {
      const v = r.dims[d.key], v0 = b.dims[d.key];
      const row = el("div", "dim-row");
      row.title = `${d.label}: ${fmt(v)} (2025: ${fmt(v0)})`;
      const track = el("div", "dim-track");
      const fill = el("div", "dim-fill"); fill.style.width = v + "%"; fill.style.background = colorOf(v);
      const tick = el("div", "dim-tick"); tick.style.left = v0 + "%";
      track.append(fill, tick);
      const lab = el("span", "lab", d.label);
      if (state.weights[d.key] === 0) lab.style.textDecoration = "line-through";
      row.append(lab, track, el("span", "val", fmt(v)));
      return row;
    }));

    const series = SCENARIOS.map((s) => ({ id: s.id, label: s.label, values: YEARS.map((y) => ({ year: y, value: evalCountry(c, s, y).composite })) }));
    lineChart(document.getElementById("detChart"), series, { title: c.name });
  }

  // ── KPIs & global ──────────────────────────────────────────────────
  function renderKPIs() {
    const scen = scenById(state.scen);
    const gs = globalSeries.find((s) => s.id === state.scen);
    const v = gs.values.find((p) => p.year === state.year).value, v0 = gs.values[0].value;
    setKpi("kpiGlobal", fmt(v), "");
    const d = v - v0;
    const foot = document.getElementById("kpiGlobalFoot");
    foot.replaceChildren(document.createTextNode(`${Model.tierOf(v).label} · `),
      el("span", d > 0.5 ? "delta-up" : d < -0.5 ? "delta-down" : "", `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}`),
      document.createTextNode(" vs 2025"));

    let tot = 0, hi = 0, n = 0;
    const tierPop = TIERS.map(() => 0);
    for (const c of COUNTRIES) {
      const p = Model.population(c, state.year), comp = current.get(c.iso3).composite;
      tot += p; tierPop[classOf(comp)] += p;
      if (comp >= 50) hi += p;
      if (comp >= 65) n++;
    }
    setKpi("kpiPop", (hi / 1000).toFixed(1), "bn");
    document.getElementById("kpiPopFoot").textContent = `${Math.round((100 * hi) / tot)}% of ${(tot / 1000).toFixed(1)} bn people`;
    setKpi("kpiCount", n, `/ ${COUNTRIES.length}`);
    document.getElementById("kpiCountFoot").textContent = "composite score ≥ 65";
    setKpi("kpiTemp", "+" + Model.warming(scen, state.year).toFixed(1), "°C");
    document.getElementById("kpiTempFoot").textContent = `IPCC AR6 median, ${scen.label}`;

    // tier bar
    document.getElementById("tierYear").textContent = state.year;
    const bar = document.getElementById("tierBar");
    bar.replaceChildren(...TIERS.map((t, i) => {
      const s = el("span"); s.style.flexGrow = tierPop[i]; s.style.background = RAMP[i];
      s.addEventListener("pointermove", (ev) => showTip([el("div", "tt-title", `${t.label} risk`), tipRow("People", `${(tierPop[i] / 1000).toFixed(2)} bn`, RAMP[i], true), tipRow("Share", `${Math.round((100 * tierPop[i]) / tot)}%`)], ev.clientX, ev.clientY));
      s.addEventListener("pointerleave", hideTip);
      return s;
    }));
    document.getElementById("tierBarLegend").replaceChildren(...TIERS.map((t, i) => {
      const s = el("span"); const sw = el("i"); sw.style.background = RAMP[i];
      s.append(sw, document.createTextNode(t.label + " "), el("b", null, `${Math.round((100 * tierPop[i]) / tot)}%`));
      return s;
    }));
  }
  function setKpi(id, value, unit) {
    const e = document.getElementById(id);
    e.replaceChildren(document.createTextNode(value));
    if (unit) e.appendChild(el("span", "unit", unit));
  }
  function renderScenario() {
    document.querySelectorAll("#scenarioSeg button").forEach((b) => b.setAttribute("aria-checked", b.dataset.id === state.scen));
    const s = scenById(state.scen);
    const p = document.getElementById("scenBlurb");
    p.replaceChildren(el("strong", null, `${s.label} — ${s.name}. `), document.createTextNode(s.blurb));
    document.getElementById("yearOut").textContent = state.year;
  }

  // ── table ──────────────────────────────────────────────────────────
  const COLS = [
    { key: "rank", label: "#" },
    { key: "name", label: "Country" },
    { key: "region", label: "Region" },
    { key: "composite", label: "Composite" },
    ...DIMS.map((d) => ({ key: d.key, label: d.short })),
    { key: "delta", label: "Δ vs 2025" },
  ];
  function buildTableHead() {
    const tr = document.getElementById("theadRow");
    COLS.forEach((col) => {
      const th = el("th", null, col.label); th.scope = "col"; th.tabIndex = 0;
      if (col.key === "rank") { tr.appendChild(th); return; }
      const sort = () => {
        if (state.sortKey === col.key) state.sortDir *= -1;
        else { state.sortKey = col.key; state.sortDir = col.key === "name" || col.key === "region" ? 1 : -1; }
        renderTable();
      };
      th.addEventListener("click", sort);
      th.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); } });
      th.dataset.key = col.key;
      tr.appendChild(th);
    });
  }
  function renderTable() {
    document.querySelectorAll("#theadRow th[data-key]").forEach((th) => {
      const col = COLS.find((c) => c.key === th.dataset.key);
      if (th.dataset.key === state.sortKey) { th.setAttribute("aria-sort", state.sortDir > 0 ? "ascending" : "descending"); th.textContent = col.label + (state.sortDir > 0 ? " ↑" : " ↓"); }
      else { th.removeAttribute("aria-sort"); th.textContent = col.label; }
    });
    // rank is always by composite
    const ranked = [...COUNTRIES].sort((a, b) => current.get(b.iso3).composite - current.get(a.iso3).composite);
    const rankOf = new Map(ranked.map((c, i) => [c.iso3, i + 1]));
    const val = (c, k) => {
      const r = current.get(c.iso3);
      if (k === "name" || k === "region") return c[k];
      if (k === "composite") return r.composite;
      if (k === "delta") return r.composite - baseline.get(c.iso3).composite;
      return r.dims[k];
    };
    let rows = COUNTRIES.filter((c) => (state.region === "All" || c.region === state.region) && (!state.q || c.name.toLowerCase().includes(state.q)));
    rows.sort((a, b) => {
      const va = val(a, state.sortKey), vb = val(b, state.sortKey);
      return (typeof va === "string" ? va.localeCompare(vb) : va - vb) * state.sortDir;
    });
    const tbody = document.getElementById("tbody");
    tbody.replaceChildren(...rows.map((c) => {
      const r = current.get(c.iso3);
      const tr = el("tr"); tr.tabIndex = 0;
      if (c.iso3 === state.sel) tr.className = "selected";
      tr.appendChild(el("td", "rank", rankOf.get(c.iso3)));
      tr.appendChild(el("td", null, c.name));
      tr.appendChild(el("td", "region", c.region));
      const comp = el("td", "comp"); const sw = el("span", "sw"); sw.style.background = colorOf(r.composite);
      comp.append(sw, document.createTextNode(fmt(r.composite))); comp.title = Model.tierOf(r.composite).label;
      tr.appendChild(comp);
      DIMS.forEach((d) => {
        const td = el("td"); const s = el("span", "sw"); s.style.background = colorOf(r.dims[d.key]);
        td.append(s, document.createTextNode(fmt(r.dims[d.key]))); tr.appendChild(td);
      });
      const dlt = r.composite - baseline.get(c.iso3).composite;
      tr.appendChild(el("td", dlt > 0.5 ? "delta-up" : dlt < -0.5 ? "delta-down" : "", `${dlt >= 0 ? "+" : "−"}${Math.abs(dlt).toFixed(1)}`));
      const pick = () => { state.sel = c.iso3; update({ light: true, keepTableScroll: true }); };
      tr.addEventListener("click", pick);
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter") pick(); });
      return tr;
    }));
    if (!rows.length) { const tr = el("tr"); const td = el("td", "muted", "No matching countries"); td.colSpan = COLS.length; tr.appendChild(td); tbody.appendChild(tr); }
  }

  // ── orchestration ──────────────────────────────────────────────────
  function renderAll() {
    renderScenario(); renderLegend(); renderMap(); renderKPIs(); renderDetail();
    lineChart(document.getElementById("globalChart"), globalSeries, { title: "World" });
    renderTable();
  }
  function update(opts = {}) {
    if (opts.weights || !globalSeries.length) computeGlobal();
    compute(); renderAll(); writeHash();
  }

  readHash();
  readTokens();
  buildControls();
  buildTableHead();
  update({ weights: true });
  buildMap();
  window.addEventListener("hashchange", () => {
    readHash();
    document.getElementById("yearRange").value = state.year;
    document.getElementById("lensSelect").value = state.lens;
    DIMS.forEach((d) => { const i = document.getElementById("w-" + d.key); i.value = state.weights[d.key]; i.nextSibling.textContent = state.weights[d.key].toFixed(1); });
    document.getElementById("amplify").checked = state.amplify;
    update({ weights: true });
  });
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(renderAll, 150); });
})();
