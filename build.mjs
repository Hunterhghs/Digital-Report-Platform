// ---------------------------------------------------------------------------
// Static build.
//
//   node build.mjs   →   dist/
//
// Each digital report lives in reports/<slug>/ as three files: report.json
// (the record), body.html (the article) and charts.js (its data visuals).
// This script wraps each in the shared shell and generates everything around
// them — the library pages, the topic facets, the feed, the sitemap and a
// CORS-open reports.json for anything that wants to read the series.
//
// No dependencies, by design: the build must keep working on whatever Node
// Cloudflare Pages happens to ship, years from now, without an install step.
// ---------------------------------------------------------------------------

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import site, { isProduction } from './site.config.mjs';
import { esc, escAttr } from './lib/inline.mjs';
import {
  setAssets,
  head,
  page,
  siteBar,
  footer,
  reportShell,
  longDate,
  monthYear,
  topicHref,
} from './lib/templates.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');

const read = (p) => fs.readFileSync(p, 'utf8');
const write = (rel, body) => {
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, body);
};
const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
};

// --- load reports -----------------------------------------------------------

function loadReports() {
  const dir = path.join(ROOT, 'reports');
  if (!fs.existsSync(dir)) return [];

  const reports = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const base = path.join(dir, e.name);
      const recordPath = path.join(base, 'report.json');
      if (!fs.existsSync(recordPath)) {
        console.warn(`  ! reports/${e.name} has no report.json — skipped`);
        return null;
      }
      const record = JSON.parse(read(recordPath));
      const bodyPath = path.join(base, 'body.html');
      if (!fs.existsSync(bodyPath)) throw new Error(`reports/${e.name}/body.html is missing`);

      // The directory name is the URL, so it is the slug — no way for the two
      // to drift apart and publish a report at an address nothing links to.
      record.slug = e.name;
      record.dir = base;
      record.body = read(bodyPath);

      // Optional per-report assets, detected rather than declared, so dropping
      // the file in is all it takes to give a report its own look or card.
      record.hasTheme = fs.existsSync(path.join(base, 'theme.css'));
      record.hasOgImage = fs.existsSync(path.join(base, 'og.png'));

      if (!record.abstract || !record.abstract.length) {
        console.warn(`  ! ${e.name} has no abstract — the page will not carry one`);
      }
      return record;
    })
    .filter(Boolean);

  // Report numbers are assigned by `npm run new` from what is on disk, so two
  // sessions working in parallel can allocate the same one. Nothing caught
  // that until a push was rejected, so the build checks it.
  const seen = new Map();
  for (const r of reports) {
    if (seen.has(r.number)) {
      throw new Error(
        `Duplicate report number ${r.number}: reports/${seen.get(r.number)} and reports/${r.slug}. ` +
          'Renumber the one published later.',
      );
    }
    seen.set(r.number, r.slug);
  }

  // Newest first; ties broken by report number so ordering is deterministic.
  reports.sort((a, b) =>
    b.published.localeCompare(a.published) || String(b.number).localeCompare(String(a.number)),
  );
  return reports;
}

// --- shared fragments -------------------------------------------------------

const chip = (t) => `<a class="chip" href="${escAttr(topicHref(t))}">${esc(t)}</a>`;

function card(r) {
  return `<article class="card">
  <p class="card-meta">№ ${esc(r.number)} · ${esc(monthYear(r.published))} · ${esc(String(r.readingTime))} min</p>
  <h3><a href="/reports/${escAttr(r.slug)}/">${esc(r.title)}</a></h3>
  <p>${esc(r.dek)}</p>
  <div class="card-foot">${(r.topics || []).map(chip).join(' ')}</div>
</article>`;
}

function leadReport(r) {
  const highlights = (r.highlights || [])
    .map((h) => `<li><b>${esc(h.value)}</b><span>${esc(h.label)}</span></li>`)
    .join('');

  return `<article class="lead-report">
  <div>
    <p class="kicker">Latest report · № ${esc(r.number)} · ${esc(longDate(r.published))}</p>
    <h2><a href="/reports/${escAttr(r.slug)}/">${esc(r.title)}</a></h2>
    <p class="dek">${esc(r.dek)}</p>
    ${highlights ? `<ul class="highlights">${highlights}</ul>` : ''}
    <a class="readbtn" href="/reports/${escAttr(r.slug)}/">Read the report</a>
  </div>
</article>`;
}

function pageHead(overline, title, dek, cadence = false) {
  return `<header class="pagehead">
  <div class="pagehead-inner">
    <p class="overline">${esc(overline)}</p>
    <h1>${esc(title)}</h1>
    <p>${esc(dek)}</p>
    ${cadence ? '<p class="cadence"><span class="dot"></span>New report every week</p>' : ''}
  </div>
</header>`;
}

