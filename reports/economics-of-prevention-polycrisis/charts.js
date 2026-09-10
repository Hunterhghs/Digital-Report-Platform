/* ===========================================================================
   Charts — "The Economics of Prevention in an Age of Polycrisis"

   Colours come from the theme tokens: a restricted Swiss palette of red for
   the response model, blue for prevention, black and grey for context.
   Figure 1 is transparent arithmetic on stated assumptions and says so; every
   other figure plots reported values, with ranges as floating bars.
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

    /* --- 1. The crossover (the signature figure) ------------------------- */

    // Costs are expressed in units of one event's response bill, so the
    // figure carries no spurious currency precision. Assumptions, stated in
    // the caption: prevention costs 3 units once and 0.2 per event to keep;
    // response costs 1 unit every time and leaves no asset behind.
    var EVENTS = 8;
    var evLabels = [];
    var responseLine = [];
    var preventionLine = [];
    for (var n = 0; n <= EVENTS; n++) {
      evLabels.push(String(n));
      responseLine.push(n * 1.0);
      preventionLine.push(3.0 + n * 0.2);
    }

    HH.chart('chart-crossover', {
      type: 'line',
      data: {
        labels: evLabels,
        datasets: [
          {
            label: 'Respond each time (1.0 per event, no asset)',
            data: responseLine,
            borderColor: C.red,
            backgroundColor: C.red,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false,
          },
          {
            label: 'Prevent once (3.0 up front, 0.2 per event to maintain)',
            data: preventionLine,
            borderColor: C.blue,
            backgroundColor: C.blue,
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataset.label.split(' (')[0] + ': ' + c.parsed.y.toFixed(1) + ' units';
              },
              footer: function (items) {
                if (items.length < 2) return '';
                var d = items[0].parsed.y - items[1].parsed.y;
                if (Math.abs(d) < 0.05) return 'The two models cost the same here';
                return d > 0
                  ? 'Responding costs ' + d.toFixed(1) + ' units more'
                  : 'Preventing costs ' + Math.abs(d).toFixed(1) + ' units more';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Number of events' }), { grid: { display: false } }),
          y: Object.assign(axis({ title: 'Cumulative cost, in units of one response' }), {
            beginAtZero: true,
            suggestedMax: 8.5,
          }),
        },
      },
    });

    /* --- 2. What resilience costs against what it avoids ----------------- */

    HH.chart('chart-lifelines', {
      type: 'bar',
      data: {
        labels: ['Added upfront cost of building in resilience', 'Losses avoided over the asset’s life'],
        datasets: [{
          label: 'Share of asset value',
          data: [[3, 5], [50, 100]],
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
              label: function (c) { return c.raw[0] + '–' + c.raw[1] + '% of asset value'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of asset value' }), {
            beginAtZero: true, max: 110,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v[0] + '–' + v[1] + '%'; },
      })],
    });

    /* --- 3. One country, one event -------------------------------------- */

    HH.chart('chart-pakistan', {
      type: 'bar',
      data: {
        labels: [
          'Pakistan 2022 floods:\ndamage and economic losses',
          'Pakistan 2022 floods:\nreconstruction needs',
          'Loss and Damage Fund:\ntotal pledges, first year',
        ],
        datasets: [{
          label: 'US$ billion',
          data: [30, 16, 0.788],
          backgroundColor: [C.red, C.orange, C.gray],
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
                var v = c.parsed.x;
                return v < 1 ? 'US$' + Math.round(v * 1000) + ' million' : 'US$' + v + ' billion';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billion' }), {
            beginAtZero: true, suggestedMax: 34,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return v < 1 ? '$' + Math.round(v * 1000) + 'm' : '$' + v + 'bn'; },
      })],
    });

    /* --- 4. What the money is already doing ------------------------------ */

    HH.chart('chart-fiscal', {
      type: 'bar',
      data: {
        labels: [
          'Net interest paid by developing countries, 2024',
          'Assessed adaptation need by 2035',
          'International public adaptation finance, 2023',
        ],
        datasets: [{
          label: 'US$ billion a year',
          data: [921, [310, 365], 26],
          backgroundColor: [C.red, C.gray, C.blue],
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
                var raw = c.raw;
                return Array.isArray(raw)
                  ? 'US$' + raw[0] + '–' + raw[1] + ' billion a year'
                  : 'US$' + raw + ' billion a year';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billion a year' }), {
            beginAtZero: true, suggestedMax: 1000,
            ticks: { callback: function (v) { return '$' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          return Array.isArray(v) ? '$' + v[0] + '–' + v[1] + 'bn' : '$' + v + 'bn';
        },
      })],
    });

    /* --- 5. The cheapest prevention, still unbuilt ------------------------ */

    HH.chart('chart-ew', {
      type: 'bar',
      data: {
        labels: ['Multi-hazard early-warning coverage'],
        datasets: [
          {
            label: 'Countries reporting a system',
            data: [119],
            backgroundColor: C.blue,
            barThickness: 56,
            stack: 'ew',
          },
          {
            label: 'Countries without one',
            data: [74],
            backgroundColor: C.red,
            barThickness: 56,
            stack: 'ew',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.x; } },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Countries' }), {
            stacked: true, beginAtZero: true, max: 193,
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { display: false } }),
        },
      },
    });
  });
})();
