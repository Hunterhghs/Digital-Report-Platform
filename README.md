# H Heuristics Digital Reports

Publishing platform for the **H Heuristics Digital Report** series — web-native
long-form research read in the browser, with live data visuals, source links on
every quantitative claim, and a citation on every page. A new report each week.

Sibling to the [Research Archive](https://researchreports.hheuristics.com),
which holds the citable, Google Scholar-indexed PDF editions. This platform is
the reading experience; that one is the citation of record.

---

## Quick start

```bash
npm run dev
```

Builds to `dist/` and serves it at <http://localhost:4321> with the same clean-URL
resolution Cloudflare Pages uses, so local and deployed behaviour match.

There are **no dependencies and no install step**. Everything is plain Node ESM
plus the standard library, by design: the build must keep working on whatever
Node version Cloudflare ships, years from now.

| Command | Does |
| --- | --- |
| `npm run build` | Generate `dist/` |
| `npm run dev` | Build, then serve |
| `npm run serve` | Serve an existing `dist/` |
| `npm run new -- <slug> "Title"` | Scaffold the next report |

---

## Publishing a report

```bash
npm run new -- energy-poverty-convergence "Energy Poverty and the Convergence Debate"
```

That creates `reports/<slug>/` with three files. Fill in the TODOs and build.

```
reports/<slug>/
  report.json   the record — metadata, abstract, section nav, highlights
  body.html     the article: a series of <section> elements
  charts.js     the report's data visuals
  theme.css     optional — gives this report its own aesthetic
  og.png        optional — social preview card
```

`theme.css` and `og.png` are picked up by their presence alone; nothing needs
declaring.

The **directory name is the URL**, so the slug and the published address can
never drift apart. Everything else in the directory (`charts.js`, any images or
data files) is copied through to `dist/reports/<slug>/`.

Nothing else needs editing. The front page, the reports index, the topic pages,
the RSS feed, the sitemap and `reports.json` all regenerate from the report
records on every build.

### report.json

| Field | Notes |
| --- | --- |
| `number` | `YYYY-NN`. `npm run new` assigns the next one automatically. |
| `title` / `subtitle` | Masthead. Keep the title a title, not a sentence. |
| `strapline` | Optional single-sentence thesis, set below the subtitle. Omit the field to hide it. |
| `dek` | Two or three sentences. Used on cards, in the feed, and in social previews. |
| `abstract` | **Required.** Array of paragraphs. Rendered as a visible Abstract section, and carried into the head metadata, the RSS feed and `reports.json` — this is what indexers read. The build warns if it is missing. |
| `jel` | JEL codes with plain-language glosses. Shown in the end matter. |
| `method` | What was synthesised, and what is schematic or illustrative rather than measured. Shown in the end matter. |
| `published` / `updated` | `YYYY-MM-DD`, parsed as UTC. |
| `readingTime` | Minutes. Roughly words ÷ 220. |
| `topics` | Facets. Add new ones to `topicOrder` in `site.config.mjs` to control where they sort. |
| `sections` | `{ id, label }` per section — drives the sticky nav and the scroll-spy. Each `id` must match a `<section id="...">` in `body.html`. |
| `highlights` | `{ value, label }` — the figures shown under the lead story on the front page. |
| `charts` | Set `false` for a report with no data visuals; Chart.js and `charts.js` are then not loaded. |
| `fontsUrl` | Google Fonts URL, when the report's theme uses a different type stack. Falls back to the default when null. |
| `themeColor` | Browser UI colour, to match the report's masthead. |
| `pdfUrl` / `archiveUrl` | Absolute URL of a PDF edition, if one exists. `pdfUrl` also emits `citation_pdf_url` for Google Scholar. |

### body.html

A fragment, not a document: a series of `<section id="…">` elements separated by
`<hr class="section-rule">`. The shell — masthead, nav, footer, metadata,
citation — is added at build time.

The component vocabulary, all defined in `assets/report.css`:

| Markup | Use |
| --- | --- |
| `<p class="section-dek">` | Italic standfirst under a section heading |
| `.exec-grid` / `.exec-card` | Numbered executive-summary cards |
| `.stat-grid` / `.stat-card` | Headline figures with a source line |
| `.chart-container` + `.chart-frame` + `<canvas>` | A data visual, with `.chart-label` above and `.chart-caption` below |
| `.chart-pair` | Two charts side by side |
| `.matrix` | Qualitative heat-map table (`.lv0`–`.lv3` cells) |
| `.data-table` inside `.tbl-scroll` | Booktabs-style data table |
| `.callout` / `.callout--warn` | Boxed aside with a `.callout-title` |
| `.pull-quote` + `.attribution` | Display quote |
| `.ref-list` | References, each with a `.ref-org` label |
| `svg.schematic` inside `.schematic-wrap` | Inline SVG diagram |

Wide content must sit inside `.tbl-scroll` (tables) or `.schematic-wrap`
(diagrams) so it scrolls itself rather than the page. A schematic's labels are
sized to its `viewBox`, so it holds a 620px minimum and pans on a phone rather
than shrinking its type to four pixels.

The Abstract and Metadata sections are generated from `report.json` — do not
write them into `body.html`. They are added to the section nav automatically.

### charts.js

Charts are [Chart.js](https://www.chartjs.org) v4, loaded from a CDN and given
house defaults by `assets/report.js`. A report file carries only its data:

```js
(function () {
  'use strict';
  if (!window.HH) return;

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var C = HH.palette;

    HH.chart('chart-additions', {
      type: 'bar',
      data: { /* … */ },
      options: {
        scales: { x: HH.axis({ grid: false }), y: HH.axis({ title: 'GW' }) },
      },
      plugins: [HH.valueLabels({ format: function (v) { return v + ' GW'; } })],
    });
  });
})();
```

| Helper | Does |
| --- | --- |
| `HH.onReady(fn)` | Runs `fn` once the runtime is up. Use this, not a bare `hh:ready` listener — chart files load *after* the event fires. |
| `HH.chart(id, config)` | Renders into `<canvas id>`; a failure is logged, never fatal. |
| `HH.axis({ title, grid })` | House axis styling, so charts don't repeat it. |
| `HH.valueLabels({ axis, format, only })` | Prints values on bars — `axis: 'x'` for horizontal bars, `only: [i, …]` to label a subset. |
| `HH.palette` | `blue`, `teal`, `gold`, `red`, `orange`, `purple`, `gray`, `ink`, `muted`, `grid`. |

Printed values matter more than hover in a report: a reader scanning a figure,
or printing the page, should get the number without interacting.

---

## Design

`assets/report.css` is the base layer: design tokens, layout, the responsive
rules, the component skeletons and a real print stylesheet. Its defaults are the
house look — `#1a1f2b` ink-navy masthead over `#fafaf8` paper, `#8b6914` gold
rules, Newsreader / Inter / JetBrains Mono. Library pages add `platform.css`.

### Giving a report its own aesthetic

Each report is meant to look like its own publication. Drop a `theme.css` into
the report's directory and the build loads it after `report.css`; name any
different type stack as `fontsUrl` in the record.

A theme should redefine the tokens first and then override only the rules that
assume the default surface:

```css
:root {
  --bg: #f6f3ec;          /* also re-colours every chart: report.js reads   */
  --primary: #1d4438;     /* the --chart-* tokens from the computed styles  */
  --accent: #a8492a;
  --serif: "IBM Plex Serif", Georgia, serif;
}
.masthead { background: var(--bg); color: var(--text); }  /* light, not dark */
section > h2 { border-bottom: 0; border-left: 4px solid var(--accent); }
```

Because `report.js` reads the `--chart-*` tokens at runtime, redefining them is
all it takes to redraw the report's figures in the new palette — no hex values
belong in a `charts.js`.

The two published themes are worth comparing: `2026-01` uses the default dark
ink-navy hero; `2026-02` is a light "field atlas" — sand ground, a heavy forest
rule instead of a dark block, terracotta section bars, ledger-style stat cards
with the label above the value, and IBM Plex throughout.

Whatever the surface, the structure stays shared: masthead, sticky section nav,
abstract, body, end matter, footer. That is what keeps a varied series legible
as one publication.

---

## Indexing

Every report page is generated with a full metadata set, so nothing can ship
unindexed:

- **Open Graph and Twitter** cards; `og:image` when the report has an `og.png`.
- **Dublin Core** (`DC.title`, `DC.creator`, `DC.subject`, `DC.rights`, …).
- **Google Scholar** citation tags on the *technical report* profile —
  `citation_technical_report_institution` and `_number`, not journal tags,
  because these are numbered institutional reports. `citation_pdf_url` is
  emitted when a `pdfUrl` is set.
- **schema.org JSON-LD** as a `Report`, with `abstract`, `keywords`,
  `reportNumber`, `timeRequired` and `license`.
- A visible **Abstract** block and an **end matter** section carrying keywords,
  JEL classification, the method note, the licence and the citation line.
- `reports.json` (CORS-open), an RSS feed carrying `content:encoded` abstracts,
  and a sitemap with `lastmod`.

All of it comes from `report.json`. The build prints a warning for any report
without an abstract.

---

## Deployment — Cloudflare Pages

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 18+ (`.nvmrc` pins 20) |
| Install command | *leave empty* — there are no dependencies |

`_headers` is generated into `dist/` on every build: a week's cache on
`/assets/*`, an hour on the feed and `reports.json` (which is served
CORS-open), and `nosniff` / `Referrer-Policy` / `X-Frame-Options` everywhere.

### The canonical origin

`CANONICAL_ORIGIN` in `site.config.mjs` is the single source of truth for
canonical links, Open Graph URLs, the sitemap, the feed and every citation line.

**Do not replace it with `CF_PAGES_URL` on production builds.** Cloudflare sets
that to the per-deployment host (`<hash>.<project>.pages.dev`), a different
string on every push, so canonicalising to it publishes citation URLs that break
on the next deploy. Preview branches do use it — they are `noindex` anyway, and
their deployment host is the correct self-reference there. `SITE_URL` overrides
both. If the domain moves, change that one constant.

Set the custom domain in the Pages dashboard, then update `CANONICAL_ORIGIN` to
match.

---

## Not yet done

- **`og:image` cards.** The plumbing is in place — drop an `og.png` into a
  report's directory and it is picked up and referenced automatically — but no
  report ships one yet, so social previews are text-only. Generating them in the
  build would need an image dependency this project deliberately does not have;
  exporting a card per report by hand, or a small Worker, would close it.
- **Search.** Fine at this size; `reports.json` is the natural index when the
  series is large enough to need one.
