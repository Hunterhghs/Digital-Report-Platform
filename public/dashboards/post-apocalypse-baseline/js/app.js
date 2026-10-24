/* ============================================================
   POST-APOCALYPSE BASELINE — application logic
   Fixed webapp console · Leaflet vector map (no tiles) · Chart.js
   ============================================================ */
'use strict';

(function () {
  const A = window.APX;
  const $ = (id) => document.getElementById(id);

  const state = {
    metric: 'divergence',
    scenario: 'current',
    year: 2020,
    playing: false,
    playTimer: null
  };

  const GOLD = '#e8b95c', EMBER = '#e0603f', TOXIC = '#d94f4f', TEAL = '#35c7b8',
        VIOLET = '#8f6fd0', SLATE = '#5b7087', MUTED = '#7c8ba0';

  /* ---------------- color helpers ---------------- */
  function hexRgb(h) {
    h = String(h).replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function mix(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    const A = hexRgb(a), B = hexRgb(b);
    const r = Math.round(A[0] + (B[0] - A[0]) * t);
    const g = Math.round(A[1] + (B[1] - A[1]) * t);
    const bl = Math.round(A[2] + (B[2] - A[2]) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }
  function piecewise(t, stops) { // t 0..1, stops = colors
    if (t <= 0) return stops[0];
    if (t >= 1) return stops[stops.length - 1];
    const x = t * (stops.length - 1);
    const i = Math.floor(x);
    return mix(stops[i], stops[i + 1], x - i);
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  const SEQ_STOPS = ['#16222f', '#2f3c4d', '#6e5a35', '#c9a227', '#d97b3a', '#d94f4f'];
  const DIVERGE = { low: '#d94f4f', mid: SLATE, high: TEAL };

  const METRICS = {
    divergence: { seq: true,  domain: [0, 1],  stops: SEQ_STOPS, label: 'Divergence index', fmt: (v) => v.toFixed(2) },
    heat:       { seq: true,  domain: [0, 1],  stops: SEQ_STOPS, label: 'Thermal hazard index', fmt: (v) => v.toFixed(2) },
    water:      { seq: true,  domain: [0, 1],  stops: SEQ_STOPS, label: 'Water-stress index', fmt: (v) => v.toFixed(2) },
    tfr:        { seq: false, domain: [0.6, 6.8], mid: 2.1, label: 'Total fertility rate (2024)', fmt: (v) => v.toFixed(2) + ' births/woman' },
    pop2100:    { seq: false, domain: [0.4, 6.2], mid: 1.0, label: 'Population multiplier 2020→2100', fmt: (v) => v.toFixed(2) + '×' }
  };

  /* ---------------- country lookup ---------------- */
  const REGION_RULES = [
    { re: /Africa|Congo|Sahara|Somaliland|Sudan|Ethiopia|Eritrea|Djibouti|Uganda|Kenya|Tanzania|Zambia|Zimbabwe|Malawi|Mozambique|Angola|Nigeria|Niger|Mali|Chad|Senegal|Gambia|Guinea|Sierra Leone|Liberia|Côte|Togo|Benin|Burkina|Ghana|Cameroon|Gabon|Burundi|Rwanda|Madagascar|Mauritania|Lesotho|eSwatini|Botswana|Namibia|Cabo Verde|Comoros|Mauritius|Seychelles|Eq\./, p: { tfr: 4.0, heat: 0.85, water: 0.72, pop: 2.5 } },
    { re: /Saudi|Yemen|Oman|Emirates|Qatar|Bahrain|Kuwait|Iraq|Iran|Jordan|Lebanon|Syria|Palestine|Israel|Egypt|Libya|Tunisia|Algeria|Morocco/, p: { tfr: 2.5, heat: 0.85, water: 0.85, pop: 1.4 } },
    { re: /India|Pakistan|Bangladesh|Nepal|Bhutan|Sri Lanka|Maldives|Afghanistan/, p: { tfr: 2.2, heat: 0.80, water: 0.80, pop: 1.3 } },
    { re: /Indonesia|Philippines|Malaysia|Brunei|Timor|Laos|Cambodia|Myanmar|Thailand|Vietnam|Papua|Solomon|Vanuatu|Fiji|Samoa|Tonga|Micronesia|Kiribati|Marshall|Nauru|Palau|Tuvalu|New Caledonia/, p: { tfr: 2.2, heat: 0.70, water: 0.50, pop: 1.2 } },
    { re: /Mexico|Brazil|Colombia|Peru|Bolivia|Venezuela|Ecuador|Guyana|Suriname|Paraguay|Uruguay|Argentina|Chile|Guatemala|Belize|Honduras|El Salvador|Nicaragua|Costa Rica|Panama|Cuba|Haiti|Dominican|Jamaica|Trinidad|Bahamas|Barbados|Grenada|St\./, p: { tfr: 1.9, heat: 0.60, water: 0.50, pop: 0.95 } },
    { re: /Kazakhstan|Uzbekistan|Turkmenistan|Kyrgyzstan|Tajikistan/, p: { tfr: 2.8, heat: 0.60, water: 0.80, pop: 1.1 } },
    { re: /China|Taiwan|Korea|Japan|Mongolia/, p: { tfr: 1.2, heat: 0.40, water: 0.50, pop: 0.7 } },
    { re: /United States|Canada|Greenland|United Kingdom|Ireland|France|Germany|Spain|Portugal|Italy|Greece|Austria|Switzerland|Belgium|Netherlands|Luxembourg|Denmark|Norway|Sweden|Finland|Iceland|Poland|Czech|Slovak|Hungary|Romania|Bulgaria|Serbia|Croatia|Slovenia|Bosnia|Montenegro|Macedonia|Albania|Estonia|Latvia|Lithuania|Belarus|Ukraine|Moldova|Russia|Australia|New Zealand|Malta|Cyprus/, p: { tfr: 1.4, heat: 0.25, water: 0.30, pop: 0.9 } },
    { re: /./, p: { tfr: 2.1, heat: 0.5, water: 0.5, pop: 1.0 } }
  ];
  function countryProfile(name) {
    if (A.COUNTRY_DATA[name]) return A.COUNTRY_DATA[name];
    for (let i = 0; i < REGION_RULES.length; i++) {
      if (REGION_RULES[i].re.test(name)) return REGION_RULES[i].p;
    }
    return { tfr: 2.1, heat: 0.5, water: 0.5, pop: 1.0 };
  }
  function growthScore(pop) { return clamp((pop - 0.5) / 3, 0, 1); }
  function metricValue(name) {
    const p = countryProfile(name);
    if (state.metric === 'tfr') return p.tfr;
    if (state.metric === 'heat') return p.heat;
    if (state.metric === 'water') return p.water;
    if (state.metric === 'pop2100') return p.pop;
    const g = growthScore(p.pop);
    const t = (state.year - 2020) / 80;
    const d2020 = clamp(0.5 * p.heat + 0.3 * p.water + 0.2 * g, 0, 1);
    const d2100 = clamp(0.45 * p.heat + 0.35 * p.water + 0.35 * g, 0, 1);
    return d2020 + (d2100 - d2020) * t;
  }
  function colorForValue(v) {
    const m = METRICS[state.metric];
    if (m.seq) {
      const t = (v - m.domain[0]) / (m.domain[1] - m.domain[0]);
      return piecewise(t, m.stops);
    }
    const lo = m.domain[0], hi = m.domain[1], mid = m.mid;
    if (v <= mid) return mix(DIVERGE.low, DIVERGE.mid, (v - lo) / (mid - lo));
    return mix(DIVERGE.mid, DIVERGE.high, (v - mid) / (hi - mid));
  }

  /* ---------------- Leaflet vector map (no tiles → no watermark) ---------------- */
  let map = null, geoLayer = null, hoveredName = null;

  function initMap() {
    map = L.map('map', {
      attributionControl: false,
      zoomControl: false,
      minZoom: 2,
      maxZoom: 7,
      center: [22, 12],
      zoom: 2,
      worldCopyJump: false
    });
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    const fc = window.COUNTRIES_GEOJSON;
    geoLayer = L.geoJSON(fc, {
      style: styleFn,
      onEachFeature: onEach
    }).addTo(map);

    map.fitBounds(geoLayer.getBounds(), { padding: [4, 4] });
  }

  function styleFn(feature) {
    const name = feature.properties && feature.properties.name ? feature.properties.name : '';
    const v = metricValue(name);
    const base = {
      weight: 0.6,
      color: 'rgba(255,255,255,0.10)',
      fillColor: colorForValue(v),
      fillOpacity: 0.88
    };
    if (name === hoveredName) {
      base.weight = 1.4;
      base.color = GOLD;
      base.fillOpacity = 1;
    }
    return base;
  }

  function onEach(feature, layer) {
    const name = feature.properties && feature.properties.name ? feature.properties.name : '—';
    layer.bindTooltip(name, { sticky: true, className: 'apx-tip', direction: 'top' });
    layer.on({
      mouseover: function () {
        hoveredName = name;
        layer.setStyle(styleFn(feature));
        layer.bringToFront();
        const v = metricValue(name);
        const m = METRICS[state.metric];
        $('mapReadout').innerHTML =
          '<b>' + name + '</b> — ' + m.label + ': <b>' + m.fmt(v) + '</b>' +
          (state.metric === 'divergence' ? ' · year ' + state.year : '');
      },
      mouseout: function () {
        hoveredName = null;
        layer.setStyle(styleFn(feature));
        $('mapReadout').innerHTML = '<b>World</b> — drag, zoom, hover a country. The ember-red band marks where future population growth and lethal-heat exposure now coincide.';
      }
    });
  }

  function redrawMap() {
    if (!geoLayer) return;
    geoLayer.setStyle(styleFn);
    updateLegend();
    updateMapNote();
  }

  function updateLegend() {
    const m = METRICS[state.metric];
    $('mapLegendTitle').textContent = m.label;
    const grad = $('mapLegendGrad');
    if (m.seq) {
      grad.style.background = 'linear-gradient(90deg,' + m.stops.join(',') + ')';
      $('mapLegendLow').textContent = String(m.domain[0]);
      $('mapLegendHigh').textContent = String(m.domain[1]);
    } else {
      grad.style.background = 'linear-gradient(90deg,' + DIVERGE.low + ',' + DIVERGE.mid + ',' + DIVERGE.high + ')';
      $('mapLegendLow').textContent = String(m.domain[0]);
      $('mapLegendHigh').textContent = String(m.domain[1]);
    }
  }

  function updateMapNote() {
    const m = METRICS[state.metric];
    const timePart = state.metric === 'divergence' ? ' · Year ' + state.year : ' · time-static metric';
    $('mapNote').textContent = 'Metric: ' + m.label + timePart + ' · local vector geometry, no tile service';
  }

  /* ---------------- Chart.js ---------------- */
  const charts = {};
  if (window.Chart) {
    Chart.defaults.color = MUTED;
    Chart.defaults.font.family = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
    Chart.defaults.font.size = 10;
    Chart.defaults.plugins.tooltip.backgroundColor = '#0d131b';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(232,185,92,.3)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.titleColor = GOLD;
    Chart.defaults.plugins.tooltip.bodyColor = '#dbe4ee';
  }

  const replacementLinePlugin = {
    id: 'replacementLine',
    afterDraw(chart) {
      if (chart.canvas.id !== 'cTfr') return;
      const xa = chart.scales.x, a = chart.chartArea;
      if (!xa || !a) return;
      const x = xa.getPixelForValue(2.1);
      if (!isFinite(x)) return;
      const ctx = chart.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgba(232,185,92,.6)';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, a.top);
      ctx.lineTo(x, a.bottom);
      ctx.stroke();
      ctx.fillStyle = GOLD;
      ctx.font = '9px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillText('replacement 2.1', x - 4, a.top + 10);
      ctx.restore();
    }
  };

  const yearMarkerPlugin = {
    id: 'yearMarker',
    afterDraw(chart) {
      if (chart.canvas.id !== 'cPop') return;
      const xa = chart.scales.x, a = chart.chartArea;
      if (!xa || !a) return;
      const idx = A.POP_YEARS.indexOf(state.year);
      if (idx < 0) return;
      let x = xa.getPixelForValue(A.POP_YEARS[idx]);
      if (!isFinite(x)) x = xa.getPixelForValue(idx);
      if (!isFinite(x)) return;
      const ctx = chart.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgba(232,185,92,.55)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, a.top);
      ctx.lineTo(x, a.bottom);
      ctx.stroke();
      ctx.fillStyle = GOLD;
      ctx.font = '9px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(state.year), x, a.top + 9);
      ctx.restore();
    }
  };

  function gridOpts() {
    return {
      x: {
        ticks: { color: '#64788f', maxTicksLimit: 10, autoSkip: true, font: { size: 9 } },
        grid: { color: 'rgba(255,255,255,.05)' }
      },
      y: {
        ticks: { color: '#64788f', font: { size: 9 } },
        grid: { color: 'rgba(255,255,255,.06)' }
      }
    };
  }

  function buildCharts() {
    if (!window.Chart) return;

    /* cTfr — fertility vs replacement */
    charts.cTfr = new Chart($('cTfr'), {
      type: 'bar',
      data: {
        labels: A.TFR_CHART.map(d => d.label),
        datasets: [{
          label: 'TFR 2024',
          data: A.TFR_CHART.map(d => d.value),
          backgroundColor: A.TFR_CHART.map(d => d.group === 'west' ? EMBER : TEAL),
          borderRadius: 2,
          barThickness: 12
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ' ' + c.parsed.x + ' births/woman' } }
        },
        scales: {
          x: { ...gridOpts().x, min: 0, max: 7, title: { display: true, text: 'births per woman', color: '#64788f', font: { size: 9 } } },
          y: { ...gridOpts().y, ticks: { color: '#8fa3b8', font: { size: 9 } } }
        }
      },
      plugins: [replacementLinePlugin]
    });

    /* cPop — demographic pivot */
    charts.cPop = new Chart($('cPop'), {
      type: 'line',
      data: {
        labels: A.POP_YEARS,
        datasets: [
          { label: 'Europe', data: A.POP_SERIES['Europe'], borderColor: TOXIC, backgroundColor: 'rgba(217,79,79,.08)', borderWidth: 1.6, pointRadius: 0, tension: 0.25, fill: false },
          { label: 'North America', data: A.POP_SERIES['North America'], borderColor: GOLD, borderWidth: 1.6, pointRadius: 0, tension: 0.25, fill: false },
          { label: 'Sub-Saharan Africa', data: A.POP_SERIES['Sub-Saharan Africa'], borderColor: TEAL, borderWidth: 1.6, pointRadius: 0, tension: 0.25, fill: false },
          { label: 'South Asia', data: A.POP_SERIES['South Asia'], borderColor: VIOLET, borderWidth: 1.6, pointRadius: 0, tension: 0.25, fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { color: '#8fa3b8', boxWidth: 10, boxHeight: 10, font: { size: 9 } } }
        },
        scales: {
          x: gridOpts().x,
          y: { ...gridOpts().y, title: { display: true, text: 'population index (1950 = 100)', color: '#64788f', font: { size: 9 } } }
        }
      },
      plugins: [yearMarkerPlugin]
    });

    /* cNiche — Holocene niche breach */
    charts.cNiche = new Chart($('cNiche'), {
      type: 'bar',
      data: nicheData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ' ' + c.parsed.y + ' billion people' } }
        },
        scales: {
          x: { ...gridOpts().x, ticks: { color: '#8fa3b8', font: { size: 8.5 }, autoSkip: false } },
          y: { ...gridOpts().y, title: { display: true, text: 'billions of people', color: '#64788f', font: { size: 9 } }, min: 0, max: 5 }
        }
      }
    });

    /* cShare — 2020 vs 2100 regional share */
    charts.cShare = new Chart($('cShare'), {
      type: 'bar',
      data: {
        labels: A.SHARE_CHART.labels,
        datasets: [
          { label: '2020', data: A.SHARE_CHART.y2020, backgroundColor: SLATE, borderRadius: 2 },
          { label: '2100', data: A.SHARE_CHART.y2100, backgroundColor: TEAL, borderRadius: 2 }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#8fa3b8', boxWidth: 10, boxHeight: 10, font: { size: 9 } } },
          tooltip: { callbacks: { label: (c) => ' ' + c.dataset.label + ': ' + c.parsed.x + '% of humanity' } }
        },
        scales: {
          x: { ...gridOpts().x, title: { display: true, text: '% of world population', color: '#64788f', font: { size: 9 } }, max: 40 },
          y: { ...gridOpts().y, ticks: { color: '#8fa3b8', font: { size: 9 } } }
        }
      }
    });

    /* cDeepTime — committed warming + SLR */
    charts.cDeepTime = new Chart($('cDeepTime'), {
      type: 'line',
      data: deepTimeData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#8fa3b8', boxWidth: 10, boxHeight: 10, font: { size: 9 }, filter: (item) => !item.text.startsWith('_') }
          }
        },
        scales: {
          x: { ...gridOpts().x, title: { display: true, text: 'year CE', color: '#64788f', font: { size: 9 } } },
          y: { ...gridOpts().y, title: { display: true, text: '°C above pre-industrial', color: GOLD, font: { size: 9 } }, min: 0, max: 5 },
          y1: {
            position: 'right',
            title: { display: true, text: 'sea-level rise (m)', color: TEAL, font: { size: 9 } },
            ticks: { color: '#64788f', font: { size: 9 } },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });

    /* cCarbon — deep-time drawdown ledger */
    charts.cCarbon = new Chart($('cCarbon'), {
      type: 'line',
      data: {
        labels: A.CARBON_CHART.map(d => d.year),
        datasets: [{
          label: '% excess CO₂ remaining',
          data: A.CARBON_CHART.map(d => d.pct),
          borderColor: GOLD,
          backgroundColor: 'rgba(232,185,92,.12)',
          borderWidth: 1.8,
          pointRadius: 3,
          pointBackgroundColor: GOLD,
          fill: true,
          tension: 0.15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            type: 'logarithmic',
            title: { display: true, text: 'years from now (log scale)', color: '#64788f', font: { size: 9 } },
            ticks: { color: '#64788f', font: { size: 9 }, callback: (v) => (v >= 1000 ? (v / 1000) + 'k' : v) },
            grid: { color: 'rgba(255,255,255,.05)' }
          },
          y: { ...gridOpts().y, min: 0, max: 110, title: { display: true, text: '% remaining', color: '#64788f', font: { size: 9 } } }
        }
      }
    });

    /* cRadar — compound vulnerability */
    charts.cRadar = new Chart($('cRadar'), {
      type: 'radar',
      data: {
        labels: A.RADAR_CHART.labels,
        datasets: [
          { label: 'Western core', data: A.RADAR_CHART.west, borderColor: '#8fa3b8', backgroundColor: 'rgba(143,163,184,.12)', pointBackgroundColor: '#8fa3b8' },
          { label: 'Equatorial epicenters', data: A.RADAR_CHART.frontier, borderColor: TOXIC, backgroundColor: 'rgba(217,79,79,.16)', pointBackgroundColor: TOXIC }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#8fa3b8', boxWidth: 10, boxHeight: 10, font: { size: 9 } } } },
        scales: {
          r: {
            min: 0, max: 100,
            angleLines: { color: 'rgba(255,255,255,.07)' },
            grid: { color: 'rgba(255,255,255,.07)' },
            pointLabels: { color: '#8fa3b8', font: { size: 9 } },
            ticks: { display: false }
          }
        }
      }
    });

    /* cVectors — attrition vectors (log) */
    const vecColors = [TOXIC, EMBER, GOLD, TEAL];
    charts.cVectors = new Chart($('cVectors'), {
      type: 'bar',
      data: {
        labels: A.VECTORS_CHART.map(d => d.label),
        datasets: [{
          label: 'magnitude',
          data: A.VECTORS_CHART.map(d => d.value),
          backgroundColor: vecColors,
          borderRadius: 2
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ' ' + A.VECTORS_CHART[c.dataIndex].value.toLocaleString() + ' ' + A.VECTORS_CHART[c.dataIndex].unit } }
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: { display: true, text: 'people affected (log scale)', color: '#64788f', font: { size: 9 } },
            ticks: { color: '#64788f', font: { size: 9 }, callback: (v) => (v >= 1000 ? (v / 1000) + 'B' : v + 'M') },
            grid: { color: 'rgba(255,255,255,.05)' }
          },
          y: { ...gridOpts().y, ticks: { color: '#8fa3b8', font: { size: 8.5 } } }
        }
      }
    });

    /* cAttrition — deep-time runway */
    charts.cAttrition = new Chart($('cAttrition'), {
      type: 'line',
      data: {
        labels: A.ATTRITION_CHART.points.map(d => d.year),
        datasets: [
          {
            label: 'Civilizational buffer (illustrative)',
            data: A.ATTRITION_CHART.points.map(d => d.buf),
            borderColor: GOLD,
            backgroundColor: 'rgba(232,185,92,.10)',
            borderWidth: 1.8,
            pointRadius: 3,
            pointBackgroundColor: GOLD,
            fill: true,
            tension: 0.2
          },
          {
            label: 'Extinction threshold zone',
            data: A.ATTRITION_CHART.points.map(() => A.ATTRITION_CHART.floor),
            borderColor: TOXIC,
            borderDash: [5, 5],
            borderWidth: 1.2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#8fa3b8', boxWidth: 10, boxHeight: 10, font: { size: 9 } } } },
        scales: {
          x: {
            type: 'logarithmic',
            title: { display: true, text: 'year CE (log scale)', color: '#64788f', font: { size: 9 } },
            ticks: { color: '#64788f', font: { size: 9 }, callback: (v) => (v >= 100000 ? '100k CE' : (v >= 10000 ? (v / 1000) + 'k CE' : String(v))) },
            grid: { color: 'rgba(255,255,255,.05)' }
          },
          y: { ...gridOpts().y, min: 0, max: 105, title: { display: true, text: 'habitability buffer (index)', color: '#64788f', font: { size: 9 } } }
        }
      }
    });
  }

  function nicheData() {
    const hi = A.NICHE_CHART.highlight[state.scenario];
    return {
      labels: A.NICHE_CHART.labels,
      datasets: [{
        label: 'billions outside niche',
        data: A.NICHE_CHART.values,
        backgroundColor: A.NICHE_CHART.values.map((v, i) => i === hi ? EMBER : SLATE),
        borderRadius: 3
      }]
    };
  }

  function deepTimeData() {
    const D = A.DEEPTIME[state.scenario];
    return {
      labels: A.DEEPTIME_YEARS,
      datasets: [
        { label: '_tempLo', data: D.tempLo, borderColor: 'transparent', backgroundColor: 'transparent', pointRadius: 0, fill: false },
        { label: 'Committed warming (°C)', data: D.temp, borderColor: GOLD, backgroundColor: 'rgba(232,185,92,.14)', borderWidth: 1.8, pointRadius: 0, fill: '-1', tension: 0.2 },
        { label: '_slrLo', data: D.slrLo, borderColor: 'transparent', backgroundColor: 'transparent', pointRadius: 0, fill: false, yAxisID: 'y1' },
        { label: 'Committed sea-level rise (m)', data: D.slr, borderColor: TEAL, backgroundColor: 'rgba(53,199,184,.12)', borderWidth: 1.8, pointRadius: 0, fill: '-1', tension: 0.2, yAxisID: 'y1' }
      ]
    };
  }

  function updateScenario() {
    if (charts.cNiche) { charts.cNiche.data = nicheData(); charts.cNiche.update(); }
    if (charts.cDeepTime) { charts.cDeepTime.data = deepTimeData(); charts.cDeepTime.update(); }
  }

  /* ---------------- sidebar & controls ---------------- */
  function initControls() {
    const toggle = $('sideToggle');
    const sidebar = $('sidebar');
    toggle.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('collapsed');
      toggle.textContent = collapsed ? '▸' : '▸ COLLAPSE';
    });

    const menuBtn = $('menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    $('metricSelect').addEventListener('change', (e) => {
      state.metric = e.target.value;
      const timeActive = state.metric === 'divergence';
      $('timelineNote').textContent = timeActive ? '' : '— static metric';
      $('yearSlider').disabled = !timeActive;
      $('playBtn').disabled = !timeActive;
      if (!timeActive) stopPlay();
      redrawMap();
    });

    document.querySelectorAll('#scenarioRow button').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#scenarioRow button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.scenario = btn.dataset.scen;
        updateScenario();
      });
    });

    $('yearSlider').addEventListener('input', (e) => {
      state.year = Number(e.target.value);
      $('yearReadout').textContent = state.year;
      if (state.metric === 'divergence') redrawMap();
      if (charts.cPop) charts.cPop.update();
    });

    $('playBtn').addEventListener('click', () => {
      if (state.playing) stopPlay(); else startPlay();
    });

    initScrollSpy();
    initClock();
  }

  function startPlay() {
    if (state.metric !== 'divergence') return;
    state.playing = true;
    $('playBtn').textContent = '❚❚ PAUSE';
    state.playTimer = setInterval(() => {
      let y = state.year + 5;
      if (y > 2100) y = 2020;
      state.year = y;
      $('yearSlider').value = y;
      $('yearReadout').textContent = y;
      redrawMap();
      if (charts.cPop) charts.cPop.update();
    }, 140);
  }
  function stopPlay() {
    state.playing = false;
    if (state.playTimer) { clearInterval(state.playTimer); state.playTimer = null; }
    $('playBtn').textContent = '▶ PLAY';
  }

  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('#navSections a'));
    const sections = links.map(l => document.querySelector(l.getAttribute('href')));
    const stage = $('stage');
    stage.addEventListener('scroll', () => {
      let current = links[0];
      const probe = stage.scrollTop + 120;
      const stageTop = stage.getBoundingClientRect().top;
      for (let i = 0; i < sections.length; i++) {
        if (!sections[i]) continue;
        const top = sections[i].getBoundingClientRect().top - stageTop + stage.scrollTop;
        if (top <= probe) current = links[i];
      }
      links.forEach(l => l.classList.remove('active'));
      current.classList.add('active');
    }, { passive: true });
  }

  function initClock() {
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      $('clock').textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ' UTC' + (-d.getTimezoneOffset() / 60 >= 0 ? '+' : '') + (-d.getTimezoneOffset() / 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    if (window.L && window.COUNTRIES_GEOJSON) initMap();
    buildCharts();
    initControls();
    updateLegend();
    updateMapNote();
    $('timelineNote').textContent = '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
