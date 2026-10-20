/* ===========================================================================
   Charts and interactions — "S-Curves Against the Clock" (hybrid dashboard)

   DATA: world adoption series 2000–2025 (EV share of car sales, solar and
   wind shares of electricity, low-carbon share of primary energy), solar
   module prices 1975–2024 and fossil CO2 1990–2024 (Our World in Data);
   logistic fits [rate, midpoint, K] from the author's least-squares fits;
   Armstrong McKay et al. (2022) thresholds [name, kind, central, min, max].
   The race model and budgets follow the Method section. Colours come from
   the theme tokens (adoption, clock and threshold ramps).
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var DATA = {"years":[2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],"solar":[0.01,0.01,0.01,0.01,0.02,0.02,0.03,0.04,0.06,0.1,0.15,0.29,0.43,0.57,0.83,1.07,1.33,1.75,2.17,2.6,3.19,3.73,4.61,5.61,6.93,8.75],"wind":[0.2,0.25,0.33,0.38,0.49,0.58,0.71,0.87,1.1,1.39,1.63,2.0,2.35,2.74,2.97,3.46,3.89,4.48,4.79,5.3,5.96,6.57,7.29,7.82,8.11,8.54],"ev":[null,null,null,null,null,null,null,null,null,null,0.012,0.072,0.17,0.29,0.44,0.68,0.95,1.4,2.4,2.7,4.4,9.3,15.0,18.0,21.0,25.0],"lowc":[10.9,10.93,10.92,10.46,10.53,10.38,10.38,10.14,10.38,10.63,10.63,10.35,10.14,10.34,10.64,10.87,11.15,11.28,11.53,11.97,12.61,12.58,12.58,12.86,13.35,13.76],"pv":{"y":[1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[132.376,99.598,72.661,51.408,43.195,36.605,29.266,26.295,21.228,19.725,17.22,14.245,12.11,11.312,11.69,12.091,11.201,10.435,9.759,9.232,8.536,7.98,7.952,7.166,6.619,6.496,6.284,5.747,5.464,4.695,4.746,5.173,5.211,4.749,3.174,2.512,2.061,1.111,0.857,0.791,0.736,0.68,0.571,0.509,0.467,0.37,0.332,0.366,0.322,0.265]},"co2":{"y":[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[22.73,23.21,22.52,22.75,22.97,23.52,24.23,24.38,24.3,24.84,25.51,25.69,26.27,27.65,28.61,29.6,30.59,31.5,32.05,31.51,33.32,34.48,34.95,35.28,35.47,35.4,35.39,35.97,36.73,37.09,35.16,36.87,37.53,38.09,38.6]},"fits":{"ev":[0.421,2027.0,100],"solar":[0.251,2033.8,100],"wind":[0.114,2044.5,100],"sw":[0.161,2032.3,75],"lowc":[0.026,2095.7,100]},"tip":[["Low-latitude coral reefs","die-off",1.5,1.0,2.0,"regional"],["Boreal permafrost","abrupt thaw",1.5,1.0,2.3,"regional"],["Greenland Ice Sheet","collapse",1.5,0.8,3.0,"core"],["West Antarctic Ice Sheet","collapse",1.5,1.0,3.0,"core"],["Barents Sea ice","abrupt loss",1.6,1.5,1.7,"regional"],["Labrador–Irminger Sea convection","collapse",1.8,1.1,3.8,"core"],["Mountain glaciers","loss",2.0,1.5,3.0,"regional"],["Sahel / W. African monsoon","greening",2.8,2.0,3.5,"regional"],["East Antarctic subglacial basins","collapse",3.0,2.0,6.0,"core"],["Amazon rainforest","dieback",3.5,2.0,6.0,"core"],["Boreal forest","southern dieback",4.0,1.4,5.0,"regional"],["Boreal permafrost","collapse",4.0,3.0,6.0,"core"],["Atlantic overturning (AMOC)","collapse",4.0,1.4,8.0,"core"],["Arctic winter sea ice","collapse",6.3,4.5,8.7,"core"],["East Antarctic Ice Sheet","collapse",7.5,5.0,10.0,"core"]]};
  var FIT = DATA.fits, TIP = DATA.tip;

  /* --- model ---------------------------------------------------------------------------- */

  var S0 = 0.1376, E0 = 42.2, TAPER = 50;
  var BUD = [[0, 1.36], [130, 1.5], [310, 1.6], [490, 1.7], [1050, 2.0]], HI = 0.3 / 560;
  function temp(C) {
    for (var i = 1; i < BUD.length; i++) if (C <= BUD[i][0]) return BUD[i - 1][1] + (BUD[i][1] - BUD[i - 1][1]) * (C - BUD[i - 1][0]) / (BUD[i][0] - BUD[i - 1][0]);
    return 2.0 + (C - 1050) * HI;
  }
  function logistic(r, t0, K, t) { return K / (1 + Math.exp(-r * (t - t0))); }
  function run(yrs, g0, end) {
    var r = Math.log(81) / yrs, M = 2025 + Math.log((1 - S0) / S0) / r, C = 0, D = 1, out = [];
    for (var y = 2025; y <= (end || 2200); y++) {
      if (y > 2025) D *= 1 + g0 * Math.max(0, 1 - (y - 2025) / TAPER);
      var S = 1 / (1 + Math.exp(-r * (y - M))), E = E0 * D * (1 - S) / (1 - S0);
      C += E;
      out.push({ y: y, S: S, E: E, C: C, T: temp(C) });
    }
    return { r: r, M: M, path: out };
  }
  function peak(yrs, g0) { var p = run(yrs, g0).path; return p[p.length - 1].T; }
  function crossYear(path, th) { for (var i = 0; i < path.length; i++) if (path[i].T >= th) return path[i].y; return null; }
  function speedFor(ceiling, g0) {
    var lo = 5, hi = 400;  // years; more years = slower = hotter
    if (peak(lo, g0) >= ceiling) return null;
    for (var k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (peak(m, g0) < ceiling) lo = m; else hi = m; }
    return lo;
  }

  /* --- helpers ------------------------------------------------------------------------ */

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  var A = { fast: tok('--a-fast'), mid: tok('--a-mid'), slow: tok('--a-slow'), clock: tok('--a-clock'), budget: tok('--a-budget'), muted: tok('--a-muted'), ev: tok('--a-ev'), wind: tok('--a-wind') };
  var TR = ['--t0', '--t1', '--t2', '--t3', '--t4'].map(tok);
  var INK = tok('--text');
  function tcol(c) { return c < 1.6 ? TR[1] : c < 2.1 ? TR[2] : c < 3.6 ? TR[3] : TR[4]; }
  var CURVES = { ev: ['EV share of car sales', A.ev, 'ev'], solar: ['Solar share of electricity', A.fast, 'solar'], wind: ['Wind share of electricity', A.wind, 'wind'], lowc: ['Low-carbon share of primary energy', A.slow, 'lowc'] };

  var state = { yrs: 169, g: 0.013 };

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, labels = HH.valueLabels;
    var tick = { color: tok('--text-muted'), font: { size: 10.5 } };
    var Y = DATA.years;

    /* 1. S-curves */
    var LY = []; for (var y = 2000; y <= 2070; y++) LY.push(y);
    var sc = HH.chart('chart-scurves', {
      type: 'line',
      data: { labels: LY, datasets: [] },
      options: { spanGaps: true, plugins: { legend: { position: 'bottom', labels: { filter: function (it) { return it.text.indexOf('fit') === -1; } } }, tooltip: { mode: 'index', intersect: false, filter: function (it) { return it.raw !== null; }, callbacks: { label: function (c) { return c.dataset.label + ': ' + c.raw.toFixed(1) + '%'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return LY[i] % 10 === 0 ? LY[i] : ''; } }, tick) }), y: Object.assign(axis({ title: '% of market or system' }), { min: 0, max: 100 }) } },
    });
    function drawCurves(which) {
      var ds = [];
      Object.keys(CURVES).forEach(function (k) {
        if (which !== 'all' && which !== k) return;
        var c = CURVES[k], f = FIT[c[2]], raw = DATA[k];
        ds.push({ label: c[0], data: LY.map(function (yy) { var i = Y.indexOf(yy); return i > -1 ? raw[i] : null; }), borderColor: c[1], backgroundColor: c[1], showLine: false, pointRadius: 3.2, pointHoverRadius: 5 });
        ds.push({ label: c[0] + ' fit', data: LY.map(function (yy) { return +logistic(f[0], f[1], f[2], yy).toFixed(2); }), borderColor: alpha(c[1], 0.8), borderWidth: k === 'lowc' ? 3.2 : 2, borderDash: [5, 4], pointRadius: 0 });
      });
      if (sc) { sc.data.datasets = ds; sc.update(); }
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-cv]'), function (b, _, all) {
      b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false');
      b.addEventListener('click', function () { Array.prototype.forEach.call(all, function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); }); drawCurves(b.getAttribute('data-cv')); });
    });
    drawCurves('all');

    HH.chart('chart-pv', {
      type: 'line',
      data: { labels: DATA.pv.y, datasets: [{ label: 'Module price, $/W', data: DATA.pv.v, borderColor: A.fast, backgroundColor: alpha(A.fast, 0.12), fill: true, pointRadius: 0 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '$' + c.raw.toFixed(2) + ' per watt'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return DATA.pv.y[i] % 10 === 0 ? DATA.pv.y[i] : ''; } }, tick) }),
          y: Object.assign(axis({ title: 'US$ per watt (log)' }), { type: 'logarithmic', min: 0.1, max: 200, ticks: Object.assign({}, tick, { callback: function (v) { return [0.1, 0.3, 1, 3, 10, 30, 100].indexOf(+v.toPrecision(1)) > -1 ? '$' + v : ''; } }) }) } },
    });

    var SP = [['EV share of car sales', Math.log(81) / FIT.ev[0], A.ev], ['Solar in electricity', Math.log(81) / FIT.solar[0], A.fast], ['Solar + wind (K = 75%)', Math.log(81) / FIT.sw[0], A.mid], ['Wind in electricity', Math.log(81) / FIT.wind[0], A.wind], ['Energy system (low-carbon)', Math.log(81) / FIT.lowc[0], A.slow]];
    HH.chart('chart-speeds', {
      type: 'bar',
      data: { labels: SP.map(function (s) { return s[0]; }), datasets: [{ label: 'Years from 10% to 90%', data: SP.map(function (s) { return +s[1].toFixed(1); }), backgroundColor: SP.map(function (s) { return s[2]; }), barPercentage: 0.7 }] },
      options: { indexAxis: 'y', layout: { padding: { right: 50 } }, plugins: { legend: { display: false } }, scales: { x: Object.assign(axis({ title: 'years from 10% to 90% (log)' }), { type: 'logarithmic', min: 5, max: 300, ticks: Object.assign({}, tick, { callback: function (v) { return [5, 10, 20, 50, 100, 200].indexOf(v) > -1 ? v : ''; } }) }), y: axis({ grid: false }) } },
      plugins: [labels({ axis: 'x', format: function (v) { return Math.round(v) + ' yrs'; } })],
    });

    /* 2. slow curve */
    var PY = Y.filter(function (yy) { return yy >= 2010; });
    HH.chart('chart-parts', {
      type: 'line',
      data: { labels: PY, datasets: [
        { label: 'EV share of car sales', data: PY.map(function (yy) { return DATA.ev[Y.indexOf(yy)]; }), borderColor: A.ev, backgroundColor: A.ev },
        { label: 'Solar + wind share of electricity', data: PY.map(function (yy) { var i = Y.indexOf(yy); return +(DATA.solar[i] + DATA.wind[i]).toFixed(2); }), borderColor: A.fast, backgroundColor: A.fast },
        { label: 'Low-carbon share of primary energy', data: PY.map(function (yy) { return DATA.lowc[Y.indexOf(yy)]; }), borderColor: A.slow, backgroundColor: A.slow, borderWidth: 3.2 },
      ] },
      options: { plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false, callbacks: { label: function (c) { return c.dataset.label + ': ' + c.raw.toFixed(1) + '%'; } } } }, scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0 }, tick) }), y: Object.assign(axis({ title: '%' }), { min: 0, max: 30 }) } },
    });
    HH.chart('chart-co2', {
      type: 'line',
      data: { labels: DATA.co2.y, datasets: [{ label: 'Fossil CO2, Gt', data: DATA.co2.v, borderColor: A.clock, backgroundColor: alpha(A.clock, 0.1), fill: true, pointRadius: 0 }] },
      options: { plugins: { legend: { display: false } }, scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return DATA.co2.y[i] % 5 === 0 ? DATA.co2.y[i] : ''; } }, tick) }), y: Object.assign(axis({ title: 'billion tonnes CO2' }), { min: 0, max: 45 }) } },
    });

    /* 3. clock */
    var BL = [['1.5°C', 130], ['1.6°C', 310], ['1.7°C', 490], ['2.0°C', 1050]];
    HH.chart('chart-budgets', {
      type: 'bar',
      data: { labels: BL.map(function (b) { return b[0]; }), datasets: [{ label: 'Remaining budget, Gt CO2', data: BL.map(function (b) { return b[1]; }), backgroundColor: [TR[1], TR[2], TR[3], TR[4]], barPercentage: 0.65 }] },
      options: { layout: { padding: { top: 22 } }, plugins: { legend: { display: false } }, scales: { x: axis({ grid: false }), y: Object.assign(axis({ title: 'billion tonnes CO2' }), { min: 0, max: 1200 }) } },
      plugins: [labels({ format: function (v) { return v + ' Gt · ' + (v / E0).toFixed(1) + ' yrs'; } })],
    });
    var CG = []; for (var c = 0; c <= 2400; c += 50) CG.push(c);
    HH.chart('chart-tcre', {
      type: 'line',
      data: { labels: CG, datasets: [
        { label: 'Warming', data: CG.map(function (cc) { return +temp(cc).toFixed(3); }), borderColor: A.clock, backgroundColor: A.clock, pointRadius: 0, borderWidth: 2.6 },
        { label: 'Published budget points', data: CG.map(function (cc) { var p = BUD.filter(function (b) { return Math.abs(b[0] - cc) < 25; })[0]; return p ? p[1] : null; }), borderColor: INK, backgroundColor: INK, showLine: false, pointRadius: 5 },
      ] },
      options: { plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false, filter: function (it) { return it.raw !== null; }, callbacks: { title: function (it) { return CG[it[0].dataIndex] + ' Gt CO2 from 2025'; }, label: function (cx) { return cx.raw.toFixed(2) + '°C'; } } } },
        scales: { x: Object.assign(axis({ grid: false, title: 'cumulative CO2 from 2025, Gt' }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return CG[i] % 500 === 0 ? CG[i] : ''; } }, tick) }), y: Object.assign(axis({ title: '°C above pre-industrial' }), { min: 1.3, max: 2.8 }) } },
    });

    /* 4. thresholds */
    var tipSorted = TIP.slice().sort(function (a, b) { return a[2] - b[2] || a[3] - b[3]; });
    var tipChart = HH.chart('chart-tip', {
      type: 'bar',
      data: { labels: tipSorted.map(function (t) { return t[0] + ' (' + t[1] + ')'; }), datasets: [
        { label: 'Range (min–max)', data: tipSorted.map(function (t) { return [t[3], t[4]]; }), backgroundColor: tipSorted.map(function (t) { return alpha(tcol(t[2]), 0.45); }), borderColor: tipSorted.map(function (t) { return tcol(t[2]); }), borderWidth: 1, barPercentage: 0.6 },
        { type: 'scatter', label: 'Central estimate', data: tipSorted.map(function (t, i) { return { x: t[2], y: i }; }), backgroundColor: INK, pointRadius: 4.5, pointStyle: 'circle' },
      ] },
      options: { indexAxis: 'y', plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: function (cx) { var t = tipSorted[cx.dataIndex]; return 'central ' + t[2] + '°C · range ' + t[3] + '–' + t[4] + '°C'; } } } },
        scales: { x: Object.assign(axis({ title: '°C above pre-industrial' }), { min: 0.5, max: 10 }), y: Object.assign(axis({ grid: false }), { ticks: Object.assign({}, tick, { font: { size: 10 } }) }) } },
      plugins: [{ id: 'tipLines', afterDatasetsDraw: function (ch) {
        var x = ch.scales.x, a = ch.chartArea, ctx = ch.ctx;
        [[1.36, A.muted, 'now 1.36°C'], [state.peak || 0, A.clock, 'scenario peak']].forEach(function (L, i) {
          if (!L[0]) return; var px = x.getPixelForValue(L[0]); ctx.save(); ctx.strokeStyle = L[1]; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = L[1]; ctx.font = '600 11px ' + tok('--mono'); ctx.textAlign = 'left'; ctx.fillText(L[2] + (i ? ' ' + L[0].toFixed(2) + '°C' : ''), px + 5, a.top + 12 + i * 14); ctx.restore();
        }); } }],
    });
    function updTipList(pk) {
      var el = document.getElementById('tip-list'); if (!el) return;
      el.innerHTML = tipSorted.map(function (t) {
        var st = pk >= t[2] ? 'is-cross' : pk >= t[3] ? 'is-risk' : '';
        return '<li class="' + st + '"><i></i><span>' + t[0] + '</span><b>' + (st === 'is-cross' ? 'crossed' : st === 'is-risk' ? 'at risk' : 'below') + ' · ' + t[2] + '°C</b></li>';
      }).join('');
    }

    /* 5. race */
    var RY = []; for (var yy2 = 2025; yy2 <= 2150; yy2++) RY.push(yy2);
    var raceE = HH.chart('chart-race-e', {
      type: 'line',
      data: { labels: RY, datasets: [
        { label: 'Clean share, %', data: [], borderColor: A.fast, backgroundColor: alpha(A.fast, 0.12), fill: true, yAxisID: 'y', pointRadius: 0, borderWidth: 2.6 },
        { label: 'CO2 emissions, Gt', data: [], borderColor: A.clock, backgroundColor: A.clock, yAxisID: 'y2', pointRadius: 0, borderWidth: 2.4 },
      ] },
      options: { plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false, callbacks: { label: function (cx) { return cx.dataset.label + ': ' + cx.raw.toFixed(1); } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return RY[i] % 25 === 0 ? RY[i] : ''; } }, tick) }), y: Object.assign(axis({ title: 'clean share, %' }), { min: 0, max: 100 }), y2: Object.assign(axis({ grid: false, title: 'Gt CO2 a year' }), { position: 'right', min: 0, max: 70 }) } },
    });
    var CENTRALS = [1.5, 1.6, 1.8, 2.0, 2.8, 3.0, 3.5, 4.0];
    var raceT = HH.chart('chart-race-t', {
      type: 'line',
      data: { labels: RY, datasets: [{ label: 'Warming, °C', data: [], borderColor: A.clock, backgroundColor: alpha(A.clock, 0.1), fill: false, pointRadius: 0, borderWidth: 2.8 }] },
      options: { plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, callbacks: { label: function (cx) { return cx.raw.toFixed(2) + '°C'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return RY[i] % 25 === 0 ? RY[i] : ''; } }, tick) }), y: Object.assign(axis({ title: '°C above pre-industrial' }), { min: 1.2, max: 4.2 }) } },
      plugins: [{ id: 'thLines', beforeDatasetsDraw: function (ch) {
        var yS = ch.scales.y, a = ch.chartArea, ctx = ch.ctx;
        CENTRALS.forEach(function (th) {
          var py = yS.getPixelForValue(th); if (py < a.top || py > a.bottom) return;
          ctx.save(); ctx.strokeStyle = alpha(tcol(th), 0.85); ctx.setLineDash([2, 3]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a.left, py); ctx.lineTo(a.right, py); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = tcol(th); ctx.font = '10px ' + tok('--mono'); ctx.textAlign = 'right';
          var names = TIP.filter(function (t) { return t[2] === th; }).map(function (t) { return t[0].split(' ')[0]; });
          ctx.fillText(th.toFixed(1) + '°C ' + names.slice(0, 3).join(', '), a.right - 4, py - 3); ctx.restore();
        }); } }],
    });
    var yrsIn = document.getElementById('r-yrs'), gIn = document.getElementById('r-g');
    function updRace() {
      state.yrs = +yrsIn.value; state.g = +gIn.value / 100;
      setText('o-yrs', state.yrs + ' years'); setText('o-g', (+gIn.value).toFixed(1) + '% a year');
      var R = run(state.yrs, state.g), P = R.path;
      setText('h-yrs', 'Growth rate ' + R.r.toFixed(3) + ' a year · 50% clean in ' + Math.round(R.M));
      var byY = {}; P.forEach(function (p) { byY[p.y] = p; });
      if (raceE) { raceE.data.datasets[0].data = RY.map(function (yy) { return +(byY[yy].S * 100).toFixed(2); }); raceE.data.datasets[1].data = RY.map(function (yy) { return +byY[yy].E.toFixed(2); }); raceE.update('none'); }
      if (raceT) { raceT.data.datasets[0].data = RY.map(function (yy) { return +byY[yy].T.toFixed(3); }); raceT.update('none'); }
      var pk = P[P.length - 1].T; state.peak = pk;
      setText('t-peak', pk.toFixed(2) + '°C'); setText('t-2100', byY[2100].T.toFixed(2) + '°C');
      var y90 = null; P.forEach(function (p) { if (y90 === null && p.S >= 0.9) y90 = p.y; });
      setText('t-90', y90 ? String(y90) : 'after 2200');
      var crossed = TIP.filter(function (t) { return pk >= t[2]; }).length;
      setText('t-tips', crossed + ' of ' + TIP.length);
      var cr = [1.5, 1.6, 1.7, 1.8, 2.0, 2.5, 3.0].map(function (th) { var c2 = crossYear(P, th); return c2 ? th.toFixed(1) + '°C in ' + c2 : null; }).filter(Boolean);
      setText('t-cross', 'Crossing years (central path): ' + (cr.join(' · ') || 'none'));
      updTipList(pk); if (tipChart) tipChart.update('none');
    }
    yrsIn.addEventListener('input', function () { Array.prototype.forEach.call(document.querySelectorAll('[data-pre]'), function (b) { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); }); updRace(); });
    gIn.addEventListener('input', function () { updRace(); updFrontier(); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-pre]'), function (b, _, all) {
      b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false');
      b.addEventListener('click', function () { yrsIn.value = Math.round(+b.getAttribute('data-pre')); Array.prototype.forEach.call(all, function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); }); updRace(); });
    });

    /* 6. frontier and required speeds */
    var FX = []; for (var f = 8; f <= 200; f += 2) FX.push(f);
    var MARK = [['EV', Math.log(81) / FIT.ev[0]], ['Solar', Math.log(81) / FIT.solar[0]], ['Solar + wind', Math.log(81) / FIT.sw[0]], ['Wind', Math.log(81) / FIT.wind[0]], ['System today', Math.log(81) / FIT.lowc[0]]];
    var frontier = HH.chart('chart-frontier', {
      type: 'scatter',
      data: { datasets: [
        { type: 'line', label: 'Peak warming', data: [], borderColor: A.clock, backgroundColor: A.clock, pointRadius: 0, borderWidth: 2.6, tension: 0.2 },
        { label: 'Historical technology speeds', data: [], backgroundColor: A.fast, borderColor: INK, borderWidth: 1, pointRadius: 6, pointHoverRadius: 8 },
      ] },
      options: { plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: function (cx) { return (cx.raw.n ? cx.raw.n + ': ' : '') + Math.round(cx.raw.x) + ' yrs → ' + cx.raw.y.toFixed(2) + '°C'; } } } },
        scales: { x: Object.assign(axis({ title: 'system 10% → 90% time, years' }), { type: 'linear', min: 0, max: 200 }), y: Object.assign(axis({ title: 'peak warming, °C' }), { min: 1.4, max: 4.2 }) } },
      plugins: [{ id: 'frLabels', afterDatasetsDraw: function (ch) {
        var m = ch.getDatasetMeta(1), ctx = ch.ctx; ctx.save(); ctx.fillStyle = INK; ctx.font = '600 10.5px ' + tok('--sans');
        m.data.forEach(function (p, i) { var d = ch.data.datasets[1].data[i]; ctx.textAlign = i === m.data.length - 1 ? 'right' : 'left'; ctx.fillText(d.n, p.x + (i === m.data.length - 1 ? -9 : 9), p.y + 4); }); ctx.restore(); } }],
    });
    function updFrontier() {
      var g = state.g;
      if (frontier) {
        frontier.data.datasets[0].data = FX.map(function (x) { return { x: x, y: +peak(x, g).toFixed(3) }; });
        frontier.data.datasets[1].data = MARK.map(function (mk) { return { x: mk[1], y: +peak(mk[1], g).toFixed(3), n: mk[0] }; });
        frontier.update('none');
      }
      var tb = document.getElementById('req-body'); if (!tb) return;
      tb.innerHTML = [2.5, 2.0, 1.8, 1.7, 1.6].map(function (ceil) {
        var yr = speedFor(ceil, g);
        if (yr === null) return '<tr><th scope="row">' + ceil.toFixed(1) + '°C</th><td class="num" colspan="4">not reachable</td></tr>';
        var r = Math.log(81) / yr, mid = 2025 + Math.log((1 - S0) / S0) / r;
        var near = MARK.slice().sort(function (a, b) { return Math.abs(a[1] - yr) - Math.abs(b[1] - yr); })[0];
        var kept = TIP.filter(function (t) { return t[2] >= ceil; }).length;
        return '<tr><th scope="row">' + ceil.toFixed(1) + '°C</th><td class="num">' + Math.round(yr) + ' yrs</td><td class="num">' + Math.round(mid) + '</td><td>' + near[0] + ' (' + Math.round(near[1]) + ' yrs)</td><td class="num">' + kept + ' of ' + TIP.length + '</td></tr>';
      }).join('');
    }
    updRace(); updFrontier();
  });
})();
