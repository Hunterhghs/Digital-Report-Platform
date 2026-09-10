/* ===========================================================================
   Charts — "A Proactive Strategy for Mitigating the Twenty-First-Century
   Polycrisis"

   Every figure here plots reported values. Colours come from the theme
   tokens — burgundy for the mitigation register, teal for adaptation and
   capability, muted neutrals for context.
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

    /* --- 1. One externality, fifteen different prices -------------------- */

    HH.chart('chart-carbonprice', {
      type: 'bar',
      data: {
        labels: [
          'Norway (tax)', 'Uruguay (tax)', 'Sweden (tax)', 'Switzerland (tax)',
          'EU ETS', 'UK ETS', 'California Cap-and-Invest', 'Mexico (tax)',
          'RGGI (US North-East)', 'South Africa (tax)', 'China national ETS',
        ],
        datasets: [{
          label: 'US$ per tonne of CO₂',
          data: [170, 160, 155, 135, 89, 55, 30, 25, 20, 17, 11],
          backgroundColor: function (ctx) {
            var v = ctx.parsed ? ctx.parsed.x : 0;
            return v >= 100 ? C.teal : v >= 50 ? C.gold : C.red;
          },
          barThickness: 15,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return 'US$' + c.parsed.x + ' per tonne of CO₂'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ per tonne of CO₂, 2025–26' }), {
            beginAtZero: true, suggestedMax: 185,
            ticks: { callback: function (v) { return '$' + v; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '$' + v; } })],
    });

    /* --- 2. The price signal against the counter-signal ------------------- */

    HH.chart('chart-signal', {
      type: 'bar',
      data: {
        labels: [
          'Fossil-fuel subsidies, 2024',
          'Revenue raised by carbon pricing, 2024',
        ],
        datasets: [{
          label: 'US$ billion a year',
          data: [7400, 100],
          backgroundColor: [C.red, C.teal],
          barThickness: 46,
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
                return v >= 1000
                  ? 'US$' + (v / 1000).toFixed(1) + ' trillion a year'
                  : 'US$' + v + ' billion a year';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billion a year' }), {
            beginAtZero: true, suggestedMax: 8000,
            ticks: {
              callback: function (v) {
                return v >= 1000 ? '$' + (v / 1000) + 'tn' : '$' + v + 'bn';
              },
            },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          return v >= 1000 ? '$' + (v / 1000).toFixed(1) + 'tn' : '$' + v + 'bn';
        },
      })],
    });

    /* --- 3. Two goods, two financing outcomes ----------------------------- */

    HH.chart('chart-asymmetry', {
      type: 'bar',
      data: {
        labels: [
          'Clean-energy investment\n(sells a product)',
          'Assessed adaptation need\nby 2035',
          'International public\nadaptation finance, 2023',
        ],
        datasets: [{
          label: 'US$ billion a year',
          data: [2200, [310, 365], 26],
          backgroundColor: [C.blue, C.gray, C.teal],
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
                var raw = c.raw;
                if (Array.isArray(raw)) return 'US$' + raw[0] + '–' + raw[1] + ' billion a year';
                return raw >= 1000
                  ? 'US$' + (raw / 1000).toFixed(1) + ' trillion a year'
                  : 'US$' + raw + ' billion a year';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billion a year' }), {
            beginAtZero: true, suggestedMax: 2400,
            ticks: {
              callback: function (v) {
                return v >= 1000 ? '$' + (v / 1000) + 'tn' : '$' + v + 'bn';
              },
            },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          if (Array.isArray(v)) return '$' + v[0] + '–' + v[1] + 'bn';
          return v >= 1000 ? '$' + (v / 1000).toFixed(1) + 'tn' : '$' + v + 'bn';
        },
      })],
    });

    /* --- 4. Declaring is not operating ------------------------------------ */

    HH.chart('chart-declare-operate', {
      type: 'bar',
      data: {
        labels: [
          'Have a national adaptation plan\n(a document)',
          'Have a multi-hazard early-warning system\n(an operating capability)',
        ],
        datasets: [{
          label: 'Share of countries',
          data: [87, 62],
          backgroundColor: [C.gray, C.teal],
          barThickness: 48,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return 'about ' + c.parsed.x + '% of countries'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of countries' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '~' + v + '%'; } })],
    });
  });
})();
