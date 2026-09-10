// ---------------------------------------------------------------------------
// Shared page chrome.
//
// Every page — the library pages and each digital report — is wrapped here, so
// the masthead, navigation, metadata and footer stay identical across the
// series and improve for all reports at once. A report file contributes only
// its own body, its charts, and optionally a theme.css that re-skins the shell.
//
// Indexing is handled here rather than per report, so no report can ship
// without an abstract, keywords, a classification and a citation: the head
// carries Open Graph, Twitter, Dublin Core, Google Scholar citation tags and
// schema.org JSON-LD, and the page itself carries a visible abstract block and
// end matter. All of it is generated from report.json.
// ---------------------------------------------------------------------------

import site, { isProduction } from '../site.config.mjs';
import { esc, escAttr } from './inline.mjs';

// Default type for the library pages and for any report that does not name its
// own. A report with a theme.css usually ships a different stack, and supplies
// the matching Google Fonts URL as `fontsUrl` in its record.
const FONTS =
  'https://fonts.googleapis.com/css2' +
  '?family=Inter:wght@300;400;500;600;700' +
  '&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700' +
  '&family=JetBrains+Mono:wght@400;500' +
  '&display=swap';

const DEFAULT_THEME_COLOR = '#1a1f2b';

// Shared assets are content-hashed at build time so a browser holding a stale
// stylesheet can never pair it with fresh HTML. The build calls setAssets()
// with the map; anything not in the map (a report's own theme.css) passes
// through unchanged.
let ASSETS = {};
export function setAssets(map) {
  ASSETS = map || {};
}
export function asset(p) {
  return ASSETS[p] || p;
}

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
 * @param {string} o.title       page title, without the site suffix
 * @param {string} o.desc        meta description
 * @param {string} o.path        absolute site path, e.g. "/reports/foo/"
 * @param {string} [o.type]      Open Graph type
 * @param {string[]} [o.css]     extra stylesheets, loaded after report.css
 * @param {string} [o.fonts]     Google Fonts URL override
 * @param {string} [o.themeColor]
 * @param {string} [o.image]     absolute URL for og:image
 * @param {string[]} [o.keywords]
 * @param {object} [o.article]   { published, modified, author, topics }
 * @param {string} [o.jsonLd]    serialised JSON-LD
 * @param {string} [o.extraMeta] raw meta tags (Dublin Core, citation_*)
 */
