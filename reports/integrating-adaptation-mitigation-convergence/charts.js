/* ===========================================================================
   Charts — "Integrating Adaptation and Mitigation"

   Every figure replots published values. The palette is the report's two
   threads: teal for mitigation and clean supply, ochre for adaptation and
   protection, brick for the rival cases and for damage.
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

    function usd(v) { return v >= 1000 ? '$' + (v / 1000).toFixed(2) + 'tn' : '$' + v + 'bn'; }

    /* --- 1. Tracked climate finance by objective -------------------------- */

    HH.chart('chart-finance', {
      type: 'bar',
      data: {
        labels: ['Mitigation', 'Adaptation', 'Dual-benefit'],
        datasets: [{
          label: 'US$ billions, 2023',
          data: [1780, 65, 58],
          backgroundColor: [C.blue, C.orange, C.gold],
          barThickness: 30,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return usd(c.parsed.x); } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions (log scale)' }), {
            type: 'logarithmic', min: 10, max: 3000,
            ticks: {
              maxRotation: 0,
              autoSkip: false,
              // Label powers of ten only; Chart.js also generates minor ticks.
              callback: function (v) {
                var e = Math.log10(v);
                return Math.abs(e - Math.round(e)) < 1e-6 ? '$' + Math.pow(10, Math.round(e)) + 'bn' : '';
              },
            },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: usd })],
    });

    /* --- 2. Adaptation finance: needs against flows ----------------------- */

    HH.chart('chart-gap', {
      type: 'bar',
      data: {
        labels: ['Needs by 2035\n(modelled to national plans)', 'International public flows, 2023'],
        datasets: [{
          label: 'US$ billions a year',
          // A floating bar carries the published 310–365 range without
          // collapsing it to a midpoint.
          data: [[310, 365], [0, 26]],
          backgroundColor: [C.orange, C.gray],
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
                var r = c.raw;
                return r[0] === 0 ? '$' + r[1] + 'bn a year' : '$' + r[0] + '–' + r[1] + 'bn a year';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions a year, developing countries' }), {
            beginAtZero: true, max: 420,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v[0] === 0 ? '$' + v[1] + 'bn' : '$' + v[0] + '–' + v[1] + 'bn'; },
      })],
    });

    /* --- 3. Cooling demand index ------------------------------------------ */

    HH.chart('chart-cooling', {
      type: 'bar',
      data: {
        labels: ['Space cooling demand today', '2050 baseline, no efficiency action'],
        datasets: [{
          label: 'Index, today = 100',
          data: [100, 300],
          backgroundColor: [C.blueLight, C.orange],
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
                return c.dataIndex === 0
                  ? 'Index 100 — about 10% of global electricity'
                  : 'At least 300 — the IEA projects demand "more than triples"';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Index, space-cooling energy demand today = 100' }), {
            beginAtZero: true, max: 360,
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return i === 0 ? '100' : '300+ (lower bound)'; },
      })],
    });

    /* --- 4. Heat derating of a thermal plant ------------------------------ */

    HH.chart('chart-derate', {
      type: 'bar',
      data: {
        labels: ['Capacity', 'Efficiency'],
        datasets: [{
          label: 'Loss at 40 °C against 20 °C, per cent',
          data: [13, 7],
          backgroundColor: [C.red, C.orange],
          barThickness: 40,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% lower at 40 °C'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent lower at 40 °C than at 20 °C' }), {
            beginAtZero: true, max: 20,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '−' + v + '%'; } })],
    });

    /* --- 6. Investment against population -------------------------------- */

    HH.chart('chart-investment', {
      type: 'bar',
      data: {
        labels: ['EMDEs excluding China', 'Africa', 'Africa'],
        datasets: [{
          label: 'Per cent',
          data: [20, 2, 20],
          backgroundColor: [C.blue, C.red, C.gray],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var what = c.dataIndex === 2 ? 'of world population' : 'of global clean energy investment';
                return c.parsed.x + '% ' + what;
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent' }), {
            beginAtZero: true, max: 25,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), {
            ticks: {
              font: { size: 10.5 },
              // Two of the rows are Africa; the axis has to say which is which.
              callback: function (v, i) {
                return ['Clean investment: EMDEs ex-China', 'Clean investment: Africa', 'Population: Africa'][i];
              },
            },
          }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '%'; } })],
    });

    /* --- 7. Cost of capital for solar ------------------------------------- */

    HH.chart('chart-wacc', {
      type: 'bar',
      data: {
        labels: ['Advanced economies', 'Philippines', 'Vietnam', 'Indonesia'],
        datasets: [{
          label: 'Cost of capital, per cent',
          data: [[5, 6.5], [0, 8], [0, 9], [0, 9.4]],
          backgroundColor: [C.gray, C.blue, C.blue, C.red],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var r = c.raw;
                return r[0] === 0 ? r[1] + '% median WACC' : r[0] + '–' + r[1] + '% range';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Weighted average cost of capital, per cent' }), {
            beginAtZero: true, max: 12,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v[0] === 0 ? v[1] + '%' : v[0] + '–' + v[1] + '%'; },
      })],
    });

    /* --- 8. Kariba 2024 --------------------------------------------------- */

    HH.chart('chart-kariba', {
      type: 'bar',
      data: {
        labels: [
          'Hydropower share of installed capacity',
          'Lake Kariba live storage at the 2024 low',
          'Kariba North Bank turbines in service at the trough',
        ],
        datasets: [{
          label: 'Per cent',
          data: [86, 8, 17],
          backgroundColor: [C.blue, C.red, C.red],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataIndex === 2
                  ? 'one of six turbines running — about 17%'
                  : c.parsed.x + '%';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return i === 2 ? '1 of 6' : v + '%'; },
      })],
    });
  });
})();
