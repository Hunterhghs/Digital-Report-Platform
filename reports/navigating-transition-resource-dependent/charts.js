/* ===========================================================================
   Charts — "Navigating the Transition"

   Every figure replots published values. Navy carries the asset side, brass
   the liability side and the treatments that act on it, brick the cases where
   a rule failed.
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

    /* --- 1. Two scenarios -------------------------------------------------- */

    HH.chart('chart-scenarios', {
      type: 'bar',
      data: {
        labels: ['Stated policies: peak, around 2030', 'Current policies: 2050'],
        datasets: [{
          label: 'Million barrels a day',
          data: [102, 113],
          backgroundColor: [C.blue, C.gold],
          barThickness: 44,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + ' mb/d'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Global oil demand, million barrels a day' }), {
            beginAtZero: false, min: 80, max: 125,
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + ' mb/d'; } })],
    });

    /* --- 2. Commodity dependence ------------------------------------------ */

    HH.chart('chart-dependence', {
      type: 'bar',
      data: {
        labels: [
          'Least-developed countries',
          'Landlocked developing countries',
          'Small island developing states',
          'All UNCTAD member states',
        ],
        datasets: [{
          label: 'Share classified as commodity-dependent, %',
          data: [80, 80, 60, 52.9],
          backgroundColor: [C.red, C.red, C.orange, C.gray],
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
                return c.dataIndex < 2
                  ? 'more than 80% of this group'
                  : (c.dataIndex === 2 ? 'around 60% of this group' : '52.9% of member states');
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of countries in the group' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return (i < 2 ? '>' : i === 2 ? '~' : '') + v + '%'; },
      })],
    });

    /* --- 3. The sovereign hedge -------------------------------------------- */

    HH.chart('chart-hedge', {
      type: 'bar',
      data: {
        labels: ['Annual premium, typical', 'Payout in 2020'],
        datasets: [{
          label: 'US$ billions',
          data: [1, 2.4],
          backgroundColor: [C.gold, C.blue],
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
                  ? 'about US$1bn a year, covering 200–300m barrels'
                  : 'about US$2.4bn received';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions' }), {
            beginAtZero: true, max: 3,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '~$' + v + 'bn'; } })],
    });

    /* --- 4. Two funds, one rule -------------------------------------------- */

    HH.chart('chart-funds', {
      type: 'bar',
      data: {
        labels: ['Norway, Government Pension Fund Global', 'Timor-Leste, Petroleum Fund'],
        datasets: [{
          label: 'Fund value, US$ billions',
          data: [2200, 16],
          backgroundColor: [C.blue, C.red],
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
                return c.dataIndex === 0
                  ? 'above US$2tn; 3% rule generally observed'
                  : 'about US$16bn; 3% rule exceeded for years';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Fund value, US$ billions (log scale)' }), {
            type: 'logarithmic', min: 10, max: 5000,
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
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v >= 1000 ? '~$' + (v / 1000).toFixed(1) + 'tn' : '~$' + v + 'bn'; },
      })],
    });

    /* --- 5. Fiscal breakevens ---------------------------------------------- */

    HH.chart('chart-breakeven', {
      type: 'bar',
      data: {
        labels: [
          'Gulf median, 2030 (projected)',
          'Gulf median, 2025',
          'Saudi: standard budget',
          'Saudi: including giga-projects',
          'Saudi: including PIF outlays',
        ],
        datasets: [{
          label: 'US$ per barrel',
          data: [62, 70, [80, 85], 96, 110],
          backgroundColor: [C.gray, C.blue, C.gold, C.orange, C.red],
          barThickness: 24,
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
                return Array.isArray(r) ? '$' + r[0] + '–' + r[1] + ' a barrel' : 'about $' + r + ' a barrel';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Fiscal breakeven, US$ per barrel' }), {
            beginAtZero: false, min: 40, max: 130,
            ticks: { callback: function (v) { return '$' + v; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) {
          return Array.isArray(v) ? '$' + v[0] + '–' + v[1] : (i === 4 ? '>$' : '~$') + v;
        },
      })],
    });

    /* --- 6. Indonesia's nickel exports ------------------------------------- */

    HH.chart('chart-nickel', {
      type: 'bar',
      data: {
        labels: ['2013, before the ban', '2022, after downstreaming'],
        datasets: [{
          label: 'Nickel-related exports, US$ billions',
          data: [6, 30],
          backgroundColor: [C.gray, C.blue],
          barThickness: 44,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'about US$' + c.parsed.x + 'bn'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions of nickel-related exports' }), {
            beginAtZero: true, max: 36,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '~$' + v + 'bn'; } })],
    });
  });
})();
