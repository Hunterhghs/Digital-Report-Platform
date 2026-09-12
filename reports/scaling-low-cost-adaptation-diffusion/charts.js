/* ===========================================================================
   Charts — "Scaling Low-Cost Adaptation Technologies"

   Figures 1 and 2 render the report's own scoring framework and say so in
   their captions; Figures 3 and 4 plot reported values. Colours come from
   the theme tokens — violet for the framework, teal for observed outcomes.
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

    /* --- 1. The diffusion score ------------------------------------------ */

    HH.chart('chart-scores', {
      type: 'bar',
      data: {
        labels: [
          'Pay-as-you-go solar',
          'Mobile money (benchmark)',
          'Digital climate advisory',
          'Cool roofs and reflective paint',
          'Drought-tolerant seed varieties',
          'Improved cookstoves',
          'Weather index insurance',
          'Early-warning systems',
        ],
        datasets: [{
          label: 'Diffusion score, out of 15',
          data: [15, 14, 13, 13, 11, 7, 5, 4],
          backgroundColor: function (ctx) {
            var v = ctx.parsed ? ctx.parsed.x : 0;
            return v >= 13 ? C.blue : v >= 10 ? C.purple : v >= 7 ? C.gold : C.red;
          },
          barThickness: 20,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: function (c) { return c.parsed.x + ' of 15'; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Sum of five attribute scores (0–3 each)' }), {
            beginAtZero: true, max: 15, ticks: { stepSize: 3 },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '/15'; } })],
    });

    /* --- 2. Two attribute profiles --------------------------------------- */

    HH.chart('chart-radar', {
      type: 'radar',
      data: {
        labels: ['Divisibility', 'Trialability', 'Observability', 'Attributability', 'Compatibility'],
        datasets: [
          {
            label: 'Pay-as-you-go solar',
            data: [3, 3, 3, 3, 3],
            borderColor: C.blue,
            backgroundColor: 'rgba(91, 33, 166, 0.16)',
            pointBackgroundColor: C.blue,
            tension: 0,
            borderWidth: 2,
          },
          {
            label: 'Weather index insurance',
            data: [3, 1, 0, 0, 1],
            borderColor: C.red,
            backgroundColor: 'rgba(190, 18, 60, 0.14)',
            pointBackgroundColor: C.red,
            tension: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.r + ' of 3'; } },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 3,
            ticks: { stepSize: 1, backdropColor: 'transparent', color: C.muted, font: { size: 9 } },
            grid: { color: C.grid },
            angleLines: { color: C.grid },
            pointLabels: { color: C.ink, font: { size: 11 } },
          },
        },
      },
    });

    /* --- 3. Sustained effect, measured ----------------------------------- */

    HH.chart('chart-sustained', {
      type: 'bar',
      data: {
        labels: [
          'Digital climate advisory:\nsustained yield gain',
          'Improved cookstoves:\nsmoke reduction by year two',
        ],
        datasets: [{
          label: 'Measured sustained effect',
          data: [[10, 30], 0],
          backgroundColor: [C.teal, C.red],
          barThickness: 48,
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
                  ? 'gain of ' + raw[0] + ' to ' + raw[1] + ' per cent'
                  : 'no sustained effect measured';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent' }), {
            beginAtZero: true, suggestedMax: 36,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          return Array.isArray(v) ? '+' + v[0] + '–' + v[1] + '%' : 'no sustained effect';
        },
      })],
    });

    /* --- 4. The cheaper technology has the bigger deficit ---------------- */

    HH.chart('chart-deficit', {
      type: 'bar',
      data: {
        labels: ['Without clean cooking', 'Without any electricity'],
        datasets: [{
          label: 'Millions of people',
          data: [2100, 655],
          backgroundColor: [C.red, C.gray],
          barThickness: 50,
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
                  ? (v / 1000).toFixed(1) + ' billion people'
                  : v + ' million people';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of people' }), {
            beginAtZero: true, suggestedMax: 2400,
            ticks: { callback: function (v) { return v >= 1000 ? (v / 1000) + 'bn' : v + 'm'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v >= 1000 ? (v / 1000).toFixed(1) + 'bn' : v + 'm'; },
      })],
    });
  });
})();
