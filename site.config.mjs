// ---------------------------------------------------------------------------
// Site-wide configuration for H Heuristics Digital Reports.
//
// CANONICAL_ORIGIN is load-bearing: canonical links, Open Graph URLs, the
// sitemap and the RSS feed are all built from it, so it must be the permanent
// public domain rather than whichever host happens to serve a given deploy.
//
// CF_PAGES_URL is deliberately NOT used on production builds. Cloudflare sets
// it to the per-deployment host (<hash>.<project>.pages.dev), a different
// string on every push; canonicalising to it would publish URLs that break on
// the next deploy. Preview branches may use it — they are noindex anyway, and
// their deployment host is the correct self-reference there.
// ---------------------------------------------------------------------------

const CANONICAL_ORIGIN = 'https://digitalreports.hheuristics.com';

export const isProduction =
  process.env.CF_PAGES_BRANCH === undefined ||
  process.env.CF_PAGES_BRANCH === 'main' ||
  process.env.CF_PAGES_BRANCH === 'master';

const resolvedOrigin =
  process.env.SITE_URL ||
  (isProduction ? CANONICAL_ORIGIN : process.env.CF_PAGES_URL || CANONICAL_ORIGIN);

export default {
  siteUrl: resolvedOrigin.replace(/\/$/, ''),

  name: 'H Heuristics',
  property: 'Digital Reports',
  tagline: 'Navigating a Changing World',
  description:
    'Web-native long-form research on systemic risk, climate resilience, development finance and the energy transition. New reports weekly.',
  author: 'Hunter Hughes',
  email: 'hunter.hughes.r@gmail.com',
  series: 'Digital Report',
  publisher: 'H Heuristics',
  language: 'en',
  locale: 'en_US',

  // The sibling archive. Cross-linked, not replaced: it holds the
  // Google Scholar-indexed PDF editions of the same research.
  archive: {
    label: 'Research Archive',
    url: 'https://researchreports.hheuristics.com',
    note: 'Citable PDF editions, indexed for Google Scholar.',
  },

  license: {
    name: 'CC BY-NC-ND 4.0',
    short: 'CC BY-NC-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  },

  // Display order for topic facets. Anything not listed sorts alphabetically
  // after these, so a new topic on a new report never breaks the build.
  topicOrder: [
    'Systemic Risk',
    'Climate Adaptation',
    'Energy Transition',
    'Development Finance',
    'Infrastructure',
    'Institutions & Governance',
    'Emerging Markets',
    'Public Health',
    'Human Capital',
    'Environment & Biodiversity',
    'Technology',
  ],

  nav: [
    { href: '/reports/', label: 'Reports' },
    { href: '/topics/', label: 'Topics' },
    { href: '/about/', label: 'About' },
  ],

  // Reading-speed assumption for the "N min read" badge.
  wordsPerMinute: 220,

  // How many reports appear on the homepage below the lead story.
  homeFeatured: 6,
};
