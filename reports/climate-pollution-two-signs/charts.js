/* ===========================================================================
   Charts — "One Source, Two Signs"

   Every figure plots reported values, with ranges drawn as floating bars.
   The palette is the theme's duotone: warm for the warming register, cool
   for the cooling and clean-air registers.
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

    /* --- 1. The half-degree that aerosols are hiding --------------------- */

    HH.chart('chart-masking', {
      type: 'bar',
      data: {
        labels: ['Warming caused by human activity to date'],
        datasets: [
          {
            label: 'Observed warming today',
            data: [1.4],
            backgroundColor: C.red,
            barThickness: 62,
            stack: 'w',
          },
          {
            label: 'Additional warming masked by aerosol cooling',
            data: [0.5],
            backgroundColor: C.blue,
            barThickness: 62,
            stack: 'w',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.x + '°C'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Degrees Celsius above pre-industrial' }), {
            stacked: true, beginAtZero: true, suggestedMax: 2.2,
            ticks: { callback: function (v) { return v + '°C'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { display: false } }),
        },
      },
    });

    /* --- 2. A stock with four years left --------------------------------- */

    HH.chart('chart-budget', {
      type: 'bar',
      data: {
        labels: [
          'Remaining carbon budget for 1.5°C',
          'Global CO₂ emissions, one year',
        ],
        datasets: [{
          label: 'Gigatonnes of CO₂',
          data: [170, 42],
          backgroundColor: [C.blue, C.red],
          barThickness: 50,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + ' GtCO₂'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Gigatonnes of CO₂' }), {
            beginAtZero: true, suggestedMax: 200,
            ticks: { callback: function (v) { return v + ' Gt'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + ' Gt'; } })],
    });

    /* --- 3. The natural experiment: IMO 2020 ----------------------------- */

    HH.chart('chart-imo', {
      type: 'bar',
      data: {
        labels: [
          'Warming effect of the 2020 shipping sulphur cap',
          'Increase in CO₂ forcing, 2019 to 2022',
        ],
        datasets: [{
          label: 'Effective radiative forcing, W/m²',
          data: [[0.057, 0.089], 0.1],
          backgroundColor: [C.red, C.gray],
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
                var raw = c.raw;
                return Array.isArray(raw)
                  ? raw[0] + ' to ' + raw[1] + ' W/m² across models'
                  : 'about ' + raw + ' W/m²';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Effective radiative forcing (W/m²)' }), {
            beginAtZero: true, suggestedMax: 0.13,
            ticks: { callback: function (v) { return v.toFixed(2); } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          return Array.isArray(v) ? v[0] + '–' + v[1] : '~' + v;
        },
      })],
    });

    /* --- 4. Clean air, achieved fast ------------------------------------- */

    HH.chart('chart-china', {
      type: 'bar',
      data: {
        labels: ['China, nationally\n2013–2022', 'Beijing province\nover nine years'],
        datasets: [{
          label: 'Fall in particulate pollution',
          data: [41, 54.1],
          backgroundColor: [C.teal, C.blue],
          barThickness: 58,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.y + '% fall in particulate pollution'; } },
          },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Per cent fall in particulate pollution' }), {
            beginAtZero: true, suggestedMax: 62,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
        },
      },
      plugins: [labels({ format: function (v) { return '−' + v + '%'; } })],
    });
  });
})();
