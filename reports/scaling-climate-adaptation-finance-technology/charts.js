/* ===========================================================================
   Charts — "Scaling Climate Adaptation Through Development Finance and
   Technology Diffusion"

   Colours come from the theme tokens, so this report's figures are drawn in
   its own earth palette without naming a single hex value here. Sources are
   given in each chart's on-page caption; ranges are plotted as floating bars
   rather than collapsed to a midpoint.
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

    // Ranges arrive as [low, high] floating bars; scalars print plainly.
    var usd = function (v) {
      return Array.isArray(v) ? '$' + v[0] + '–' + v[1] + 'bn' : '$' + v + 'bn';
    };
    var pct = function (v) {
      return Array.isArray(v) ? v[0] + '–' + v[1] + '%' : v + '%';
    };

    /* --- 1. The gap is widening, not closing ---------------------------- */

    HH.chart('chart-gap', {
      type: 'bar',
      data: {
        labels: ['2022', '2023', '2025', '2035\nCOP30 target', '2035\nassessed need'],
        datasets: [{
          label: 'Adaptation finance for developing countries',
          data: [28, 26, 40, 120, [310, 365]],
          backgroundColor: [C.gray, C.red, C.gold, C.blue, C.teal],
          barThickness: 54,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var raw = c.raw;
                return Array.isArray(raw)
                  ? 'US$' + raw[0] + '–' + raw[1] + ' billion a year'
                  : 'US$' + raw + ' billion a year';
              },
            },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'US$ billion per year' }), {
            beginAtZero: true,
            suggestedMax: 400,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
        },
      },
      plugins: [labels({ format: usd })],
    });

    /* --- 2. The delivery ladder ------------------------------------------ */

    HH.chart('chart-ladder', {
      type: 'bar',
      data: {
        labels: [
          'Countries with a national adaptation plan',
          'Countries with adequate early-warning systems',
          'Adaptation finance as a share of assessed need',
        ],
        datasets: [{
          label: 'Coverage',
          data: [87, 50, 8],
          backgroundColor: [C.teal, C.orange, C.red],
          barThickness: 34,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'about ' + c.parsed.x + '% covered'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '~' + v + '%'; } })],
    });

    /* --- 3. Losses already run far ahead of the finance ------------------ */

    HH.chart('chart-losses', {
      type: 'bar',
      data: {
        labels: [
          'Annual natural-hazard losses,\nlow- and middle-income countries',
          'International public adaptation\nfinance to developing countries',
        ],
        datasets: [{
          label: 'US$ billion per year',
          data: [390, 26],
          backgroundColor: [C.red, C.blue],
          barThickness: 46,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'US$' + c.parsed.x + ' billion a year'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billion per year' }), {
            beginAtZero: true, suggestedMax: 440,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '$' + v + 'bn'; } })],
    });

    /* --- 4. The returns are not in doubt -------------------------------- */

    HH.chart('chart-bcr', {
      type: 'bar',
      data: {
        labels: [
          'WRI — 320 real adaptation investments',
          'Early-warning systems (WMO / GCA)',
          'IFC — protected asset value per dollar',
          'World Bank Lifelines — resilient infrastructure',
          'Adapt Now — portfolio net benefit per dollar',
        ],
        datasets: [{
          label: 'Return per dollar invested',
          data: [10, 9, 8.6, 4, 3.9],
          backgroundColor: [C.teal, C.teal, C.orange, C.gold, C.gold],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return '$' + c.parsed.x + ' per $1 invested'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ of benefit per US$1 invested' }), {
            beginAtZero: true, suggestedMax: 12,
            ticks: { callback: function (v) { return '$' + v; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return (i === 0 ? '>$' : '$') + v; },
      })],
    });

    /* --- 5. What is at stake if the gap stays open ----------------------- */

    HH.chart('chart-gdp', {
      type: 'bar',
      data: {
        labels: [
          'Global GDP\nwell below 2°C',
          'Global GDP\nsevere warming',
          'ASEAN economies\nmost severe case',
        ],
        datasets: [{
          label: 'GDP smaller by mid-century than a no-warming baseline',
          data: [[11, 14], 18, 37],
          backgroundColor: [C.gold, C.orange, C.red],
          barThickness: 58,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var raw = c.raw;
                return Array.isArray(raw)
                  ? raw[0] + '–' + raw[1] + '% smaller by mid-century'
                  : raw + '% smaller by mid-century';
              },
            },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Per cent smaller than a no-warming baseline' }), {
            beginAtZero: true, suggestedMax: 42,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
        },
      },
      plugins: [labels({ format: pct })],
    });

    /* --- 6. What delivery achieves: Bangladesh -------------------------- */

    HH.chart('chart-bangladesh', {
      type: 'bar',
      data: {
        labels: ['1970 — Cyclone Bhola', '1991 — April cyclone', '2020 — Cyclone Amphan'],
        datasets: [{
          label: 'Reported deaths in Bangladesh',
          data: [300000, 138000, 26],
          backgroundColor: [C.red, C.orange, C.teal],
          barThickness: 62,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return c.parsed.y.toLocaleString('en-GB') + ' reported deaths'; },
            },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Reported deaths (logarithmic scale)' }), {
            type: 'logarithmic',
            min: 10,
            max: 1000000,
            ticks: {
              callback: function (v) {
                // Label only the decade gridlines; a log axis otherwise
                // crowds itself with unreadable intermediate values.
                return [10, 100, 1000, 10000, 100000, 1000000].indexOf(v) > -1
                  ? v.toLocaleString('en-GB')
                  : '';
              },
            },
          }),
        },
      },
      plugins: [labels({
        format: function (v) { return v.toLocaleString('en-GB'); },
      })],
    });
  });
})();
