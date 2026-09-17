/* ===========================================================================
   Charts — "Convergence Through Crisis"

   Every figure replots published values; Figure 1's 2023 bar is inferred from
   the published statement that 2024 was double, and is labelled as such.
   Plum carries the clean replacement, brick the incumbent that won a window,
   graphite the reference values.
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

    /* --- 1. Pakistan's solar imports -------------------------------------- */

    HH.chart('chart-pakistan', {
      type: 'bar',
      data: {
        labels: ['2023 (inferred)', '2024 (reported)'],
        datasets: [{
          label: 'Gigawatts of solar panels imported',
          data: [8.5, 17],
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
                  ? 'about 8.5 GW — inferred from "double the year before"'
                  : '17 GW imported';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Gigawatts imported' }), {
            beginAtZero: true, max: 20,
            ticks: { callback: function (v) { return v + ' GW'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return (i === 0 ? '~' : '') + v + ' GW'; },
      })],
    });

    /* --- 2. South African rooftop solar ----------------------------------- */

    HH.chart('chart-southafrica', {
      type: 'bar',
      data: {
        labels: ['Mar 2022', 'Jun 2023', 'Mid-2024', 'Latest estimate'],
        datasets: [{
          label: 'Rooftop solar, MW',
          data: [983, 4412, 5791, 7345],
          backgroundColor: [C.gray, C.blueLight, C.blue, C.purple],
          barThickness: 30,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x.toLocaleString() + ' MW'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Estimated installed capacity, MW' }), {
            beginAtZero: true, max: 8500,
            ticks: { callback: function (v) { return (v / 1000) + ' GW'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v.toLocaleString() + ' MW'; } })],
    });

    /* --- 3. Lebanon's solar capacity -------------------------------------- */

    HH.chart('chart-lebanon', {
      type: 'bar',
      data: {
        labels: ['2020', 'End 2022', '2023'],
        datasets: [{
          label: 'Cumulative solar capacity, MW',
          data: [100, 870, 1300],
          backgroundColor: [C.gray, C.blueLight, C.blue],
          barThickness: 34,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'about ' + c.parsed.x.toLocaleString() + ' MW'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Cumulative installed capacity, MW' }), {
            beginAtZero: true, max: 1500,
            ticks: { callback: function (v) { return v.toLocaleString(); } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '~' + v.toLocaleString() + ' MW'; } })],
    });

    /* --- 4. Vietnam's rooftop solar --------------------------------------- */

    HH.chart('chart-vietnam', {
      type: 'bar',
      data: {
        labels: ['Installed in 2019', 'Installed in 2020', 'Of which: December 2020'],
        datasets: [{
          label: 'MWp installed',
          data: [378, 9731, 6000],
          backgroundColor: [C.gray, C.blue, C.gold],
          barThickness: 32,
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
                  ? 'about 6,000 MWp commissioned in the final month'
                  : c.parsed.x.toLocaleString() + ' MWp';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Megawatts-peak installed' }), {
            beginAtZero: true, max: 11000,
            ticks: { callback: function (v) { return (v / 1000) + ' GWp'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return (i === 2 ? '~' : '') + v.toLocaleString() + ' MWp'; },
      })],
    });

    /* --- 5. Eskom's diesel bill ------------------------------------------- */

    HH.chart('chart-eskom', {
      type: 'bar',
      data: {
        labels: ['FY2022', 'FY2023', 'FY2024'],
        datasets: [{
          label: 'Diesel for open-cycle gas turbines, R billions',
          data: [10.1, 21.5, 23.4],
          backgroundColor: [C.gray, C.red, C.red],
          barThickness: 34,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'R' + c.parsed.x + 'bn on diesel'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Rand billions spent on diesel' }), {
            beginAtZero: true, max: 28,
            ticks: { callback: function (v) { return 'R' + v + 'bn'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return 'R' + v + 'bn'; } })],
    });
  });
})();