export function head(o) {
  const url = site.siteUrl + o.path;
  const suffix = `${site.name} ${site.property}`;
  // The front page's own title already is the suffix; appending it would read
  // "Digital Reports — H Heuristics Digital Reports" in the browser tab.
  const full = o.title.endsWith(site.property) ? o.title : `${o.title} — ${suffix}`;
  const css = ['/assets/report.css', ...(o.css || [])].map(asset);

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${escAttr(o.desc)}">
${o.keywords && o.keywords.length ? `<meta name="keywords" content="${escAttr(o.keywords.join(', '))}">\n` : ''}<link rel="canonical" href="${escAttr(url)}">
${isProduction ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<meta name="author" content="${escAttr(site.author)}">
<meta name="theme-color" content="${escAttr(o.themeColor || DEFAULT_THEME_COLOR)}">

<meta property="og:type" content="${escAttr(o.type || 'website')}">
<meta property="og:site_name" content="${escAttr(suffix)}">
<meta property="og:title" content="${escAttr(o.title)}">
<meta property="og:description" content="${escAttr(o.desc)}">
<meta property="og:url" content="${escAttr(url)}">
<meta property="og:locale" content="${escAttr(site.locale)}">
${o.image ? `<meta property="og:image" content="${escAttr(o.image)}">\n<meta property="og:image:alt" content="${escAttr(o.title)}">\n` : ''}${
    o.article
      ? `<meta property="article:published_time" content="${escAttr(o.article.published)}">
<meta property="article:modified_time" content="${escAttr(o.article.modified || o.article.published)}">
<meta property="article:author" content="${escAttr(o.article.author || site.author)}">
${(o.article.topics || []).map((t) => `<meta property="article:tag" content="${escAttr(t)}">`).join('\n')}
`
      : ''
  }<meta name="twitter:card" content="${o.image ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${escAttr(o.title)}">
<meta name="twitter:description" content="${escAttr(o.desc)}">
${o.extraMeta ? `\n${o.extraMeta}\n` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${escAttr(suffix)}" href="/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${escAttr(o.fonts || FONTS)}">
${css.map((h) => `<link rel="stylesheet" href="${escAttr(h)}">`).join('\n')}
${o.jsonLd ? `<script type="application/ld+json">${o.jsonLd}</script>` : ''}`;
}

/** The dark strip that carries the reader back to the library. */
export function siteBar(current = '') {
  const links = site.nav
    .map((n) => {
      const on = current === n.href;
      return `<a href="${escAttr(n.href)}"${on ? ' aria-current="page" class="is-current"' : ''}>${esc(n.label)}</a>`;
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

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

function citationLine(report) {
  const url = `${site.siteUrl}/reports/${report.slug}/`;
  return (
    `${report.author || site.author} (${report.published.slice(0, 4)}). ` +
    `${report.title}: ${report.subtitle}. ` +
    `${site.publisher} ${site.series} ${report.number}. ${url}`
  );
}

/**
 * Head metadata beyond Open Graph: Dublin Core for general-purpose crawlers,
 * and the Google Scholar citation profile. Scholar's technical-report profile
 * is the right one for this series — it is a numbered report from an
 * institution, not a journal article.
 */
function reportMeta(report) {
  const url = `${site.siteUrl}/reports/${report.slug}/`;
  const abstract = (report.abstract || []).join(' ');
  const keywords = (report.keywords || []).join('; ');

  const tags = [
    ['DC.title', report.title],
    ['DC.creator', report.author || site.author],
    ['DC.publisher', site.publisher],
    ['DC.date', report.published],
    ['DC.type', 'Text.Report'],
    ['DC.format', 'text/html'],
    ['DC.identifier', url],
    ['DC.language', site.language],
    ['DC.rights', site.license.url],
    ['DC.description', abstract || report.dek],
    ...(report.topics || []).map((t) => ['DC.subject', t]),

    ['citation_title', `${report.title}: ${report.subtitle}`],
    ['citation_author', report.author || site.author],
    ['citation_author_institution', report.institution || site.publisher],
    ['citation_publication_date', report.published.replace(/-/g, '/')],
    ['citation_online_date', report.published.replace(/-/g, '/')],
    ['citation_technical_report_institution', report.institution || site.publisher],
    ['citation_technical_report_number', report.number],
    ['citation_abstract_html_url', url],
    ['citation_language', site.language],
    ...(keywords ? [['citation_keywords', keywords]] : []),
    ...(report.pdfUrl ? [['citation_pdf_url', report.pdfUrl]] : []),
  ];

  return tags
    .filter(([, v]) => v)
    .map(([n, v]) => `<meta name="${escAttr(n)}" content="${escAttr(v)}">`)
    .join('\n');
}

function reportJsonLd(report) {
  const url = `${site.siteUrl}/reports/${report.slug}/`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: report.title,
    name: `${report.title}: ${report.subtitle}`,
    alternativeHeadline: report.subtitle,
    abstract: (report.abstract || []).join(' ') || report.dek,
    description: report.dek,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: report.published,
    dateModified: report.updated || report.published,
    inLanguage: site.language,
    keywords: (report.keywords || report.topics || []).join(', '),
    reportNumber: report.number,
    timeRequired: `PT${report.readingTime}M`,
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: report.author || site.author,
      affiliation: { '@type': 'Organization', name: report.institution || site.publisher },
    },
    publisher: {
      '@type': 'Organization',
      name: site.publisher,
      url: site.siteUrl,
    },
    isPartOf: {
      '@type': 'PublicationIssue',
      name: `${site.name} ${site.property}`,
      url: `${site.siteUrl}/reports/`,
    },
    license: site.license.url,
    citation: citationLine(report),
    about: (report.topics || []).map((t) => ({ '@type': 'Thing', name: t })),
  });
}

/** Visible abstract block — scholarly summary, and the first thing a crawler
 *  reads inside the article. */
function abstractBlock(report) {
  if (!report.abstract || !report.abstract.length) return '';
  return `<section class="abstract" id="abstract">
  <h2>Abstract</h2>
  ${report.abstract.map((p) => `<p>${esc(p)}</p>`).join('\n  ')}
</section>`;
}

/** End matter — keywords, classification, method note, citation. */
function endMatter(report) {
  const rows = [];

  if (report.keywords && report.keywords.length) {
    rows.push([
      'Keywords',
      report.keywords
        .map((k) => `<span class="kw">${esc(k)}</span>`)
        .join(''),
    ]);
  }
  if (report.topics && report.topics.length) {
    rows.push([
      'Topics',
      report.topics
        .map((t) => `<a class="chip" href="${escAttr(topicHref(t))}">${esc(t)}</a>`)
        .join(' '),
    ]);
  }
  if (report.jel) rows.push(['JEL classification', esc(report.jel)]);
  if (report.method) rows.push(['Data and method', esc(report.method)]);

  rows.push([
    'Report',
    `${esc(site.publisher)} ${esc(site.series)} № ${esc(report.number)} · Published ${esc(longDate(report.published))}` +
      (report.updated && report.updated !== report.published
        ? ` · Updated ${esc(longDate(report.updated))}`
        : ''),
  ]);
  rows.push([
    'Licence',
    `<a href="${escAttr(site.license.url)}" rel="license noopener" target="_blank">${esc(site.license.name)}</a>`,
  ]);
  rows.push(['Cite as', `<span class="cite-inline">${esc(citationLine(report))}</span>`]);

  return `<section class="endmatter" id="metadata">
  <h2>Metadata</h2>
  <dl class="endmatter__list">
${rows.map(([k, v]) => `    <div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('\n')}
  </dl>
</section>`;
}

/**
 * Wrap a report body in the report shell.
 * @param {object} report  the report.json record, plus build-time flags
 *                         (`hasTheme`, `hasOgImage`)
 * @param {string} body    the article HTML (a series of <section> elements)
 */
export function reportShell(report, body) {
  const url = `${site.siteUrl}/reports/${report.slug}/`;

  // Abstract and metadata are generated, so they are added to the section nav
  // here rather than being repeated in every report's `sections` array.
  const navItems = [
    ...(report.abstract && report.abstract.length ? [{ id: 'abstract', label: 'Abstract' }] : []),
    ...(report.sections || []),
    { id: 'metadata', label: 'Metadata' },
  ];
  const nav = navItems
    .map((s) => `<a href="#${escAttr(s.id)}">${esc(s.label)}</a>`)
    .join('');

  const meta = [
    ['Author', esc(report.author || site.author)],
    ['Institution', esc(report.institution || site.publisher)],
    ['Published', esc(longDate(report.published))],
    ['Report №', esc(report.number)],
    ['Reading time', `${esc(String(report.readingTime))} min`],
  ]
    .map(([k, v]) => `<div><strong>${k}</strong>${v}</div>`)
    .join('\n      ');

  const css = report.hasTheme ? [`/reports/${report.slug}/theme.css`] : [];
  const image = report.hasOgImage ? `${url}og.png` : undefined;

  const headHtml = head({
    title: report.title,
    desc: report.dek,
    path: `/reports/${report.slug}/`,
    type: 'article',
    css,
    fonts: report.fontsUrl,
    themeColor: report.themeColor,
    image,
    keywords: report.keywords,
    article: {
      published: report.published,
      modified: report.updated || report.published,
      author: report.author || site.author,
      topics: report.topics,
    },
    extraMeta: reportMeta(report),
    jsonLd: reportJsonLd(report),
  });

  const archiveNote = report.archiveUrl
    ? `<p style="margin-top:1.4rem"><a href="${escAttr(report.archiveUrl)}" rel="noopener" target="_blank">Citable PDF edition →</a> ${esc(site.archive.note)}</p>`
    : `<p style="margin-top:1.4rem">Citable PDF editions of the ${esc(site.name)} research series are held in the <a href="${escAttr(site.archive.url)}" rel="noopener" target="_blank">${esc(site.archive.label)}</a>.</p>`;

  const scripts = [];
  if (report.charts !== false) scripts.push(CHART_JS);
  scripts.push(asset('/assets/report.js'));
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
${abstractBlock(report)}
${abstractBlock(report) ? '<hr class="section-rule">\n' : ''}${body}
<hr class="section-rule">
${endMatter(report)}
  <div class="back-top"><a href="#main">↑ Back to top</a></div>
</main>

${footer({
  extra: archiveNote,
  cite: `<div class="cite-box"><strong>Cite as:</strong><br>${esc(citationLine(report))}</div>`,
})}`;

  return page({ headHtml, bodyClass: `report report--${report.slug}`, body: bodyHtml, scripts });
}
