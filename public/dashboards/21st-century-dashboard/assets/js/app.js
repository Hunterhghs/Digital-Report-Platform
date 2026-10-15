/* =============================================================================
   H Heuristics — 21st Century Dashboard
   Application layer: chart factory, panels, routing, theming, export.
   Depends on: Chart.js 4 (assets/vendor), window.HH_DATA (assets/js/data.js)
   ============================================================================= */
(function () {
  'use strict';

  const D = window.HH_DATA;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, attrs, children) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => c && n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return n;
  };

  /* ------------------------------------------------------------ theme tokens */
  const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const T = () => ({
    bg: cssVar('--bg'), paper: cssVar('--paper'), ink: cssVar('--ink'), ink2: cssVar('--ink-2'), muted: cssVar('--muted'),
    grid: cssVar('--grid'), accent: cssVar('--accent'), positive: cssVar('--positive'), negative: cssVar('--negative'), caution: cssVar('--caution'),
    series: [1, 2, 3, 4, 5, 6, 7, 8].map(i => cssVar('--s' + i)),
    sans: cssVar('--sans'), mono: cssVar('--mono'), serif: cssVar('--serif')
  });
  const alpha = (hex, a) => {
    const h = hex.replace('#', '');
    const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const n = parseInt(f, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };

  /* ------------------------------------------------------------ formatting */
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
  const nf0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  const fmt = {
    pct: v => nf.format(v) + ' %',
    pct0: v => nf0.format(v) + ' %',
    num: v => nf.format(v),
    num0: v => nf0.format(v),
    bn: v => nf.format(v) + ' bn',
    m: v => nf0.format(v) + ' m',
    usd: v => '$' + nf.format(v),
    usdT: v => '$' + nf.format(v) + ' tn',
    usdB: v => '$' + nf0.format(v) + ' bn',
    deg: v => (v > 0 ? '+' : '') + v.toFixed(2) + ' °C',
    ppm: v => nf.format(v) + ' ppm',
    gt: v => nf.format(v) + ' Gt',
    twh: v => nf0.format(v) + ' TWh',
    sci: v => {
      if (v === 0) return '0';
      const e = Math.floor(Math.log10(v));
      const m = v / Math.pow(10, e);
      return (Math.abs(m - 1) < 1e-6 ? '' : m.toFixed(1) + '×') + '10' + sup(e);
    },
    log: v => {
      if (v >= 1e6) return '$' + nf.format(v / 1e6) + ' m';
      if (v >= 1e3) return '$' + nf.format(v / 1e3) + ' k';
      if (v >= 1) return '$' + nf.format(v);
      return '$' + v.toPrecision(2);
    }
  };
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function sup(n) { return String(n).split('').map(c => SUP[c] || c).join(''); }
  const isPow10 = v => Math.abs(Math.log10(v) - Math.round(Math.log10(v))) < 1e-9;

  /* ------------------------------------------------------------ Chart.js setup */
  function applyChartDefaults() {
    const t = T();
    Chart.defaults.font.family = t.sans;
    Chart.defaults.font.size = 11.5;
    Chart.defaults.color = t.muted;
    Chart.defaults.borderColor = t.grid;
    Chart.defaults.animation.duration = 450;
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.legend.labels.boxWidth = 10;
    Chart.defaults.plugins.legend.labels.boxHeight = 10;
    Chart.defaults.plugins.legend.labels.padding = 14;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = 'rectRounded';
    Chart.defaults.plugins.tooltip.backgroundColor = t.ink;
    Chart.defaults.plugins.tooltip.titleColor = t.bg;
    Chart.defaults.plugins.tooltip.bodyColor = t.bg;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 4;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.plugins.tooltip.titleFont = { family: t.sans, weight: '600', size: 12 };
    Chart.defaults.plugins.tooltip.bodyFont = { family: t.sans, size: 12 };
    Chart.defaults.elements.line.borderWidth = 2.2;
    Chart.defaults.elements.line.tension = 0.25;
    Chart.defaults.elements.point.radius = 0;
    Chart.defaults.elements.point.hoverRadius = 4;
    Chart.defaults.elements.point.hitRadius = 8;
    Chart.defaults.elements.bar.borderRadius = 2;
    Chart.defaults.interaction = { mode: 'index', intersect: false };
  }

  /* Reference lines plugin: options.plugins.refLines = [{axis:'x'|'y', value, label, color, dash, position}] */
  const refLinesPlugin = {
    id: 'refLines',
    afterDatasetsDraw(chart, _args, opts) {
      const lines = (opts && opts.lines) || [];
      if (!lines.length) return;
      const { ctx, chartArea: a, scales } = chart;
      const t = T();
      ctx.save();
      lines.forEach(l => {
        const sc = scales[l.axis === 'x' ? 'x' : 'y'];
        if (!sc) return;
        const px = sc.getPixelForValue(l.value);
        if (!isFinite(px)) return;
        ctx.strokeStyle = l.color || t.muted;
        ctx.lineWidth = l.width || 1;
        ctx.setLineDash(l.dash || [4, 4]);
        ctx.beginPath();
        if (l.axis === 'x') { ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); } else { ctx.moveTo(a.left, px); ctx.lineTo(a.right, px); }
        ctx.stroke();
        if (l.label) {
          ctx.setLineDash([]);
          ctx.fillStyle = l.color || t.muted;
          ctx.font = `500 10px ${t.mono}`;
          if (l.axis === 'x') {
            ctx.textAlign = l.position === 'left' ? 'right' : 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(l.label, px + (l.position === 'left' ? -5 : 5), a.top + 4);
          } else {
            ctx.textAlign = l.position === 'left' ? 'left' : 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(l.label, l.position === 'left' ? a.left + 5 : a.right - 5, px - 3);
          }
        }
      });
      ctx.restore();
    }
  };

  /* Point labels plugin (scatter/bubble): options.plugins.pointLabels = {key:'label', min:0, font}. Labels read from raw.label */
  const pointLabelsPlugin = {
    id: 'pointLabels',
    afterDatasetsDraw(chart, _args, opts) {
      if (!opts || !opts.enabled) return;
      const { ctx } = chart;
      const t = T();
      ctx.save();
      ctx.font = `500 10.5px ${t.sans}`;
      ctx.fillStyle = t.ink2;
      ctx.textBaseline = 'middle';
      chart.data.datasets.forEach((ds, di) => {
        if (!chart.isDatasetVisible(di)) return;
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((pt, i) => {
          const raw = ds.data[i];
          if (!raw || !raw.label) return;
          if (opts.minR && (raw.r || 0) < opts.minR) return;
          const r = (pt.options && pt.options.radius) || 3;
          if (raw.inside) {
            ctx.textAlign = 'center'; ctx.fillStyle = t.ink; ctx.font = `600 10.5px ${t.sans}`;
            ctx.fillText(raw.label, pt.x, pt.y + (raw.dy || 0));
            ctx.font = `500 10.5px ${t.sans}`; ctx.fillStyle = t.ink2;
            return;
          }
          const align = raw.align || 'right';
          ctx.textAlign = align === 'left' ? 'right' : 'left';
          const dx = align === 'left' ? -(r + 4) : (r + 4);
          ctx.fillText(raw.label, pt.x + dx, pt.y + (raw.dy || 0));
        });
      });
      ctx.restore();
    }
  };

  /* Value labels for bar charts: options.plugins.valueLabels = {fmt} */
  const valueLabelsPlugin = {
    id: 'valueLabels',
    afterDatasetsDraw(chart, _args, opts) {
      if (!opts || !opts.enabled) return;
      const { ctx } = chart;
      const t = T();
      const horizontal = chart.options.indexAxis === 'y';
      ctx.save();
      ctx.font = `500 10.5px ${t.mono}`;
      ctx.fillStyle = t.ink2;
      chart.data.datasets.forEach((ds, di) => {
        if (!chart.isDatasetVisible(di)) return;
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((bar, i) => {
          const v = ds.data[i];
          if (v == null) return;
          const s = opts.fmt ? opts.fmt(v) : String(v);
          if (horizontal) { ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, bar.x + 5, bar.y); }
          else { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(s, bar.x, bar.y - 3); }
        });
      });
      ctx.restore();
    }
  };

  /* Quadrant captions: options.plugins.quadrants = [{x:'left'|'right', y:'top'|'bottom', text}] */
  const quadrantsPlugin = {
    id: 'quadrants',
    beforeDatasetsDraw(chart, _args, opts) {
      const items = (opts && opts.items) || [];
      if (!items.length) return;
      const { ctx, chartArea: a } = chart;
      const t = T();
      ctx.save();
      ctx.font = `600 10.5px ${t.mono}`;
      ctx.fillStyle = alpha(t.muted, 0.75);
      items.forEach(q => {
        ctx.textAlign = q.x === 'left' ? 'left' : 'right';
        ctx.textBaseline = q.y === 'top' ? 'top' : 'bottom';
        const x = q.x === 'left' ? a.left + 8 : a.right - 8;
        const y = q.y === 'top' ? a.top + 8 : a.bottom - 8;
        ctx.fillText(q.text.toUpperCase(), x, y);
      });
      ctx.restore();
    }
  };

  const scaleBase = (t, extra) => Object.assign({
    grid: { color: t.grid, drawTicks: false, tickLength: 0 },
    border: { display: false },
    ticks: { padding: 6 }
  }, extra || {});

  /* Build a Chart.js line config from compact spec */
  function lineConfig(spec) {
    const t = T();
    const xLinear = spec.xType === 'linear';
    const datasets = spec.series.map((s, i) => {
      const color = s.color || t.series[i % t.series.length];
      const ds = {
        label: s.label, data: xLinear ? s.data.map((v, j) => ({ x: spec.labels[j], y: v })) : s.data, borderColor: color, backgroundColor: s.fill ? alpha(color, spec.stacked ? 0.78 : 0.14) : color,
        fill: s.fill ? (spec.stacked ? (i === 0 ? 'origin' : '-1') : 'origin') : false,
        borderWidth: s.width || 2.2, borderDash: s.dash || undefined, pointRadius: s.points != null ? s.points : (s.data.length <= 12 ? 3 : 0),
        pointBackgroundColor: color, yAxisID: s.axis || 'y', spanGaps: true, order: s.order
      };
      if (spec.projectionIndex != null) {
        ds.segment = { borderDash: ctx => (ctx.p1DataIndex >= spec.projectionIndex ? [5, 4] : undefined) };
      }
      if (spec.stacked && s.fill) { ds.borderWidth = 1; ds.borderColor = alpha(t.bg, 0.6); ds.backgroundColor = alpha(color, 0.85); }
      return ds;
    });
    const yFmt = spec.yFmt || fmt.num;
    const scales = {
      x: scaleBase(t, { grid: { display: false }, type: xLinear ? 'linear' : 'category',
        min: xLinear ? spec.labels[0] : undefined, max: xLinear ? spec.labels[spec.labels.length - 1] : undefined,
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: spec.xTicks || 10, callback: xLinear ? (v => String(v)) : undefined, stepSize: spec.xStep } }),
      y: scaleBase(t, { stacked: !!spec.stacked, min: spec.yMin, max: spec.yMax, suggestedMax: spec.ySuggestedMax, type: spec.yLog ? 'logarithmic' : 'linear',
        ticks: { callback: v => (spec.yLog ? (isPow10(v) ? yFmt(v) : '') : yFmt(v)), maxTicksLimit: 7 },
        title: spec.yTitle ? { display: true, text: spec.yTitle, font: { size: 10.5 }, color: t.muted } : undefined })
    };
    if (spec.y2) {
      scales.y2 = scaleBase(t, { position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: v => (spec.y2.fmt || fmt.num)(v), maxTicksLimit: 7 }, min: spec.y2.min, max: spec.y2.max,
        title: spec.y2.title ? { display: true, text: spec.y2.title, font: { size: 10.5 }, color: t.muted } : undefined });
    }
    if (spec.xMin != null) scales.x.min = spec.xMin;
    if (spec.xMax != null) scales.x.max = spec.xMax;
    const plugins = {
      legend: { display: spec.legend !== false && spec.series.length > 1 },
      tooltip: { callbacks: { title: items => String(xLinear ? items[0].parsed.x : items[0].label), label: c => ` ${c.dataset.label}: ${(c.dataset.yAxisID === 'y2' && spec.y2 ? (spec.y2.fmt || fmt.num) : yFmt)(c.parsed.y)}` } },
      refLines: { lines: spec.refLines || [] }
    };
    if (spec.stacked && spec.tooltipTotal) {
      plugins.tooltip.callbacks.footer = items => 'Total: ' + yFmt(items.reduce((s, it) => s + (it.parsed.y || 0), 0));
    }
    return { type: spec.type || 'line', data: { labels: spec.labels, datasets }, options: { responsive: true, maintainAspectRatio: false, scales, plugins, interaction: spec.interaction || { mode: 'index', intersect: false } } };
  }

  function barConfig(spec) {
    const t = T();
    const horizontal = spec.horizontal !== false;
    const datasets = spec.series.map((s, i) => ({
      label: s.label, data: s.data,
      backgroundColor: s.colors || alpha(s.color || t.series[i % t.series.length], 0.9),
      borderColor: s.color || t.series[i % t.series.length], borderWidth: 0, maxBarThickness: spec.barMax || 28, categoryPercentage: 0.72, barPercentage: 0.9
    }));
    const vFmt = spec.vFmt || fmt.num;
    const valueAxis = scaleBase(t, { stacked: !!spec.stacked, min: spec.vMin, max: spec.vMax, type: spec.vLog ? 'logarithmic' : 'linear',
      ticks: { callback: v => (spec.vLog ? (isPow10(v) ? vFmt(v) : '') : vFmt(v)), maxTicksLimit: 7 }, grid: { color: t.grid } });
    const catAxis = scaleBase(t, { stacked: !!spec.stacked, grid: { display: false }, ticks: { autoSkip: false, font: { size: 11 } } });
    return {
      type: 'bar',
      data: { labels: spec.labels, datasets },
      options: {
        indexAxis: horizontal ? 'y' : 'x', responsive: true, maintainAspectRatio: false,
        layout: { padding: { right: horizontal && spec.valueLabels ? 44 : 0, top: !horizontal && spec.valueLabels ? 14 : 0 } },
        scales: horizontal ? { x: valueAxis, y: catAxis } : { x: catAxis, y: valueAxis },
        plugins: {
          legend: { display: spec.legend !== false && spec.series.length > 1 },
          tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${vFmt(horizontal ? c.parsed.x : c.parsed.y)}` } },
          refLines: { lines: spec.refLines || [] },
          valueLabels: { enabled: !!spec.valueLabels, fmt: vFmt }
        },
        interaction: { mode: 'nearest', axis: horizontal ? 'y' : 'x', intersect: false }
      }
    };
  }

  /* ------------------------------------------------------------ registry */
  const registry = new Map(); // panelId -> {chart, cfg, panel, canvas}
  const viewState = {};       // sectionId -> initialized boolean
  const simState = { p: 0.01, q: 0.4, K: 90, ref: true };

  function svgIcon(name) {
    const paths = {
      png: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
      csv: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
  }

  function panelShell(p, sectionId) {
    const cls = ['panel', p.size || '', p.tall ? 'tall' : '', p.stretch ? 'stretch' : ''].join(' ').trim();
    const actions = el('div', { class: 'panel-actions' });
    if (p.chart) {
      actions.appendChild(el('button', { type: 'button', title: 'Download CSV', 'aria-label': 'Download CSV', html: svgIcon('csv'), onclick: () => downloadCSV(p.id) }));
      actions.appendChild(el('button', { type: 'button', title: 'Download PNG', 'aria-label': 'Download PNG', html: svgIcon('png'), onclick: () => downloadPNG(p.id) }));
    }
    const head = el('div', { class: 'panel-head' }, [
      el('div', {}, [
        p.eyebrow ? el('p', { class: 'panel-eyebrow', text: p.eyebrow }) : null,
        el('h3', { class: 'panel-title', text: p.title }),
        p.sub ? el('p', { class: 'panel-sub', text: p.sub }) : null
      ]),
      actions
    ]);
    const body = el('div', { class: 'panel-body' });
    if (p.note) body.appendChild(el('p', { class: 'panel-note', html: p.note }));
    let canvas = null;
    if (p.chart) {
      canvas = el('canvas', { role: 'img', 'aria-label': p.title });
      body.appendChild(el('div', { class: 'chart-box' }, [canvas]));
    }
    const foot = el('div', { class: 'panel-foot' }, [p.approx ? el('span', { class: 'approx', text: '≈ approx.' }) : null, 'Source: ' + (p.source || '')]);
    const node = el('section', { class: cls, id: 'panel-' + p.id, 'data-section': sectionId }, [head, body, foot]);
    return { node, body, canvas };
  }

  function mountChart(p, canvas, sectionId) {
    const cfg = p.chart();
    cfg.options = cfg.options || {};
    cfg.options.plugins = cfg.options.plugins || {};
    const chart = new Chart(canvas, cfg);
    registry.set(p.id, { chart, cfg, panel: p, canvas, sectionId });
  }

  /* ------------------------------------------------------------ export */
  function downloadCSV(id) {
    const r = registry.get(id);
    if (!r) return;
    const data = r.chart.data;
    const rows = [];
    const esc = v => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const cell = v => (v == null ? '' : (typeof v === 'object' ? (v.y == null ? '' : v.y) : v));
    if (data.labels && data.labels.length) {
      rows.push(['label', ...data.datasets.map(d => d.label)].map(esc).join(','));
      data.labels.forEach((l, i) => rows.push([l, ...data.datasets.map(d => cell(d.data[i]))].map(esc).join(',')));
    } else {
      rows.push(['series', 'label', 'x', 'y', 'r'].map(esc).join(','));
      data.datasets.forEach(d => (d.data || []).forEach(pt => rows.push([d.label, pt.label || '', pt.x, pt.y, pt.r != null ? pt.r : ''].map(esc).join(','))));
    }
    rows.push('');
    rows.push(esc('Source: ' + (r.panel.source || '')));
    rows.push(esc('H Heuristics — 21st Century Dashboard, ' + D.meta.build));
    const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    triggerDownload(URL.createObjectURL(blob), slug(r.panel.title) + '.csv');
    toast('CSV downloaded');
  }

  function downloadPNG(id) {
    const r = registry.get(id);
    if (!r) return;
    const t = T();
    const src = r.chart.canvas;
    const dpr = window.devicePixelRatio || 1;
    const pad = 28 * dpr, headH = 74 * dpr, footH = 44 * dpr;
    const out = document.createElement('canvas');
    out.width = src.width + pad * 2;
    out.height = src.height + headH + footH + pad * 2;
    const c = out.getContext('2d');
    c.fillStyle = t.paper; c.fillRect(0, 0, out.width, out.height);
    c.fillStyle = t.accent; c.fillRect(0, 0, out.width, 4 * dpr);
    c.fillStyle = t.muted; c.font = `500 ${10 * dpr}px ${t.mono}`; c.textBaseline = 'top';
    c.fillText((r.panel.eyebrow || 'H HEURISTICS').toUpperCase(), pad, pad);
    c.fillStyle = t.ink; c.font = `600 ${19 * dpr}px ${t.serif}`;
    c.fillText(r.panel.title, pad, pad + 18 * dpr);
    if (r.panel.sub) { c.fillStyle = t.muted; c.font = `400 ${11.5 * dpr}px ${t.sans}`; c.fillText(r.panel.sub, pad, pad + 46 * dpr); }
    c.drawImage(src, pad, pad + headH);
    const fy = pad + headH + src.height + 12 * dpr;
    c.strokeStyle = t.grid; c.lineWidth = dpr; c.beginPath(); c.moveTo(pad, fy); c.lineTo(out.width - pad, fy); c.stroke();
    c.fillStyle = t.muted; c.font = `400 ${9.5 * dpr}px ${t.sans}`;
    c.fillText(truncate('Source: ' + (r.panel.source || ''), Math.floor((out.width - pad * 2) / (5.2 * dpr))), pad, fy + 8 * dpr);
    c.fillStyle = t.ink; c.font = `600 ${11 * dpr}px ${t.serif}`; c.textAlign = 'right';
    c.fillText('H Heuristics', out.width - pad, fy + 20 * dpr);
    c.fillStyle = t.muted; c.font = `500 ${8.5 * dpr}px ${t.mono}`;
    c.fillText('DATA · CLARITY · JUDGMENT', out.width - pad, fy + 34 * dpr);
    triggerDownload(out.toDataURL('image/png'), slug(r.panel.title) + '.png');
    toast('PNG downloaded');
  }

  const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
  const slug = s => 'hh-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
  function triggerDownload(href, name) { const a = el('a', { href, download: name }); document.body.appendChild(a); a.click(); a.remove(); }
  let toastTimer;
  function toast(msg) { const n = $('#toast'); n.textContent = msg; n.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => n.classList.remove('show'), 1800); }

  /* ------------------------------------------------------------ shared builders */
  const seriesFrom = (obj, opts) => Object.keys(obj).map((k, i) => Object.assign({ label: k, data: obj[k] }, opts ? opts(k, i) : {}));
  const sortedItems = (items, desc) => items.slice().sort((a, b) => (desc ? b[1] - a[1] : a[1] - b[1]));

  /* =============================================================================
     SECTIONS
  ============================================================================= */
  const SECTIONS = [
    /* ------------------------------------------------------------- 01 OVERVIEW */
    {
      id: 'overview', num: '01', nav: 'Overview',
      title: 'Nine systems, one coupled century.',
      lede: 'This dashboard tracks the forces that set the century’s slope: how technologies spread, whether poor countries catch up, who is being born where, how climate, pollution, conflict and inequality compound, who is exposed, how fast energy turns over, what AI does to all of it, and where the frontier is moving. <strong>Each panel carries its source. Each section closes on a binding term</strong>: a rule for reading that class of problem.',
      kpis: D.overview.kpis, kpiCols: 8,
      custom: 'signalBoard',
      panels: [
        {
          id: 'coupling', size: 'two-thirds', eyebrow: 'Polycrisis cascade', title: 'How the systems couple',
          sub: 'Transmission strength from the row system to the column system, 0–3. Hover a cell for the mechanism.',
          source: D.polycrisis.coupling.source, html: renderCouplingMatrix
        },
        {
          id: 'coupling-rank', size: 'third', stretch: true, eyebrow: 'Load-bearing systems', title: 'Who transmits, who absorbs',
          sub: 'Row and column sums of the coupling matrix', source: D.polycrisis.coupling.source,
          chart: () => {
            const c = D.polycrisis.coupling; const t = T();
            const out = c.matrix.map(r => r.reduce((s, v) => s + (v || 0), 0));
            const inn = c.domains.map((_, j) => c.matrix.reduce((s, r) => s + (r[j] || 0), 0));
            return barConfig({ labels: c.domains, series: [{ label: 'Transmits (row sum)', data: out, color: t.series[0] }, { label: 'Absorbs (column sum)', data: inn, color: t.series[2] }], vFmt: fmt.num0, vMin: 0, vMax: 21, barMax: 12 });
          }
        }
      ],
      binding: 'Read the century as a coupling problem, not a list of risks; the number that matters in any domain is the one that sets the slope in another, and that channel is usually fiscal or energetic.'
    },

    /* ------------------------------------------------------------- 02 DIFFUSION */
    {
      id: 'diffusion', num: '02', nav: 'Diffusion',
      title: 'Cost curves close globally; adoption curves close locally.',
      lede: 'Technology now reaches the first adopter faster than at any point in history and the median household on a schedule set by electricity, credit and institutions, not by price. <strong>The gap between a world price and a national system is the diffusion problem.</strong>',
      kpis: D.diffusion.kpis,
      panels: [
        {
          id: 'adoption-lag', size: 'half', tall: true, eyebrow: 'Diffusion speed', title: 'Years from introduction to half of US households',
          sub: 'Consumer technologies, ordered by year of introduction', source: D.diffusion.adoptionLag.source, approx: true,
          chart: () => {
            const a = D.diffusion.adoptionLag; const t = T();
            const items = a.items;
            return barConfig({
              labels: items.map(i => `${i[0]} (${i[1]})`), series: [{ label: 'Years to 50 %', data: items.map(i => i[2]), colors: items.map(i => (i[1] >= 2000 ? t.accent : alpha(t.series[2], 0.85))) }],
              vFmt: v => v + ' yrs', valueLabels: true, vMin: 0, vMax: 80, legend: false
            });
          }
        },
        {
          id: 's-curves', size: 'half', tall: true, eyebrow: 'Global S-curves', title: 'Four diffusion curves, one century',
          sub: 'World, 2000–2024. Internet and mobile broadband are per population; solar + wind is share of electricity; EVs are share of new car sales.',
          source: D.diffusion.sCurves.source, approx: true,
          chart: () => {
            const s = D.diffusion.sCurves;
            return lineConfig({ labels: s.years, series: seriesFrom(s.series), yFmt: fmt.pct0, yMin: 0, yMax: 100, interaction: { mode: 'index', intersect: false } });
          }
        },
        {
          id: 'bass', size: 'full', eyebrow: 'Interactive', title: 'Bass diffusion simulator with a capital-constrained ceiling',
          sub: 'Innovation (p), imitation (q) and the carrying capacity K set by complementary capital. Compare against the empirical internet curve.',
          source: 'Bass (1969) mixed-influence model; H Heuristics capital-constrained ceiling. Reference curve: ITU internet users, world, 1995–2024.',
          html: renderBassSimulator
        },
        {
          id: 'two-margin', size: 'full', eyebrow: 'Two-margin diffusion', title: 'Extensive presence vs intensive occupation, 2024',
          sub: 'A technology is present almost everywhere; it occupies a system in few places. Intensive thresholds: solar ≥ 5 % of electricity with access ≥ 80 %, wind ≥ 5 %, EVs ≥ 15 % of new car sales.',
          source: D.diffusion.twoMargin.source, approx: true, html: renderTwoMargin
        }
      ],
      binding: 'Treat a technology’s global cost curve as a traded-goods event and its national adoption curve as a complementary-capital event; the gap between the two is the diffusion problem, not the price.'
    },

    /* ------------------------------------------------------------- 03 CONVERGENCE */
    {
      id: 'convergence', num: '03', nav: 'Convergence',
      title: 'Convergence is real, and it is mostly one industrialiser.',
      lede: 'Emerging economies’ share of world output rose 16 points since 2000; strip out China and the gain is four. <strong>Catch-up happens where income, productivity, technology adoption and structural change close together</strong>, which is a short list of countries.',
      kpis: D.convergence.kpis,
      panels: [
        {
          id: 'rel-income', size: 'two-thirds', tall: true, eyebrow: 'Catch-up', title: 'GDP per capita as a share of the United States, PPP',
          sub: '2000–2024, %. Click legend entries to add or remove economies.', source: D.convergence.relativeIncome.source, approx: true,
          chart: () => {
            const r = D.convergence.relativeIncome; const t = T();
            const names = Object.keys(r.series);
            const palette = [t.series[0], t.series[2], t.series[4], t.series[3], t.series[5], t.series[6], t.series[7], t.series[1], t.caution, t.positive, t.negative];
            const cfg = lineConfig({ labels: r.years, series: names.map((n, i) => ({ label: n, data: r.series[n], color: palette[i % palette.length], points: 0 })), yFmt: fmt.pct0, yMin: 0, yMax: 80 });
            cfg.data.datasets.forEach(ds => { ds.hidden = !r.defaultOn.includes(ds.label); });
            return cfg;
          }
        },
        {
          id: 'china-wedge', size: 'third', tall: true, eyebrow: 'The China wedge', title: 'EMDE share of world GDP, with and without China',
          sub: 'PPP, %, 2000–2024', source: D.convergence.chinaWedge.source, approx: true,
          chart: () => {
            const w = D.convergence.chinaWedge; const t = T();
            return lineConfig({ labels: w.years, series: [
              { label: 'EMDEs incl. China', data: w.series['EMDEs incl. China'], color: t.series[0], fill: true },
              { label: 'EMDEs excl. China', data: w.series['EMDEs excl. China'], color: t.series[2], fill: true },
              { label: 'China alone', data: w.series['China alone'], color: t.series[3], dash: [4, 3] }
            ], yFmt: fmt.pct0, yMin: 0, yMax: 70 });
          }
        },
        {
          id: 'four-clocks', size: 'full', eyebrow: 'Four clocks', title: 'Did income, productivity, technology and structure close together?',
          sub: 'Catch-up is a joint-occupation test, not a single slope. Latest available year, 2022–2024.', source: D.convergence.fourClocks.source, approx: true, html: renderFourClocks
        }
      ],
      binding: 'Weight any emerging-market convergence headline by what it looks like without China; a bloc average that is one industrialiser is a description of that industrialiser, not of the bloc.'
    },

    /* ------------------------------------------------------------- 04 DEMOGRAPHY */
    {
      id: 'demography', num: '04', nav: 'Demography',
      title: 'The 2060 composition is already in the 2025 maternity ward.',
      lede: 'Fertility has fallen below replacement across most of the world’s output while births concentrate in Africa and, within the United States, in Hispanic, Asian and multiracial cohorts. <strong>Composition shifts are slow, cohort-driven and effectively locked a generation ahead.</strong>',
      kpis: D.demography.kpis,
      panels: [
        {
          id: 'us-comp', size: 'two-thirds', tall: true, eyebrow: 'United States', title: 'Racial and ethnic composition, 2000–2060',
          sub: 'Share of population, %. Dashed segments are Census Bureau projections (main series).', source: D.demography.usComposition.source, approx: true,
          chart: () => {
            const u = D.demography.usComposition; const t = T();
            const colors = [t.series[2], t.series[0], t.series[1], t.series[4], t.series[3]];
            const idx = u.years.indexOf(u.projectionStart);
            return lineConfig({ labels: u.years, series: seriesFrom(u.series, (k, i) => ({ color: colors[i], fill: true, points: 2 })), stacked: true, yFmt: fmt.pct0, yMin: 0, yMax: 100, projectionIndex: idx, tooltipTotal: true,
              refLines: [{ axis: 'x', value: idx - 0.5, label: 'Projection →', color: t.muted }] });
          }
        },
        {
          id: 'us-gap', size: 'third', tall: true, eyebrow: 'Generation gap', title: 'The US by age band, 2023',
          sub: 'Composition within each age group, %', source: D.demography.usGenerationGap.source, approx: true,
          chart: () => {
            const g = D.demography.usGenerationGap; const t = T();
            const colors = [t.series[2], t.series[0], t.series[1], t.series[4], t.series[3]];
            return barConfig({ labels: g.groups, series: seriesFrom(g.series, (k, i) => ({ color: colors[i] })), stacked: true, horizontal: false, vFmt: fmt.pct0, vMin: 0, vMax: 100, barMax: 60 });
          }
        },
        {
          id: 'world-regions', size: 'half', tall: true, eyebrow: 'World', title: 'Population by region, 1950–2100',
          sub: 'Billions, UN medium variant. Africa passes Europe + the Americas combined before 2050.', source: D.demography.worldRegions.source,
          chart: () => {
            const w = D.demography.worldRegions; const t = T();
            const colors = [t.series[0], t.series[2], t.series[3], t.series[4], t.series[5], t.series[6]];
            return lineConfig({ labels: w.years, series: seriesFrom(w.series, (k, i) => ({ color: colors[i], fill: true, points: 0 })), stacked: true, yFmt: fmt.bn, yMin: 0, yMax: 11, tooltipTotal: true, projectionIndex: 4,
              refLines: [{ axis: 'x', value: 3, label: '2025', color: t.muted }] });
          }
        },
        {
          id: 'tfr', size: 'half', tall: true, eyebrow: 'Fertility', title: 'Total fertility rate, 2024',
          sub: 'Children per woman; replacement ≈ 2.1', source: D.demography.tfr.source,
          chart: () => {
            const items = sortedItems(D.demography.tfr.items, false); const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'TFR', data: items.map(i => i[1]), colors: items.map(i => (i[0] === 'World' ? t.ink : i[1] < 2.1 ? alpha(t.accent, 0.88) : alpha(t.series[2], 0.85))) }],
              vFmt: v => nf.format(v), vMin: 0, vMax: 7, valueLabels: true, legend: false, barMax: 16, refLines: [{ axis: 'x', value: 2.1, label: 'Replacement 2.1', color: t.ink2, dash: [3, 3] }] });
          }
        },
        {
          id: 'median-age', size: 'full', eyebrow: 'Age structure', title: 'Median age, 2025',
          sub: 'Years. A 35-year spread between Niger and Japan.', source: D.demography.medianAge.source,
          chart: () => {
            const items = D.demography.medianAge.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'Median age', data: items.map(i => i[1]), colors: items.map(i => (i[0] === 'World' ? t.ink : i[1] < 30 ? alpha(t.series[4], 0.9) : i[1] < 40 ? alpha(t.series[2], 0.9) : alpha(t.accent, 0.88))) }],
              horizontal: false, vFmt: v => nf.format(v), vMin: 0, vMax: 55, valueLabels: true, legend: false, barMax: 44 });
          }
        }
      ],
      binding: 'Read racial and ethnic composition as a cohort pipeline, not a snapshot; the 2060 share is set by births already recorded, and the policy-relevant variable is the age band, not the national total.'
    },

    /* ------------------------------------------------------------- 05 POLYCRISIS */
    {
      id: 'polycrisis', num: '05', nav: 'Polycrisis',
      title: 'Crises compound through shared systems, not in parallel.',
      lede: 'Warming, dirty air, armed conflict and poverty are each at or near record levels on their own measures. <strong>The analytical object is the coupling between them</strong>: the channel, usually fiscal or energetic, through which stress in one system sets the slope in another.',
      kpis: D.polycrisis.kpis,
      panels: [
        {
          id: 'climate-dual', size: 'two-thirds', tall: true, eyebrow: 'Climate', title: 'Temperature anomaly and fossil CO₂ emissions',
          sub: '°C above 1850–1900 (left) and GtCO₂ per year (right)', source: D.polycrisis.temperature.source + ' ' + D.polycrisis.emissions.source, approx: true,
          chart: () => {
            const tp = D.polycrisis.temperature, em = D.polycrisis.emissions; const t = T();
            const years = tp.years;
            const emMap = Object.fromEntries(em.years.map((y, i) => [y, em.values[i]]));
            return lineConfig({ labels: years, series: [
              { label: 'Temperature anomaly (°C)', data: tp.values, color: t.accent, fill: true, points: 2 },
              { label: 'Fossil CO₂ (Gt/yr)', data: years.map(y => emMap[y] != null ? emMap[y] : null), color: t.series[1], axis: 'y2', dash: [5, 3], points: 3 }
            ], xType: 'linear', xStep: 5, yFmt: v => v.toFixed(1) + ' °C', yMin: 0, yMax: 1.8, y2: { fmt: fmt.gt, min: 0, max: 40 },
              refLines: [{ axis: 'y', value: 1.5, label: 'Paris 1.5 °C', color: t.ink2, position: 'left' }] });
          }
        },
        {
          id: 'co2', size: 'third', tall: true, eyebrow: 'Atmosphere', title: 'Atmospheric CO₂, Mauna Loa',
          sub: 'Annual mean, ppm, 1960–2024', source: D.polycrisis.co2ppm.source,
          chart: () => {
            const c = D.polycrisis.co2ppm; const t = T();
            return lineConfig({ labels: c.years, series: [{ label: 'CO₂', data: c.values, color: t.series[2], fill: true, points: 3 }], xType: 'linear', xStep: 10, yFmt: fmt.num0, yMin: 300, yMax: 440, legend: false,
              refLines: [{ axis: 'y', value: 350, label: '350 ppm', color: t.muted, position: 'left' }] });
          }
        },
        {
          id: 'conflict', size: 'half', eyebrow: 'Conflict and displacement', title: 'Armed conflicts and people forcibly displaced',
          sub: 'State-based conflicts (left) and millions displaced at year-end (right)', source: D.polycrisis.conflicts.source + ' ' + D.polycrisis.displaced.source,
          chart: () => {
            const c = D.polycrisis.conflicts, d = D.polycrisis.displaced; const t = T();
            const years = c.years;
            const dMap = Object.fromEntries(d.years.map((y, i) => [y, d.values[i]]));
            return lineConfig({ labels: years, series: [
              { label: 'State-based conflicts', data: c.values, color: t.accent, points: 3 },
              { label: 'Forcibly displaced (m)', data: years.map(y => dMap[y] != null ? dMap[y] : null), color: t.series[2], axis: 'y2', fill: true, points: 3 }
            ], xType: 'linear', xStep: 2, yFmt: fmt.num0, yMin: 0, yMax: 70, y2: { fmt: fmt.m, min: 0, max: 140 } });
          }
        },
        {
          id: 'poverty', size: 'half', eyebrow: 'Poverty', title: 'Extreme poverty is still falling, but the slope has flattened',
          sub: 'Share of world population below $2.15 / day, %. Dashed: nowcast and projection.', source: D.polycrisis.poverty.source, approx: true,
          chart: () => {
            const p = D.polycrisis.poverty; const t = T();
            const idx = p.years.indexOf(p.projectionStart);
            return lineConfig({ labels: p.years, series: [{ label: 'Extreme poverty rate', data: p.values, color: t.series[0], fill: true, points: 3 }], xType: 'linear', xStep: 5, yFmt: fmt.pct0, yMin: 0, yMax: 40, legend: false, projectionIndex: idx,
              refLines: [{ axis: 'y', value: 3, label: 'SDG 1 target: 3 % by 2030', color: t.ink2, position: 'left' }] });
          }
        },
        {
          id: 'inequality', size: 'third', eyebrow: 'Inequality', title: 'Who holds global income and wealth',
          sub: 'Share by global population decile group, 2021, %', source: D.polycrisis.inequality.source,
          chart: () => {
            const q = D.polycrisis.inequality; const t = T();
            const colors = [t.series[4], t.series[2], t.accent];
            return barConfig({ labels: ['Income', 'Wealth'], series: q.groups.map((g, i) => ({ label: g, data: [q.income[i], q.wealth[i]], color: colors[i] })), stacked: true, horizontal: false, vFmt: fmt.pct0, vMin: 0, vMax: 100, barMax: 90 });
          }
        },
        {
          id: 'pm25', size: 'two-thirds', eyebrow: 'Pollution', title: 'Population-weighted PM₂.₅ by region',
          sub: 'µg/m³, 2023. WHO guideline 5; interim target 1 is 35.', source: D.polycrisis.pm25.source, approx: true,
          chart: () => {
            const p = D.polycrisis.pm25; const t = T();
            const items = sortedItems(p.items, true);
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'PM₂.₅', data: items.map(i => i[1]), colors: items.map(i => (i[1] >= 35 ? alpha(t.accent, 0.9) : i[1] >= 15 ? alpha(t.series[6], 0.9) : alpha(t.series[4], 0.9))) }],
              vFmt: v => nf.format(v) + ' µg/m³', vMin: 0, vMax: 60, valueLabels: true, legend: false, barMax: 20,
              refLines: [{ axis: 'x', value: 5, label: 'WHO 5', color: t.positive }, { axis: 'x', value: 35, label: 'IT-1 35', color: t.accent }] });
          }
        }
      ],
      binding: 'Score crises by their coupling coefficients, not their individual severity; the cascade runs through the weakest shared system, which in most of the exposed world is fiscal capacity.'
    },

    /* ------------------------------------------------------------- 06 EXPOSURE */
    {
      id: 'exposure', num: '06', nav: 'Exposure',
      title: 'Exposure is an integral over people and years.',
      lede: 'Nearly everyone breathes air above the WHO guideline, half of humanity faces severe water scarcity for part of the year, and the hottest, fastest-growing populations have the least cooling capacity. <strong>Head-counts understate the damage because they ignore duration and the absence of a wire.</strong>',
      kpis: D.exposure.kpis,
      panels: [
        {
          id: 'exposure-stack', size: 'half', tall: true, eyebrow: 'Exposure ledger', title: 'People exposed, by hazard',
          sub: 'Billions, latest year. Categories overlap; the bars are not additive.', source: D.exposure.exposureStack.source,
          chart: () => {
            const items = D.exposure.exposureStack.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'People exposed', data: items.map(i => i[1]), colors: items.map((_, i) => alpha(t.accent, 0.95 - i * 0.08)) }],
              vFmt: v => nf.format(v) + ' bn', vMin: 0, vMax: 9, valueLabels: true, legend: false, barMax: 22, refLines: [{ axis: 'x', value: 8.2, label: 'World 8.2 bn', color: t.ink2, position: 'left' }] });
          }
        },
        {
          id: 'cooling-gap', size: 'half', tall: true, eyebrow: 'The cooling gap', title: 'Heat load vs cooling capacity',
          sub: 'Cooling degree days (x) against household air-conditioner ownership (y). Bubble area = population.', source: D.exposure.coolingGap.source, approx: true,
          chart: () => {
            const g = D.exposure.coolingGap; const t = T();
            const maxPop = Math.max(...g.items.map(i => i[3]));
            const place = { 'Japan': { align: 'left' }, 'South Korea': { align: 'left' }, 'Thailand': { align: 'left' }, 'India': { inside: true }, 'Pakistan': { align: 'left', dy: -6 }, 'Bangladesh': { align: 'left', dy: 6 },
              'DR Congo': { align: 'left', dy: 6 }, 'Philippines': { dy: -14 }, 'Nigeria': { dy: 9 }, 'Indonesia': { dy: -4 } };
            const pts = g.items.map(i => Object.assign({ x: i[1], y: i[2], r: 4 + 26 * Math.sqrt(i[3] / maxPop), label: i[0], pop: i[3] }, place[i[0]] || {}));
            const color = p => (p.x >= g.floors.cddHot && p.y < g.floors.acClub ? t.accent : p.y >= g.floors.acClub ? t.series[2] : t.series[4]);
            return {
              type: 'bubble',
              data: { datasets: [{ label: 'Countries', data: pts, backgroundColor: pts.map(p => alpha(color(p), 0.55)), borderColor: pts.map(p => color(p)), borderWidth: 1.2 }] },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                  x: scaleBase(t, { min: 0, max: 4000, title: { display: true, text: 'Cooling degree days per year (18 °C base)', color: t.muted, font: { size: 10.5 } }, ticks: { callback: v => nf0.format(v) } }),
                  y: scaleBase(t, { min: -5, max: 105, title: { display: true, text: 'Households with air conditioning, %', color: t.muted, font: { size: 10.5 } }, ticks: { callback: v => (v < 0 || v > 100 ? '' : v + ' %') } })
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { title: items => items[0].raw.label, label: c => [` CDD: ${nf0.format(c.raw.x)}`, ` AC ownership: ${c.raw.y} %`, ` Population: ${nf0.format(c.raw.pop)} m`] } },
                  refLines: { lines: [{ axis: 'x', value: g.floors.cddHot, color: t.muted, label: 'Hot ≥ 2,000 CDD' }, { axis: 'y', value: g.floors.acClub, color: t.muted, label: 'AC club ≥ 50 %', position: 'left' }] },
                  pointLabels: { enabled: true },
                  quadrants: { items: [{ x: 'right', y: 'bottom', text: 'Cooling gap' }, { x: 'right', y: 'top', text: 'AC club' }, { x: 'left', y: 'top', text: 'Temperate, wired' }] }
                },
                interaction: { mode: 'nearest', intersect: true }
              }
            };
          }
        },
        {
          id: 'heat-niche', size: 'half', eyebrow: 'Habitability', title: 'Share of humanity outside the human climate niche by 2100',
          sub: 'Mean annual temperature ≥ 29 °C, by warming pathway, % of projected population', source: D.exposure.heatNiche.source,
          chart: () => {
            const items = D.exposure.heatNiche.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'Share outside niche', data: items.map(i => i[1]), colors: [alpha(t.series[2], 0.9), alpha(t.series[4], 0.9), alpha(t.accent, 0.9), alpha(t.accent, 0.6)] }],
              horizontal: false, vFmt: fmt.pct0, vMin: 0, vMax: 45, valueLabels: true, legend: false, barMax: 70 });
          }
        },
        {
          id: 'heat-labour', size: 'half', eyebrow: 'Labour', title: 'Potential labour hours lost to heat, by sector, 2023',
          sub: 'Billions of hours. Agriculture carries two-thirds of the loss.', source: D.exposure.heatLabour.source,
          chart: () => {
            const items = D.exposure.heatLabour.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'Hours lost', data: items.map(i => i[1]), colors: [alpha(t.accent, 0.9), alpha(t.series[3], 0.9), alpha(t.series[2], 0.9), alpha(t.series[4], 0.9)] }],
              vFmt: v => nf0.format(v) + ' bn h', vMin: 0, vMax: 400, valueLabels: true, legend: false, barMax: 26 });
          }
        }
      ],
      binding: 'Treat exposure as a cumulative integral over people and years, not an annual head-count; the damage is set by how long a population sits in the hazard and by whether a wire reaches them before it does.'
    },

    /* ------------------------------------------------------------- 07 TRANSITION */
    {
      id: 'transition', num: '07', nav: 'Clean transition',
      title: 'Clean capital now outspends fossil capital two to one. Tonnes lag the mix.',
      lede: 'Solar and wind supply 15 % of global electricity and clean investment reached $2.2 trillion, yet fossil generation is still 59 % and emissions set a record in 2024. <strong>The transition is a mix event in most countries and a tonne event in few.</strong>',
      kpis: D.transition.kpis,
      panels: [
        {
          id: 'investment', size: 'half', eyebrow: 'Capital', title: 'Energy investment, clean vs fossil',
          sub: 'USD trillion, 2015–2025e', source: D.transition.investment.source, approx: true,
          chart: () => {
            const v = D.transition.investment; const t = T();
            return lineConfig({ labels: v.years, series: [{ label: 'Clean energy', data: v.series['Clean energy'], color: t.positive, fill: true, points: 3 }, { label: 'Fossil fuels', data: v.series['Fossil fuels'], color: t.series[1], points: 3 }],
              xType: 'linear', xStep: 1, yFmt: fmt.usdT, yMin: 0, yMax: 2.5, projectionIndex: v.years.indexOf(v.projectionStart) });
          }
        },
        {
          id: 'mix', size: 'half', eyebrow: 'Electricity', title: 'Global generation mix',
          sub: 'Share of electricity, %, 2010–2024', source: D.transition.mix.source,
          chart: () => {
            const m = D.transition.mix; const t = T();
            return lineConfig({ labels: m.years, series: [
              { label: 'Fossil', data: m.series['Fossil'], color: t.series[1], fill: true, points: 0 },
              { label: 'Hydro, nuclear, other', data: m.series['Hydro, nuclear, other'], color: t.series[2], fill: true, points: 0 },
              { label: 'Solar + wind', data: m.series['Solar + wind'], color: t.caution, fill: true, points: 0 }
            ], stacked: true, xType: 'linear', xStep: 2, yFmt: fmt.pct0, yMin: 0, yMax: 100, tooltipTotal: false });
          }
        },
        {
          id: 'share-sync', size: 'full', tall: true, eyebrow: 'Share-sync', title: 'Solar + wind share against fossil share, by grid, 2024',
          sub: 'Bubble area = electricity generation. Share-sync requires the power clock (≥ 8 % solar + wind) and the fossil-exit clock (≤ 55 % fossil) on the same grid; deep exit is ≤ 40 % fossil.',
          source: D.transition.shareSync.source, approx: true,
          chart: () => {
            const s = D.transition.shareSync; const t = T();
            const maxG = Math.max(...s.items.map(i => i[3]));
            const place = { 'Spain': { align: 'left' }, 'Kenya': { align: 'left' }, 'Brazil': { align: 'left' }, 'European Union': { align: 'left' }, 'China': { inside: true }, 'United States': { dy: 10 },
              'Turkey': { dy: 10, align: 'left' }, 'Indonesia': { dy: -6 }, 'Nigeria': { dy: 7 }, 'Ethiopia': { dy: -8 }, 'Viet Nam': { align: 'left' } };
            const pts = s.items.map(i => Object.assign({ x: i[1], y: i[2], r: 4 + 30 * Math.sqrt(i[3] / maxG), label: i[0], twh: i[3] }, place[i[0]] || {}));
            const cell = p => (p.x >= s.lines.power && p.y <= s.lines.fossilExit) ? 'sync' : p.x >= s.lines.power ? 'power' : p.y <= s.lines.fossilExit ? 'exit' : 'none';
            const colorOf = { sync: t.positive, power: t.caution, exit: t.series[2], none: t.accent };
            return {
              type: 'bubble',
              data: { datasets: [{ label: 'Grids', data: pts, backgroundColor: pts.map(p => alpha(colorOf[cell(p)], 0.5)), borderColor: pts.map(p => colorOf[cell(p)]), borderWidth: 1.2 }] },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                  x: scaleBase(t, { min: -2, max: 50, title: { display: true, text: 'Solar + wind, % of generation', color: t.muted, font: { size: 10.5 } }, ticks: { callback: v => (v < 0 ? '' : v + ' %') } }),
                  y: scaleBase(t, { min: -5, max: 105, reverse: false, title: { display: true, text: 'Fossil, % of generation', color: t.muted, font: { size: 10.5 } }, ticks: { callback: v => (v < 0 || v > 100 ? '' : v + ' %') } })
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { title: items => items[0].raw.label, label: c => [` Solar + wind: ${c.raw.x} %`, ` Fossil: ${c.raw.y} %`, ` Generation: ${nf0.format(c.raw.twh)} TWh`, ` Cell: ${({ sync: 'Share-sync', power: 'Power-ahead', exit: 'Exit-ahead', none: 'Neither clock' })[cell(c.raw)]}`] } },
                  refLines: { lines: [{ axis: 'x', value: s.lines.power, color: t.muted, label: 'Power clock 8 %' }, { axis: 'y', value: s.lines.fossilExit, color: t.muted, label: 'Fossil-exit 55 %', position: 'left' }, { axis: 'y', value: s.lines.deepExit, color: t.positive, dash: [2, 3], label: 'Deep exit 40 %', position: 'left' }] },
                  pointLabels: { enabled: true },
                  quadrants: { items: [{ x: 'right', y: 'bottom', text: 'Share-sync' }, { x: 'right', y: 'top', text: 'Power-ahead' }, { x: 'left', y: 'bottom', text: 'Exit-ahead (hydro / nuclear)' }, { x: 'left', y: 'top', text: 'Neither clock' }] }
                },
                interaction: { mode: 'nearest', intersect: true }
              }
            };
          }
        },
        {
          id: 'costs', size: 'third', eyebrow: 'Wright’s law', title: 'Solar module and battery pack prices',
          sub: 'Log scale. $/W (left) and $/kWh (right), 2010–2024', source: D.transition.costs.source, approx: true,
          chart: () => {
            const c = D.transition.costs; const t = T();
            const cfg = lineConfig({ labels: c.years, series: [{ label: 'Solar module ($/W)', data: c.solar, color: t.caution, points: 3 }, { label: 'Battery pack ($/kWh)', data: c.battery, color: t.series[2], points: 3, axis: 'y2' }],
              yFmt: v => '$' + v, yLog: true, yMin: 0.05, yMax: 5, y2: { fmt: v => '$' + nf0.format(v), min: 50, max: 2000 } });
            cfg.options.scales.y2.type = 'logarithmic';
            cfg.options.scales.y2.ticks.callback = v => (isPow10(v) || [200, 500, 2000].includes(v) ? '$' + nf0.format(v) : '');
            return cfg;
          }
        },
        {
          id: 'ev', size: 'third', eyebrow: 'Transport', title: 'Electric car sales',
          sub: 'Millions, BEV + PHEV, 2016–2025e', source: D.transition.evSales.source,
          chart: () => {
            const e = D.transition.evSales; const t = T();
            return barConfig({ labels: e.years, series: [{ label: 'EV sales (m)', data: e.values, colors: e.values.map((_, i) => (e.years[i] >= e.projectionStart ? alpha(t.positive, 0.45) : alpha(t.positive, 0.9))) }],
              horizontal: false, vFmt: v => nf.format(v) + ' m', vMin: 0, vMax: 24, valueLabels: true, legend: false, barMax: 34 });
          }
        },
        {
          id: 'access', size: 'third', eyebrow: 'Access floor', title: 'People without electricity and clean cooking',
          sub: 'Millions, 2010–2023. The access clock is closing far slower than the cost clock.', source: D.transition.access.source,
          chart: () => {
            const a = D.transition.access; const t = T();
            return lineConfig({ labels: a.years, series: [{ label: 'Without clean cooking', data: a.series['Without clean cooking'], color: t.series[3], fill: true, points: 3 }, { label: 'Without electricity', data: a.series['Without electricity'], color: t.accent, fill: true, points: 3 }],
              xType: 'linear', xStep: 2, yFmt: fmt.m, yMin: 0, yMax: 3200 });
          }
        }
      ],
      binding: 'Read a generation-share headline against the fossil share on the same grid; additions that do not retire a fossil megawatt-hour are a mix event, not a tonne event.'
    },

    /* ------------------------------------------------------------- 08 AI */
    {
      id: 'ai', num: '08', nav: 'AI & technology',
      title: 'AI arrives as electricity demand before it arrives as productivity.',
      lede: 'Training compute, capital and adoption are compounding at rates no previous general-purpose technology matched, while data-centre demand is on course to double by 2030. <strong>Whether a country converts the load into a lever depends on the stack already in place.</strong>',
      kpis: D.ai.kpis,
      panels: [
        {
          id: 'compute', size: 'two-thirds', tall: true, eyebrow: 'Frontier compute', title: 'Training compute of notable models',
          sub: 'FLOP, log scale, 2012–2025. Roughly a billion-fold increase in thirteen years.', source: D.ai.compute.source, approx: true,
          chart: () => {
            const c = D.ai.compute; const t = T();
            const pts = c.items.map(i => ({ x: i[1], y: i[2], label: i[0], align: ['AlphaGo Zero', 'BERT-Large', 'AlphaFold 2'].includes(i[0]) ? 'left' : 'right', dy: i[0] === 'AlphaFold 2' ? 6 : i[0] === 'Llama 3.1 405B' ? 8 : 0 }));
            return {
              type: 'scatter',
              data: { datasets: [{ label: 'Models', data: pts, backgroundColor: alpha(t.accent, 0.85), borderColor: t.accent, pointRadius: 5, pointHoverRadius: 7, showLine: false }] },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                  x: scaleBase(t, { type: 'linear', min: 2012, max: 2026, ticks: { stepSize: 2, callback: v => String(v) }, grid: { display: false } }),
                  y: scaleBase(t, { type: 'logarithmic', min: 1e17, max: 1e27, ticks: { callback: v => (isPow10(v) ? '10' + sup(Math.round(Math.log10(v))) : ''), font: { family: t.mono } } })
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { title: items => items[0].raw.label, label: c => [` Year: ${Math.floor(c.raw.x)}`, ` Training compute: ${fmt.sci(c.raw.y)} FLOP`] } },
                  pointLabels: { enabled: true },
                  refLines: { lines: [{ axis: 'y', value: 1e25, color: t.muted, label: '10²⁵ FLOP — EU AI Act systemic-risk threshold', position: 'left' }] }
                },
                interaction: { mode: 'nearest', intersect: true }
              }
            };
          }
        },
        {
          id: 'ai-invest', size: 'third', tall: true, eyebrow: 'Capital', title: 'Global corporate investment in AI',
          sub: 'USD billion, 2013–2024', source: D.ai.investment.source, approx: true,
          chart: () => {
            const v = D.ai.investment; const t = T();
            return barConfig({ labels: v.years, series: [{ label: 'AI investment', data: v.values, color: t.series[2] }], horizontal: false, vFmt: fmt.usdB, vMin: 0, vMax: 300, legend: false, barMax: 22 });
          }
        },
        {
          id: 'datacentre', size: 'third', eyebrow: 'Load', title: 'Data-centre electricity demand',
          sub: 'TWh, 2015–2030 (IEA base case). Dashed: projection.', source: D.ai.datacentre.source, approx: true,
          chart: () => {
            const d = D.ai.datacentre; const t = T();
            return lineConfig({ labels: d.years, series: [{ label: 'Data centres', data: d.values, color: t.accent, fill: true, points: 3 }], xType: 'linear', xStep: 3, yFmt: fmt.twh, yMin: 0, yMax: 1000, legend: false, projectionIndex: d.years.indexOf(d.projectionStart),
              refLines: [{ axis: 'y', value: 415, label: '2024: ≈ 1.5 % of global electricity', color: t.muted, position: 'left' }] });
          }
        },
        {
          id: 'adoption', size: 'third', eyebrow: 'Adoption', title: 'Organisations using AI',
          sub: 'Share of surveyed organisations, %, 2017–2025', source: D.ai.adoption.source,
          chart: () => {
            const a = D.ai.adoption; const t = T();
            return lineConfig({ labels: a.years, series: [{ label: 'Any AI', data: a.series['Any AI'], color: t.series[2], points: 3 }, { label: 'Generative AI', data: a.series['Generative AI'], color: t.accent, points: 3 }], yFmt: fmt.pct0, yMin: 0, yMax: 100 });
          }
        },
        {
          id: 'inference', size: 'third', eyebrow: 'Cost', title: 'Inference cost at GPT-3.5 performance',
          sub: 'USD per million tokens, log scale', source: D.ai.inferenceCost.source, approx: true,
          chart: () => {
            const c = D.ai.inferenceCost; const t = T();
            return lineConfig({ labels: c.points.map(p => p[0]), series: [{ label: '$ / m tokens', data: c.points.map(p => p[1]), color: t.positive, points: 4 }], yFmt: v => '$' + v, yLog: true, yMin: 0.01, yMax: 100, legend: false });
          }
        },
        {
          id: 'ai-clocks', size: 'full', eyebrow: 'Load-before-lever', title: 'Three AI-transition clocks',
          sub: 'Load capacity (surplus electrons), lever stack (internet plus an industrial process) and a clean kilowatt-hour. The cell names follow the H Heuristics glossary.',
          source: D.ai.clocks.source, approx: true, html: renderAiClocks
        }
      ],
      binding: 'Treat AI as electricity demand before treating it as a productivity technology; the ranking of countries is set by whether the complementary stack exists to turn the load into a lever.'
    },

    /* ------------------------------------------------------------- 09 FRONTIER */
    {
      id: 'frontier', num: '09', nav: 'Frontier',
      title: 'The cheap unit is the one whose downstream system already exists.',
      lede: 'Genomes, launches, modules, battery packs and tokens have each fallen in cost by two to six orders of magnitude. <strong>Cost collapse is a necessary condition; the complementary stock, from grids to clinics to clean electrons, decides where the frontier becomes a system.</strong>',
      kpis: D.frontier.kpis,
      panels: [
        {
          id: 'cost-curves', size: 'full', eyebrow: 'Cost collapse', title: 'Six frontier cost curves',
          sub: 'Log scale, each in its own unit. The caption shows the fall from first to last observation.', source: D.frontier.costCurves.source, approx: true, html: renderCostMultiples
        },
        {
          id: 'rd', size: 'half', tall: true, eyebrow: 'Inputs', title: 'R&D intensity',
          sub: 'Gross domestic expenditure on R&D, % of GDP, latest year', source: D.frontier.rd.source,
          chart: () => {
            const items = D.frontier.rd.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'R&D, % GDP', data: items.map(i => i[1]), colors: items.map(i => (i[0] === 'OECD average' ? t.ink : i[1] >= 2.5 ? alpha(t.accent, 0.88) : i[1] >= 1 ? alpha(t.series[2], 0.85) : alpha(t.series[3], 0.85))) }],
              vFmt: v => nf.format(v) + ' %', vMin: 0, vMax: 7, valueLabels: true, legend: false, barMax: 18 });
          }
        },
        {
          id: 'pct', size: 'half', tall: true, eyebrow: 'Outputs', title: 'PCT international patent applications, 2024',
          sub: 'Filings by origin. China overtook the United States in 2019.', source: D.frontier.pct.source,
          chart: () => {
            const items = D.frontier.pct.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'PCT filings', data: items.map(i => i[1]), colors: items.map((_, i) => alpha(t.series[2], 0.95 - i * 0.06)) }],
              vFmt: v => nf0.format(v), vMin: 0, vMax: 80000, valueLabels: true, legend: false, barMax: 20 });
          }
        },
        {
          id: 'pubs', size: 'half', eyebrow: 'Science', title: 'Peer-reviewed science and engineering articles, 2022',
          sub: 'Thousands, fractional count', source: D.frontier.publications.source, approx: true,
          chart: () => {
            const items = D.frontier.publications.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'Articles (k)', data: items.map(i => i[1]), color: t.series[4] }], horizontal: false, vFmt: v => nf0.format(v) + ' k', vMin: 0, vMax: 1000, valueLabels: true, legend: false, barMax: 40 });
          }
        },
        {
          id: 'ai-models', size: 'half', eyebrow: 'Frontier concentration', title: 'Notable AI models by country of origin, 2024',
          sub: 'Count of notable machine-learning models', source: D.frontier.aiModels.source,
          chart: () => {
            const items = D.frontier.aiModels.items; const t = T();
            return barConfig({ labels: items.map(i => i[0]), series: [{ label: 'Notable models', data: items.map(i => i[1]), colors: items.map(i => (i[0] === 'United States' ? alpha(t.accent, 0.9) : i[0] === 'China' ? alpha(t.series[1], 0.85) : alpha(t.series[2], 0.8))) }],
              vFmt: v => nf0.format(v), vMin: 0, vMax: 50, valueLabels: true, legend: false, barMax: 22 });
          }
        }
      ],
      binding: 'Discount the headline cost per unit and weight the complementary stock; the cheap tonne, token or genome is the one whose downstream system already exists.'
    }
  ];

  /* =============================================================================
     CUSTOM PANELS
  ============================================================================= */

  /* --- Signal board (overview) */
  function renderSignalBoard(container) {
    const board = el('div', { class: 'signal-board' });
    D.signals.forEach((s, i) => {
      const sec = SECTIONS.find(x => x.id === s.section);
      const spark = el('div', { class: 'spark' });
      const canvas = el('canvas', { 'aria-hidden': 'true' });
      spark.appendChild(canvas);
      const card = el('button', { class: 'signal', type: 'button', onclick: () => navigate(s.section) }, [
        el('div', { class: 'sig-label', text: s.label }),
        el('div', { class: 'sig-value', text: s.headline }),
        el('div', { class: 'sig-sub', text: s.sub }),
        spark,
        el('div', { class: 'sig-go', text: `${sec.num} ${sec.nav} →` })
      ]);
      board.appendChild(card);
      requestAnimationFrame(() => {
        const t = T();
        const chart = new Chart(canvas, {
          type: 'line',
          data: { labels: s.data.map(d => d[0]), datasets: [{ data: s.data.map(d => d[1]), borderColor: t.accent, backgroundColor: alpha(t.accent, 0.12), fill: true, borderWidth: 1.8, pointRadius: s.data.map((_, j) => (j === s.data.length - 1 ? 3 : 0)), pointBackgroundColor: t.accent, tension: 0.3 }] },
          options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false }, tooltip: { enabled: false }, refLines: { lines: [] } }, scales: { x: { display: false }, y: { display: false, type: s.log ? 'logarithmic' : 'linear' } }, layout: { padding: 3 } }
        });
        registry.set('signal-' + i, { chart, panel: { title: s.label }, sectionId: 'overview', ephemeral: true });
      });
    });
    container.appendChild(board);
  }

  /* --- Coupling matrix */
  function renderCouplingMatrix(body) {
    const c = D.polycrisis.coupling; const t = T();
    const n = c.domains.length;
    const short = c.domains.map(d => d.replace('Poverty & inequality', 'Poverty').replace('Sovereign finance', 'Finance').replace('Energy system', 'Energy').replace('Food & water', 'Food/water'));
    const m = el('div', { class: 'matrix', style: `grid-template-columns: 92px repeat(${n}, minmax(0, 1fr)) 40px;` });
    const tip = el('div', { class: 'matrix-tip', html: 'Hover a cell. <b>Rows transmit, columns absorb.</b> A 3 is a load-bearing channel: stress in the row system reliably moves the column system.' });
    const shade = v => v === 3 ? alpha(t.accent, 0.92) : v === 2 ? alpha(t.accent, 0.5) : v === 1 ? alpha(t.accent, 0.18) : 'transparent';
    m.appendChild(el('div', { class: 'mh' }, [el('span', { text: 'from ↓ / to →' })]));
    short.forEach(d => m.appendChild(el('div', { class: 'mh', text: d })));
    m.appendChild(el('div', { class: 'mh', text: 'Out' }));
    c.matrix.forEach((row, i) => {
      m.appendChild(el('div', { class: 'mh row', text: short[i] }));
      row.forEach((v, j) => {
        if (v == null) { m.appendChild(el('div', { class: 'mc null' })); return; }
        const cell = el('div', { class: 'mc', style: `background:${shade(v)}; color:${v === 3 ? '#fff' : t.ink};`, text: String(v), title: `${c.domains[i]} → ${c.domains[j]} (${v}): ${c.mechanisms[i][j]}` });
        cell.addEventListener('mouseenter', () => { tip.innerHTML = `<b>${c.domains[i]} → ${c.domains[j]}</b> · strength ${v}/3 — ${c.mechanisms[i][j]}`; });
        m.appendChild(cell);
      });
      m.appendChild(el('div', { class: 'mh', style: 'font-weight:600; color:' + t.ink, text: String(row.reduce((s, v) => s + (v || 0), 0)) }));
    });
    m.appendChild(el('div', { class: 'mh row', text: 'In' }));
    for (let j = 0; j < n; j++) m.appendChild(el('div', { class: 'mh', style: 'font-weight:600; color:' + t.ink, text: String(c.matrix.reduce((s, r) => s + (r[j] || 0), 0)) }));
    m.appendChild(el('div', { class: 'mh' }));
    body.appendChild(m);
    body.appendChild(el('div', { class: 'matrix-legend' }, [
      el('span', { html: `<span class="sw" style="background:${shade(1)}"></span>1 weak` }),
      el('span', { html: `<span class="sw" style="background:${shade(2)}"></span>2 material` }),
      el('span', { html: `<span class="sw" style="background:${shade(3)}"></span>3 load-bearing` })
    ]));
    body.appendChild(tip);
  }

  /* --- Bass simulator */
  function renderBassSimulator(body) {
    const t = T();
    const wrap = el('div', { class: 'sim' });
    const controls = el('div', { class: 'sim-controls' });
    const chartBox = el('div', { class: 'chart-box', style: 'height: 340px;' });
    const canvas = el('canvas', { role: 'img', 'aria-label': 'Bass diffusion simulator' });
    chartBox.appendChild(canvas);
    const right = el('div', { class: 'sim-right' });

    const mk = (key, label, min, max, step, hint, fmtv) => {
      const out = el('output', { text: fmtv(simState[key]) });
      const input = el('input', { type: 'range', min, max, step, value: simState[key] });
      input.addEventListener('input', () => { simState[key] = parseFloat(input.value); out.textContent = fmtv(simState[key]); update(); });
      return { node: el('div', { class: 'ctl' }, [el('label', {}, [el('span', { text: label }), out]), input, el('div', { class: 'hint', text: hint })]), input, out };
    };
    const cP = mk('p', 'p — innovation (external influence)', 0.001, 0.05, 0.001, 'Advertising, mandates, imports. Sets how fast the curve leaves zero.', v => v.toFixed(3));
    const cQ = mk('q', 'q — imitation (internal influence)', 0.05, 0.9, 0.01, 'Word of mouth, network effects, supplier learning. Sets the steepness.', v => v.toFixed(2));
    const cK = mk('K', 'K — ceiling set by complementary capital', 5, 100, 1, 'Grid, credit, skills, institutions. A technology cannot saturate a system it cannot be wired into.', v => v + ' %');
    const refChk = el('input', { type: 'checkbox' }); refChk.checked = simState.ref;
    refChk.addEventListener('change', () => { simState.ref = refChk.checked; update(); });
    const presets = el('div', { class: 'preset-row' });
    [['Television', 0.03, 0.4, 98], ['Smartphone', 0.01, 0.7, 95], ['Internet-like', 0.004, 0.3, 90], ['Token adoption', 0.01, 0.35, 30], ['Policy push, thin capital', 0.04, 0.2, 40]].forEach(([name, p, q, K]) => {
      presets.appendChild(el('button', { class: 'preset', type: 'button', text: name, onclick: () => { simState.p = p; simState.q = q; simState.K = K; cP.input.value = p; cQ.input.value = q; cK.input.value = K; cP.out.textContent = p.toFixed(3); cQ.out.textContent = q.toFixed(2); cK.out.textContent = K + ' %'; update(); } }));
    });
    const readout = el('div', { class: 'sim-readout' });
    controls.append(cP.node, cQ.node, cK.node, el('div', { class: 'hint', text: 'Presets' }), presets, el('label', { class: 'check' }, [refChk, el('span', { text: 'Overlay empirical internet curve (t₀ = 1995)' })]));
    right.append(chartBox, readout);
    wrap.append(controls, right);
    body.appendChild(wrap);

    const H = 40;
    const F = (tt, p, q) => (1 - Math.exp(-(p + q) * tt)) / (1 + (q / p) * Math.exp(-(p + q) * tt));
    let chart;
    function compute() {
      const { p, q, K } = simState;
      const cum = [], ann = [];
      for (let i = 0; i <= H; i++) { const f = K * F(i, p, q); cum.push(+f.toFixed(2)); ann.push(i === 0 ? 0 : +(f - K * F(i - 1, p, q)).toFixed(2)); }
      const tPeak = Math.log(q / p) / (p + q);
      const tHalf = Math.log(2 + q / p) / (p + q);
      return { cum, ann, tPeak: tPeak > 0 ? tPeak : 0, tHalf, peakRate: Math.max(...ann) };
    }
    function update() {
      const r = compute();
      const t2 = T();
      const ref = D.diffusion.bassReference;
      readout.innerHTML = '';
      [['Peak adoption year', 't = ' + r.tPeak.toFixed(1)], ['Years to half of K', r.tHalf.toFixed(1)], ['Peak annual adoption', r.peakRate.toFixed(1) + ' pp / yr'], ['Share at t = 20', r.cum[20].toFixed(0) + ' %']].forEach(([k, v]) => readout.appendChild(el('div', {}, [el('div', { class: 'k', text: k }), el('div', { class: 'v', text: v })])));
      const datasets = [
        { type: 'line', label: 'Cumulative adoption (% of population)', data: r.cum, borderColor: t2.accent, backgroundColor: alpha(t2.accent, 0.12), fill: true, yAxisID: 'y', pointRadius: 0, borderWidth: 2.4, order: 1 },
        { type: 'bar', label: 'Annual adoptions (pp / yr)', data: r.ann, backgroundColor: alpha(t2.series[2], 0.45), yAxisID: 'y2', order: 3, maxBarThickness: 10 }
      ];
      if (simState.ref) datasets.push({ type: 'line', label: ref.label, data: ref.data, borderColor: t2.ink2, borderDash: [4, 4], borderWidth: 1.6, pointRadius: 0, yAxisID: 'y', order: 2 });
      if (chart) { chart.data.datasets = datasets; chart.options.plugins.refLines.lines[0].value = simState.K; chart.update('none'); return; }
      chart = new Chart(canvas, {
        data: { labels: Array.from({ length: H + 1 }, (_, i) => i), datasets },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: {
            x: scaleBase(t2, { grid: { display: false }, title: { display: true, text: 'Years since introduction', color: t2.muted, font: { size: 10.5 } }, ticks: { maxTicksLimit: 9 } }),
            y: scaleBase(t2, { min: 0, max: 100, ticks: { callback: v => v + ' %' } }),
            y2: scaleBase(t2, { position: 'right', min: 0, suggestedMax: 12, grid: { drawOnChartArea: false }, ticks: { callback: v => v + ' pp' } })
          },
          plugins: { legend: { display: true }, tooltip: { callbacks: { title: items => 'Year ' + items[0].label, label: c => ` ${c.dataset.label}: ${nf.format(c.parsed.y)}` } }, refLines: { lines: [{ axis: 'y', value: simState.K, color: t2.muted, label: 'K ceiling', position: 'left' }] } },
          interaction: { mode: 'index', intersect: false }
        }
      });
      registry.set('bass', { chart, panel: SECTIONS[1].panels.find(p => p.id === 'bass'), sectionId: 'diffusion' });
    }
    update();
  }

  /* --- Two-margin scorecard */
  function renderTwoMargin(body) {
    const d = D.diffusion.twoMargin; const th = d.thresholds;
    const rows = d.rows.map(r => {
      const [name, solar, wind, ev, access] = r;
      const solarOk = solar >= th.solar && access >= th.access, windOk = wind >= th.wind, evOk = ev >= th.ev;
      const ext = [solar >= 0.5, wind >= 0.5, ev >= 0.5].filter(Boolean).length;
      const int = [solarOk, windOk, evOk].filter(Boolean).length;
      const cell = int >= 2 ? ['Hardware club', 'strong'] : int === 1 ? ['Single-system', 'mid'] : ext >= 1 ? ['Token adoption', 'weak'] : ['Pre-diffusion', 'weak'];
      return { name, solar, wind, ev, access, solarOk, windOk, evOk, ext, int, cell };
    }).sort((a, b) => b.int - a.int || b.ext - a.ext || (b.solar + b.wind + b.ev) - (a.solar + a.wind + a.ev));
    const tick = ok => `<span class="tick ${ok ? 'ok' : 'no'}">${ok ? '●' : '○'}</span>`;
    const html = `<div class="tbl-wrap"><table class="tbl"><thead><tr>
      <th>Country</th><th class="num">Solar % elec.</th><th class="num">Wind % elec.</th><th class="num">EV % sales</th><th class="num">Access %</th>
      <th>Solar</th><th>Wind</th><th>EV</th><th class="num">Extensive</th><th class="num">Intensive</th><th>Cell</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td class="first">${r.name}</td><td class="num">${nf.format(r.solar)}</td><td class="num">${nf.format(r.wind)}</td><td class="num">${nf.format(r.ev)}</td><td class="num">${r.access}</td>
      <td>${tick(r.solarOk)}</td><td>${tick(r.windOk)}</td><td>${tick(r.evOk)}</td><td class="num score">${r.ext}/3</td><td class="num score">${r.int}/3</td><td><span class="cell-tag ${r.cell[1]}">${r.cell[0]}</span></td></tr>`).join('')}
      </tbody></table></div>`;
    body.insertAdjacentHTML('beforeend', html);
  }

  /* --- Four clocks scorecard */
  function renderFourClocks(body) {
    const d = D.convergence.fourClocks;
    const rows = d.rows.map(r => {
      const [name, inc, prod, net, elec, agri, manuf] = r;
      const c1 = inc >= 2, c2 = prod >= 1.5, c3 = net >= 50 && elec >= 90, c4 = agri <= 40 && manuf >= 10;
      const n = [c1, c2, c3, c4].filter(Boolean).length;
      const cell = n === 4 ? ['Four clocks closed', 'strong'] : n === 3 ? ['Three of four', 'mid'] : n === 2 ? ['Clock mismatch', 'mid'] : ['Stalled', 'weak'];
      return { name, inc, prod, net, elec, agri, manuf, c: [c1, c2, c3, c4], n, cell };
    }).sort((a, b) => b.n - a.n || b.inc - a.inc);
    const tick = ok => `<span class="tick ${ok ? 'ok' : 'no'}">${ok ? '●' : '○'}</span>`;
    const html = `<div class="tbl-wrap"><table class="tbl"><thead><tr>
      <th>Country</th><th class="num">Income growth %/yr</th><th class="num">Productivity %/yr</th><th class="num">Internet %</th><th class="num">Electricity %</th><th class="num">Agri. employment %</th><th class="num">Manufacturing % GDP</th>
      <th>Income</th><th>Productivity</th><th>Technology</th><th>Structure</th><th class="num">Closed</th><th>Reading</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td class="first">${r.name}</td><td class="num">${nf.format(r.inc)}</td><td class="num">${nf.format(r.prod)}</td><td class="num">${r.net}</td><td class="num">${r.elec}</td><td class="num">${r.agri}</td><td class="num">${r.manuf}</td>
      ${r.c.map(tick).map(s => `<td>${s}</td>`).join('')}<td class="num score">${r.n}/4</td><td><span class="cell-tag ${r.cell[1]}">${r.cell[0]}</span></td></tr>`).join('')}
      </tbody></table></div>`;
    body.insertAdjacentHTML('beforeend', html);
  }

  /* --- AI clocks scorecard */
  function renderAiClocks(body) {
    const d = D.ai.clocks;
    const rows = d.rows.map(r => {
      const [name, gen, net, ind, clean] = r;
      const load = gen >= 4000, lever = net >= 50 && ind >= 20, cl = clean >= 40;
      let cell;
      if (load && lever && cl) cell = ['Load-to-lever', 'strong'];
      else if (load && lever) cell = ['Fossil-load cell', 'weak'];
      else if (!load && cl && lever) cell = ['Clean-thin cell', 'mid'];
      else if (!load && cl) cell = ['Clean, unwired', 'mid'];
      else if (load) cell = ['Load without lever', 'mid'];
      else if (lever) cell = ['Lever without load', 'mid'];
      else cell = ['Pre-stack', 'weak'];
      return { name, gen, net, ind, clean, load, lever, cl, n: [load, lever, cl].filter(Boolean).length, cell };
    }).sort((a, b) => b.n - a.n || b.gen - a.gen);
    const tick = ok => `<span class="tick ${ok ? 'ok' : 'no'}">${ok ? '●' : '○'}</span>`;
    const html = `<div class="tbl-wrap"><table class="tbl"><thead><tr>
      <th>Country</th><th class="num">Generation kWh / capita</th><th class="num">Internet %</th><th class="num">Industry % GDP</th><th class="num">Low-carbon % elec.</th>
      <th>Load</th><th>Lever</th><th>Clean kWh</th><th class="num">Closed</th><th>Cell</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td class="first">${r.name}</td><td class="num">${nf0.format(r.gen)}</td><td class="num">${r.net}</td><td class="num">${r.ind}</td><td class="num">${r.clean}</td>
      <td>${tick(r.load)}</td><td>${tick(r.lever)}</td><td>${tick(r.cl)}</td><td class="num score">${r.n}/3</td><td><span class="cell-tag ${r.cell[1]}">${r.cell[0]}</span></td></tr>`).join('')}
      </tbody></table></div>`;
    body.insertAdjacentHTML('beforeend', html);
  }

  /* --- Cost-collapse small multiples */
  function renderCostMultiples(body) {
    const d = D.frontier.costCurves;
    const grid = el('div', { class: 'multiples' });
    body.appendChild(grid);
    d.curves.forEach((cv, i) => {
      const first = cv.points[0][1], last = cv.points[cv.points.length - 1][1];
      const ratio = first / last;
      const box = el('div', { class: 'chart-box' });
      const canvas = el('canvas', { role: 'img', 'aria-label': cv.label });
      box.appendChild(canvas);
      const card = el('div', { class: 'multiple' }, [
        el('p', { class: 'm-title', text: cv.label }),
        el('p', { class: 'm-sub', text: `${cv.unit} · ${Math.floor(cv.points[0][0])}–${Math.floor(cv.points[cv.points.length - 1][0])}` }),
        box,
        el('div', { class: 'm-fall', text: `÷ ${ratio >= 1000 ? nf0.format(Math.round(ratio / 10) * 10) : nf.format(ratio)} · ${fmt.log(first)} → ${fmt.log(last)}` })
      ]);
      grid.appendChild(card);
      requestAnimationFrame(() => {
        const t = T();
        const minY = Math.pow(10, Math.floor(Math.log10(last)));
        const maxY = Math.pow(10, Math.ceil(Math.log10(first)));
        const chart = new Chart(canvas, {
          type: 'line',
          data: { datasets: [{ label: cv.label, data: cv.points.map(p => ({ x: p[0], y: p[1] })), borderColor: t.accent, backgroundColor: alpha(t.accent, 0.1), fill: true, pointRadius: 3, pointBackgroundColor: t.accent, tension: 0.2 }] },
          options: {
            responsive: true, maintainAspectRatio: false, parsing: true,
            scales: {
              x: scaleBase(t, { type: 'linear', grid: { display: false }, ticks: { maxTicksLimit: 4, callback: v => String(Math.round(v)) } }),
              y: scaleBase(t, { type: 'logarithmic', min: minY, max: maxY, ticks: { maxTicksLimit: 5, callback: v => (isPow10(v) ? fmt.log(v) : ''), font: { size: 10 } } })
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { title: items => String(Math.floor(items[0].parsed.x)), label: c => ` ${fmt.log(c.parsed.y)} ${cv.unit.replace('$ ', '')}` } }, refLines: { lines: [] } },
            interaction: { mode: 'nearest', intersect: false }
          }
        });
        registry.set('cost-' + i, { chart, cfg: chart.config, panel: { title: cv.label, source: d.source, eyebrow: 'Cost collapse', sub: cv.unit }, sectionId: 'frontier' });
      });
    });
  }

  /* =============================================================================
     SOURCES & METHOD VIEW
  ============================================================================= */
  const GLOSSARY = [
    ['Polycrisis cascade', 'Multiple compounding crises where failure in one domain accelerates failure in another, as distinct from independent, parallel risks.'],
    ['Constraint selection', 'Adoption as a filter: a technology scales where it is orthogonal to the binding constraint (infrastructure, state trust, informality) and stalls where it loads on that constraint.'],
    ['Two-margin diffusion', 'Extensive presence (the country has the technology at a detectable share) versus intensive occupation (the technology occupies the relevant system).'],
    ['Capital-constrained ceiling', 'The Bass carrying capacity K as a function of domestic credit and complementary stock, not of remaining unaware agents.'],
    ['Four clocks', 'Whether income, labour productivity, technology adoption and structural transformation closed together. A geographic filter on catch-up, not a single S-curve of development.'],
    ['China wedge', 'The gap between an EMDE aggregate with and without China. A bloc average that is one industrialiser.'],
    ['Cooling gap', 'High heat exposure against low electricity-and-appliance capacity to remove that heat. A labour-productivity variable before it is a mortality variable.'],
    ['AC club', 'High heat exposure jointly occupied with AC-capable electricity. A grid label, not an ownership label.'],
    ['Share-sync', 'Joint occupation of the power clock (solar + wind ≥ 8 % of electricity) and the fossil-exit clock (fossil ≤ 55 %) on the same grid. A mix event, not a tonne event. Deep exit is fossil ≤ 40 %.'],
    ['Power-ahead / exit-ahead', 'Power clock closed without fossil exit (India); fossil exit without the post-2010 solar-and-wind system (Kenya, Ethiopia).'],
    ['Load-before-lever', 'AI arrives as electricity demand before it arrives as an efficiency technology. Country ranking is set by whether the complementary stack exists to convert the load into a lever.'],
    ['Fossil-load / clean-thin cell', 'Surplus electrons and a digital-industrial process on a grid that has not turned over (fossil-load); a turning-over mix without the surplus that would host a hyperscale load (clean-thin).'],
    ['Cost-as-ranking error', 'Treating a headline cost per unit as a substitute for a complementary-stock test. The cheap unit is the one whose complementary stock already exists.'],
    ['Binding term', 'The closing move of each section: a directive for how to read this class of problem, not a summary.']
  ];

  function renderSources(view) {
    const items = [];
    SECTIONS.forEach(s => s.panels.forEach(p => items.push({ section: `${s.num} ${s.nav}`, title: p.title, source: p.source, approx: p.approx })));
    const prose = el('div', { class: 'prose' });
    prose.innerHTML = `
      <h3>What this instrument is</h3>
      <p>A reading of the century through nine coupled systems. Each panel compiles figures from the public releases cited beneath it: UN, World Bank, IMF, IEA, Ember, IRENA, BloombergNEF, WMO, NOAA, the Global Carbon Project, UCDP/PRIO, UNHCR, WHO, the Health Effects Institute, the Lancet Countdown, the US Census Bureau, the Stanford AI Index, Epoch AI, McKinsey, OECD, WIPO, NSF and NHGRI.</p>
      <h3>How to read the flags</h3>
      <p>Values marked <code>≈</code> are approximate: read off published charts, interpolated between reported years, taken from preliminary or nowcast releases, or converted between price bases. Dashed line segments are projections or estimates. Scorecards apply explicit thresholds stated in the panel subtitle; the thresholds are analytical choices, not official definitions.</p>
      <p>The coupling matrix in the Overview is an H Heuristics analytical judgment, not a measured quantity. It exists to make the coupling claim falsifiable: each cell names a mechanism that can be argued with.</p>
      <h3>Vintage and maintenance</h3>
      <p>${D.meta.build}. Data vintage: ${D.meta.vintage}. All numbers live in <code>assets/js/data.js</code>; panels in <code>assets/js/app.js</code> read from that object and carry no hard-coded values. Every chart exports its underlying series as CSV and its rendered image as PNG from the panel header.</p>
      <h3>Glossary</h3>
      <dl class="glossary">${GLOSSARY.map(g => `<dt>${g[0]}</dt><dd>${g[1]}</dd>`).join('')}</dl>
      <h3>Sources by panel</h3>`;
    view.appendChild(prose);
    const list = el('div', { class: 'source-list' });
    items.forEach(i => list.appendChild(el('div', { class: 'source-item' }, [
      el('div', { class: 'si-h', html: `<span class="panel-eyebrow" style="display:inline;margin-right:8px">${i.section}</span>${i.title}${i.approx ? ' <span class="approx" style="font-family:var(--mono);font-size:10px;color:var(--caution)">≈</span>' : ''}` }),
      el('div', { class: 'si-s', text: i.source })
    ])));
    view.appendChild(list);
  }

  /* =============================================================================
     RENDERING & ROUTING
  ============================================================================= */
  const main = $('#main');
  const tabs = $('#tabs');
  const VIEW_IDS = SECTIONS.map(s => s.id).concat(['sources']);

  function buildShell() {
    tabs.innerHTML = '';
    SECTIONS.forEach(s => tabs.appendChild(el('button', { class: 'tab', role: 'tab', id: 'tab-' + s.id, 'aria-controls': 'view-' + s.id, 'aria-selected': 'false', type: 'button', onclick: () => navigate(s.id) }, [el('span', { class: 'n', text: s.num }), s.nav])));
    tabs.appendChild(el('button', { class: 'tab', role: 'tab', id: 'tab-sources', 'aria-controls': 'view-sources', 'aria-selected': 'false', type: 'button', onclick: () => navigate('sources') }, [el('span', { class: 'n', text: '§' }), 'Sources & method']));
    main.innerHTML = '';
    VIEW_IDS.forEach(id => main.appendChild(el('section', { class: 'view', id: 'view-' + id, role: 'tabpanel', 'aria-labelledby': 'tab-' + id })));
    $('#meta-pill').textContent = D.meta.build + ' · data ' + D.meta.vintage.replace('Latest available releases, ', '');
    $('#footer-meta').textContent = `${D.meta.build} · ${D.meta.vintage}`;
  }

  function renderSection(s) {
    const view = $('#view-' + s.id);
    view.innerHTML = '';
    const head = el('div', { class: 'section-head' }, [
      el('div', {}, [el('p', { class: 'eyebrow', text: `${s.num} — ${s.nav}` }), el(s.id === 'overview' ? 'h1' : 'h2', { text: s.title })]),
      el('p', { class: 'lede', html: s.lede })
    ]);
    view.appendChild(head);
    const kpis = el('div', { class: 'kpis' + (s.kpiCols === 8 ? ' cols-8' : '') });
    s.kpis.forEach(k => kpis.appendChild(el('div', { class: 'kpi ' + (k.dir || 'neutral') }, [
      el('div', { class: 'kpi-label', text: k.label }), el('div', { class: 'kpi-value', text: k.value }), el('div', { class: 'kpi-delta', text: k.delta }), el('div', { class: 'kpi-note', text: k.note })
    ])));
    view.appendChild(kpis);
    if (s.custom === 'signalBoard') renderSignalBoard(view);
    const grid = el('div', { class: 'grid' });
    view.appendChild(grid);
    s.panels.forEach(p => {
      const sizeClass = { full: 'full', half: '', third: 'third', 'two-thirds': 'two-thirds' }[p.size || 'half'];
      const shell = panelShell(Object.assign({}, p, { size: sizeClass }), s.id);
      grid.appendChild(shell.node);
      if (p.chart) mountChart(p, shell.canvas, s.id);
      else if (p.html) p.html(shell.body);
    });
    view.appendChild(el('div', { class: 'binding' }, [el('span', { class: 'label', text: 'Binding term' }), el('p', { text: s.binding })]));
    viewState[s.id] = true;
  }

  function activate(id) {
    if (!VIEW_IDS.includes(id)) id = 'overview';
    VIEW_IDS.forEach(v => {
      const view = $('#view-' + v), tab = $('#tab-' + v);
      const on = v === id;
      view.classList.toggle('active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    if (!viewState[id]) {
      if (id === 'sources') { renderSources($('#view-sources')); viewState.sources = true; }
      else renderSection(SECTIONS.find(s => s.id === id));
    } else {
      // Views re-shown after being hidden: make sure charts fit their boxes.
      registry.forEach(r => { if (r.sectionId === id) r.chart.resize(); });
    }
    const s = SECTIONS.find(x => x.id === id);
    document.title = (s ? `${s.nav} — ` : 'Sources & method — ') + 'The 21st Century Dashboard — H Heuristics';
  }

  function navigate(id) {
    if (location.hash !== '#' + id) location.hash = id; else activate(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function currentId() { return (location.hash || '#overview').slice(1); }

  function rebuildAll() {
    registry.forEach(r => { try { r.chart.destroy(); } catch (e) { /* noop */ } });
    registry.clear();
    Object.keys(viewState).forEach(k => { viewState[k] = false; });
    applyChartDefaults();
    buildShell();
    activate(currentId());
  }

  /* --- theme */
  function setTheme(mode) {
    if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('hh-theme', mode); } catch (e) { /* noop */ }
    $('#theme-label').textContent = mode === 'dark' ? 'Light' : 'Dark';
    $('meta[name="theme-color"]').setAttribute('content', mode === 'dark' ? '#0E1116' : '#F7F3EB');
  }

  /* --- init */
  Chart.register(refLinesPlugin, pointLabelsPlugin, valueLabelsPlugin, quadrantsPlugin);
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  rebuildAll();

  $('#theme-toggle').addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(dark ? 'light' : 'dark');
    rebuildAll();
  });
  $('#print-btn').addEventListener('click', () => window.print());
  window.addEventListener('hashchange', () => activate(currentId()));
  window.addEventListener('keydown', e => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = VIEW_IDS.indexOf(currentId());
    const next = VIEW_IDS[(i + (e.key === 'ArrowRight' ? 1 : VIEW_IDS.length - 1)) % VIEW_IDS.length];
    navigate(next);
  });
})();
