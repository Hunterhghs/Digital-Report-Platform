/* ===========================================================================
   Charts — "Climate-Resilient Industrialization Pathways"

   Every figure replots published values. Colour carries the archetype scheme:
   steel blue for reliability, safety orange for price and cost, olive for
   physical exposure, graphite for reference values.
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

    /* --- 1. Firms experiencing outages, by region ------------------------- */

    HH.chart('chart-outages', {
      type: 'bar',
      data: {
        labels: [
          'Sub-Saharan Africa',
          'Latin America & Caribbean',
          'South Asia',
          'World',
          'East Asia & Pacific',
          'Middle East & North Africa',
          'Europe & Central Asia',
        ],
        datasets: [{
          label: 'Per cent of firms experiencing electrical outages',
          data: [72.4, 60.0, 48.5, 47.5, 42.7, 29.7, 25.5],
          backgroundColor: function (ctx) {
            return ctx.dataIndex === 3 ? C.gray : C.blue;
          },
          barThickness: 18,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x.toFixed(1) + '% of firms'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of surveyed firms' }), {
            beginAtZero: true, max: 85,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v.toFixed(1) + '%'; } })],
    });

    /* --- 2. Heat and factory output --------------------------------------- */

    HH.chart('chart-heat', {
      type: 'bar',
      data: {
        labels: ['Annual plant output, per °C', 'Worker productivity on hot days, per °C'],
        datasets: [{
          label: 'Per cent lost per degree Celsius',
          // The hot-day effect is published as a range and is plotted as one.
          data: [[0, 2], [4, 9]],
          backgroundColor: [C.orange, C.red],
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
                var r = c.raw;
                return r[0] === 0 ? 'about ' + r[1] + '% per °C' : r[0] + '–' + r[1] + '% per °C';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent lost per degree Celsius' }), {
            beginAtZero: true, max: 11,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v[0] === 0 ? '~' + v[1] + '%' : v[0] + '–' + v[1] + '%'; },
      })],
    });

    /* --- 3. ILO working hours lost in 2030 -------------------------------- */

    HH.chart('chart-ilo', {
      type: 'bar',
      data: {
        labels: ['Southern Asia', 'Western Africa', 'World'],
        datasets: [{
          label: 'Per cent of working hours lost in 2030',
          data: [5, 5, 2.2],
          backgroundColor: [C.red, C.red, C.gray],
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
                return c.dataIndex === 2
                  ? '2.2% — equivalent to 80 million full-time jobs'
                  : 'about ' + c.parsed.x + '% of working hours';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of total working hours lost, 2030 projection' }), {
            beginAtZero: true, max: 7,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v, i) { return (i === 2 ? '' : '~') + v + '%'; } })],
    });

    /* --- 4. Thailand 2011 -------------------------------------------------- */

    HH.chart('chart-thailand', {
      type: 'bar',
      data: {
        labels: ['Total economic damage', 'Of which manufacturing'],
        datasets: [{
          label: 'US$ billions',
          data: [45.7, 32],
          backgroundColor: [C.red, C.orange],
          barThickness: 40,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'US$' + c.parsed.x + 'bn'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions of economic damage' }), {
            beginAtZero: true, max: 55,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '$' + v + 'bn'; } })],
    });
  });
})();
