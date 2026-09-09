/* ===========================================================================
   H Heuristics Digital Reports — report runtime.

   Three jobs: keep the sticky section nav in sync with the reader's position,
   drive the reading-progress bar, and give every chart on every report the
   same typographic and colour defaults so the data visuals read as one set.
   Chart.js is optional — a report with no charts simply skips that part.
   =========================================================================== */

(function () {
  'use strict';

  var css = getComputedStyle(document.documentElement);
  var token = function (name, fallback) {
    return (css.getPropertyValue(name) || '').trim() || fallback;
  };

  var PALETTE = {
    blue: token('--chart-blue', '#2c5282'),
    blueLight: token('--chart-blue-light', '#63b3ed'),
    gold: token('--chart-gold', '#b8860b'),
    red: token('--chart-red', '#9b2c2c'),
    teal: token('--chart-teal', '#276749'),
    gray: token('--chart-gray', '#718096'),
    orange: token('--chart-orange', '#c05621'),
    purple: token('--chart-purple', '#553c9a'),
    ink: token('--text', '#1a1a1a'),
    muted: token('--text-muted', '#757575'),
    grid: token('--border-light', '#e8e4db'),
    dark: token('--bg-dark', '#1a1f2b'),
    accent: token('--accent', '#8b6914'),
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- sticky section nav + progress ------------------------------------- */

  function initNav() {
    var bar = document.querySelector('.progress__bar');
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-inner a[href^="#"]'));
    var nav = document.querySelector('.nav-inner');
    var sections = links
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    var ticking = false;

    function update() {
      ticking = false;

      if (bar) {
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - window.innerHeight;
        var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
      }

      if (!sections.length) return;

      // The active section is the last one whose top has passed the nav.
      // Positions come from rects rather than offsetTop, which is measured
      // from the nearest positioned ancestor and would silently shift if any
      // wrapper ever gained a position.
      var line = 90;
      var current = 0;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) current = i;
      }
      // At the very bottom, the final section is always the active one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections.length - 1;
      }

      for (var j = 0; j < links.length; j++) {
        var on = j === current;
        links[j].classList.toggle('is-active', on);
        if (on) {
          links[j].setAttribute('aria-current', 'true');
          // Keep the active item visible in the horizontally scrolling nav.
          // Compared as rects: the links' offsetParent is the body, not the
          // scroll container, so offsetLeft is in the wrong coordinate space
          // and mis-scrolls the nav by the page gutter.
          if (nav && nav.scrollWidth > nav.clientWidth + 1) {
            var navBox = nav.getBoundingClientRect();
            var linkBox = links[j].getBoundingClientRect();
            if (linkBox.left < navBox.left) {
              nav.scrollLeft += linkBox.left - navBox.left - 16;
            } else if (linkBox.right > navBox.right) {
              nav.scrollLeft += linkBox.right - navBox.right + 16;
            }
          }
        } else {
          links[j].removeAttribute('aria-current');
        }
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Recompute once the page has settled. Webfonts land after first paint and
    // move every section boundary, and browsers restore the horizontal scroll
    // of the nav container on reload — both leave the first pass stale.
    window.addEventListener('load', onScroll);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onScroll).catch(function () {});
    }

    update();
  }

  /* --- chart defaults ------------------------------------------------------ */

  function initCharts() {
    if (typeof Chart === 'undefined') return;

    var sans = token('--sans', 'Inter, sans-serif');
    var mono = token('--mono', 'monospace');

    Chart.defaults.font.family = sans;
    Chart.defaults.font.size = 11;
    Chart.defaults.color = PALETTE.muted;
    Chart.defaults.animation = reduceMotion ? false : { duration: 600, easing: 'easeOutQuart' };
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.responsive = true;

    Chart.defaults.plugins.legend.labels.boxWidth = 10;
    Chart.defaults.plugins.legend.labels.boxHeight = 10;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 14;
    Chart.defaults.plugins.legend.labels.color = PALETTE.ink;

    Chart.defaults.plugins.tooltip.backgroundColor = PALETTE.dark;
    Chart.defaults.plugins.tooltip.titleFont = { family: sans, size: 11.5, weight: '600' };
    Chart.defaults.plugins.tooltip.bodyFont = { family: mono, size: 11 };
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 2;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxWidth = 8;
    Chart.defaults.plugins.tooltip.boxHeight = 8;
    Chart.defaults.plugins.tooltip.usePointStyle = true;

    Chart.defaults.elements.bar.borderWidth = 0;
    Chart.defaults.elements.line.borderWidth = 2.4;
    Chart.defaults.elements.line.tension = 0.25;
    Chart.defaults.elements.point.radius = 3;
    Chart.defaults.elements.point.hoverRadius = 5;
  }

  /* --- public helper -------------------------------------------------------- */

  // Axis styling is applied here rather than repeated in every chart config,
  // so a report file only carries data and the choices specific to that chart.
  function axis(opts) {
    opts = opts || {};
    return {
      grid: {
        color: opts.grid === false ? 'transparent' : PALETTE.grid,
        drawTicks: false,
        drawBorder: false,
      },
      border: { display: false },
      ticks: {
        color: PALETTE.muted,
        padding: 8,
        font: { size: 10.5 },
      },
      title: opts.title
        ? { display: true, text: opts.title, color: PALETTE.muted, font: { size: 10.5 } }
        : { display: false },
    };
  }

  // Chart.js has no built-in data labels. Printed values matter more than
  // hover in a report — a reader scanning a figure, or printing the page,
  // should get the number without interacting — so bars carry theirs.
  //
  //   axis:   'y' (default) for vertical bars, 'x' for horizontal
  //   format: (value, index) => string
  //   only:   optional array of data indices to label; default all
  function valueLabels(opts) {
    opts = opts || {};
    var horizontal = opts.axis === 'x';
    var fmt = opts.format || function (v) { return String(v); };

    return {
      id: 'hhValueLabels-' + Math.random().toString(36).slice(2, 8),
      afterDatasetsDraw: function (chart) {
        var ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = PALETTE.ink;
        ctx.font = '600 11px ' + token('--sans', 'Inter, sans-serif');
        ctx.textBaseline = horizontal ? 'middle' : 'bottom';
        ctx.textAlign = horizontal ? 'left' : 'center';

        chart.data.datasets.forEach(function (ds, di) {
          var meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach(function (bar, i) {
            var raw = ds.data[i];
            if (raw === null || raw === undefined) return;
            if (opts.only && opts.only.indexOf(i) === -1) return;
            var text = fmt(raw, i);
            if (horizontal) ctx.fillText(text, bar.x + 8, bar.y);
            else ctx.fillText(text, bar.x, bar.y - 6);
          });
        });
        ctx.restore();
      },
    };
  }

  function render(id, config) {
    var el = document.getElementById(id);
    if (!el || typeof Chart === 'undefined') return null;
    try {
      return new Chart(el.getContext('2d'), config);
    } catch (err) {
      // A broken chart must never take the article down with it.
      if (window.console && console.warn) console.warn('Chart "' + id + '" failed:', err);
      return null;
    }
  }

  // Report chart files are deferred scripts loaded after this one, so they can
  // register their listener only after boot() has already fired. onReady closes
  // that race: it runs the callback immediately if the runtime is up, and
  // otherwise waits for the event.
  function onReady(fn) {
    if (window.HH && window.HH.isReady) fn();
    else document.addEventListener('hh:ready', fn, { once: true });
  }

  window.HH = {
    palette: PALETTE,
    axis: axis,
    chart: render,
    valueLabels: valueLabels,
    onReady: onReady,
    isReady: false,
    reduceMotion: reduceMotion,
  };

  /* --- boot ------------------------------------------------------------------ */

  function boot() {
    initNav();
    initCharts();
    window.HH.isReady = true;
    document.dispatchEvent(new CustomEvent('hh:ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