const libraryPage = ({ title, desc, pathname, current, body }) =>
  page({
    headHtml: head({
      title,
      desc,
      path: pathname,
      css: ['/assets/platform.css'],
      jsonLd: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${site.name} ${site.property}`,
        url: site.siteUrl,
        description: site.description,
        publisher: { '@type': 'Organization', name: site.publisher },
      }),
    }),
    body: `${siteBar(current)}\n${body}\n${footer()}`,
    scripts: [],
  });

// --- assets -----------------------------------------------------------------

/**
 * Copy assets/ into dist/assets/ under content-hashed names and return a map
 * from the source path to the published one.
 *
 * Without this, a returning reader can hold a week-old report.css alongside
 * today's HTML and a report's freshly-deployed theme.css — which is exactly
 * how the abstract lost its padding while keeping its border. Hashed names
 * make a mismatch impossible and let the files be cached indefinitely.
 */
function buildAssets() {
  const from = path.join(ROOT, 'assets');
  const map = {};
  if (!fs.existsSync(from)) return map;

  const out = path.join(DIST, 'assets');
  fs.mkdirSync(out, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const buf = fs.readFileSync(path.join(from, entry.name));
    const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);
    const ext = path.extname(entry.name);
    const hashed = `${path.basename(entry.name, ext)}.${hash}${ext}`;
    fs.writeFileSync(path.join(out, hashed), buf);
    map[`/assets/${entry.name}`] = `/assets/${hashed}`;
  }
  return map;
}

// --- pages ------------------------------------------------------------------

function buildHome(reports) {
  const [lead, ...rest] = reports;
  const featured = rest.slice(0, site.homeFeatured);

  const topics = topicIndex(reports);
  const rail = topics
    .map(
      ([t, list]) =>
        `<a href="${escAttr(topicHref(t))}">${esc(t)} <b>${list.length}</b></a>`,
    )
    .join('');

  const body = `${pageHead(
    `${site.name} · ${site.tagline}`,
    'Digital Reports',
    site.description,
    true,
  )}
<main class="shell" id="main">
  ${
    lead
      ? leadReport(lead)
      : `<div class="empty">No reports published yet. Add one with <code>npm run new</code>.</div>`
  }

  ${
    featured.length
      ? `<h2 class="band-title">More from the series <span class="count">${reports.length} total</span></h2>
  <div class="card-grid">${featured.map(card).join('\n')}</div>`
      : ''
  }

  ${
    topics.length
      ? `<h2 class="band-title" style="margin-top:3rem">Browse by topic</h2>
  <div class="topic-rail">${rail}</div>`
      : ''
  }

  <h2 class="band-title" style="margin-top:3rem">About the series</h2>
  <div class="prose">
    <p>${esc(site.name)} ${esc(site.property)} are web-native research reports: read in the browser, with live data visuals, source links on every quantitative claim, and a full citation. A new report is published each week.</p>
    <p>Citable PDF editions of the underlying research are held in the <a href="${escAttr(site.archive.url)}" rel="noopener" target="_blank">${esc(site.archive.label)}</a>, indexed for Google Scholar. <a href="/about/">More about the series →</a></p>
  </div>
</main>`;

  write('index.html', libraryPage({
    title: `${site.name} ${site.property}`,
    desc: site.description,
    pathname: '/',
    current: '/',
    body,
  }));
}

function buildReportIndex(reports) {
  const byYear = new Map();
  for (const r of reports) {
    const y = r.published.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(r);
  }

  const bands = [...byYear.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(
      ([year, list]) =>
        `<h2 class="band-title">${esc(year)} <span class="count">${list.length} report${list.length === 1 ? '' : 's'}</span></h2>
  <div class="card-grid">${list.map(card).join('\n')}</div>`,
    )
    .join('\n\n  ');

  const body = `${pageHead(
    'The series',
    'Reports',
    'Every digital report published to date, newest first.',
  )}
<main class="shell" id="main">
  ${bands || '<div class="empty">No reports published yet.</div>'}
</main>`;

  write('reports/index.html', libraryPage({
    title: 'Reports',
    desc: 'Every H Heuristics digital report published to date.',
    pathname: '/reports/',
    current: '/reports/',
    body,
  }));
}

function topicIndex(reports) {
  const map = new Map();
  for (const r of reports) {
    for (const t of r.topics || []) {
      if (!map.has(t)) map.set(t, []);
      map.get(t).push(r);
    }
  }
  // Configured topics first, in configured order; anything new sorts after.
  return [...map.entries()].sort((a, b) => {
    const ia = site.topicOrder.indexOf(a[0]);
    const ib = site.topicOrder.indexOf(b[0]);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a[0].localeCompare(b[0]);
  });
}

function buildTopics(reports) {
  const topics = topicIndex(reports);

  const rail = topics
    .map(([t, list]) => `<a href="${escAttr(topicHref(t))}">${esc(t)} <b>${list.length}</b></a>`)
    .join('');

  write('topics/index.html', libraryPage({
    title: 'Topics',
    desc: 'Browse the H Heuristics digital report series by topic.',
    pathname: '/topics/',
    current: '/topics/',
    body: `${pageHead('The series', 'Topics', 'The research themes running through the series.')}
<main class="shell" id="main">
  ${topics.length ? `<div class="topic-rail">${rail}</div>` : '<div class="empty">No topics yet.</div>'}
  ${topics
    .map(
      ([t, list]) => `<h2 class="band-title" id="${escAttr(topicHref(t).split('/')[2])}">${esc(t)} <span class="count">${list.length}</span></h2>
  <div class="card-grid">${list.map(card).join('\n')}</div>`,
    )
    .join('\n\n  ')}
</main>`,
  }));

  for (const [topic, list] of topics) {
    const href = topicHref(topic);
    write(`${href.slice(1)}index.html`, libraryPage({
      title: topic,
      desc: `H Heuristics digital reports on ${topic.toLowerCase()}.`,
      pathname: href,
      current: '/topics/',
      body: `${pageHead('Topic', topic, `${list.length} report${list.length === 1 ? '' : 's'} in this theme.`)}
<main class="shell" id="main">
  <div class="card-grid">${list.map(card).join('\n')}</div>
  <p style="margin-top:2.5rem"><a href="/topics/">← All topics</a></p>
</main>`,
    }));
  }
}

function buildAbout(reports) {
  const body = `${pageHead('About', 'About the series', 'What these reports are, how they are made, and how to cite them.')}
<main class="shell" id="main">
  <div class="prose">
    <h2>What this is</h2>
    <p>${esc(site.name)} ${esc(site.property)} is an independent research series on systemic risk, climate resilience, development finance and the energy transition — the interlocking pressures that decide how well societies absorb the shocks now arriving together.</p>
    <p>Each report is written for the browser rather than for paper. Charts are live data visuals rather than pictures of charts; every quantitative claim links to its primary source; and each report carries a report number, a publication date and a citation line, so it can be referenced like any other working paper.</p>

    <h2>Cadence</h2>
    <p>A new digital report is published each week. The series is cumulative: earlier reports stay online at stable addresses, and the argument develops across them rather than restarting each time.</p>

    <h2>Method</h2>
    <p>The reports are syntheses. They draw on institutional and peer-reviewed research — the IEA, IRENA, the IPCC, the World Bank, UNEP, the WHO and the WMO among others — and on primary reporting of country programmes. They are analytical rather than predictive: where a figure is a schematic or an illustrative scenario rather than a measurement, the caption says so.</p>

    <h2>Citation and licence</h2>
    <p>Each report page carries a full citation line in its footer. Citable PDF editions of the underlying research are held in the <a href="${escAttr(site.archive.url)}" rel="noopener" target="_blank">${esc(site.archive.label)}</a>, where they are indexed for Google Scholar.</p>
    <p>Published under <a href="${escAttr(site.license.url)}" rel="license noopener" target="_blank">${esc(site.license.name)}</a>. Machine-readable metadata for the whole series is available at <a href="/reports.json">/reports.json</a>, and updates at <a href="/feed.xml">/feed.xml</a>.</p>

    <h2>Contact</h2>
    <p>${esc(site.author)} — <a href="mailto:${escAttr(site.email)}">${esc(site.email)}</a></p>
  </div>
  ${
    reports.length
      ? `<h2 class="band-title" style="margin-top:3rem">Published so far <span class="count">${reports.length}</span></h2>
  <div class="card-grid">${reports.map(card).join('\n')}</div>`
      : ''
  }
</main>`;

  write('about/index.html', libraryPage({
    title: 'About',
    desc: 'About the H Heuristics digital report series — method, cadence, citation and licence.',
    pathname: '/about/',
    current: '/about/',
    body,
  }));
}

function build404() {
  write('404.html', libraryPage({
    title: 'Not found',
    desc: 'That page does not exist.',
    pathname: '/404.html',
    current: '',
    body: `${pageHead('Error 404', 'Page not found', 'That address does not match a report in this series.')}
<main class="shell" id="main">
  <p><a class="readbtn" href="/reports/">Browse all reports</a></p>
</main>`,
  }));
}

// --- machine-readable outputs ------------------------------------------------

function buildFeeds(reports) {
  const now = new Date().toUTCString();

  const items = reports
    .map((r) => {
      const url = `${site.siteUrl}/reports/${r.slug}/`;
      return `  <item>
    <title>${esc(r.title)}</title>
    <link>${esc(url)}</link>
    <guid isPermaLink="true">${esc(url)}</guid>
    <pubDate>${new Date(`${r.published}T09:00:00Z`).toUTCString()}</pubDate>
    <dc:creator>${esc(r.author || site.author)}</dc:creator>
    <description>${esc(r.dek)}</description>
${
  (r.abstract || []).length
    ? `    <content:encoded><![CDATA[${(r.abstract || [])
        .map((p) => `<p>${p}</p>`)
        .join('')}]]></content:encoded>\n`
    : ''
}    ${(r.topics || []).map((t) => `<category>${esc(t)}</category>`).join('\n    ')}
  </item>`;
    })
    .join('\n');

  write(
    'feed.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>${esc(site.name)} ${esc(site.property)}</title>
  <link>${esc(site.siteUrl)}/</link>
  <atom:link href="${esc(site.siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>${esc(site.description)}</description>
  <language>${esc(site.language)}</language>
  <lastBuildDate>${now}</lastBuildDate>
${items}
</channel>
</rss>
`,
  );

  const urls = [
    { loc: `${site.siteUrl}/`, pri: '1.0' },
    { loc: `${site.siteUrl}/reports/`, pri: '0.9' },
    { loc: `${site.siteUrl}/topics/`, pri: '0.6' },
    { loc: `${site.siteUrl}/about/`, pri: '0.5' },
    ...topicIndex(reports).map(([t]) => ({ loc: site.siteUrl + topicHref(t), pri: '0.5' })),
    ...reports.map((r) => ({
      loc: `${site.siteUrl}/reports/${r.slug}/`,
      pri: '0.9',
      lastmod: r.updated || r.published,
    })),
  ];

  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.pri}</priority></url>`,
  )
  .join('\n')}
</urlset>
`,
  );

  write(
    'reports.json',
    JSON.stringify(
      {
        series: `${site.name} ${site.property}`,
        url: `${site.siteUrl}/`,
        license: site.license.url,
        generated: new Date().toISOString(),
        count: reports.length,
        reports: reports.map((r) => ({
          number: r.number,
          slug: r.slug,
          title: r.title,
          subtitle: r.subtitle,
          dek: r.dek,
          abstract: r.abstract || [],
          url: `${site.siteUrl}/reports/${r.slug}/`,
          author: r.author || site.author,
          institution: r.institution || site.publisher,
          published: r.published,
          updated: r.updated || r.published,
          topics: r.topics || [],
          keywords: r.keywords || [],
          jel: r.jel || null,
          readingTime: r.readingTime,
          license: site.license.url,
        })),
      },
      null,
      2,
    ),
  );

  write(
    'robots.txt',
    isProduction
      ? `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n',
  );

  // Shared assets carry a content hash, so they can be cached indefinitely.
  // Everything under /reports/ — the pages themselves and each report's own
  // theme.css and charts.js — is unhashed and must revalidate, or a reader
  // ends up pairing a stale stylesheet with fresh markup.
  write(
    '_headers',
    `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/reports/*
  Cache-Control: public, max-age=0, must-revalidate

/reports.json
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=3600

/feed.xml
  Cache-Control: public, max-age=3600

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
`,
  );
}

// --- run ---------------------------------------------------------------------

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const reports = loadReports();

  copyDir(path.join(ROOT, 'public'), DIST);
  setAssets(buildAssets());

  for (const r of reports) {
    write(`reports/${r.slug}/index.html`, reportShell(r, r.body));

    // Everything else in the report directory travels with it — charts.js,
    // and any images or data files a particular report needs.
    for (const entry of fs.readdirSync(r.dir, { withFileTypes: true })) {
      if (entry.name === 'report.json' || entry.name === 'body.html') continue;
      const src = path.join(r.dir, entry.name);
      const dst = path.join(DIST, 'reports', r.slug, entry.name);
      if (entry.isDirectory()) copyDir(src, dst);
      else fs.copyFileSync(src, dst);
    }
  }

  buildHome(reports);
  buildReportIndex(reports);
  buildTopics(reports);
  buildAbout(reports);
  build404();
  buildFeeds(reports);

  console.log(`✓ built ${reports.length} report${reports.length === 1 ? '' : 's'} → dist/`);
  console.log(`  origin: ${site.siteUrl}${isProduction ? '' : '  (preview — noindex)'}`);
  for (const r of reports) console.log(`  · ${r.number}  /reports/${r.slug}/`);
}

main();
