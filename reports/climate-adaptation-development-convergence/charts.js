/* ===========================================================================
   Charts — "Climate Adaptation and Development Convergence Across the
   Global South"

   Colours come from the theme tokens. Where a figure renders the shape of a
   finding rather than a published series — the convergence sign flip, the
   retention trajectories — the on-page caption says so explicitly and the
   axis is drawn accordingly.
   =========================================================================== */

(function () {
  'use strict';

  // report.js defines HH and loads first; bail out rather than throw if it did not.
  if (!window.HH) return;

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;

    var C = HH.palette;
    var axis = HH.axis;
    var labels = HH.valueLabels;

    var pct = function (v) {
      return Array.isArray(v) ? v[0] + '–' + v[1] + '%' : v + '%';
    };

    /* --- 1. Convergence switched on, and only recently ------------------- */

    // The magnitude of the coefficient is estimate-dependent and contested,
    // so this renders its sign alone: the axis carries no numeric ticks.
    HH.chart('chart-convergence', {
      type: 'bar',
      data: {
        labels: ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s'],
        datasets: [{
          label: 'Sign of the coefficient on initial income',
          data: [1, 1, 1, 1, -1, -1],
          backgroundColor: function (ctx) {
            return ctx.dataIndex < 4 ? C.red : C.teal;
          },
          barThickness: 46,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.parsed.y > 0
                  ? 'Positive coefficient — divergence'
                  : 'Negative coefficient — convergence';
              },
            },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis(), {
            min: -1.6,
            max: 1.6,
            ticks: {
              color: C.muted,
              padding: 8,
              callback: function (v) {
                if (v === 1) return 'Divergence';
                if (v === -1) return 'Convergence';
                return '';
              },
            },
          }),
        },
      },
    });

    /* --- 2. Convergence runs on particular escalators -------------------- */

    HH.chart('chart-escalators', {
      type: 'bar',
      data: {
        labels: ['Formal manufacturing', 'Agriculture'],
        datasets: [{
          label: 'Unconditional catch-up in labour productivity',
          data: [[2, 3], 0],
          backgroundColor: [C.blue, C.gray],
          barThickness: 44,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                return Array.isArray(c.raw)
                  ? c.raw[0] + '–' + c.raw[1] + '% of the gap closed per year'
                  : 'No measurable catch-up';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of the productivity gap closed per year' }), {
            beginAtZero: true, suggestedMax: 3.6,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          return Array.isArray(v) ? v[0] + '–' + v[1] + '%' : '≈0 — no measurable catch-up';
        },
      })],
    });

    /* --- 3. The risk premium, priced --------------------------------------- */

    HH.chart('chart-wacc', {
      type: 'bar',
      data: {
        labels: [
          'Europe & North America',
          'Kenya or Senegal',
          'African power sector overall',
        ],
        datasets: [{
          label: 'Weighted average cost of capital',
          data: [[4, 6], [8, 9], 15],
          backgroundColor: [C.teal, C.gold, C.red],
          barThickness: 40,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                return Array.isArray(c.raw)
                  ? 'WACC of ' + c.raw[0] + '–' + c.raw[1] + '%'
                  : 'WACC above ' + c.raw + '%';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Weighted average cost of capital (%)' }), {
            beginAtZero: true, suggestedMax: 18,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return Array.isArray(v) ? v[0] + '–' + v[1] + '%' : '>' + v + '%'; },
      })],
    });

    /* --- 4. Heat is already taking output ---------------------------------- */

    HH.chart('chart-heat', {
      type: 'bar',
      data: {
        labels: ['Dhaka', 'Bangkok', 'New Delhi'],
        datasets: [{
          label: 'Output lost to heat-driven productivity decline',
          data: [8.3, 4.9, 4.2],
          backgroundColor: [C.orange, C.gold, C.purple],
          barThickness: 46,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return c.parsed.y + '% of economic output'; },
            },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Per cent of economic output' }), {
            beginAtZero: true, suggestedMax: 10,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
        },
      },
      plugins: [labels({ format: pct })],
    });

    /* --- 5. The retention gap (the signature figure) ---------------------- */

    // Two economies, identical gross growth of 5% a year, differing only in
    // how much of it survives. Arithmetic, not a forecast — the caption says so.
    var YEARS = 30;
    var years = [];
    var high = [];
    var low = [];
    for (var y = 0; y <= YEARS; y++) {
      years.push('Year ' + y);
      high.push(100 * Math.pow(1.045, y));
      low.push(100 * Math.pow(1.03, y));
    }

    HH.chart('chart-retention', {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'High retention — 0.5% a year lost to shocks (net 4.5%)',
            data: high,
            borderColor: C.teal,
            backgroundColor: 'rgba(14, 116, 144, 0.10)',
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: '+1',
          },
          {
            label: 'Low retention — 2.0% a year lost to shocks (net 3.0%)',
            data: low,
            borderColor: C.red,
            backgroundColor: C.red,
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataset.label.split(' —')[0] + ': ' + Math.round(c.parsed.y);
              },
              footer: function (items) {
                if (items.length < 2) return '';
                var a = items[0].parsed.y;
                var b = items[1].parsed.y;
                var hi = Math.max(a, b);
                var lo = Math.min(a, b);
                return 'Gap: ' + Math.round((hi / lo - 1) * 100) + '% higher income';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), {
            ticks: {
              color: C.muted,
              padding: 8,
              callback: function (v, i) { return i % 5 === 0 ? i : ''; },
            },
          }),
          y: Object.assign(axis({ title: 'Income per head, indexed to 100 at year 0' }), {
            beginAtZero: false,
            suggestedMin: 100,
          }),
        },
      },
    });

    /* --- 6. Adaptation recovers most of the loss -------------------------- */

    HH.chart('chart-offset', {
      type: 'bar',
      data: {
        labels: ['Heat-driven learning loss over a school year'],
        datasets: [
          {
            label: 'Recovered by adaptation (air conditioning)',
            data: [75],
            backgroundColor: C.teal,
            barThickness: 54,
            stack: 'a',
          },
          {
            label: 'Residual loss',
            data: [25],
            backgroundColor: C.red,
            barThickness: 54,
            stack: 'a',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) { return c.dataset.label + ': ' + c.parsed.x + '% of the loss'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Share of the heat-driven learning loss' }), {
            stacked: true, beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { font: { size: 10.5 } } }),
        },
      },
    });
  });
})();
