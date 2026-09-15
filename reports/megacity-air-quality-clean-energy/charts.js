/* ===========================================================================
   Charts — "Air Quality Improvement as a Co-Benefit of Clean Energy
   Transition in Megacities"

   Every figure replots published values; Figure 2's middle bar is derived
   and its caption says so. Colours come from the theme tokens — sky blue for
   clean outcomes, smog brick for pollution and burden.
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

    // Dashed vertical reference lines on a horizontal bar chart, drawn after
    // the bars so they read on top. Values are in data units of the x scale.
    function refLines(lines) {
      return {
        id: 'refLines',
        afterDatasetsDraw: function (chart) {
          var x = chart.scales.x;
          var area = chart.chartArea;
          var ctx = chart.ctx;
          ctx.save();
          lines.forEach(function (l) {
            var px = x.getPixelForValue(l.value);
            ctx.strokeStyle = l.color;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(px, area.top);
            ctx.lineTo(px, area.bottom);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = l.color;
            ctx.font = '600 10px ' + getComputedStyle(document.documentElement).getPropertyValue('--mono');
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(l.label, px + 4, area.top - 4);
          });
          ctx.restore();
        },
      };
    }

    /* --- 1. The most polluted major cities --------------------------------- */

    HH.chart('chart-cities', {
      type: 'bar',
      data: {
        labels: ['Delhi', 'Lahore', 'Dhaka', 'Kinshasa', 'Karachi', 'Beijing (official, for comparison)'],
        datasets: [{
          label: 'Annual PM2.5, µg/m³ (2024)',
          data: [108.3, 102.1, 78, 58.2, 47.1, 30.5],
          backgroundColor: [C.red, C.red, C.red, C.orange, C.orange, C.blue],
          barThickness: 22,
        }],
      },
      options: {
        indexAxis: 'y',
        layout: { padding: { top: 18 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                return c.parsed.x + ' µg/m³ — ' + (c.parsed.x / 5).toFixed(0) + '× the WHO guideline';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Annual average PM2.5, µg/m³' }), { beginAtZero: true, max: 125 }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [
        labels({ axis: 'x', format: function (v) { return v; } }),
        refLines([
          { value: 5, label: 'WHO 5', color: C.teal },
          { value: 35, label: 'Interim 35', color: C.gray },
        ]),
      ],
    });

    /* --- 2. What a fossil-fuel phase-out reaches -------------------------- */

    HH.chart('chart-attribution', {
      type: 'bar',
      data: {
        labels: [
          'All PM2.5 and ozone deaths',
          'Avoidable by controlling all human emissions (derived)',
          'Attributable to fossil fuels',
        ],
        datasets: [{
          label: 'Excess deaths per year, millions',
          data: [8.34, 6.26, 5.13],
          backgroundColor: [C.gray, C.orange, C.red],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x.toFixed(2) + ' million a year'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of excess deaths per year' }), { beginAtZero: true, max: 10 }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v.toFixed(2) + 'm'; } })],
    });

    /* --- 3. Sources of urban PM2.5 ----------------------------------------- */

    var regions = ['World', 'India', 'Southern Asia', 'South-Eastern Asia', 'Northern China', 'Africa', 'Rest of the Americas', 'Western Europe'];
    var sources = [
      { label: 'Traffic', color: C.red, data: [25, 37, 34, 36, 15, 17, 30, 25] },
      { label: 'Industry incl. power', color: C.purple, data: [15, 4, 27, 18, 16, 10, 8, 11] },
      { label: 'Domestic fuel burning', color: C.orange, data: [20, 16, 13, 19, 15, 34, 25, 15] },
      { label: 'Other human (mostly secondary)', color: C.gold, data: [22, 22, 16, 13, 30, 17, 16, 44] },
      { label: 'Natural dust and sea salt', color: C.blueLight, data: [18, 21, 10, 14, 24, 22, 21, 5] },
    ];

    HH.chart('chart-sources', {
      type: 'bar',
      data: {
        labels: regions,
        datasets: sources.map(function (s) {
          return { label: s.label, data: s.data, backgroundColor: s.color, barThickness: 24 };
        }),
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 10.5 } } },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.x + '%'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Share of urban PM2.5, per cent' }), {
            stacked: true, beginAtZero: true, max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { font: { size: 10.5 } } }),
        },
      },
    });

    /* --- 4. Deaths per terawatt-hour ------------------------------------- */

    HH.chart('chart-twh', {
      type: 'bar',
      data: {
        labels: ['Coal', 'Oil', 'Biomass', 'Natural gas', 'Hydropower', 'Wind', 'Nuclear', 'Solar'],
        datasets: [{
          label: 'Deaths per TWh',
          data: [24.6, 18.4, 4.6, 2.8, 1.3, 0.04, 0.03, 0.02],
          backgroundColor: [C.red, C.red, C.orange, C.orange, C.gray, C.blue, C.blue, C.blue],
          barThickness: 22,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + ' deaths per TWh'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Deaths per terawatt-hour (log scale)' }), {
            type: 'logarithmic', min: 0.01, max: 100,
            ticks: {
              maxRotation: 0,
              autoSkip: false,
              // Label powers of ten only; Chart.js also generates minor ticks.
              callback: function (v) {
                var e = Math.log10(v);
                return Math.abs(e - Math.round(e)) < 1e-6 ? String(Math.pow(10, Math.round(e))) : '';
              },
            },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v; } })],
    });

    /* --- 6. Deaths avoided by global mitigation --------------------------- */

    var west = [
      { year: '2030', mid: 0.5, err: 0.2 },
      { year: '2050', mid: 1.3, err: 0.5 },
      { year: '2100', mid: 2.2, err: 0.8 },
    ];

    // Whiskers for the published ± uncertainty, drawn over the central bars.
    var whiskers = {
      id: 'westWhiskers',
      afterDatasetsDraw: function (chart) {
        var x = chart.scales.x;
        var ctx = chart.ctx;
        ctx.save();
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 1.5;
        chart.getDatasetMeta(0).data.forEach(function (bar, i) {
          var lo = x.getPixelForValue(west[i].mid - west[i].err);
          var hi = x.getPixelForValue(west[i].mid + west[i].err);
          ctx.beginPath();
          ctx.moveTo(lo, bar.y); ctx.lineTo(hi, bar.y);
          ctx.moveTo(lo, bar.y - 7); ctx.lineTo(lo, bar.y + 7);
          ctx.moveTo(hi, bar.y - 7); ctx.lineTo(hi, bar.y + 7);
          ctx.stroke();
        });
        ctx.restore();
      },
    };

    // Value labels sit past the upper whisker rather than on the bar end.
    var westLabels = {
      id: 'westLabels',
      afterDatasetsDraw: function (chart) {
        var x = chart.scales.x;
        var ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = C.ink;
        ctx.font = '600 11px ' + getComputedStyle(document.documentElement).getPropertyValue('--sans');
        ctx.textBaseline = 'middle';
        chart.getDatasetMeta(0).data.forEach(function (bar, i) {
          ctx.fillText(west[i].mid + 'm ± ' + west[i].err, x.getPixelForValue(west[i].mid + west[i].err) + 10, bar.y);
        });
        ctx.restore();
      },
    };

    HH.chart('chart-west', {
      type: 'bar',
      data: {
        labels: west.map(function (d) { return d.year; }),
        datasets: [{
          label: 'Premature deaths avoided per year, millions',
          data: west.map(function (d) { return d.mid; }),
          backgroundColor: [C.blueLight, C.blue, C.teal],
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
                var d = west[c.dataIndex];
                return d.mid + ' ± ' + d.err + ' million deaths avoided';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: 'Millions of premature deaths avoided per year' }), { beginAtZero: true, max: 3.6 }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [whiskers, westLabels],
    });

    /* --- 7. What cleaned China's air ------------------------------------- */

    HH.chart('chart-china', {
      type: 'bar',
      data: {
        labels: [
          'Stronger industrial emission standards',
          'Upgraded industrial boilers',
          'Phasing out outdated industrial capacity',
          'Clean fuels in the residential sector',
        ],
        datasets: [{
          label: 'Decline in national PM2.5, µg/m³ (2017)',
          data: [6.6, 4.4, 2.8, 2.2],
          backgroundColor: [C.gray, C.gray, C.gray, C.blue],
          barThickness: 24,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return '−' + c.parsed.x + ' µg/m³'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Contribution to decline in PM2.5, µg/m³' }), { beginAtZero: true, max: 8 }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '−' + v; } })],
    });

    /* --- 8. ULEZ: roadside NO2 by zone ------------------------------------ */

    HH.chart('chart-ulez-no2', {
      type: 'bar',
      data: {
        labels: ['Central London', 'Inner London', 'Outer London', 'Whole of London'],
        datasets: [{
          label: 'Roadside NO2 reduction vs no-ULEZ scenario, 2024',
          data: [54, 29, 24, 27],
          backgroundColor: [C.blue, C.blue, C.blue, C.teal],
          barThickness: 24,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% lower'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent lower than without the ULEZ' }), {
            beginAtZero: true, max: 60,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '−' + v + '%'; } })],
    });

    /* --- 9. ULEZ: pollutants vs carbon ------------------------------------ */

    HH.chart('chart-ulez-emissions', {
      type: 'bar',
      data: {
        labels: ['Nitrogen oxides (NOx)', 'Exhaust PM2.5', 'Carbon dioxide (CO2)'],
        datasets: [{
          label: 'Emission reduction vs no-ULEZ scenario, 2019–2024',
          data: [24, 29, 2],
          backgroundColor: [C.blue, C.blue, C.red],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% lower'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Per cent lower than without the ULEZ' }), {
            beginAtZero: true, max: 35,
            ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '−' + v + '%'; } })],
    });
  });
})();
