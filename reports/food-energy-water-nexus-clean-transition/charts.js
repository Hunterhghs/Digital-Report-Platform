/* ===========================================================================
   Charts — "Food, Energy, Water: Disruption and Substitution"

   Figure 1 plots FAO's published monthly series in full; the rest replot
   point values from the sources named in each caption. Water blue carries
   the clean substitution, clay the disruption, wheat the installed
   dependency.
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

    /* --- 1. FAO Food Price Index, monthly --------------------------------- */

    var FPI_LABELS = ['2019-01','2019-02','2019-03','2019-04','2019-05','2019-06','2019-07','2019-08','2019-09','2019-10','2019-11','2019-12','2020-01','2020-02','2020-03','2020-04','2020-05','2020-06','2020-07','2020-08','2020-09','2020-10','2020-11','2020-12','2021-01','2021-02','2021-03','2021-04','2021-05','2021-06','2021-07','2021-08','2021-09','2021-10','2021-11','2021-12','2022-01','2022-02','2022-03','2022-04','2022-05','2022-06','2022-07','2022-08','2022-09','2022-10','2022-11','2022-12','2023-01','2023-02','2023-03','2023-04','2023-05','2023-06','2023-07','2023-08','2023-09','2023-10','2023-11','2023-12','2024-01','2024-02','2024-03','2024-04','2024-05','2024-06','2024-07','2024-08','2024-09','2024-10','2024-11','2024-12','2025-01','2025-02','2025-03','2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08'];
    var FPI_INDEX = [93.1,93.8,93.0,93.5,94.2,95.4,95.1,93.8,93.2,95.0,98.2,100.8,102.5,99.6,95.2,92.4,91.2,93.1,93.8,95.7,97.9,101.3,105.5,108.5,113.5,116.5,119.1,122.1,128.4,125.4,124.4,128.0,129.1,133.3,135.4,133.7,135.7,141.7,160.2,158.8,158.7,155.7,141.6,138.7,137.3,136.7,136.0,133.1,131.4,130.7,128.0,128.4,124.5,123.0,124.4,121.8,121.7,120.7,120.6,119.1,117.6,117.4,118.9,119.2,120.5,121.0,120.9,121.7,124.6,126.9,127.7,127.3,124.6,126.6,127.2,128.2,127.1,128.1,129.8,130.0,128.6,126.4,125.2,124.5,124.1,125.5,128.7,131.0,131.0,130.1,130.8,133.3];
    var FPI_CEREALS = [101.8,100.7,97.5,94.6,94.4,99.2,97.6,92.6,91.8,96.0,95.6,97.4,100.7,99.6,98.0,99.6,98.0,97.3,97.3,99.2,104.3,112.1,114.8,116.4,125.0,126.1,123.9,126.2,133.7,130.3,126.3,130.4,132.8,137.1,141.4,140.5,140.6,145.3,170.1,169.7,173.5,166.3,147.3,145.6,147.9,152.3,150.1,147.3,147.5,146.7,138.6,136.1,129.3,126.6,125.9,125.0,126.3,124.8,121.0,122.8,119.9,113.8,110.9,111.6,118.7,115.2,110.7,110.2,113.6,114.4,111.4,111.4,111.8,112.6,109.7,110.9,109.0,107.3,106.5,105.6,104.8,103.8,105.6,107.2,107.5,108.7,110.4,111.3,114.2,110.0,113.8,116.3];

    HH.chart('chart-fpi', {
      type: 'line',
      data: {
        labels: FPI_LABELS,
        datasets: [
          {
            label: 'Food Price Index',
            data: FPI_INDEX,
            borderColor: C.blue,
            backgroundColor: 'rgba(15, 76, 92, 0.10)',
            borderWidth: 2,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: 'Cereals',
            data: FPI_CEREALS,
            borderColor: C.orange,
            borderWidth: 1.6,
            borderDash: [4, 3],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 14, font: { size: 10.5 } } },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1); } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Month' }), {
            ticks: {
              maxRotation: 0, autoSkip: false,
              // One label per January keeps the axis readable at 92 points.
              callback: function (v, i) {
                var m = FPI_LABELS[i];
                return m && m.slice(5) === '01' ? m.slice(0, 4) : '';
              },
            },
          }),
          y: Object.assign(axis({ title: 'Index, 2014\u20132016 = 100' }), { suggestedMin: 85, suggestedMax: 175 }),
        },
      },
    });

    /* --- 2. Why the ammonia plants stopped -------------------------------- */

    HH.chart('chart-ammonia', {
      type: 'bar',
      data: {
        labels: ['Gas as a share of EU ammonia variable cost', 'EU ammonia capacity shut or curtailed at the peak'],
        datasets: [{
          label: 'Per cent, summer 2022',
          data: [90, 70],
          backgroundColor: [C.red, C.orange],
          barThickness: 38,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'about ' + c.parsed.x + '%'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent' }), {
            beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '~' + v + '%'; } })],
    });

    /* --- 3. Ecuador's rationing ------------------------------------------- */

    HH.chart('chart-ecuador', {
      type: 'bar',
      data: {
        labels: ['Early in the drought', 'From September 2024', 'From 23 October 2024'],
        datasets: [{
          label: 'Scheduled outage, hours per day',
          data: [2, 8, 14],
          backgroundColor: [C.blueLight, C.orange, C.red],
          barThickness: 32,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + ' hours a day'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Hours of scheduled power cuts per day' }), {
            beginAtZero: true, max: 18, ticks: { stepSize: 2 },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + ' hrs'; } })],
    });

    /* --- 4. Panama Canal transits ----------------------------------------- */

    HH.chart('chart-panama', {
      type: 'bar',
      data: {
        labels: ['Normal operation', 'Mid-2023', 'November 2023', 'February 2024'],
        datasets: [{
          label: 'Vessel transits per day',
          data: [38, 36, 24, 18],
          backgroundColor: [C.gray, C.blue, C.orange, C.red],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + ' transits a day'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Vessel transits per day' }), { beginAtZero: true, max: 45 }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v; } })],
    });

    /* --- 6. Green ammonia price discovery --------------------------------- */

    HH.chart('chart-ammonia-price', {
      type: 'bar',
      data: {
        labels: ['Indian tender, discovered range', 'Global benchmark cited alongside it'],
        datasets: [{
          label: 'Rupees per kilogram',
          data: [[49.75, 64.74], [0, 110]],
          backgroundColor: [C.blue, C.gray],
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
                return r[0] === 0 ? 'about \u20b9' + r[1] + '/kg' : '\u20b9' + r[0] + '\u2013' + r[1] + '/kg';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Rupees per kilogram of green ammonia' }), {
            beginAtZero: true, max: 130,
            ticks: { callback: function (v) { return '\u20b9' + v; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v) {
          return v[0] === 0 ? '~\u20b9' + v[1] : '\u20b9' + v[0] + '\u2013' + v[1];
        },
      })],
    });

    /* --- 7. Desalination energy intensity --------------------------------- */

    HH.chart('chart-desal', {
      type: 'bar',
      data: {
        labels: ['1970', 'By 2018', 'Modern plant today'],
        datasets: [{
          label: 'kWh per cubic metre',
          data: [[20, 30], [2.8, 3.2], [2.5, 3.5]],
          backgroundColor: [C.red, C.blue, C.teal],
          barThickness: 34,
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
                return c.dataIndex === 1 ? 'about 3 kWh/m\u00b3' : r[0] + '\u2013' + r[1] + ' kWh/m\u00b3';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Kilowatt-hours per cubic metre of product water' }), {
            beginAtZero: true, max: 34,
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return i === 1 ? '~3' : v[0] + '\u2013' + v[1]; },
      })],
    });
  });
})();
