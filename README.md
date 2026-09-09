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
  report.json   the record — title, dek, date, topics, section nav, highlights
  body.html     the article: a series of <section> elements
  charts.js     the report's data visuals
```

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
| `published` / `updated` | `YYYY-MM-DD`, parsed as UTC. |
| `readingTime` | Minutes. Roughly words ÷ 220. |
| `topics` | Facets. Add new ones to `topicOrder` in `site.config.mjs` to control where they sort. |
| `sections` | `{ id, label }` per section — drives the sticky nav and the scroll-spy. Each `id` must match a `<section id="...">` in `body.html`. |
| `highlights` | `{ value, label }` — the figures shown under the lead story on the front page. |
| `charts` | Set `false` for a report with no data visuals; Chart.js and `charts.js` are then not loaded. |

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
| `svg.schematic` | Inline SVG diagram |

Wide content must sit inside `.tbl-scroll` so it scrolls itself rather than the
page.

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

Tokens live at the top of `assets/report.css` and are shared by every page:
`#1a1f2b` ink-navy masthead over `#fafaf8` paper, `#8b6914` gold rules,
Newsreader for display, Inter for text, JetBrains Mono for labels. Reports and
library pages both load `report.css`; library pages add `platform.css`.

The look is deliberately print-adjacent — hairline rules, bordered cards, no
drop shadows — and there is a real print stylesheet, so a report prints
legibly with the navigation and progress bar suppressed.

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

- **`og:image`.** Social previews currently carry title and description but no
  image, because generating a PNG card needs a dependency this build does not
  have. A static card per report, or a small Worker, would close it.
- **Search.** Fine at this size; `reports.json` is the natural index when the
  series is large enough to need one.
