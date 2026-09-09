// Scaffold the next digital report.
//
//   npm run new -- <slug> "Report title"
//
// Creates reports/<slug>/ with report.json, body.html and charts.js, numbered
// one past the highest report of the current year. Fill in the TODOs, then
// `npm run dev` to see it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORTS = path.join(ROOT, 'reports');

const [slugArg, ...titleParts] = process.argv.slice(2);

if (!slugArg) {
  console.error('usage: npm run new -- <slug> "Report title"');
  process.exit(1);
}

const slug = slugArg
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const dir = path.join(REPORTS, slug);
if (fs.existsSync(dir)) {
  console.error(`reports/${slug}/ already exists.`);
  process.exit(1);
}

const title = titleParts.join(' ') || 'TODO — report title';
const today = new Date().toISOString().slice(0, 10);
const year = today.slice(0, 4);

// Next number in this year's sequence.
const existing = fs.existsSync(REPORTS)
  ? fs
      .readdirSync(REPORTS, { withFileTypes: true })
      .filter((e) => e.isDirectory() && fs.existsSync(path.join(REPORTS, e.name, 'report.json')))
      .map((e) => JSON.parse(fs.readFileSync(path.join(REPORTS, e.name, 'report.json'), 'utf8')).number)
      .filter((n) => String(n).startsWith(`${year}-`))
      .map((n) => Number(String(n).split('-')[1]) || 0)
  : [];
const number = `${year}-${String(Math.max(0, ...existing) + 1).padStart(2, '0')}`;

fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(
  path.join(dir, 'report.json'),
  `${JSON.stringify(
    {
      number,
      title,
      subtitle: 'TODO — one line, sentence case',
      strapline: 'TODO — the thesis in a single sentence, or remove this field',
      dek: 'TODO — two or three sentences for the cards, the feed and social previews.',
      abstract: [
        'TODO — paragraph 1: the problem and the claim. The abstract is rendered on the page, carried in the head metadata, the RSS feed and reports.json, and is what indexers read. Four paragraphs is the house length.',
        'TODO — paragraph 2: the analytical core.',
        'TODO — paragraph 3: the evidence.',
        'TODO — paragraph 4: the implication and the agenda.',
      ],
      jel: 'TODO — JEL codes and their plain-language glosses, or delete this field',
      method: 'TODO — which sources were synthesised, what is schematic or illustrative rather than measured, and whether the report is analytical or predictive.',
      author: 'Hunter Hughes',
      institution: 'H Heuristics',
      published: today,
      updated: today,
      readingTime: 20,
      charts: true,
      // Optional, for a report with its own look: add a theme.css to this
      // directory and name the type it needs here. Delete both if reusing
      // the default aesthetic.
      fontsUrl: null,
      themeColor: null,
      topics: ['TODO — see topicOrder in site.config.mjs'],
      keywords: ['TODO'],
      sections: [
        { id: 'executive-summary', label: 'Executive Summary' },
        { id: 'section-one', label: '1. TODO' },
        { id: 'references', label: 'References' },
      ],
      highlights: [{ value: 'TODO', label: 'TODO — shown on the front page' }],
    },
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  path.join(dir, 'body.html'),
  `<section id="executive-summary">
  <h2>Executive Summary</h2>
  <p class="section-dek">TODO — one sentence framing the report.</p>

  <div class="exec-grid">
    <div class="exec-card">
      <div class="exec-num">1</div>
      <p class="exec-title">TODO</p>
      <p class="exec-body">TODO</p>
    </div>
  </div>

  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-value">TODO</div>
      <div class="stat-label">TODO</div>
      <div class="stat-source">Source</div>
    </div>
  </div>
</section>

<hr class="section-rule">

<section id="section-one">
  <h2>1. TODO</h2>
  <p class="section-dek">TODO</p>

  <p>TODO</p>

  <div class="chart-container">
    <p class="chart-label">Figure 1 — TODO</p>
    <div class="chart-frame"><canvas id="chart-one"></canvas></div>
    <p class="chart-caption">TODO. Source: <a href="#" rel="noopener" target="_blank">TODO</a>.</p>
  </div>

  <div class="callout">
    <p class="callout-title">TODO</p>
    <p>TODO</p>
  </div>
</section>

<hr class="section-rule">

<section id="references">
  <h2>References</h2>
  <p class="section-dek">Every quantitative claim above is attributed inline. The principal sources are collected here.</p>
  <ul class="ref-list">
    <li><span class="ref-org">TODO</span><a href="#" rel="noopener" target="_blank">TODO</a>.</li>
  </ul>
</section>
`,
);

fs.writeFileSync(
  path.join(dir, 'charts.js'),
  `/* Charts — ${title} */

(function () {
  'use strict';

  // report.js defines HH and loads first; bail out rather than throw if it did not.
  if (!window.HH) return;

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;

    var C = HH.palette;
    var axis = HH.axis;

    HH.chart('chart-one', {
      type: 'bar',
      data: {
        labels: ['A', 'B'],
        datasets: [{ label: 'TODO', data: [1, 2], backgroundColor: [C.blue, C.teal] }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { x: axis({ grid: false }), y: Object.assign(axis(), { beginAtZero: true }) },
      },
      plugins: [HH.valueLabels({})],
    });
  });
})();
`,
);

console.log(`✓ reports/${slug}/  (№ ${number})`);
console.log('  edit report.json, body.html and charts.js, then: npm run dev');
