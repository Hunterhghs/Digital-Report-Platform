/* ===========================================================================
   Charts — "The Polycrisis Century" (dashboard)

   DATA holds annual series downloaded from their publishers (see Sources):
   for each indicator, `raw` is the annual value and `m` the stress measure —
   year-on-year % change for food and oil, the level for everything else.
   The stress-breadth index is computed here, in the browser, so that the
   threshold control recalculates the calendar, the breadth chart, the decade
   averages and the threshold lines on the small multiples together.
   =========================================================================== */

(function () {
  'use strict';

  // report.js defines HH and loads first; bail out rather than throw if it did not.
  if (!window.HH) return;

  var DATA = {"years":[2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026],"series":[{"key":"food","label":"Food price spike","measure":"Year-on-year change in the FAO Food Price Index (%)","kind":"acute","raw":[53.6,55.3,53.4,58.1,65.9,67.6,72.9,94.6,117.7,91.8,106.9,131.8,122.8,120.1,115.0,93.1,92.0,97.9,95.7,94.9,98.1,125.7,144.5,124.5,122.0,127.2,130.2],"m":[-3.1,3.2,-3.4,8.8,13.4,2.6,7.8,29.8,24.4,-22.0,16.4,23.3,-6.8,-2.2,-4.2,-19.0,-1.2,6.4,-2.2,-0.8,3.4,28.1,15.0,-13.8,-2.0,4.3,2.4],"rawLabel":"FAO Food Price Index, annual mean (2014–16=100)"},{"key":"energy","label":"Oil price spike","measure":"Year-on-year change in Brent crude (%)","kind":"acute","raw":[28.76,24.51,25.14,29.0,38.78,54.9,65.25,72.61,96.94,61.74,79.61,111.26,111.57,108.55,99.02,52.32,43.64,54.12,71.33,64.3,41.96,70.86,100.93,82.49,80.52,69.14,93.81],"m":[58.5,-14.8,2.6,15.4,33.7,41.6,18.9,11.3,33.5,-36.3,28.9,39.8,0.3,-2.7,-8.8,-47.2,-16.6,24.0,31.8,-9.9,-34.7,68.9,42.4,-18.3,-2.4,-14.1,35.7],"rawLabel":"Brent crude, annual mean (US$/bbl)"},{"key":"finance","label":"Market volatility","measure":"VIX, annual mean","kind":"acute","raw":[23.32,25.75,27.29,21.98,15.48,12.81,12.81,17.54,32.69,31.48,22.55,24.2,17.8,14.23,14.18,16.67,15.83,11.09,16.64,15.39,29.25,19.66,25.64,16.85,15.55,18.93,18.15],"m":[23.32,25.75,27.29,21.98,15.48,12.81,12.81,17.54,32.69,31.48,22.55,24.2,17.8,14.23,14.18,16.67,15.83,11.09,16.64,15.39,29.25,19.66,25.64,16.85,15.55,18.93,18.15],"rawLabel":"VIX, annual mean"},{"key":"policy","label":"Policy uncertainty","measure":"Global Economic Policy Uncertainty, annual mean","kind":"acute","raw":[74.9,111.7,101.7,103.1,77.5,65.9,63.3,70.1,120.8,113.0,127.1,147.1,149.2,129.0,106.4,116.0,161.8,171.4,186.6,235.2,303.1,205.8,253.9,218.2,209.7,394.7,337.3],"m":[74.9,111.7,101.7,103.1,77.5,65.9,63.3,70.1,120.8,113.0,127.1,147.1,149.2,129.0,106.4,116.0,161.8,171.4,186.6,235.2,303.1,205.8,253.9,218.2,209.7,394.7,337.3],"rawLabel":"Global Economic Policy Uncertainty, annual mean"},{"key":"conflict","label":"Battle deaths","measure":"Battle-related deaths (thousands)","kind":"acute","raw":[78.7,23.6,21.2,23.3,19.7,12.4,20.3,19.4,28.9,36.0,21.7,25.6,74.2,93.5,116.0,104.5,90.8,72.1,55.2,52.7,73.1,199.8,285.0,138.9,155.0,153.6,null],"m":[78.7,23.6,21.2,23.3,19.7,12.4,20.3,19.4,28.9,36.0,21.7,25.6,74.2,93.5,116.0,104.5,90.8,72.1,55.2,52.7,73.1,199.8,285.0,138.9,155.0,153.6,null],"rawLabel":"UCDP battle-related deaths, thousands"},{"key":"disasters","label":"Disaster events","measure":"Recorded natural disaster events","kind":"acute","raw":[401,377,421,368,365,434,429,414,361,367,413,345,364,345,328,398,350,365,325,414,414,438,439,450,443,364,null],"m":[401,377,421,368,365,434,429,414,361,367,413,345,364,345,328,398,350,365,325,414,414,438,439,450,443,364,null],"rawLabel":"EM-DAT recorded natural disasters"},{"key":"climate","label":"Temperature","measure":"Temperature anomaly vs 1951–80 (°C)","kind":"chronic","raw":[0.39,0.53,0.63,0.62,0.53,0.68,0.64,0.66,0.54,0.66,0.72,0.61,0.65,0.67,0.75,0.89,1.01,0.91,0.85,0.98,1.01,0.85,0.89,1.17,1.28,1.18,null],"m":[0.39,0.53,0.63,0.62,0.53,0.68,0.64,0.66,0.54,0.66,0.72,0.61,0.65,0.67,0.75,0.89,1.01,0.91,0.85,0.98,1.01,0.85,0.89,1.17,1.28,1.18,null],"rawLabel":"GISTEMP anomaly vs 1951–80 (°C)"},{"key":"displacement","label":"Displacement","measure":"UNHCR populations of concern (millions)","kind":"chronic","raw":[19.1,18.2,16.3,14.8,15.9,16.1,23.4,25.9,25.8,27.0,26.1,26.8,29.1,36.8,48.5,56.8,56.5,62.1,67.9,71.6,77.3,81.7,97.4,107.5,113.3,108.9,null],"m":[19.1,18.2,16.3,14.8,15.9,16.1,23.4,25.9,25.8,27.0,26.1,26.8,29.1,36.8,48.5,56.8,56.5,62.1,67.9,71.6,77.3,81.7,97.4,107.5,113.3,108.9,null],"rawLabel":"UNHCR populations of concern (m)"}],"conflicts":{"years":[1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],"n":[17,14,20,21,18,14,14,16,15,13,17,17,18,16,15,21,20,20,25,27,28,33,26,29,26,29,26,26,28,30,32,36,38,41,41,42,44,43,42,38,44,47,39,41,49,53,51,44,50,41,41,39,40,40,40,38,33,33,33,33,33,35,39,37,31,37,33,39,46,54,54,54,52,57,57,54,56,59,59,65]},"corr":{"keys":["food","energy","finance","policy","conflict","disasters"],"matrix":[[1.0,0.75,0.13,-0.05,-0.03,0.09],[0.75,1.0,-0.08,-0.18,0.05,0.1],[0.13,-0.08,1.0,0.11,-0.08,0.01],[-0.05,-0.18,0.11,1.0,0.62,0.12],[-0.03,0.05,-0.08,0.62,1.0,0.28],[0.09,0.1,0.01,0.12,0.28,1.0]]}};

  var YEARS = DATA.years;                       // 2000 … 2026
  var BASE = YEARS.filter(function (y) { return y <= 2025; });
  var ACUTE = DATA.series.filter(function (s) { return s.kind === 'acute'; });
  var CHRONIC = DATA.series.filter(function (s) { return s.kind === 'chronic'; });
  var HEAT = ['#f6efe6', '#f1d6c4', '#e8b39b', '#da8a72', '#c45f4f', '#a6363a', '#7f1a2a'];

  function quantile(vals, q) {
    var v = vals.slice().sort(function (a, b) { return a - b; });
    var k = q * (v.length - 1), lo = Math.floor(k), hi = Math.ceil(k);
    return v[lo] + (v[hi] - v[lo]) * (k - lo);
  }
  function baseVals(s) {
    return BASE.map(function (y) { return s.m[YEARS.indexOf(y)]; }).filter(function (x) { return x != null; });
  }
  // Percentile rank of x within the 2000–2025 record of the same indicator.
  function pctRank(s, x) {
    var v = baseVals(s);
    var below = v.filter(function (a) { return a < x; }).length;
    var equal = v.filter(function (a) { return a === x; }).length;
    return (below + 0.5 * equal) / v.length;
  }
  function thresholds(q) {
    var t = {};
    ACUTE.forEach(function (s) { t[s.key] = quantile(baseVals(s), q); });
    return t;
  }
  function breadth(q) {
    var t = thresholds(q);
    return YEARS.map(function (y, i) {
      return ACUTE.reduce(function (n, s) {
        var v = s.m[i];
        return n + (v != null && v >= t[s.key] ? 1 : 0);
      }, 0);
    });
  }
  function mean(a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }
  function decadeAvgs(q) {
    var b = breadth(q);
    function avg(a, z) { return mean(YEARS.map(function (y, i) { return (y >= a && y <= z) ? b[i] : null; }).filter(function (x) { return x != null; })); }
    return [avg(2000, 2009), avg(2010, 2019), avg(2020, 2025)];
  }
  function fmt(s, v) {
    if (v == null) return 'no data';
    if (s.key === 'food' || s.key === 'energy') return (v > 0 ? '+' : '') + v.toFixed(1) + '%';
    if (s.key === 'conflict') return v.toFixed(1) + 'k deaths';
    if (s.key === 'climate') return '+' + v.toFixed(2) + ' °C';
    if (s.key === 'displacement') return v.toFixed(1) + 'm people';
    return String(Math.round(v * 10) / 10);
  }

  var q = 0.75;

  /* --- Stress calendar (HTML table, so it is readable without a canvas) ---- */

  var table = document.getElementById('stress-calendar');

  function renderCalendar() {
    if (!table) return;
    var t = thresholds(q);
    var b = breadth(q);
    var html = '<thead><tr><th scope="col" class="cal-rowhead">Indicator</th>';
    YEARS.forEach(function (y) {
      html += '<th scope="col" class="cal-year' + (y === 2026 ? ' is-prov' : '') + '">' + (y === 2026 ? '26*' : String(y).slice(2)) + '</th>';
    });
    html += '</tr></thead><tbody>';

    function row(s, counted) {
      var r = '<tr class="' + (counted ? 'is-acute' : 'is-chronic') + '"><th scope="row" class="cal-rowhead">' + s.label + '</th>';
      YEARS.forEach(function (y, i) {
        var v = s.m[i];
        if (v == null) { r += '<td class="cal-cell is-na" title="' + s.label + ', ' + y + ': no data yet"></td>'; return; }
        var p = pctRank(s, v);
        var lvl = Math.max(0, Math.min(HEAT.length - 1, Math.floor(p * HEAT.length)));
        var hit = counted && v >= t[s.key];
        r += '<td class="cal-cell' + (hit ? ' is-hit' : '') + (y === 2026 ? ' is-prov' : '') + '" style="background:' + HEAT[lvl] + '"'
          + ' title="' + s.label + ', ' + y + ': ' + fmt(s, v) + (hit ? ' — stressed' : '') + '"></td>';
      });
      return r + '</tr>';
    }
    ACUTE.forEach(function (s) { html += row(s, true); });
    html += '<tr class="cal-sum"><th scope="row" class="cal-rowhead">Stressed (of 6)</th>';
    YEARS.forEach(function (y, i) { html += '<td class="cal-count' + (b[i] >= 5 ? ' is-max' : '') + '">' + b[i] + '</td>'; });
    html += '</tr>';
    html += '<tr class="cal-divider"><th scope="row" class="cal-rowhead">Chronic pressures</th><td colspan="' + YEARS.length + '"></td></tr>';
    CHRONIC.forEach(function (s) { html += row(s, false); });
    html += '</tbody>';
    table.innerHTML = html;
  }

  HH.onReady(function () {
    renderCalendar();
    if (typeof Chart === 'undefined') return;

    var axis = HH.axis;
    var labels = HH.valueLabels;
    var INK = '#15171c', HOT = '#a6363a', COOL = '#3b4a8c', MUTED = '#8a8f99';

    /* --- Breadth chart ------------------------------------------------------ */

    var breadthChart = HH.chart('chart-breadth', {
      type: 'bar',
      data: {
        labels: YEARS.map(function (y) { return y === 2026 ? '2026*' : String(y); }),
        datasets: [{
          label: 'Acute indicators stressed',
          data: breadth(q),
          backgroundColor: function (ctx) {
            var v = ctx.raw, y = YEARS[ctx.dataIndex];
            if (y === 2026) return '#c9c2b8';
            return v >= 5 ? '#7f1a2a' : v >= 3 ? '#c45f4f' : v >= 1 ? '#e8b39b' : '#efe7dc';
          },
          barPercentage: 0.86,
          categoryPercentage: 1,
        }],
      },
      options: {
        layout: { padding: { top: 18 } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.y + ' of 6 acute indicators stressed' + (YEARS[c.dataIndex] === 2026 ? ' (partial year, 4 indicators)' : ''); } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), {
            ticks: { maxRotation: 0, autoSkip: false, callback: function (v, i) { var y = YEARS[i]; return (y % 5 === 0 || y === 2026) ? (y === 2026 ? '26*' : y) : ''; } },
          }),
          y: Object.assign(axis({ title: 'Indicators stressed' }), { beginAtZero: true, max: 6, ticks: { stepSize: 1 } }),
        },
      },
      plugins: [labels({ axis: 'y', format: function (v) { return v > 0 ? v : ''; } })],
    });

    /* --- Small multiples ------------------------------------------------------ */

    var minis = {};
    ACUTE.forEach(function (s) {
      var thLine = {
        id: 'th-' + s.key,
        afterDatasetsDraw: function (chart) {
          var t = thresholds(q)[s.key];
          var y = chart.scales.y.getPixelForValue(t), a = chart.chartArea, ctx = chart.ctx;
          ctx.save();
          ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke();
          ctx.restore();
        },
      };
      minis[s.key] = HH.chart('mini-' + s.key, {
        type: 'bar',
        data: {
          labels: YEARS.map(String),
          datasets: [{
            data: s.m,
            backgroundColor: function (ctx) {
              var v = ctx.raw, y = YEARS[ctx.dataIndex];
              if (v == null) return 'transparent';
              if (y === 2026) return '#c9c2b8';
              return v >= thresholds(q)[s.key] ? HOT : '#d9cfc2';
            },
            barPercentage: 0.9, categoryPercentage: 1,
          }],
        },
        options: {
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { title: function (c) { return c[0].label + (c[0].label === '2026' ? ' (partial)' : ''); }, label: function (c) { return fmt(s, c.raw); } } },
          },
          scales: {
            x: Object.assign(axis({ grid: false }), { ticks: { maxRotation: 0, autoSkip: false, font: { size: 9 }, callback: function (v, i) { var y = YEARS[i]; return y % 10 === 0 ? y : ''; } } }),
            y: Object.assign(axis({}), { ticks: { font: { size: 9 }, maxTicksLimit: 4 } }),
          },
        },
        plugins: [thLine],
      });
    });

    /* --- Decades ---------------------------------------------------------------- */

    var QS = [0.667, 0.75, 0.8];
    var QL = ['Worst third', 'Worst quartile', 'Worst fifth'];
    var dec = QS.map(decadeAvgs);
    HH.chart('chart-decades', {
      type: 'bar',
      data: {
        labels: ['2000–09', '2010–19', '2020–25'],
        datasets: QS.map(function (qq, i) {
          return {
            label: QL[i],
            data: dec[i].map(function (v) { return Math.round(v * 100) / 100; }),
            backgroundColor: ['#e8b39b', '#c45f4f', '#7f1a2a'][i],
            barPercentage: 0.82,
          };
        }),
      },
      options: {
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 10, font: { size: 10.5 } } },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1) + ' a year'; } } },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Average indicators stressed' }), { beginAtZero: true, max: 4.5 }),
        },
      },
    });

    /* --- Correlation table -------------------------------------------------------- */

    var corr = document.getElementById('corr-matrix');
    if (corr) {
      var names = DATA.corr.keys.map(function (k) { return DATA.series.filter(function (s) { return s.key === k; })[0].label; });
      var h = '<thead><tr><th scope="col"></th>' + names.map(function (n) { return '<th scope="col">' + n + '</th>'; }).join('') + '</tr></thead><tbody>';
      DATA.corr.matrix.forEach(function (row, i) {
        h += '<tr><th scope="row">' + names[i] + '</th>';
        row.forEach(function (r, j) {
          var cls = i === j ? 'is-diag' : (Math.abs(r) >= 0.6 ? 'is-strong' : Math.abs(r) >= 0.25 ? 'is-mid' : 'is-weak');
          h += '<td class="' + cls + '" title="' + names[i] + ' × ' + names[j] + ': r = ' + r.toFixed(2) + '">' + (i === j ? '—' : r.toFixed(2)) + '</td>';
        });
        h += '</tr>';
      });
      corr.innerHTML = h + '</tbody>';
    }

    /* --- The rising floor ----------------------------------------------------------- */

    HH.chart('chart-conflicts', {
      type: 'line',
      data: {
        labels: DATA.conflicts.years,
        datasets: [{
          label: 'State-based armed conflicts',
          data: DATA.conflicts.n,
          borderColor: HOT,
          backgroundColor: 'rgba(166, 54, 58, 0.12)',
          fill: true, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.15,
        }],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + ' active conflicts'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: { maxRotation: 0, autoSkip: false, callback: function (v, i) { var y = DATA.conflicts.years[i]; return y % 10 === 0 ? y : ''; } } }),
          y: Object.assign(axis({ title: 'Conflicts' }), { beginAtZero: true, max: 70 }),
        },
      },
    });

    function chronicLine(id, key, color, unit, fmtTick) {
      var s = CHRONIC.filter(function (x) { return x.key === key; })[0];
      var ys = YEARS.filter(function (y, i) { return s.raw[i] != null; });
      HH.chart(id, {
        type: 'line',
        data: {
          labels: ys,
          datasets: [{ data: ys.map(function (y) { return s.raw[YEARS.indexOf(y)]; }), borderColor: color, backgroundColor: color, borderWidth: 2.2, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 }],
        },
        options: {
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return fmt(s, c.parsed.y); } } } },
          scales: {
            x: Object.assign(axis({ grid: false }), { ticks: { maxRotation: 0, autoSkip: false, callback: function (v, i) { return ys[i] % 5 === 0 ? ys[i] : ''; } } }),
            y: Object.assign(axis({ title: unit }), { ticks: { callback: fmtTick } }),
          },
        },
      });
    }
    chronicLine('chart-temp', 'climate', HOT, '°C vs 1951–80', function (v) { return v.toFixed(1); });
    chronicLine('chart-displaced', 'displacement', COOL, 'Millions', function (v) { return v; });

    /* --- Threshold control ------------------------------------------------------------- */

    function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
    function applyThreshold() {
      renderCalendar();
      if (breadthChart) { breadthChart.data.datasets[0].data = breadth(q); breadthChart.update(); }
      Object.keys(minis).forEach(function (k) { if (minis[k]) minis[k].update(); });
      var d = decadeAvgs(q);
      setText('avg-00', d[0].toFixed(1)); setText('avg-10', d[1].toFixed(1)); setText('avg-20', d[2].toFixed(1));
      setText('breadth-meta', QL[QS.indexOf(q)] + ' · six acute indicators · author’s calculation');
    }
    var seg = document.querySelectorAll('.segmented button');
    Array.prototype.forEach.call(seg, function (btn) {
      btn.addEventListener('click', function () {
        q = parseFloat(btn.getAttribute('data-q'));
        Array.prototype.forEach.call(seg, function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        applyThreshold();
      });
    });
    applyThreshold();
  });
})();
