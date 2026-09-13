/* ===========================================================================
   Charts — "The Bars Do Not Add Up"

   Figures 1 and 2 replot the published Global Burden of Disease 2017
   attributable-death figures shown in the chart under discussion; Figure 3
   compares two published estimates of the same quantity; Figure 4 plots WHO
   return-on-investment estimates. Nothing here is modelled by the author.
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

    var mn = function (v) { return v + 'm'; };

    /* --- 1. The sum against the population of the dead ------------------- */

    HH.chart('chart-sum', {
      type: 'bar',
      data: {
        labels: [
          'All 34 bars, added together',
          'People who actually died in 2017',
        ],
        datasets: [{
          label: 'Millions of deaths',
          data: [66.9, 56],
          backgroundColor: [C.red, C.gray],
          barThickness: 52,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + ' million'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of deaths, 2017' }), {
            beginAtZero: true, suggestedMax: 72,
            ticks: { callback: function (v) { return v + 'm'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: mn })],
    });

    /* --- 2. The same bars, sorted by what kind of thing they are --------- */

    // One dataset per category, with nulls elsewhere, so the legend carries
    // the taxonomy. Stacking keeps each bar at full width.
    var names = [
      'High blood pressure', 'Smoking', 'High blood sugar', 'Obesity',
      'Outdoor air pollution', 'Diet high in sodium', 'Diet low in whole grains',
      'Alcohol use', 'Diet low in fruits', 'Diet low in nuts and seeds',
      'Indoor air pollution', 'Diet low in vegetables',
    ];
    var vals = [10.44, 7.1, 6.53, 4.72, 3.41, 3.2, 3.07, 2.84, 2.42, 2.06, 1.64, 1.46];
    var kind = ['P', 'B', 'P', 'P', 'E', 'D', 'D', 'B', 'D', 'D', 'E', 'D'];

    function series(code) {
      return vals.map(function (v, i) { return kind[i] === code ? v : null; });
    }

    HH.chart('chart-kinds', {
      type: 'bar',
      data: {
        labels: names,
        datasets: [
          { label: 'Physiological state', data: series('P'), backgroundColor: C.red, stack: 'k' },
          { label: 'Behaviour', data: series('B'), backgroundColor: C.blue, stack: 'k' },
          { label: 'Environmental exposure', data: series('E'), backgroundColor: C.teal, stack: 'k' },
          { label: 'Dietary composition', data: series('D'), backgroundColor: C.gold, stack: 'k' },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                if (c.parsed.x === null) return null;
                return c.dataset.label + ': ' + c.parsed.x + ' million';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of attributable deaths, 2017' }), {
            stacked: true, beginAtZero: true, suggestedMax: 11.5,
            ticks: { callback: function (v) { return v + 'm'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { font: { size: 10 } } }),
        },
      },
    });

    /* --- 3. One quantity, two published estimates ------------------------ */

    HH.chart('chart-airpollution', {
      type: 'bar',
      data: {
        labels: [
          'GBD 2017\n(2017 data, as charted)',
          'State of Global Air 2024\n(2021 data)',
        ],
        datasets: [{
          label: 'Annual deaths attributed to air pollution',
          data: [4.9, 8.1],
          backgroundColor: [C.gray, C.red],
          barThickness: 54,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.y + ' million deaths a year'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
          y: Object.assign(axis({ title: 'Millions of deaths a year' }), {
            beginAtZero: true, suggestedMax: 9,
            ticks: { callback: function (v) { return v + 'm'; } },
          }),
        },
      },
      plugins: [labels({ format: mn })],
    });

    /* --- 4. What the interventions return -------------------------------- */

    HH.chart('chart-roi', {
      type: 'bar',
      data: {
        labels: ['Sustained five years', 'Sustained to 2035'],
        datasets: [{
          label: 'Return per US$1 invested in WHO "best buys"',
          data: [4, 7],
          backgroundColor: [C.teal, C.blue],
          barThickness: 56,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.y + ' dollars returned per dollar invested'; } },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Return per US$1 invested' }), {
            beginAtZero: true, suggestedMax: 8,
            ticks: { callback: function (v) { return '$' + v; } },
          }),
        },
      },
      plugins: [labels({ format: function (v) { return '$' + v; } })],
    });
  });
})();
