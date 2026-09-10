/* ===========================================================================
   Charts — "Climate Adaptation as Infrastructure for Global Polycrisis
   Risk Reduction"

   Figures 1 and 2 are transparent arithmetic on stated chain reliabilities
   and say so in their captions; the rest plot reported values. Colours come
   from the theme tokens — drawing blue for structure, safety orange for the
   binding constraint.
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

    var pct = function (v) { return v + '%'; };

    /* --- 1. Reliability is a product, not an average --------------------- */

    var LINKS = 8;
    var chainLabels = [];
    for (var i = 1; i <= LINKS; i++) chainLabels.push(String(i));

    function curve(p) {
      var out = [];
      for (var n = 1; n <= LINKS; n++) out.push(Math.pow(p, n) * 100);
      return out;
    }

    HH.chart('chart-reliability', {
      type: 'line',
      data: {
        labels: chainLabels,
        datasets: [
          { label: 'Each link 99% reliable', data: curve(0.99), borderColor: C.teal, backgroundColor: C.teal },
          { label: 'Each link 95% reliable', data: curve(0.95), borderColor: C.blue, backgroundColor: C.blue },
          { label: 'Each link 90% reliable', data: curve(0.90), borderColor: C.gold, backgroundColor: C.gold },
          { label: 'Each link 80% reliable', data: curve(0.80), borderColor: C.red, backgroundColor: C.red },
        ].map(function (d) {
          d.pointRadius = 0;
          d.pointHoverRadius = 4;
          d.fill = false;
          return d;
        }),
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataset.label + ' → service works ' + c.parsed.y.toFixed(0) + '% of the time';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Number of links the service depends on' }), {
            grid: { display: false },
          }),
          y: Object.assign(axis({ title: 'Probability the whole service works (%)' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
        },
      },
    });

    /* --- 2. Where the marginal dollar goes -------------------------------- */

    // A five-link chain with one weak link. Strengthening the weak link and
    // strengthening the strongest link cost roughly the same and do very
    // different things; the arithmetic is set out in the caption.
    HH.chart('chart-marginal', {
      type: 'bar',
      data: {
        labels: [
          'As built\n(links at 99, 95, 70, 98, 96%)',
          'Strengthen the binding link\n(70% → 95%)',
          'Strengthen the strongest link\n(99% → 99.9%)',
        ],
        datasets: [{
          label: 'Probability the whole service works',
          data: [61.9, 84.1, 62.5],
          backgroundColor: [C.gray, C.red, C.blueLight],
          barThickness: 46,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return 'Service available ' + c.parsed.x + '% of the time'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Probability the whole service works (%)' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '%'; } })],
    });

    /* --- 3. What a shared node costs when it fails ------------------------ */

    HH.chart('chart-outages', {
      type: 'bar',
      data: {
        labels: [
          'All surveyed firms',
          'Sub-Saharan Africa and South Asia',
          'Worst-affected firms, Sub-Saharan Africa',
        ],
        datasets: [{
          label: 'Annual sales lost to power outages',
          data: [8, 10, 31],
          backgroundColor: [C.gray, C.gold, C.red],
          barThickness: 40,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + '% of annual sales'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of annual sales' }), {
            beginAtZero: true, suggestedMax: 35,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: pct })],
    });

    /* --- 4. A chain that is missing most of its length -------------------- */

    HH.chart('chart-refrigeration', {
      type: 'bar',
      data: {
        labels: ['Share of world harvested cropland', 'Share of perishable output refrigerated'],
        datasets: [
          {
            label: 'Developing economies',
            data: [80, 20],
            backgroundColor: C.red,
            barPercentage: 0.8,
          },
          {
            label: 'Developed economies',
            data: [null, 60],
            backgroundColor: C.blue,
            barPercentage: 0.8,
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                if (c.parsed.y === null) return null;
                return c.dataset.label + ': ' + c.parsed.y + '%';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
          y: Object.assign(axis({ title: 'Per cent' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
        },
      },
      plugins: [labels({ format: pct })],
    });

    /* --- 5. What the broken chain costs ----------------------------------- */

    HH.chart('chart-foodloss', {
      type: 'bar',
      data: {
        labels: [
          'Food lost each year for want of refrigeration',
          'Recoverable by closing the refrigeration gap',
        ],
        datasets: [{
          label: 'Million tonnes a year',
          data: [526, 144],
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
              label: function (c) { return c.parsed.x + ' million tonnes a year'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Million tonnes a year' }), {
            beginAtZero: true, suggestedMax: 600,
            ticks: { callback: function (v) { return v + 'Mt'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + ' Mt'; } })],
    });
  });
})();
