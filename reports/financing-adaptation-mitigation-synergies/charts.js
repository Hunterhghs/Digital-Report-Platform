/* ===========================================================================
   Charts — "Financing the Synergy"

   Every figure replots published values. Bottle green carries the financed
   side, gold the instrument that converts an avoided loss, brick the
   unfinanced remainder.
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

    /* --- 1. Who pays for adaptation --------------------------------------- */

    HH.chart('chart-private', {
      type: 'bar',
      data: {
        labels: ['All tracked adaptation finance', 'Of which: from private actors'],
        datasets: [{
          label: 'US$ billions, 2023',
          data: [65, 5.7],
          backgroundColor: [C.blue, C.gold],
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
                return c.dataIndex === 1
                  ? 'US$5.7bn — about 9% of the tracked total'
                  : 'US$65bn tracked for 2023';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions, 2023' }), {
            beginAtZero: true, max: 75,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return i === 1 ? '$5.7bn (~9%)' : '$65bn'; },
      })],
    });

    /* --- 2. The vulnerability premium ------------------------------------- */

    HH.chart('chart-premium', {
      type: 'bar',
      data: {
        labels: ['Decade studied, additional interest paid', 'Following decade, projected'],
        datasets: [{
          label: 'US$ billions',
          data: [[0, 40], [146, 168]],
          backgroundColor: [C.gray, C.red],
          barThickness: 42,
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
                return r[0] === 0 ? 'about US$' + r[1] + 'bn' : 'US$' + r[0] + '–' + r[1] + 'bn';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions of additional interest' }), {
            beginAtZero: true, max: 200,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v[0] === 0 ? '~$' + v[1] + 'bn' : '$' + v[0] + '–' + v[1] + 'bn'; },
      })],
    });

    /* --- 3. The protection gap -------------------------------------------- */

    HH.chart('chart-gap', {
      type: 'bar',
      data: {
        labels: ['Natural catastrophe losses, 2024'],
        datasets: [
          {
            label: 'Insured',
            data: [137],
            backgroundColor: C.blue,
            barThickness: 56,
          },
          {
            label: 'Uninsured — the protection gap',
            data: [181],
            backgroundColor: C.red,
            barThickness: 56,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 10.5 } } },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataset.label + ': US$' + c.parsed.x + 'bn (' + Math.round((c.parsed.x / 318) * 100) + '%)';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions of economic losses, 2024' }), {
            stacked: true, beginAtZero: true, max: 340,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '$' + v + 'bn'; } })],
    });

    /* --- 4. Ecuador's Galápagos conversion --------------------------------- */

    HH.chart('chart-ecuador', {
      type: 'bar',
      data: {
        labels: [
          'Face value repurchased',
          'Debt service saved, 17 years',
          'Approximate market value paid',
          'Committed to conservation',
        ],
        datasets: [{
          label: 'US$ billions',
          data: [1.6, 1.1, 0.656, 0.45],
          backgroundColor: [C.gray, C.blue, C.teal, C.gold],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'US$' + c.parsed.x + 'bn'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions' }), {
            beginAtZero: true, max: 2,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '$' + v + 'bn'; } })],
    });

    /* --- 6. The climate finance goal --------------------------------------- */

    HH.chart('chart-ncqg', {
      type: 'bar',
      data: {
        labels: ['Previous goal', 'New goal for 2035', 'Wider mobilisation called for'],
        datasets: [{
          label: 'US$ billions a year',
          data: [100, 300, 1300],
          backgroundColor: [C.gray, C.blue, C.gold],
          barThickness: 32,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var v = c.parsed.x;
                return v >= 1000 ? 'US$' + (v / 1000).toFixed(1) + ' trillion a year' : 'US$' + v + 'bn a year';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions a year (log scale)' }), {
            type: 'logarithmic', min: 50, max: 3000,
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
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v >= 1000 ? '$' + (v / 1000).toFixed(1) + 'tn' : '$' + v + 'bn'; },
      })],
    });
  });
})();
