/* ===========================================================================
   Charts — "The Last Third"

   Every figure replots published values; Figure 5's 2015 bar is derived from
   the UN's statement that 2026 is three points below it, and says so. The
   three-state palette carries the report's argument: green for what moved,
   ochre for what stalled, brick for what reversed.
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

    function pct(v) { return v + '%'; }

    /* --- 1. Target status, 2025 and 2026 ---------------------------------- */

    HH.chart('chart-status', {
      type: 'bar',
      data: {
        labels: ['2025 assessment', '2026 assessment'],
        datasets: [
          { label: 'On track or moderate', data: [35, 36], backgroundColor: C.teal, barThickness: 34 },
          { label: 'Too slow', data: [47, 49], backgroundColor: C.gold, barThickness: 34 },
          { label: 'Regressed below 2015', data: [18, 15], backgroundColor: C.red, barThickness: 34 },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 10.5 } } },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.x + '%'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of assessable targets' }), {
            stacked: true, beginAtZero: true, max: 100,
            ticks: { callback: pct },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { font: { size: 11 } } }),
        },
      },
      // Print each segment's share inside its bar, where it fits.
      plugins: [{
        id: 'segmentLabels',
        afterDatasetsDraw: function (chart) {
          var ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 11px ' + getComputedStyle(document.documentElement).getPropertyValue('--mono');
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          chart.data.datasets.forEach(function (ds, di) {
            chart.getDatasetMeta(di).data.forEach(function (bar, i) {
              var w = Math.abs(bar.x - bar.base);
              if (w > 28) ctx.fillText(ds.data[i] + '%', bar.base + (bar.x - bar.base) / 2, bar.y);
            });
          });
          ctx.restore();
        },
      }],
    });

    /* --- 2. Internet use --------------------------------------------------- */

    HH.chart('chart-internet', {
      type: 'bar',
      data: {
        labels: ['Start of the Agenda', 'Latest UN assessment'],
        datasets: [{
          label: 'Share of world population using the internet, %',
          data: [40, 74],
          backgroundColor: [C.gray, C.teal],
          barThickness: 44,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% of the world online'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of world population' }), {
            beginAtZero: true, max: 100, ticks: { callback: pct },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: pct })],
    });

    /* --- 3. Social protection by income group ----------------------------- */

    HH.chart('chart-protection', {
      type: 'bar',
      data: {
        labels: ['High income', 'Upper-middle income', 'World', 'Lower-middle income', 'Low income'],
        datasets: [{
          label: 'Covered by at least one cash benefit, %',
          data: [85.9, 71.2, 52.4, 32.4, 9.7],
          backgroundColor: [C.gray, C.gray, C.blue, C.gold, C.red],
          barThickness: 24,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% covered'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of population covered' }), {
            beginAtZero: true, max: 100, ticks: { callback: pct },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: pct })],
    });

    /* --- 4. African spending per person ----------------------------------- */

    HH.chart('chart-africa', {
      type: 'bar',
      data: {
        labels: ['Interest payments', 'Education', 'Health'],
        datasets: [{
          label: 'US$ per person, 2021–2023 average',
          data: [70, 63, 44],
          backgroundColor: [C.red, C.gold, C.gold],
          barThickness: 34,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return 'US$' + c.parsed.x + ' per person'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ per person per year' }), {
            beginAtZero: true, max: 85,
            ticks: { callback: function (v) { return '$' + v; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '$' + v; } })],
    });

    /* --- 5. Extreme poverty ------------------------------------------------ */

    HH.chart('chart-poverty', {
      type: 'bar',
      data: {
        labels: ['2015 (derived)', '2026 (projected)', '2030 goal'],
        datasets: [{
          label: 'Global extreme poverty rate, %',
          data: [13, 10, 0],
          backgroundColor: [C.gray, C.red, C.teal],
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
                return c.dataIndex === 2 ? 'goal: end extreme poverty' : c.parsed.x + '% of the world';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent of world population in extreme poverty' }), {
            beginAtZero: true, max: 16, ticks: { callback: pct },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({
        axis: 'x',
        format: function (v, i) { return i === 2 ? 'zero' : (i === 0 ? '~' : '') + v + '%'; },
      })],
    });

    /* --- 6. Sub-Saharan Africa's rural electricity deficit ----------------- */

    HH.chart('chart-frontier', {
      type: 'bar',
      data: {
        labels: ['2010', '2024'],
        datasets: [{
          label: 'Rural people without electricity, millions',
          data: [376, 447],
          backgroundColor: [C.gray, C.red],
          barThickness: 44,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + ' million without electricity'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of rural people, sub-Saharan Africa' }), {
            beginAtZero: true, max: 500,
            ticks: { callback: function (v) { return v + 'm'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + 'm'; } })],
    });
  });
})();
