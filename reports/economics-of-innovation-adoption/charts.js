/* ===========================================================================
   Charts — "The Economics of Innovation Adoption"

   Consumer-friendly figures: every chart shows one idea with the number
   printed on it. Colours come from the theme tokens — curve teal for
   progress, coral for the shocks, blue for the speed of adoption.
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

    /* --- 2. Each wave adopts faster than the last ------------------------- */

    HH.chart('chart-speed', {
      type: 'bar',
      data: {
        labels: ['Telephone', 'Radio', 'Television', 'Mobile phones', 'Internet'],
        datasets: [{
          label: 'Years to reach 50 million users',
          data: [75, 38, 13, 12, 4],
          backgroundColor: function (ctx) {
            return ctx.dataIndex === 4 ? C.teal : C.blue;
          },
          barThickness: 30,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return 'about ' + c.parsed.x + ' years'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Years' }), {
            beginAtZero: true, suggestedMax: 85,
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v + ' yrs'; },
      })],
    });

    /* --- 3. The baseline is moving ---------------------------------------- */

    HH.chart('chart-disasters', {
      type: 'bar',
      data: {
        labels: ['1980–2024 average', '2020–2024 average', '2024'],
        datasets: [{
          label: 'US billion-dollar disasters',
          data: [9, 23, 27],
          backgroundColor: function (ctx) {
            return ctx.dataIndex === 2 ? C.red : C.gold;
          },
          barThickness: 42,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + ' events per year'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Events per year' }), {
            beginAtZero: true, suggestedMax: 32,
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return String(v); } })],
    });

    /* --- 4. Adoption made solar cheap ------------------------------------- */

    HH.chart('chart-solar', {
      type: 'bar',
      data: {
        labels: ['2010', '2023'],
        datasets: [{
          label: 'Cost of utility-scale solar electricity',
          data: [0.46, 0.044],
          backgroundColor: [C.gray, C.teal],
          barThickness: 56,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return '$' + c.parsed.x + ' per kWh'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US dollars per kilowatt-hour' }), {
            beginAtZero: true, suggestedMax: 0.52,
            ticks: { callback: function (v) { return '$' + v; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return '$' + v; },
      })],
    });

    /* --- 5. The deal changed sides ---------------------------------------- */

    HH.chart('chart-solar-fossil', {
      type: 'bar',
      data: {
        labels: ['2010', '2023'],
        datasets: [{
          label: 'Solar cost relative to the fossil alternative',
          data: [414, -56],
          backgroundColor: function (ctx) {
            return ctx.raw >= 0 ? C.red : C.teal;
          },
          barThickness: 56,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var v = c.raw;
                return v >= 0
                  ? 'solar cost ' + v + '% more than fossil power'
                  : 'solar cost ' + Math.abs(v) + '% less than fossil power';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent, relative to fossil alternative' }), {
            beginAtZero: true, suggestedMax: 480,
            ticks: { callback: function (v) { return (v >= 0 ? '+' : '') + v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return (v >= 0 ? '+' : '') + v + '%'; },
      })],
    });
  });
})();
