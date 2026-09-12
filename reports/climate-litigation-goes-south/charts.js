/* ===========================================================================
   Charts — "Climate Litigation Goes South"

   All four figures plot reported values from the LSE–Sabin 2024 snapshot
   (or values derived from it, flagged in the captions). Colours come from
   the theme tokens — bench green for the docket, oxblood for the South.
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

    /* --- 1. The docket is younger than the treaty ------------------------- */

    HH.chart('chart-paris', {
      type: 'bar',
      data: {
        labels: [
          'Before the Paris Agreement\n(through 2015)',
          'Since the Paris Agreement\n(2015 – mid-2024)',
        ],
        datasets: [{
          label: 'Climate cases on record',
          data: [800, 1866],
          backgroundColor: [C.gray, C.blue],
          barThickness: 46,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x.toLocaleString() + ' cases'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Cumulative climate cases' }), {
            beginAtZero: true, suggestedMax: 2200,
            ticks: { callback: function (v) { return v.toLocaleString(); } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v.toLocaleString(); },
      })],
    });

    /* --- 2. Where the cases sit ------------------------------------------- */

    HH.chart('chart-geography', {
      type: 'bar',
      data: {
        labels: [
          'Developed countries',
          'Developing countries',
          'International and regional bodies',
        ],
        datasets: [{
          label: 'Share of the global docket',
          data: [87, 8, 5],
          backgroundColor: function (ctx) {
            var i = ctx.dataIndex;
            return i === 1 ? C.red : i === 2 ? C.gold : C.gray;
          },
          barThickness: 44,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + '% of cases'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of all cases' }), {
            beginAtZero: true, suggestedMax: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '%'; } })],
    });

    /* --- 3. The docket wins more than it loses ---------------------------- */

    HH.chart('chart-outcomes', {
      type: 'bar',
      data: {
        labels: [
          'Concluded cases in favour of claimants',
          'Concluded cases against or mixed',
        ],
        datasets: [{
          label: 'Concluded climate cases, 2016–2023',
          data: [70, 30],
          backgroundColor: [C.blue, C.gray],
          barThickness: 46,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + '% of concluded cases'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of concluded cases' }), {
            beginAtZero: true, suggestedMax: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '%'; } })],
    });

    /* --- 4. The docket's centre of gravity --------------------------------- */

    HH.chart('chart-dockets', {
      type: 'bar',
      data: {
        labels: ['United States', 'United Kingdom', 'Brazil', 'Germany'],
        datasets: [{
          label: 'Climate cases on record',
          data: [1745, 139, 82, 60],
          backgroundColor: function (ctx) {
            return ctx.dataIndex === 2 ? C.red : C.gray;
          },
          barThickness: 40,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + ' cases'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Cases on record, mid-2024' }), {
            beginAtZero: true, suggestedMax: 1900,
            ticks: { callback: function (v) { return v.toLocaleString(); } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v.toLocaleString(); },
      })],
    });
  });
})();
