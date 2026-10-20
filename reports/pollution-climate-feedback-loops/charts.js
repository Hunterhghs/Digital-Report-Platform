/* ===========================================================================
   Charts and interactions — "The Pollution–Climate Risk Nexus" (hybrid dashboard)

   DATA: NOAA global methane (annual mean and growth, 1984–2025), GFED4s boreal
   fire carbon (1997–2023; 2017+ beta), GWIS burned area (2012–2024), SatPM
   PM2.5 exposure by income group (1998–2024), share without clean cooking
   (2000–2024) and Mills et al. (2018) ozone yield gaps. The loop calculator's
   strengths are illustrative. Colours come from the theme's --d-* tokens.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var DATA = {"ch4":{"years":[1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],"mean":[1644.8,1657.3,1670.1,1682.7,1693.2,1704.5,1714.5,1724.8,1735.5,1736.5,1742.1,1748.9,1751.3,1754.5,1765.6,1772.3,1773.2,1771.3,1772.7,1777.3,1777.1,1774.2,1774.9,1781.3,1787.0,1793.5,1798.9,1803.0,1808.1,1813.4,1822.6,1834.2,1843.2,1849.6,1857.3,1866.6,1878.8,1894.9,1911.0,1921.5,1929.5,1936.0],"growth":[12.88,12.2,12.89,11.44,10.72,11.17,8.67,14.0,2.43,3.85,7.27,3.85,2.48,6.35,12.14,2.25,-1.34,-0.66,3.18,4.83,-4.71,0.23,1.84,7.83,6.56,4.72,5.04,5.01,5.02,5.67,12.74,10.0,7.13,6.83,8.73,9.67,14.81,17.69,13.01,8.29,8.04,4.77]},"gfed":{"years":[1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023],"bona":[26,89,37,20,12,83,52,98,67,48,37,29,39,70,47,49,97,111,128,37,104,75,86,10,157,93,769],"boas":[94,279,99,109,99,159,275,45,65,132,58,179,66,88,101,210,81,128,103,145,108,173,209,198,360,76,124]},"burnt":{"years":[2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"mha":[437.7,388.0,406.3,443.5,416.1,411.8,329.7,407.5,408.7,384.2,364.1,397.0,350.7]},"pm":{"High-income countries":{"years":[1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[15.5,14.9,15.8,15.7,15.9,16.4,15.1,15.7,16.2,15.4,15.3,15.3,15.5,15.4,14.5,14.3,14.2,14.2,13.5,13.7,13.6,12.9,12.1,12.5,12.6,12.7,12.5]},"Low-income countries":{"years":[1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[23.1,21.1,27.1,29.1,27.7,28.4,28.9,28.5,27.3,29.3,29.3,28.8,30.5,31.5,31.2,30.9,29.3,31.4,30.0,29.5,28.7,29.4,28.2,28.8,29.6,26.5,30.0]},"Lower-middle-income countries":{"years":[1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[32.1,31.7,36.4,38.1,38.2,39.7,40.4,40.2,41.7,43.4,45.7,45.1,45.5,47.4,46.1,46.0,45.5,49.6,50.9,49.9,49.8,46.6,44.3,46.8,44.6,43.6,42.5]},"Upper-middle-income countries":{"years":[1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[23.3,22.3,25.9,26.8,28.3,30.3,30.0,31.7,33.5,33.8,33.1,32.6,32.0,34.4,32.6,33.7,36.0,34.9,32.2,31.0,28.9,28.7,26.1,25.3,25.7,26.2,26.0]},"World":{"years":[1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[24.4,23.7,27.3,28.3,29.0,30.5,30.4,31.1,32.4,33.1,33.6,33.2,33.3,35.0,33.7,34.1,34.7,35.9,35.1,34.3,33.4,32.2,30.2,30.9,30.4,30.1,29.9]}},"cook":{"years":[2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"v":[53.0,52.0,51.0,50.0,49.0,48.0,48.0,47.0,46.0,45.0,44.0,42.0,41.0,40.0,38.0,36.0,35.0,33.0,32.0,30.0,29.0,28.0,27.0,26.0,25.0]},"ozone":[["Soybean",12.4],["Wheat",7.1],["Maize",6.1],["Rice",4.4]]};

  var LOOPS = {
    fire: { s: [0.8, 0.8, 0.78], links: [['Warming → fire weather', 'Global and slow: cut greenhouse gas emissions'], ['Fire → carbon and smoke', 'Local and fast: fuel, ignition and peatland management'], ['Carbon → warming', 'Set by the carbon cycle; reduced only by less fire']] },
    methane: { s: [0.8, 0.8, 0.78], links: [['Warming → wetland methane', 'Natural: cannot be switched off'], ['Methane → ozone and warming', 'Cut human-caused methane: ~30% of fossil methane at no net cost'], ['Ozone → weaker sinks', 'Ozone controls and tolerant crops']] },
    cooking: { s: [0.8, 0.8, 0.78], links: [['Poverty → polluting fuels', 'Clean cooking: about $8 bn a year for universal access'], ['Smoke → illness', 'Ventilation and improved stoves (partial)'], ['Illness → lost income', 'Health care and social protection']] },
  };

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  /* --- 1. loop map (works without Chart.js) ------------------------------------ */

  function initLoopMap() {
    var svg = document.querySelector('.loopmap');
    var btns = document.querySelectorAll('[data-loop]');
    var cards = document.querySelectorAll('[data-card]');
    function show(k) {
      Array.prototype.forEach.call(btns, function (b) { var on = b.getAttribute('data-loop') === k; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      Array.prototype.forEach.call(cards, function (c) { c.hidden = c.getAttribute('data-card') !== k; });
      if (!svg) return;
      svg.classList.toggle('has-active', k !== 'all');
      Array.prototype.forEach.call(svg.querySelectorAll('.lp-edge'), function (e) { var on = k !== 'all' && e.getAttribute('data-loops').split(' ').indexOf(k) > -1; e.classList.toggle('is-on', on); e.querySelector('path').setAttribute('marker-end', on ? 'url(#lp-ar-on)' : 'url(#lp-ar)'); });
    }
    Array.prototype.forEach.call(btns, function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-loop')); }); });
    show('all');
  }
  initLoopMap();

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, labels = HH.valueLabels;
    var CL = tok('--d-climate'), PO = tok('--d-pollution'), HE = tok('--d-health'), EC = tok('--d-eco'), DV = tok('--d-dev'), MU = tok('--d-muted'), INK = tok('--text'), ACC = tok('--accent');
    var tick = { color: tok('--text-muted'), font: { size: 10.5 } };
    function yearTicks(years, step) { return Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return years[i] % step === 0 ? years[i] : ''; } }, tick); }

    /* --- 2. fire ---------------------------------------------------------------- */

    var GF = DATA.gfed;
    HH.chart('chart-boreal', {
      type: 'bar',
      data: { labels: GF.years, datasets: [
        { label: 'Boreal North America', data: GF.bona, backgroundColor: GF.years.map(function (y) { return y >= 2017 ? alpha(CL, 0.55) : CL; }), stack: 's', barPercentage: 0.9 },
        { label: 'Boreal Asia', data: GF.boas, backgroundColor: GF.years.map(function (y) { return y >= 2017 ? alpha(PO, 0.55) : PO; }), stack: 's', barPercentage: 0.9 },
      ] },
      options: {
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { title: function (c) { var y = +c[0].label; return y + (y >= 2017 ? ' (GFED beta estimate)' : ''); }, label: function (c) { return c.dataset.label + ': ' + c.parsed.y + ' Tg C'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { stacked: true, ticks: yearTicks(GF.years, 5) }), y: Object.assign(axis({ title: 'Tg carbon a year' }), { stacked: true, min: 0, ticks: tick }) },
      },
    });

    var BU = DATA.burnt;
    HH.chart('chart-burnt', {
      type: 'bar',
      data: { labels: BU.years, datasets: [{ data: BU.mha, backgroundColor: alpha(PO, 0.75), barPercentage: 0.75 }] },
      options: {
        layout: { padding: { top: 16 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y.toFixed(0) + ' million hectares'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: yearTicks(BU.years, 2) }), y: Object.assign(axis({ title: 'Million hectares' }), { min: 0, max: 500, ticks: tick }) },
      },
      plugins: [labels({ only: [0, BU.years.length - 1], format: function (v) { return Math.round(v); } })],
    });

    /* --- 3. methane and ozone --------------------------------------------------- */

    var CH = DATA.ch4;
    HH.chart('chart-methane', {
      data: { labels: CH.years, datasets: [
        { type: 'line', label: 'Concentration (ppb)', data: CH.mean, borderColor: PO, backgroundColor: PO, borderWidth: 2.6, pointRadius: 0, tension: 0.2, yAxisID: 'y' },
        { type: 'bar', label: 'Annual growth (ppb)', data: CH.growth, backgroundColor: CH.years.map(function (y) { return y === 2020 || y === 2021 ? CL : alpha(CL, 0.35); }), barPercentage: 0.85, yAxisID: 'y1' },
      ] },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 11 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + (c.parsed.y == null ? '—' : c.parsed.y.toFixed(1)); } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: yearTicks(CH.years, 5) }),
          y: Object.assign(axis({ title: 'ppb' }), { min: 1600, max: 1960, ticks: tick }),
          y1: Object.assign(axis({ grid: false, title: 'Growth, ppb a year' }), { position: 'right', min: 0, max: 40, ticks: tick }),
        },
      },
    });

    var OZ = DATA.ozone;
    HH.chart('chart-ozone', {
      type: 'bar',
      data: { labels: OZ.map(function (o) { return o[0]; }), datasets: [{ data: OZ.map(function (o) { return o[1]; }), backgroundColor: EC, barPercentage: 0.6 }] },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 40 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% of global yield lost to ozone'; } } } },
        scales: { x: Object.assign(axis({ title: 'Per cent of yield' }), { min: 0, max: 14, ticks: tick }), y: Object.assign(axis({ grid: false }), { ticks: { color: INK, font: { size: 11.5 } } }) },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '%'; } })],
    });

    /* --- 4. PM2.5 by income ------------------------------------------------------- */

    var PM = DATA.pm, groups = [['World', INK, 3], ['Lower-middle-income countries', CL, 2], ['Upper-middle-income countries', PO, 2], ['Low-income countries', HE, 2], ['High-income countries', DV, 2]];
    var pmYears = PM.World.years;
    HH.chart('chart-pm', {
      type: 'line',
      data: { labels: pmYears, datasets: groups.map(function (g) { return { label: g[0].replace(' countries', ''), data: PM[g[0]].v, borderColor: g[1], backgroundColor: g[1], borderWidth: g[2], pointRadius: 0, tension: 0.2 }; }) },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, boxHeight: 3, font: { size: 11 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1) + ' µg/m³'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: yearTicks(pmYears, 4) }), y: Object.assign(axis({ title: 'µg/m³' }), { min: 0, max: 55, ticks: tick }) },
      },
      plugins: [{ id: 'who', beforeDatasetsDraw: function (c) { var y = c.scales.y.getPixelForValue(5), a = c.chartArea, ctx = c.ctx; ctx.save(); ctx.strokeStyle = EC; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke(); ctx.fillStyle = EC; ctx.font = '600 10.5px ' + tok('--mono'); ctx.fillText('WHO guideline 5', a.left + 6, y - 6); ctx.restore(); } }],
    });

    /* --- 6. cooking ------------------------------------------------------------------- */

    var CK = DATA.cook;
    HH.chart('chart-cooking', {
      type: 'line',
      data: { labels: CK.years, datasets: [{ data: CK.v, borderColor: DV, backgroundColor: alpha(DV, 0.15), fill: true, borderWidth: 2.6, pointRadius: 0, tension: 0.2 }] },
      options: {
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + '% without clean cooking fuels'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: yearTicks(CK.years, 4) }), y: Object.assign(axis({ title: 'Per cent of population' }), { min: 0, max: 60, ticks: tick }) },
      },
    });

    /* --- 7. loop-gain calculator ------------------------------------------------------- */

    var loopKey = 'fire', sl = [1, 2, 3].map(function (i) { return document.getElementById('g-c' + i); });
    var gainChart = HH.chart('chart-gain', {
      type: 'bar',
      data: { labels: ['Before', 'After'], datasets: [{ data: [0, 0], backgroundColor: [MU, ACC], barPercentage: 0.55 }] },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 50 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return 'Amplification ×' + c.parsed.x.toFixed(2); } } } },
        scales: { x: Object.assign(axis({ title: 'Amplification of an external push (×)' }), { min: 0, max: 2.2, ticks: tick }), y: Object.assign(axis({ grid: false }), { ticks: { color: INK, font: { size: 11.5 } } }) },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '×' + v.toFixed(2); } })],
    });
    function updateGain() {
      var L = LOOPS[loopKey], g0 = 1, g1 = 1;
      L.s.forEach(function (s, i) { var c = parseFloat(sl[i].value); g0 *= s; g1 *= s * (1 - c); setText('o-c' + (i + 1), c > 0 ? 'cut ' + Math.round(c * 100) + '%' : 'no cut'); });
      var m0 = 1 / (1 - g0), m1 = 1 / (1 - g1), removed = (m0 - m1) / (m0 - 1);
      setText('t-g', g0.toFixed(2) + ' → ' + g1.toFixed(2));
      setText('t-m', '×' + m0.toFixed(2) + ' → ×' + m1.toFixed(2));
      setText('t-r', Math.round(removed * 100) + '%');
      if (gainChart) { gainChart.data.datasets[0].data = [m0, m1]; gainChart.update(); }
    }
    function setLoop(k) {
      loopKey = k;
      LOOPS[k].links.forEach(function (l, i) { setText('g-l' + (i + 1), l[0]); setText('g-h' + (i + 1), l[1]); sl[i].value = 0; });
      Array.prototype.forEach.call(document.querySelectorAll('[data-gloop]'), function (b) { b.classList.toggle('is-on', b.getAttribute('data-gloop') === k); });
      updateGain();
    }
    sl.forEach(function (s) { if (s) s.addEventListener('input', updateGain); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-gloop]'), function (b) { b.addEventListener('click', function () { setLoop(b.getAttribute('data-gloop')); }); });
    setLoop('fire');
  });
})();
