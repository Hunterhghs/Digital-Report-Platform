/* ===========================================================================
   Charts — "Convergence Without Absorption"

   Every figure replots published values. Ink carries the structural series,
   coral the gap the report is about, sage the comparison values.
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

    /* --- 1. Where developing economies stand ------------------------------ */

    // Two different units, so each bar is labelled with its own value and the
    // caption says they are not comparable with each other.
    HH.chart('chart-gap', {
      type: 'bar',
      data: {
        labels: [
          'Developing per capita income, % of advanced level',
          'Per capita growth, 2026 (%)',
          'Per capita growth, 2000–2019 average (%)',
        ],
        datasets: [{
          label: 'Per cent',
          data: [12, 3, 4],
          backgroundColor: [C.red, C.blue, C.gray],
          barThickness: 28,
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
                  ? 'about 4% — roughly a percentage point above 2026'
                  : c.parsed.x + '%';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent' }), {
            beginAtZero: true, max: 15,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return (i === 2 ? '~' : '') + v + '%'; },
      })],
    });

    /* --- 2. Rodrik: income at the manufacturing peak ---------------------- */

    HH.chart('chart-rodrik', {
      type: 'bar',
      data: {
        labels: [
          'Early industrialisers (UK, Germany, US)',
          'Brazil',
          'China',
          'India',
        ],
        datasets: [{
          label: 'Income per head at the manufacturing peak, constant 1990 US$',
          data: [[11000, 14000], [0, 5000], [0, 3000], [0, 2000]],
          backgroundColor: [C.gray, C.orange, C.red, C.red],
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
                var r = c.raw;
                return r[0] === 0
                  ? 'deindustrialisation began at about $' + r[1].toLocaleString()
                  : 'peak at $' + r[0].toLocaleString() + '–' + r[1].toLocaleString() + ', 30–37% of the workforce';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Income per head, constant 1990 US$' }), {
            beginAtZero: true, max: 16000,
            ticks: { callback: function (v) { return '$' + (v / 1000) + 'k'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          return v[0] === 0
            ? '$' + (v[1] / 1000) + 'k'
            : '$' + (v[0] / 1000) + '–' + (v[1] / 1000) + 'k';
        },
      })],
    });

    /* --- 3. Digitally deliverable services -------------------------------- */

    HH.chart('chart-services', {
      type: 'bar',
      data: {
        labels: ['Developed economies', 'Developing economies'],
        datasets: [{
          label: 'Digitally deliverable services exports, US$ trillions',
          data: [4.1, 1.3],
          backgroundColor: [C.gray, C.blue],
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
                  ? 'about US$4.1tn, growing 9% a year'
                  : 'about US$1.3tn, growing 12% a year';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ trillions of exports' }), {
            beginAtZero: true, max: 5,
            ticks: { callback: function (v) { return '$' + v + 'tn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return '$' + v + 'tn (' + (i === 0 ? '+9%' : '+12%') + ')'; },
      })],
    });

    /* --- 4. Entrants against formal jobs ---------------------------------- */

    HH.chart('chart-jobs', {
      type: 'bar',
      data: {
        labels: ['Young people entering the labour market', 'Formal jobs created'],
        datasets: [{
          label: 'Millions a year',
          data: [[10, 12], [0, 3]],
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
                var r = c.raw;
                return r[0] === 0 ? 'about 3 million a year' : r[0] + '–' + r[1] + ' million a year';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of people a year, Africa' }), {
            beginAtZero: true, max: 14,
            ticks: { callback: function (v) { return v + 'm'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v[0] === 0 ? '~' + v[1] + 'm' : v[0] + '–' + v[1] + 'm'; },
      })],
    });

    /* --- 5. Informality ---------------------------------------------------- */

    HH.chart('chart-informal', {
      type: 'bar',
      data: {
        labels: ['Africa, 2024', 'World, 2024'],
        datasets: [{
          label: 'Informal share of total employment, %',
          data: [85.3, 57.8],
          backgroundColor: [C.red, C.blue],
          barThickness: 42,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% of employment is informal'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of total employment' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '%'; } })],
    });
  });
})();
