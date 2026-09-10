/* ===========================================================================
   Charts — "Breaking the Pollution–Poverty–Climate Nexus in Emerging Economies"

   Colours come from the theme tokens, lightened for the dark ground. Figure 1
   renders the report's own analytical ordering and says so in its caption;
   every other figure plots reported values, with ranges drawn as floating
   bars rather than collapsed to midpoints.
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

    var bn = function (v) { return v >= 1000 ? (v / 1000).toFixed(1) + 'bn' : v + 'm'; };

    /* --- 1. Three clocks (the report's framework) ------------------------- */

    // A log axis is the right one here: the argument is precisely that the
    // three legs pay out on different orders of magnitude of time.
    HH.chart('chart-clocks', {
      type: 'bar',
      data: {
        labels: [
          'Clean cooking & electrified heat',
          'Clean urban transport',
          'Industrial emission controls',
          'Household electrification',
          'Grid decarbonisation',
        ],
        datasets: [
          {
            label: 'Health benefit',
            data: [0.5, 1, 1, 2, 5],
            backgroundColor: C.red,
            barPercentage: 0.82,
          },
          {
            label: 'Poverty benefit',
            data: [1, 5, 8, 2, 10],
            backgroundColor: C.gold,
            barPercentage: 0.82,
          },
          {
            label: 'Climate benefit',
            data: [20, 20, 25, 15, 25],
            backgroundColor: C.blue,
            barPercentage: 0.82,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                var v = c.parsed.x;
                return c.dataset.label + ': about ' +
                  (v < 1 ? Math.round(v * 12) + ' months' : v + ' years');
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Years to first measurable benefit (logarithmic)' }), {
            type: 'logarithmic',
            min: 0.4,
            max: 40,
            ticks: {
              color: C.muted,
              padding: 8,
              callback: function (v) {
                return [0.5, 1, 2, 5, 10, 20, 30].indexOf(v) > -1
                  ? (v < 1 ? '6 mo' : v + 'y')
                  : '';
              },
            },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
    });

    /* --- 2. The access deficit behind the pollution ----------------------- */

    HH.chart('chart-access', {
      type: 'bar',
      data: {
        labels: ['Without clean cooking', 'Without electricity'],
        datasets: [
          {
            label: 'Sub-Saharan Africa',
            data: [1050, 557],
            backgroundColor: C.red,
            barThickness: 48,
            stack: 'a',
          },
          {
            label: 'Rest of the world',
            data: [1050, 98],
            backgroundColor: C.gray,
            barThickness: 48,
            stack: 'a',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataset.label + ': about ' + bn(c.parsed.x) + ' people';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of people' }), {
            stacked: true, beginAtZero: true, suggestedMax: 2300,
            ticks: { callback: function (v) { return v >= 1000 ? (v / 1000) + 'bn' : v + 'm'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true }),
        },
      },
    });

    /* --- 3. Pollution's bill lands on the household ---------------------- */

    HH.chart('chart-hardship', {
      type: 'bar',
      data: {
        labels: ['Financial hardship from out-of-pocket health spending, 2022'],
        datasets: [
          {
            label: 'Pushed into poverty, or driven deeper into it',
            data: [1600],
            backgroundColor: C.red,
            barThickness: 58,
            stack: 'h',
          },
          {
            label: 'Other financial hardship',
            data: [500],
            backgroundColor: C.orange,
            barThickness: 58,
            stack: 'h',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataset.label + ': ' + (c.parsed.x / 1000).toFixed(1) + ' billion people';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of people' }), {
            stacked: true, beginAtZero: true, suggestedMax: 2300,
            ticks: { callback: function (v) { return v >= 1000 ? (v / 1000) + 'bn' : v + 'm'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { font: { size: 10 } } }),
        },
      },
    });

    /* --- 4. Who pays for health in the poorest countries ------------------ */

    HH.chart('chart-oop', {
      type: 'doughnut',
      data: {
        labels: [
          'Out-of-pocket, paid by households',
          'External aid and development assistance',
          'Domestic government resources',
          'Other sources',
        ],
        datasets: [{
          data: [40, 31, 22, 7],
          backgroundColor: [C.red, C.blue, C.teal, C.gray],
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 2,
        }],
      },
      options: {
        cutout: '58%',
        plugins: {
          legend: { position: 'right', align: 'center' },
          tooltip: {
            callbacks: {
              label: function (c) { return c.label + ': ' + c.parsed + '% of health spending'; },
            },
          },
        },
      },
    });

    /* --- 5. The subsidy is mostly the harm itself ------------------------- */

    HH.chart('chart-subsidy', {
      type: 'bar',
      data: {
        labels: ['Global fossil-fuel subsidy, 2024'],
        datasets: [
          {
            label: 'Explicit — budgetary support that undercharges for supply cost',
            data: [0.725],
            backgroundColor: C.gray,
            barThickness: 58,
            stack: 's',
          },
          {
            label: 'Implicit — unpriced air pollution and climate damage',
            data: [6.7],
            backgroundColor: C.red,
            barThickness: 58,
            stack: 's',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start' },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.dataset.label.split(' —')[0] + ': US$' +
                  (c.parsed.x < 1 ? Math.round(c.parsed.x * 1000) + ' billion' : c.parsed.x + ' trillion');
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ trillion' }), {
            stacked: true, beginAtZero: true, suggestedMax: 8,
            ticks: { callback: function (v) { return '$' + v + 'tn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { display: false } }),
        },
      },
    });

    /* --- 6. The clean option is already the cheap one -------------------- */

    HH.chart('chart-lcoe', {
      type: 'bar',
      data: {
        labels: ['Onshore wind', 'Utility solar', 'New gas', 'New coal'],
        datasets: [{
          label: 'Unsubsidised levelised cost of energy',
          data: [[27, 73], [29, 92], [45, 108], [69, 168]],
          backgroundColor: [C.teal, C.gold, C.gray, C.red],
          barThickness: 32,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return 'US$' + c.raw[0] + '–' + c.raw[1] + ' per MWh'; },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ per megawatt-hour, unsubsidised' }), {
            beginAtZero: true, suggestedMax: 190,
            ticks: { callback: function (v) { return '$' + v; } },
          }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) { return '$' + v[0] + '–' + v[1]; },
      })],
    });
  });
})();
