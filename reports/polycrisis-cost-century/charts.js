/* ===========================================================================
   Charts and calculators — "The Polycrisis Bill" (hybrid dashboard)

   The ledger reads each entry's amount from its table row (data-amt, US$
   trillion a year) and totals the ticked entries as a share of 2025 world
   output. The century and prevention calculators below are the same code
   the figures in the text were computed with in Node.js. Colours come from
   the theme's --c-* tokens; no hex values live in this file.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  /* --- calculator core (verbatim from the calibration script) -------------------- */

  var G0 = 118.35; // world GDP 2025, US$ trillion (World Bank WDI)
function century(g, s0, s1, r) {
  var rows = [], tot = 0, pv = 0, gdpTot = 0, per = [0, 0, 0];
  for (var t = 2025; t <= 2100; t++) {
    var k = t - 2025, gdp = G0 * Math.pow(1 + g, k), s = s0 + (s1 - s0) * k / 75, loss = s * gdp;
    tot += loss; gdpTot += gdp; pv += loss / Math.pow(1 + r, k);
    per[t < 2050 ? 0 : t < 2075 ? 1 : 2] += loss;
    rows.push({ t: t, gdp: gdp, share: s, loss: loss });
  }
  return { rows: rows, total: tot, pv: pv, gdpTotal: gdpTot, periods: per };
}
function prevention(g, s0, s1, r, a, c, ramp) {
  var base = century(g, s0, s1, r), avoided = 0, cost = 0, avPV = 0, coPV = 0;
  base.rows.forEach(function (x) { var k = x.t - 2025, f = a * Math.min(1, k / ramp), av = f * x.loss, co = c * x.gdp; avoided += av; cost += co; avPV += av / Math.pow(1 + r, k); coPV += co / Math.pow(1 + r, k); });
  return { avoided: avoided, cost: cost, avPV: avPV, coPV: coPV };
}

  var PRESETS = {
    market: ['disasters', 'heat'],
    health: ['disasters', 'heat', 'air'],
    violence: ['disasters', 'heat', 'air', 'violence'],
    full: ['disasters', 'heat', 'air', 'violence', 'military', 'carbon'],
  };
  var RANGE = [[100, 300], [200, 700], [300, 2000], [600, 3000]]; // working range, US$ tn

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function money(tn) { return tn >= 1000 ? '$' + (tn / 1000).toFixed(2) + ' qn' : tn >= 10 ? '$' + Math.round(tn).toLocaleString() + ' tn' : '$' + tn.toFixed(2) + ' tn'; }
  function pct(x, d) { return (x * 100).toFixed(d == null ? 1 : d) + '%'; }

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, labels = HH.valueLabels;
    var C = { output: tok('--c-loss'), welfare: tok('--c-welfare'), response: tok('--c-response'), liability: tok('--c-liability') };
    var PREV = tok('--c-prevent'), GDPC = tok('--c-gdp'), INK = tok('--text');
    var tick = { color: tok('--text-muted'), font: { size: 10.5 } };

    /* --- 1. the ledger -------------------------------------------------------------- */

    var rows = Array.prototype.slice.call(document.querySelectorAll('#ledger tbody tr'));
    var acctOf = function (tr) { var s = tr.querySelector('.acct'); return s.className.replace(/.*acct--(\w+).*/, '$1'); };
    rows.forEach(function (tr) { tr.querySelector('.amt').textContent = parseFloat(tr.getAttribute('data-amt')).toFixed(2); });

    var ledgerChart = HH.chart('chart-ledger', {
      type: 'bar',
      data: { labels: [], datasets: [{ data: [], backgroundColor: [], barPercentage: 0.72 }] },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 44 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '$' + c.parsed.x.toFixed(2) + ' tn a year (' + pct(c.parsed.x / G0) + ' of 2025 output)'; } } } },
        scales: { x: Object.assign(axis({ title: 'US$ trillion a year' }), { min: 0, ticks: tick }), y: Object.assign(axis({ grid: false }), { ticks: { color: INK, font: { size: 10.5 } } }) },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v.toFixed(1); } })],
    });

    function ledgerTotal(keys) { return rows.reduce(function (s, tr) { return keys.indexOf(tr.getAttribute('data-key')) > -1 ? s + parseFloat(tr.getAttribute('data-amt')) : s; }, 0); }
    var ledgerShare = 0;
    function updateLedger() {
      var inc = rows.filter(function (tr) { return tr.querySelector('input').checked; });
      rows.forEach(function (tr) { tr.querySelector('.amt').classList.toggle('is-off', !tr.querySelector('input').checked); });
      var tot = inc.reduce(function (s, tr) { return s + parseFloat(tr.getAttribute('data-amt')); }, 0);
      ledgerShare = tot / G0;
      setText('ledger-total', tot.toFixed(2));
      setText('ledger-share', pct(ledgerShare) + ' of 2025 world output');
      if (ledgerChart) {
        ledgerChart.data.labels = inc.map(function (tr) { return tr.children[1].textContent.replace(/ \(reference\)/, '').replace('Natural catastrophe losses, direct', 'Disaster losses').replace('Economic impact of violence, excluding military spending', 'Violence (non-military)').replace('Climate damage locked in by one year\'s emissions', 'Climate liability of emissions').replace('Collapse of selected ecosystem services', 'Ecosystem collapse (2030)').replace('Heat-related labour income losses', 'Heat labour losses').replace('Health cost of PM2.5 air pollution', 'Air pollution health cost').replace('World military expenditure', 'Military spending').replace('Climate-attributable extreme-weather costs', 'Climate-attributable extremes'); });
        ledgerChart.data.datasets[0].data = inc.map(function (tr) { return parseFloat(tr.getAttribute('data-amt')); });
        ledgerChart.data.datasets[0].backgroundColor = inc.map(function (tr) { return C[acctOf(tr)]; });
        ledgerChart.update();
      }
      var fromLedger = document.querySelector('[data-cpreset="ledger"]');
      if (fromLedger && fromLedger.classList.contains('is-on')) applyCPreset('ledger');
    }
    rows.forEach(function (tr) { tr.querySelector('input').addEventListener('change', function () { clearOn('[data-lpreset]'); updateLedger(); }); });
    function clearOn(sel) { Array.prototype.forEach.call(document.querySelectorAll(sel), function (b) { b.classList.remove('is-on'); }); }
    function segGroup(attr, fn) {
      var bs = document.querySelectorAll('[data-' + attr + ']');
      Array.prototype.forEach.call(bs, function (b) { b.addEventListener('click', function () { Array.prototype.forEach.call(bs, function (x) { x.classList.toggle('is-on', x === b); }); fn(b.getAttribute('data-' + attr)); }); });
    }
    segGroup('lpreset', function (k) { rows.forEach(function (tr) { tr.querySelector('input').checked = PRESETS[k].indexOf(tr.getAttribute('data-key')) > -1; }); updateLedger(); });

    var READ = [['Market losses', 'market'], ['With health', 'health'], ['With violence', 'violence'], ['Full ledger', 'full']];
    HH.chart('chart-readings', {
      type: 'bar',
      data: { labels: READ.map(function (r) { return r[0]; }), datasets: [{ data: READ.map(function (r) { return Math.round(1000 * ledgerTotal(PRESETS[r[1]]) / G0) / 10; }), backgroundColor: [C.output, C.welfare, C.welfare, C.liability], barPercentage: 0.62 }] },
      options: {
        layout: { padding: { top: 18 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y.toFixed(1) + '% of 2025 world output ($' + ledgerTotal(PRESETS[READ[c.dataIndex][1]]).toFixed(1) + ' tn)'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: { color: INK, font: { size: 10.5 } } }), y: Object.assign(axis({ title: 'Per cent of world output' }), { min: 0, max: 26, ticks: tick }) },
      },
      plugins: [labels({ format: function (v) { return v.toFixed(1) + '%'; } })],
    });

    /* --- 3. trajectory -------------------------------------------------------------- */

    var TR = [
      ['Disaster losses, 2024–25', 0.25, 0.25, 'output'],
      ['Heat labour losses, 2024', 0.9, 0.9, 'output'],
      ['Air pollution health cost, 2019', 6.1, 6.1, 'welfare'],
      ['Violence, all (PPP), 2024', 11.6, 11.6, 'welfare'],
      ['Ecosystem collapse, 2030', 2.0, 2.0, 'liability'],
      ['Antimicrobial resistance, 2050', 1.1, 3.8, 'liability'],
      ['Climate (Swiss Re), 2050', 11, 18, 'liability'],
      ['Climate (NGFS V, retracted basis), 2050', 5, 15, 'retracted'],
    ];
    HH.chart('chart-trajectory', {
      type: 'bar',
      data: { labels: TR.map(function (t) { return t[0]; }), datasets: [
        { label: 'Low or single estimate', data: TR.map(function (t) { return t[1]; }), backgroundColor: TR.map(function (t) { return t[3] === 'retracted' ? alpha(C.liability, 0.18) : C[t[3]]; }), borderColor: TR.map(function (t) { return t[3] === 'retracted' ? C.liability : 'transparent'; }), borderWidth: TR.map(function (t) { return t[3] === 'retracted' ? 1.5 : 0; }), stack: 's', barPercentage: 0.7 },
        { label: 'Range to high estimate', data: TR.map(function (t) { return t[2] - t[1]; }), backgroundColor: TR.map(function (t) { return t[3] === 'retracted' ? alpha(C.liability, 0.08) : alpha(C[t[3]], 0.35); }), borderColor: TR.map(function (t) { return t[3] === 'retracted' ? C.liability : 'transparent'; }), borderWidth: TR.map(function (t) { return t[3] === 'retracted' ? 1.5 : 0; }), stack: 's', barPercentage: 0.7 },
      ] },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 60 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { var t = TR[c.dataIndex]; return t[1] === t[2] ? t[1] + '% of world output' : t[1] + '–' + t[2] + '% of world output'; } } } },
        scales: { x: Object.assign(axis({ title: 'Per cent of world output' }), { stacked: true, min: 0, max: 20, ticks: tick }), y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { color: INK, font: { size: 10.5 } } }) },
      },
      plugins: [{ id: 'rangeLabels', afterDatasetsDraw: function (c) { var meta = c.getDatasetMeta(1), ctx = c.ctx; ctx.save(); ctx.fillStyle = INK; ctx.font = '700 10.5px ' + tok('--mono'); ctx.textBaseline = 'middle'; meta.data.forEach(function (b, i) { var t = TR[i]; ctx.fillText(t[1] === t[2] ? t[1] + '%' : t[1] + '–' + t[2] + '%', b.x + 6, b.y); }); ctx.restore(); } }],
    });

    /* --- 4. the century calculator --------------------------------------------------- */

    var cg = document.getElementById('c-g'), cs0 = document.getElementById('c-s0'), cs1 = document.getElementById('c-s1'), cr = document.getElementById('c-r');
    var centChart = HH.chart('chart-century', {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: {
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 11 } } }, tooltip: { callbacks: { label: function (c) { return c.datasetIndex === 0 ? 'Loss: $' + c.parsed.y.toFixed(1) + ' tn' : 'Cumulative: $' + c.parsed.y.toFixed(2) + ' qn'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { var y = 2025 + i; return y % 25 === 0 ? y : ''; } }, tick) }),
          y: Object.assign(axis({ title: 'Annual loss, US$ tn' }), { min: 0, ticks: tick }),
          y1: Object.assign(axis({ grid: false, title: 'Cumulative, US$ quadrillion' }), { min: 0, position: 'right', ticks: tick }),
        },
      },
    });
    function params() { return { g: parseFloat(cg.value), s0: parseFloat(cs0.value), s1: parseFloat(cs1.value), r: parseFloat(cr.value) }; }
    function updateCentury() {
      var p = params(), c = century(p.g, p.s0, p.s1, p.r);
      setText('o-g', pct(p.g, 2)); setText('o-s0', pct(p.s0, 1)); setText('o-s1', pct(p.s1, 1)); setText('o-r', pct(p.r, 1));
      if (centChart) {
        var cum = 0;
        centChart.data.labels = c.rows.map(function (x) { return x.t; });
        centChart.data.datasets = [
          { type: 'bar', label: 'Annual loss', data: c.rows.map(function (x) { return x.loss; }), backgroundColor: alpha(C.output, 0.75), barPercentage: 1, categoryPercentage: 0.9, yAxisID: 'y' },
          { type: 'line', label: 'Cumulative bill', data: c.rows.map(function (x) { cum += x.loss; return cum / 1000; }), borderColor: INK, backgroundColor: INK, borderWidth: 2.2, pointRadius: 0, tension: 0.2, yAxisID: 'y1' },
        ];
        centChart.update();
      }
      setText('t-total', money(c.total));
      setText('t-pv', money(c.pv)); setText('t-pv-l', 'Present value at ' + pct(p.r, 1));
      setText('t-gdp', money(c.gdpTotal)); setText('t-gdp-l', 'World output, 2025–2100 · losses ' + pct(c.total / c.gdpTotal) + ' of it');
      setText('t-per', money(c.gdpTotal / 100));
      var gdpPer = [0, 0, 0]; c.rows.forEach(function (x) { gdpPer[x.t < 2050 ? 0 : x.t < 2075 ? 1 : 2] += x.gdp; });
      var names = ['2025–2049', '2050–2074', '2075–2100'], tb = document.querySelector('#periods tbody');
      if (tb) {
        var rng = function (r) { return '$' + (r[0] >= 1000 ? r[0] / 1000 + ' qn' : r[0] + ' tn') + ' – $' + (r[1] >= 1000 ? r[1] / 1000 + '+ qn' : r[1] + ' tn'); };
        tb.innerHTML = names.map(function (n, i) { return '<tr><td>' + n + '</td><td>' + money(gdpPer[i]) + '</td><td>' + pct(c.periods[i] / gdpPer[i]) + '</td><td class="loss">' + money(c.periods[i]) + '</td><td class="ref">' + rng(RANGE[i]) + '</td></tr>'; }).join('')
          + '<tr class="total"><td>Century</td><td>' + money(c.gdpTotal) + '</td><td>' + pct(c.total / c.gdpTotal) + '</td><td class="loss">' + money(c.total) + '</td><td class="ref">' + rng(RANGE[3]) + '</td></tr>';
      }
      updatePrevention();
    }
    [cg, cs0, cs1, cr].forEach(function (el) { if (el) el.addEventListener('input', function () { clearOn('[data-cpreset]'); updateCentury(); }); });
    function applyCPreset(k) {
      var v = { low: [0.02, 0.05], central: [0.04, 0.10], high: [0.08, 0.20] }[k];
      if (k === 'ledger') { var s = Math.min(0.25, Math.round(ledgerShare * 200) / 200); v = [s, Math.min(0.3, s * 2)]; }
      cs0.value = v[0]; cs1.value = v[1]; updateCentury();
    }
    segGroup('cpreset', applyCPreset);

    /* --- 5. prevention -------------------------------------------------------------------- */

    var pa = document.getElementById('p-a'), pc = document.getElementById('p-c');
    var prevChart = HH.chart('chart-prevention', {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 14, boxHeight: 3, font: { size: 11 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': $' + c.parsed.y.toFixed(1) + ' tn'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { var y = 2025 + i; return y % 25 === 0 ? y : ''; } }, tick) }), y: Object.assign(axis({ title: 'US$ tn a year' }), { min: 0, ticks: tick }) },
      },
    });
    function updatePrevention() {
      if (!pa || !pc) return;
      var p = params(), a = parseFloat(pa.value), cc = parseFloat(pc.value);
      setText('o-a', pct(a, 0)); setText('o-c', pct(cc, 2) + ' of output');
      var res = prevention(p.g, p.s0, p.s1, p.r, a, cc, 20), base = century(p.g, p.s0, p.s1, p.r);
      if (prevChart) {
        prevChart.data.labels = base.rows.map(function (x) { return x.t; });
        prevChart.data.datasets = [
          { label: 'Losses without prevention', data: base.rows.map(function (x) { return x.loss; }), borderColor: alpha(C.output, 0.5), backgroundColor: alpha(C.output, 0.06), fill: true, borderWidth: 1.6, pointRadius: 0 },
          { label: 'Losses avoided', data: base.rows.map(function (x) { var k = x.t - 2025; return a * Math.min(1, k / 20) * x.loss; }), borderColor: PREV, backgroundColor: alpha(PREV, 0.2), fill: true, borderWidth: 2.6, pointRadius: 0 },
          { label: 'Prevention spending', data: base.rows.map(function (x) { return cc * x.gdp; }), borderColor: INK, backgroundColor: INK, borderDash: [6, 4], borderWidth: 2, pointRadius: 0 },
        ];
        prevChart.update();
      }
      setText('t-av', money(res.avoided)); setText('t-co', money(res.cost));
      var net = res.avoided - res.cost;
      setText('t-net', (net < 0 ? '−' : '') + money(Math.abs(net))); setText('t-net-l', 'Net saving · present value ' + (res.avPV - res.coPV < 0 ? '−' : '') + money(Math.abs(res.avPV - res.coPV)));
      setText('t-bcr', res.cost > 0 ? (res.avoided / res.cost).toFixed(2) + ' (' + (res.avPV / res.coPV).toFixed(2) + ')' : '—');
    }
    [pa, pc].forEach(function (el) { if (el) el.addEventListener('input', updatePrevention); });

    updateLedger();
    updateCentury();
  });
})();
