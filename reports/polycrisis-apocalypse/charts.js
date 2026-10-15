/* ===========================================================================
   Charts and model — "The Polycrisis Apocalypse" (hybrid dashboard)

   DATA: historical regression spans (approximate, see Sources), planetary
   boundaries by assessment, UCDP conflicts 1946–2025, GISTEMP 1880–2025 and
   UNDP HDR 2025 world series (HDI, life expectancy, material footprint),
   1990–2023. The spiral model below is the same code the figures in the text
   were computed with in Node.js: seeded, annual, deterministic for a seed.
   Colours come from the theme's tokens; no hex values live in this file.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var DATA = {"temp":{"years":[1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1892,1893,1894,1895,1896,1897,1898,1899,1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],"v":[-0.17,-0.09,-0.11,-0.18,-0.28,-0.33,-0.31,-0.36,-0.18,-0.11,-0.36,-0.22,-0.27,-0.31,-0.3,-0.23,-0.11,-0.11,-0.28,-0.18,-0.08,-0.16,-0.28,-0.37,-0.47,-0.26,-0.22,-0.38,-0.42,-0.48,-0.44,-0.44,-0.37,-0.34,-0.15,-0.14,-0.36,-0.46,-0.3,-0.27,-0.27,-0.18,-0.28,-0.26,-0.27,-0.22,-0.11,-0.22,-0.2,-0.36,-0.15,-0.09,-0.16,-0.28,-0.13,-0.2,-0.15,-0.03,0.0,-0.02,0.12,0.18,0.06,0.09,0.2,0.09,-0.07,-0.03,-0.11,-0.11,-0.17,-0.07,0.01,0.08,-0.13,-0.14,-0.19,0.05,0.06,0.03,-0.02,0.06,0.03,0.05,-0.2,-0.11,-0.06,-0.02,-0.08,0.05,0.03,-0.08,0.01,0.16,-0.07,-0.01,-0.1,0.18,0.07,0.16,0.26,0.32,0.14,0.31,0.16,0.12,0.18,0.32,0.39,0.27,0.45,0.41,0.22,0.23,0.31,0.45,0.33,0.47,0.61,0.38,0.39,0.53,0.63,0.62,0.53,0.68,0.64,0.66,0.54,0.66,0.72,0.61,0.65,0.67,0.75,0.89,1.01,0.91,0.85,0.98,1.01,0.85,0.89,1.17,1.28,1.18]},"conflicts":{"years":[1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],"n":[17,14,20,21,18,14,14,16,15,13,17,17,18,16,15,21,20,20,25,27,28,33,26,29,26,29,26,26,28,30,32,36,38,41,41,42,44,43,42,38,44,47,39,41,49,53,51,44,50,41,41,39,40,40,40,38,33,33,33,33,33,35,39,37,31,37,33,39,46,54,54,54,52,57,57,54,56,59,59,65]},"hdi":{"years":[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023],"world":[0.608,0.611,0.614,0.617,0.62,0.625,0.631,0.636,0.641,0.646,0.651,0.657,0.662,0.669,0.675,0.681,0.688,0.694,0.698,0.701,0.707,0.713,0.717,0.721,0.726,0.731,0.735,0.739,0.741,0.745,0.742,0.742,0.752,0.756],"low":[0.346,0.348,0.352,0.356,0.361,0.368,0.373,0.378,0.382,0.39,0.393,0.401,0.407,0.414,0.424,0.433,0.442,0.45,0.457,0.461,0.467,0.471,0.477,0.482,0.488,0.491,0.497,0.5,0.504,0.507,0.507,0.507,0.512,0.515],"vhigh":[0.797,0.8,0.802,0.804,0.809,0.812,0.818,0.824,0.829,0.832,0.838,0.843,0.847,0.852,0.857,0.861,0.866,0.87,0.872,0.874,0.879,0.883,0.886,0.892,0.895,0.898,0.9,0.903,0.906,0.909,0.901,0.903,0.908,0.914],"le":[65.11,65.31,65.56,65.73,65.92,66.17,66.49,66.81,67.04,67.28,67.62,67.91,68.2,68.49,68.75,69.09,69.45,69.78,69.98,70.36,70.66,70.95,71.25,71.52,71.75,71.95,72.18,72.36,72.64,72.86,72.17,71.21,72.98,73.38],"mf":[8.67,8.33,8.82,8.78,8.89,9.0,9.1,9.16,9.19,9.24,9.31,9.34,9.42,9.75,10.15,10.4,10.7,10.99,11.04,10.96,11.44,12.01,12.21,12.5,12.54,12.38,12.39,12.35,12.32,12.45,12.28,12.6,12.57,12.71]},"history":[["Egypt: First Intermediate Period",125,"c. 2181–2055 BCE · unified rule restored"],["Mycenaean Greece: no writing",450,"c. 1200–750 BCE · Linear B to the alphabet"],["Roman world: lead pollution",500,"165 CE – early Middle Ages · 'more than 500 years'"],["Harappan cities to Ganges cities",1300,"c. 1900–600 BCE · urbanism returns elsewhere"]],"boundaries":[["2009",3],["2015",4],["2023",6],["2024",6],["2025",7]]};

  /* --- the spiral model (verbatim from the calibration script) ---------------- */

  function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  var FIXED={d:0.03,h:0.5,mu:0.06,g:0.2,floor:0.02,low:0.25,high:0.75};
  function run(p, seed, T){
    var r=rng(seed), C=1, S=0.05, Cs=new Array(T), Ss=new Array(T), collapses=[], cur=null;
    for(var t=0;t<T;t++){
      var shock=0; if(r()<p.rate/10) shock=-Math.log(1-r())*p.size*(0.3+0.7*C);
      var dS = shock + p.k*C*S - p.rho*C*S/(1+S/FIXED.h) - FIXED.d*S;
      var dC = FIXED.g*C*(1-C)*(C/(C+p.a)) - FIXED.mu*S*C;
      S=Math.max(0,S+dS); C=Math.min(1,Math.max(FIXED.floor,C+dC));
      if(cur===null && C<FIXED.low){ cur={start:t,end:null}; collapses.push(cur); }
      else if(cur!==null && C>FIXED.high){ cur.end=t; cur=null; }
      Cs[t]=C; Ss[t]=S;
    }
    return {Cs:Cs,Ss:Ss,collapses:collapses};
  }
  var REBUILD_A = [1, 0.5, 0.3, 0.15, 0.05];
  var REBUILD_L = ['very slow', 'slow', 'moderate', 'fast', 'very fast'];
  var DEFAULTS = { rate: 2, size: 0.12, k: 0.25, rho: 0.6, rebuild: 3 };

  function monteCarlo(p, N, T) {
    var c100 = 0, c1000 = 0, collapsed = 0, dark = [], tc = 0;
    for (var i = 0; i < N; i++) {
      var o = run(p, 1000 + i, T), f = o.collapses[0];
      if (f) { collapsed++; if (f.start < 100) c100++; c1000++; if (f.end !== null) dark.push(f.end - f.start); }
      var n = 0; for (var t = 0; t < T; t++) if (o.Cs[t] < 0.25) n++;
      tc += n / T;
    }
    dark.sort(function (a, b) { return a - b; });
    return { c100: c100 / N, c1000: c1000 / N, collapsed: collapsed, dark: dark.length ? dark[(dark.length - 1) >> 1] : null, nrec: dark.length, tc: tc / N };
  }

  /* --- helpers ------------------------------------------------------------------ */

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function hex(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join(''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = hex(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mix(h1, h2, t) { var a = hex(h1), b = hex(h2); return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function pct(x) { return Math.round(x * 100) + '%'; }

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, labels = HH.valueLabels;
    var RED = tok('--primary'), BLUE = tok('--accent'), GOLD = tok('--gold'), INK = tok('--text'), MUTED = tok('--chart-gray'), PAPER = tok('--bg'), TEAL = tok('--chart-teal');
    var tick = { color: tok('--text-muted'), font: { size: 11 } };

    /* --- 2. history ----------------------------------------------------------------- */

    var H = DATA.history;
    HH.chart('chart-history', {
      type: 'bar',
      data: { labels: H.map(function (h) { return h[0]; }), datasets: [{ data: H.map(function (h) { return h[1]; }), backgroundColor: [GOLD, RED, RED, GOLD], barPercentage: 0.66 }] },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 64 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '~' + c.parsed.x.toLocaleString() + ' years · ' + H[c.dataIndex][2]; } } } },
        scales: {
          x: Object.assign(axis({ title: 'Approximate years' }), { beginAtZero: true, max: 1400, ticks: tick }),
          y: Object.assign(axis({ grid: false }), { ticks: { color: INK, font: { size: 11.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v, i) { return (i === 2 ? '500+' : '~' + v.toLocaleString()) + ' yrs'; } })],
    });

    /* --- 4. ledger charts ------------------------------------------------------------- */

    HH.chart('chart-boundaries', {
      type: 'bar',
      data: { labels: DATA.boundaries.map(function (b) { return b[0]; }), datasets: [{ data: DATA.boundaries.map(function (b) { return b[1]; }), backgroundColor: DATA.boundaries.map(function (b) { return b[1] >= 7 ? RED : mix(GOLD, RED, (b[1] - 3) / 4); }), barPercentage: 0.6 }] },
      options: {
        layout: { padding: { top: 18 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + ' of 9 boundaries transgressed'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: tick }), y: Object.assign(axis({ title: 'Of 9 boundaries' }), { beginAtZero: true, max: 9, ticks: Object.assign({ stepSize: 3 }, tick) }) },
      },
      plugins: [labels({ format: function (v) { return v + ' of 9'; } })],
    });

    var CF = DATA.conflicts;
    HH.chart('chart-conflicts', {
      type: 'line',
      data: { labels: CF.years, datasets: [{ data: CF.n, borderColor: RED, backgroundColor: alpha(RED, 0.12), fill: true, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.15 }] },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + ' state-based conflicts'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return CF.years[i] % 20 === 0 ? CF.years[i] : ''; } }, tick) }),
          y: Object.assign(axis({ title: 'Conflicts' }), { beginAtZero: true, max: 70, ticks: tick }),
        },
      },
    });

    var TP = DATA.temp;
    HH.chart('chart-temp', {
      type: 'bar',
      data: { labels: TP.years, datasets: [{ data: TP.v, backgroundColor: TP.v.map(function (v) { return v >= 0 ? mix(GOLD, RED, Math.min(1, v / 1.2)) : alpha(BLUE, 0.7); }), barPercentage: 1, categoryPercentage: 1 }] },
      options: {
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return (c.parsed.y > 0 ? '+' : '') + c.parsed.y.toFixed(2) + ' °C vs 1951–1980'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return TP.years[i] % 40 === 0 ? TP.years[i] : ''; } }, tick) }),
          y: Object.assign(axis({ title: '°C vs 1951–1980' }), { ticks: tick }),
        },
      },
    });

    var HD = DATA.hdi;
    HH.chart('chart-material', {
      type: 'line',
      data: { labels: HD.years, datasets: [{ data: HD.mf, borderColor: GOLD, backgroundColor: alpha(GOLD, 0.14), fill: true, borderWidth: 2.2, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 }] },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y.toFixed(1) + ' tonnes per person'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return HD.years[i] % 5 === 0 ? HD.years[i] : ''; } }, tick) }),
          y: Object.assign(axis({ title: 'Tonnes per person' }), { min: 0, max: 14, ticks: tick }),
        },
      },
    });

    /* --- 5. early warnings ------------------------------------------------------------- */

    function avgGain(a, b) { var i = HD.years.indexOf(a), j = HD.years.indexOf(b); return (HD.world[j] - HD.world[i]) / (b - a) * 1000; }
    var G = [['1990–2000', avgGain(1990, 2000)], ['2000–2010', avgGain(2000, 2010)], ['2010–2019', avgGain(2010, 2019)], ['2019–2023', avgGain(2019, 2023)]];
    HH.chart('chart-hdi', {
      type: 'bar',
      data: { labels: G.map(function (g) { return g[0]; }), datasets: [{ data: G.map(function (g) { return Math.round(g[1] * 100) / 100; }), backgroundColor: [BLUE, BLUE, BLUE, RED], barPercentage: 0.6 }] },
      options: {
        layout: { padding: { top: 18 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '+' + c.parsed.y.toFixed(2) + ' thousandths of HDI a year'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: tick }), y: Object.assign(axis({ title: 'Thousandths a year' }), { beginAtZero: true, max: 7, ticks: tick }) },
      },
      plugins: [labels({ format: function (v) { return '+' + v.toFixed(2); } })],
    });

    HH.chart('chart-le', {
      type: 'line',
      data: { labels: HD.years, datasets: [{ data: HD.le, borderColor: BLUE, backgroundColor: BLUE, borderWidth: 2.4, pointRadius: HD.years.map(function (y) { return y >= 2019 && y <= 2023 ? 3.5 : 0; }), pointHoverRadius: 5, tension: 0.15 }] },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y.toFixed(1) + ' years'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return HD.years[i] % 5 === 0 ? HD.years[i] : ''; } }, tick) }),
          y: Object.assign(axis({ title: 'Years' }), { min: 64, max: 75, ticks: tick }),
        },
      },
    });

    /* --- 3. the simulator ------------------------------------------------------------------- */

    var ids = { rate: 's-rate', size: 's-size', k: 's-k', rho: 's-rho', rebuild: 's-a' };
    var seed = 1;
    function read() {
      var v = {};
      Object.keys(ids).forEach(function (k) { var el = document.getElementById(ids[k]); v[k] = el ? parseFloat(el.value) : DEFAULTS[k]; });
      return { rate: v.rate, size: v.size, k: v.k, rho: v.rho, a: REBUILD_A[Math.round(v.rebuild) - 1], rebuild: Math.round(v.rebuild) };
    }
    function showOutputs(p) {
      setText('o-rate', String(+p.rate.toFixed(2)) + ' per decade');
      setText('o-size', p.size.toFixed(2));
      setText('o-k', p.k.toFixed(2));
      setText('o-rho', p.rho.toFixed(2));
      setText('o-a', REBUILD_L[p.rebuild - 1]);
    }

    var years = []; for (var y = 0; y < 1000; y++) years.push(y);
    var collapsedBands = {
      id: 'collapsed-bands',
      beforeDatasetsDraw: function (chart) {
        var d = chart.data.datasets[0].data, x = chart.scales.x, a = chart.chartArea, ctx = chart.ctx;
        ctx.save(); ctx.fillStyle = alpha(RED, 0.1);
        var start = null;
        for (var i = 0; i <= d.length; i++) {
          var low = i < d.length && d[i] < 0.25;
          if (low && start === null) start = i;
          if (!low && start !== null) { var x0 = x.getPixelForValue(start), x1 = x.getPixelForValue(i - 1); ctx.fillRect(x0, a.top, Math.max(1, x1 - x0), a.bottom - a.top); start = null; }
        }
        ctx.restore();
      },
    };
    var runChart = HH.chart('chart-run', {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          { label: 'Capacity', data: [], yAxisID: 'y', borderColor: BLUE, backgroundColor: BLUE, borderWidth: 2.2, pointRadius: 0, tension: 0 },
          { label: 'Unresolved stress', data: [], yAxisID: 'y1', borderColor: RED, backgroundColor: RED, borderWidth: 1.4, pointRadius: 0, tension: 0 },
        ],
      },
      options: {
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 14, boxHeight: 3, font: { size: 12 } } },
          tooltip: { callbacks: { title: function (c) { return 'Year ' + c[0].label; }, label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(2); } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false, title: 'Years from the start of the run' }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return i % 100 === 0 ? i : ''; } }, tick) }),
          y: Object.assign(axis({ title: 'Capacity' }), { min: 0, max: 1, position: 'left', ticks: tick }),
          y1: Object.assign(axis({ grid: false, title: 'Stress' }), { min: 0, suggestedMax: 1.5, position: 'right', ticks: tick }),
        },
      },
      plugins: [collapsedBands],
    });

    function describeRun(o) {
      if (!o.collapses.length) return 'Run ' + seed + ': no collapse in 1,000 years. Capacity absorbed every crisis.';
      var parts = o.collapses.map(function (c, i) {
        return (i ? 'collapsed again in year ' : 'collapsed in year ') + c.start + (c.end !== null ? ', recovered in year ' + c.end + ' (a dark age of ' + (c.end - c.start) + ' years)' : ', not recovered by year 1,000');
      });
      return 'Run ' + seed + ': ' + parts.join('; ') + '.';
    }
    function drawRun(p) {
      var o = run(p, seed, 1000);
      if (runChart) {
        runChart.data.datasets[0].data = o.Cs.map(function (v) { return Math.round(v * 1000) / 1000; });
        runChart.data.datasets[1].data = o.Ss.map(function (v) { return Math.round(v * 1000) / 1000; });
        runChart.update();
      }
      setText('run-title', 'One simulated millennium · run ' + seed);
      setText('run-meta', describeRun(o));
    }
    function drawStats(p) {
      var m = monteCarlo(p, 300, 1000);
      setText('t-c100', pct(m.c100));
      setText('t-c1000', pct(m.c1000));
      setText('t-dark', m.dark !== null ? m.dark + ' yrs' : '—');
      setText('t-dark-label', m.dark !== null ? 'median dark age, ' + m.nrec + ' of ' + m.collapsed + ' collapsed runs that recovered' : (m.collapsed ? 'no collapsed run recovered within 1,000 years' : 'no run collapsed'));
      setText('t-time', pct(m.tc));
    }

    var RG = [0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75], KG = [0.34, 0.31, 0.28, 0.25, 0.22, 0.19, 0.16];
    function drawHeat(p) {
      var t = document.getElementById('heat');
      if (!t) return;
      var near = function (arr, v) { var b = 0; arr.forEach(function (x, i) { if (Math.abs(x - v) < Math.abs(arr[b] - v)) b = i; }); return b; };
      var ci = near(RG, p.rho), ck = near(KG, p.k);
      var html = '<caption>Each cell: share of 100 runs whose capacity falls below 0.25 within 300 years. Darker is worse.</caption><thead><tr><th class="heat-rowhead" scope="col">coupling ↓ · repair →</th>' + RG.map(function (r) { return '<th scope="col">' + r.toFixed(2) + '</th>'; }).join('') + '</tr></thead><tbody>';
      KG.forEach(function (k, ki) {
        html += '<tr><th class="heat-rowhead" scope="row">' + k.toFixed(2) + '</th>';
        RG.forEach(function (rho, ri) {
          var c = 0;
          for (var i = 0; i < 100; i++) if (run({ rate: p.rate, size: p.size, k: k, rho: rho, a: p.a }, 1000 + i, 300).collapses.length) c++;
          var share = c / 100;
          html += '<td class="' + (share > 0.55 ? 'is-dark' : '') + (ki === ck && ri === ci ? ' is-current' : '') + '" style="background:' + mix(PAPER, RED, Math.pow(share, 0.85)) + '" title="repair ' + rho.toFixed(2) + ', coupling ' + k.toFixed(2) + ': ' + c + ' of 100 runs collapse within 300 years">' + c + '%</td>';
        });
        html += '</tr>';
      });
      t.innerHTML = html + '</tbody>';
    }

    var timer = null, heatTimer = null;
    function update(full) {
      var p = read();
      showOutputs(p);
      drawRun(p);
      clearTimeout(timer);
      timer = setTimeout(function () { drawStats(p); }, 40);
      clearTimeout(heatTimer);
      heatTimer = setTimeout(function () { drawHeat(p); }, full ? 0 : 160);
    }
    Object.keys(ids).forEach(function (k) {
      var el = document.getElementById(ids[k]);
      if (el) el.addEventListener('input', function () { update(false); });
    });
    var bs = document.getElementById('b-seed');
    if (bs) bs.addEventListener('click', function () { seed += 1; drawRun(read()); });
    var br = document.getElementById('b-reset');
    if (br) br.addEventListener('click', function () {
      Object.keys(ids).forEach(function (k) { var el = document.getElementById(ids[k]); if (el) el.value = DEFAULTS[k]; });
      seed = 1; update(true);
    });
    update(true);
  });
})();
