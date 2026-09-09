/* ===========================================================================
   Charts — "The Clean Transition as Global Polycrisis Mitigation Infrastructure"

   Every series here is the figure data from the underlying research report.
   Sources are named in each chart's on-page caption; nothing is generated or
   interpolated except where a caption says the path is illustrative.
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

    var gw = function (v) { return v.toLocaleString('en-GB') + ' GW'; };

    /* --- 1. Deployment is already at record pace ------------------------- */

    HH.chart('chart-additions', {
      type: 'bar',
      data: {
        labels: ['2015', '2017', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'Annual renewable power additions',
          data: [150, 175, 205, 261, 295, 348, 473, 585, 800],
          backgroundColor: function (ctx) {
            // The last two years carry the argument, so they are the two that
            // are coloured; the earlier run-up is context.
            var i = ctx.dataIndex;
            return i === 8 ? C.teal : i === 7 ? '#4a8c7a' : '#c9ccc8';
          },
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return gw(c.parsed.y); } } },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Gigawatts added per year' }), {
            beginAtZero: true,
            suggestedMax: 900,
          }),
        },
      },
      plugins: [labels({ format: gw, only: [7, 8] })],
    });

    /* --- 2. Air-pollution mortality --------------------------------------- */

    HH.chart('chart-pollution', {
      type: 'bar',
      data: {
        labels: ['All air pollution (2021)', 'of which: household solid fuels'],
        datasets: [{
          label: 'Deaths per year',
          data: [8.1, 3.7],
          backgroundColor: [C.orange, C.red],
          barThickness: 42,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + ' million deaths'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Million deaths per year' }), {
            beginAtZero: true, suggestedMax: 9.4,
          }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v.toFixed(1) + 'M'; } })],
    });

    /* --- 3. The EU fossil-import shock ------------------------------------ */

    HH.chart('chart-eu-imports', {
      type: 'bar',
      data: {
        labels: ['2021 — pre-crisis', '2022 — the shock', '2024 — post-crisis'],
        datasets: [{
          label: 'EU fossil-fuel import bill',
          data: [313, 693, 376],
          backgroundColor: [C.gray, C.red, C.teal],
          barThickness: 62,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return '€' + c.parsed.y + ' billion'; } } },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: '€ billion' }), { beginAtZero: true, suggestedMax: 780 }),
        },
      },
      plugins: [labels({ format: function (v) { return '€' + v + 'bn'; } })],
    });

    /* --- 4. The new dependency: refining concentration --------------------- */

    HH.chart('chart-minerals', {
      type: 'bar',
      data: {
        labels: ['Battery-grade graphite', 'Rare-earth elements', 'Refined lithium', 'Refined cobalt'],
        datasets: [{
          label: "China's projected share of refining, 2035",
          data: [80, 80, 60, 60],
          backgroundColor: [C.purple, C.purple, '#7c66b8', '#7c66b8'],
          barThickness: 30,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataIndex < 2 ? 'around 80% of supply' : 'over 60% of supply';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Share of global refined supply, 2035 (%)' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return i < 2 ? '~80%' : '>60%'; },
      })],
    });

    /* --- 5. The deployment multiplier, counted ----------------------------- */

    HH.chart('chart-multiplier', {
      type: 'bar',
      data: {
        labels: [
          'Clean power (solar, wind, hydro, geothermal)',
          'Energy efficiency & green buildings',
          'Electrified & public transport',
          'Grids, storage & interconnection',
          'Clean cooking & electrified heat',
          'Domestic clean-tech manufacturing',
          'Demand response & digital control',
          'Nature-based & resilient systems',
        ],
        datasets: [{
          label: 'Risk registers lowered strongly',
          data: [4, 4, 4, 3, 3, 3, 2, 1],
          backgroundColor: function (ctx) {
            var v = ctx.parsed ? ctx.parsed.x : 0;
            return v >= 4 ? C.teal : v === 3 ? '#4a8c7a' : v === 2 ? C.gold : C.gray;
          },
          barThickness: 22,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return c.parsed.x + ' of 4 risk registers'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Number of the four risk registers lowered strongly' }), {
            beginAtZero: true, max: 4, ticks: { stepSize: 1 },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + ' of 4'; } })],
    });

    /* --- 6. The deployment gap (the signature figure) ---------------------- */

    var gapYears = ['2018', '2019', '2020', '2021', '2022', '2023', '2024',
                    '2025', '2026', '2027', '2028', '2029', '2030'];
    var pad = [null, null, null, null, null, null];

    HH.chart('chart-gap', {
      type: 'line',
      data: {
        labels: gapYears,
        datasets: [
          {
            label: 'Installed capacity (history)',
            data: [2350, 2540, 2800, 3080, 3380, 3865, 4448],
            borderColor: C.blue,
            backgroundColor: C.blue,
            pointRadius: 3,
            fill: false,
          },
          {
            // 1,122 GW a year from 2025 — IRENA's requirement for the pledge.
            label: 'Required for the 2030 pledge (+1,122 GW/yr)',
            data: pad.concat([4448, 5570, 6692, 7814, 8936, 10058, 11180]),
            borderColor: C.teal,
            backgroundColor: C.teal,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false,
          },
          {
            // The record 2024 rate, held flat — deliberately generous.
            label: 'If the record 2024 pace merely holds (+585 GW/yr)',
            data: pad.concat([4448, 5033, 5618, 6203, 6788, 7373, 7958]),
            borderColor: C.gold,
            backgroundColor: 'rgba(184, 134, 11, 0.14)',
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: { target: 1 },
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
                if (c.parsed.y === null) return null;
                return c.dataset.label + ': ' + (c.parsed.y / 1000).toFixed(1) + ' TW';
              },
            },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Installed renewable capacity (GW)' }), {
            beginAtZero: true,
            suggestedMax: 12000,
            ticks: { callback: function (v) { return (v / 1000) + ' TW'; } },
          }),
        },
      },
    });

    /* --- 7. Investment: bigger than fossil, but concentrated --------------- */

    HH.chart('chart-investment', {
      type: 'bar',
      data: {
        labels: ['Clean energy', 'Fossil fuels'],
        datasets: [
          {
            label: 'China + advanced economies',
            data: [1.65, null],
            backgroundColor: C.teal,
            barThickness: 74,
            stack: 's',
          },
          {
            label: 'Rest of the world',
            data: [0.55, null],
            backgroundColor: '#9cc7c1',
            barThickness: 74,
            stack: 's',
          },
          {
            label: 'Fossil-fuel investment',
            data: [null, 1.1],
            backgroundColor: C.gray,
            barThickness: 74,
            stack: 's',
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) { return c.dataset.label + ': US$' + c.parsed.y + ' trillion'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), { stacked: true }),
          y: Object.assign(axis({ title: 'US$ trillion, 2025' }), {
            stacked: true, beginAtZero: true, suggestedMax: 2.6,
            ticks: { callback: function (v) { return '$' + v + 'tn'; } },
          }),
        },
      },
    });
  });
})();
