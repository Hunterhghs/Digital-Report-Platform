// ---------------------------------------------------------------------------
// Shared page chrome.
//
// Every page — the library pages and each digital report — is wrapped here, so
// the masthead, navigation, metadata and footer stay identical across the
// series and improve for all reports at once. A report file contributes only
// its own body and charts.
// ---------------------------------------------------------------------------

import site, { isProduction } from '../site.config.mjs';
import { esc, escAttr } from './inline.mjs';

const FONTS =
  'https://fonts.googleapis.com/css2' +
  '?family=Inter:wght@300;400;500;600;700' +
  '&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700' +
  '&family=JetBrains+Mono:wght@400;500' +
  '&display=swap';

export const CHART_JS = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';

/** "2026-09-10" → "10 September 2026". Dates are parsed as UTC on purpose:
 *  a bare date string is otherwise read as local midnight and can render as
 *  the previous day west of Greenwich. */
export function longDate(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function monthYear(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function topicHref(topic) {
  return `/topics/${topic.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/`;
}

/**
 * <head> for any page.
 * @param {object} o
 * @param {string} o.title     page title, without the site suffix
 * @param {string} o.desc      meta description
 * @param {string} o.path      absolute site path, e.g. "/reports/foo/"
 * @param {string} [o.type]    Open Graph type
 * @param {string[]} [o.css]   extra stylesheets
 * @param {object} [o.article] { published, modified, author, topics }
 * @param {string} [o.jsonLd]  serialised JSON-LD
 */
export function head(o) {
  const url = site.siteUrl + o.path;
  const suffix = `${site.name} ${site.property}`;
  // The front page's own title already is the suffix; appending it would read
  // "Digital Reports — H Heuristics Digital Reports" in the browser tab.
  const full = o.title.endsWith(site.property) ? o.title : `${o.title} — ${suffix}`;
  const css = ['/assets/report.css', ...(o.css || [])];

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${escAttr(o.desc)}">
<link rel="canonical" href="${escAttr(url)}">
${isProduction ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<meta name="author" content="${escAttr(site.author)}">
<meta name="theme-color" content="#1a1f2b">

<meta property="og:type" content="${escAttr(o.type || 'website')}">
<meta property="og:site_name" content="${escAttr(site.name + ' ' + site.property)}">
<meta property="og:title" content="${escAttr(o.title)}">
<meta property="og:description" content="${escAttr(o.desc)}">
<meta property="og:url" content="${escAttr(url)}">
<meta property="og:locale" content="${escAttr(site.locale)}">
${
  o.article
    ? `<meta property="article:published_time" content="${escAttr(o.article.published)}">
<meta property="article:modified_time" content="${escAttr(o.article.modified || o.article.published)}">
<meta property="article:author" content="${escAttr(o.article.author || site.author)}">
${(o.article.topics || []).map((t) => `<meta property="article:tag" content="${escAttr(t)}">`).join('\n')}
`
    : ''
}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(o.title)}">
<meta name="twitter:description" content="${escAttr(o.desc)}">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${escAttr(site.name + ' ' + site.property)}" href="/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
${css.map((h) => `<link rel="stylesheet" href="${escAttr(h)}">`).join('\n')}
${o.jsonLd ? `<script type="application/ld+json">${o.jsonLd}</script>` : ''}`;
}

/** The dark strip that carries the reader back to the library. */
export function siteBar(current = '') {
  const links = site.nav
    .map((n) => {
      const on = current === n.href;
      return `<a href="${escAttr(n.href)}"${on ? ' aria-current="page" style="color:var(--accent-light)"' : ''}>${esc(n.label)}</a>`;
    })
    .join('');

  return `<div class="sitebar">
  <div class="sitebar__inner">
    <a class="sitebar__brand" href="/">${esc(site.name)} <span>${esc(site.property)}</span></a>
    <nav class="sitebar__links" aria-label="Site">${links}</nav>
  </div>
</div>`;
}

/** Footer shared by the library pages and the reports. */
export function footer({ cite = '', extra = '' } = {}) {
  const year = new Date().getUTCFullYear();
  return `<footer class="report-footer">
  <div class="footer-inner">
    <h3>${esc(site.name)} · ${esc(site.property)}</h3>
    <p>${esc(site.description)}</p>
    ${extra}
    ${cite}
    <div class="footer-meta">
      <span>© ${year} ${esc(site.publisher)}</span>
      <span><a href="${escAttr(site.license.url)}" rel="license noopener" target="_blank">${esc(site.license.name)}</a></span>
      <span><a href="${escAttr(site.archive.url)}" rel="noopener" target="_blank">${esc(site.archive.label)}</a></span>
      <span><a href="/feed.xml">RSS</a></span>
      <span><a href="mailto:${escAttr(site.email)}">Contact</a></span>
    </div>
  </div>
</footer>`;
}

/** Full document wrapper. */
export function page({ headHtml, bodyClass = '', body, scripts = [] }) {
  return `<!doctype html>
<html lang="${escAttr(site.language)}">
<head>
${headHtml}
</head>
<body${bodyClass ? ` class="${escAttr(bodyClass)}"` : ''}>
<a class="skip-link" href="#main">Skip to content</a>
${body}
${scripts.map((s) => (s.startsWith('<') ? s : `<script src="${escAttr(s)}" defer></script>`)).join('\n')}
</body>
</html>`;
}

/**
 * Wrap a report body in the report shell.
 * @param {object} report  the report.json record
 * @param {string} body    the article HTML (a series of <section> elements)
 */
export function reportShell(report, body) {
  const nav = (report.sections || [])
    .map((s) => `<a href="#${escAttr(s.id)}">${esc(s.label)}</a>`)
    .join('');

  const url = `${site.siteUrl}/reports/${report.slug}/`;

  const meta = [
    ['Author', esc(report.author || site.author)],
    ['Institution', esc(report.institution || site.publisher)],
    ['Published', esc(longDate(report.published))],
    ['Report №', esc(report.number)],
    ['Reading time', `${esc(String(report.readingTime))} min`],
  ]
    .map(([k, v]) => `<div><strong>${k}</strong>${v}</div>`)
    .join('\n      ');

  const citation =
    `${report.author || site.author} (${report.published.slice(0, 4)}). ` +
    `${report.title}: ${report.subtitle}. ` +
    `${site.publisher} ${site.series} ${report.number}. ${url}`;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: report.title,
    alternativeHeadline: report.subtitle,
    description: report.dek,
    url,
    datePublished: report.published,
    dateModified: report.updated || report.published,
    inLanguage: site.language,
    keywords: (report.keywords || report.topics || []).join(', '),
    reportNumber: report.number,
    author: { '@type': 'Person', name: report.author || site.author },
    publisher: { '@type': 'Organization', name: site.publisher, url: site.siteUrl },
    isPartOf: { '@type': 'PublicationIssue', name: site.series },
    license: site.license.url,
    about: (report.topics || []).map((t) => ({ '@type': 'Thing', name: t })),
  });

  const headHtml = head({
    title: report.title,
    desc: report.dek,
    path: `/reports/${report.slug}/`,
    type: 'article',
    article: {
      published: report.published,
      modified: report.updated || report.published,
      author: report.author || site.author,
      topics: report.topics,
    },
    jsonLd,
  });

  const chips = (report.topics || [])
    .map((t) => `<a class="chip" href="${escAttr(topicHref(t))}">${esc(t)}</a>`)
    .join(' ');

  const archiveNote = report.archiveUrl
    ? `<p style="margin-top:1.4rem"><a href="${escAttr(report.archiveUrl)}" rel="noopener" target="_blank">Citable PDF edition →</a> ${esc(site.archive.note)}</p>`
    : `<p style="margin-top:1.4rem">Citable PDF editions of the ${esc(site.name)} research series are held in the <a href="${escAttr(site.archive.url)}" rel="noopener" target="_blank">${esc(site.archive.label)}</a>.</p>`;

  const scripts = [];
  if (report.charts !== false) scripts.push(CHART_JS);
  scripts.push('/assets/report.js');
  if (report.charts !== false) scripts.push(`/reports/${report.slug}/charts.js`);

  const bodyHtml = `<div class="progress" aria-hidden="true"><div class="progress__bar"></div></div>
${siteBar()}

<header class="masthead">
  <div class="masthead-inner">
    <p class="overline">${esc(site.name)} · ${esc(site.series)} № ${esc(report.number)} · ${esc(monthYear(report.published))}</p>
    <h1>${esc(report.title)}</h1>
    <p class="subtitle">${esc(report.subtitle)}</p>
    ${report.strapline ? `<p class="strapline">${esc(report.strapline)}</p>` : ''}
    <div class="meta-row">
      ${meta}
    </div>
  </div>
</header>

<nav class="sticky-nav" aria-label="Report sections">
  <div class="nav-inner">${nav}</div>
</nav>

<main class="content" id="main">
${body}
  <div class="back-top"><a href="#main">↑ Back to top</a></div>
</main>

${footer({
  extra: `<p style="margin-top:1rem">Topics: ${chips}</p>${archiveNote}`,
  cite: `<div class="cite-box"><strong style="color:var(--accent-light)">Cite as:</strong><br>${esc(citation)}</div>`,
})}`;

  return page({ headHtml, body: bodyHtml, scripts });
}
