/* =============================================================================
   H Heuristics — 21st Century Dashboard
   Data layer. Every dataset carries a `source` string and, where values are
   read off published charts, interpolated between reported years, or taken
   from preliminary releases, an `approx: true` flag. Update numbers here;
   panels in app.js read from this object and never hard-code values.
   ============================================================================= */

window.HH_DATA = (function () {
  'use strict';

  const D = {};

  D.meta = {
    build: 'October 2026 build',
    vintage: 'Latest available releases, 2024–2025 editions',
    brand: 'H Heuristics',
    tagline: 'Data · Clarity · Judgment'
  };

  /* ---------------------------------------------------------------------------
     01 · OVERVIEW — headline signals
  --------------------------------------------------------------------------- */
  D.overview = {
    kpis: [
      { label: 'Global mean temperature, 2024', value: '+1.55 °C', delta: 'Warmest year on record', dir: 'bad', note: 'vs 1850–1900 · WMO consolidated' },
      { label: 'Atmospheric CO₂, 2024 mean', value: '424.6 ppm', delta: '+3.7 ppm YoY, largest rise recorded', dir: 'bad', note: 'Mauna Loa · NOAA GML' },
      { label: 'World population, 2025', value: '8.2 bn', delta: 'TFR 2.25 and falling', dir: 'neutral', note: 'UN WPP 2024' },
      { label: 'Solar + wind share of electricity', value: '15 %', delta: '+1.6 pp YoY', dir: 'good', note: 'Global, 2024 · Ember' },
      { label: 'EV share of new car sales', value: '22 %', delta: '17.3 m units, +25 % YoY', dir: 'good', note: 'Global, 2024 · IEA' },
      { label: 'Corporate AI investment, 2024', value: '$252 bn', delta: '+26 % YoY', dir: 'neutral', note: 'Stanford AI Index 2025' },
      { label: 'Forcibly displaced, end-2024', value: '123 m', delta: '13th consecutive annual rise', dir: 'bad', note: 'UNHCR Global Trends' },
      { label: 'People breathing air above WHO PM₂.₅ guideline', value: '99 %', delta: '≈ 8.1 m deaths / yr', dir: 'bad', note: 'WHO · State of Global Air 2024' }
    ]
  };

  /* Signal board sparklines: one per system, short series */
  D.signals = [
    { section: 'diffusion', label: 'Internet users, % of world', unit: '%', data: [[2000, 6.7], [2005, 15.8], [2010, 28.9], [2015, 40.9], [2020, 59.3], [2024, 68.0]], headline: '68 %', sub: 'of humanity online, 2024' },
    { section: 'convergence', label: 'China GDP per capita, % of US (PPP)', unit: '%', data: [[2000, 7.8], [2005, 11.0], [2010, 16.9], [2015, 22.6], [2020, 27.1], [2024, 29.6]], headline: '30 %', sub: 'of US income level, 2024' },
    { section: 'demography', label: 'US non-Hispanic white share', unit: '%', data: [[2000, 69.1], [2010, 63.7], [2020, 57.8], [2030, 55.4], [2040, 51.6], [2050, 48.0]], headline: '< 50 %', sub: 'projected mid-2040s' },
    { section: 'polycrisis', label: 'Forcibly displaced, millions', unit: 'm', data: [[2010, 43.7], [2014, 59.5], [2018, 70.8], [2020, 82.4], [2022, 108.4], [2024, 123.2]], headline: '123 m', sub: 'displaced, end-2024' },
    { section: 'exposure', label: 'Global temperature anomaly, °C', unit: '°C', data: [[2000, 0.70], [2005, 0.90], [2010, 0.95], [2015, 1.17], [2020, 1.27], [2024, 1.55]], headline: '+1.55 °C', sub: 'above pre-industrial, 2024' },
    { section: 'transition', label: 'Solar + wind, % of electricity', unit: '%', data: [[2010, 1.7], [2015, 4.5], [2018, 7.0], [2020, 9.4], [2022, 12.0], [2024, 15.0]], headline: '15 %', sub: 'of global power, 2024' },
    { section: 'ai', label: 'Corporate AI investment, $ bn', unit: '$bn', data: [[2014, 21.6], [2016, 42.3], [2018, 79.6], [2020, 146.7], [2022, 189.6], [2024, 252.3]], headline: '$252 bn', sub: 'invested in 2024' },
    { section: 'frontier', label: 'Cost per human genome, $ (log)', unit: '$', log: true, data: [[2001, 95000000], [2007, 10000000], [2010, 50000], [2015, 1500], [2020, 689], [2022, 525]], headline: '$525', sub: 'per genome, 2022 (from $95 m)' }
  ];

  /* ---------------------------------------------------------------------------
     02 · DIFFUSION OF INNOVATIONS
  --------------------------------------------------------------------------- */
  D.diffusion = {
    kpis: [
      { label: 'Years to 50 % of US households', value: '6', delta: 'Smartphone (2007 → 2013)', dir: 'neutral', note: 'vs 68 years for the telephone' },
      { label: 'Fastest consumer app to 100 m users', value: '2 months', delta: 'ChatGPT, Jan 2023', dir: 'neutral', note: 'vs 9 months for TikTok, 30 for Instagram' },
      { label: 'Solar PV cumulative capacity, 2024', value: '1,865 GW', delta: '≈ 46× the 2010 stock', dir: 'good', note: 'IRENA' },
      { label: 'Mobile broadband subs per 100 people', value: '≈ 95', delta: 'From 4 in 2007', dir: 'good', note: 'World · ITU, approx.' }
    ],
    // Years from commercial introduction to ~50 % of US households (approximate).
    adoptionLag: {
      source: 'Our World in Data (Comin & Hobijn CHAT; US Census; Pew Research). Years are approximate; generative AI measured on adults, not households.',
      approx: true,
      items: [
        ['Telephone', 1876, 68], ['Electricity', 1882, 43], ['Automobile', 1900, 48], ['Refrigerator', 1920, 24],
        ['Radio', 1920, 11], ['Television', 1946, 8], ['Colour TV', 1954, 18], ['Microwave', 1967, 19],
        ['VCR', 1975, 13], ['Personal computer', 1977, 23], ['Mobile phone', 1983, 15], ['Internet', 1991, 10],
        ['Social media', 2004, 7], ['Smartphone', 2007, 6], ['Tablet', 2010, 5], ['Generative AI (adults)', 2022, 3]
      ]
    },
    // Global S-curves, % (mobile broadband is subscriptions per 100 people).
    sCurves: {
      source: 'ITU (internet users, mobile broadband); Ember (solar + wind share of electricity); IEA Global EV Outlook 2025 (EV share of new car sales). Interpolated between reported years where flagged ≈.',
      approx: true,
      years: [2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024],
      series: {
        'Internet users, % of population': [6.7, 10.6, 14.1, 17.6, 23.3, 28.9, 34.3, 39.0, 44.0, 49.0, 59.3, 64.4, 68.0],
        'Mobile broadband subs per 100': [0, 0, 0.3, 1.5, 6.0, 11.5, 22.0, 36.0, 50.0, 69.0, 77.0, 87.0, 95.0],
        'Solar + wind, % of electricity': [0.2, 0.3, 0.5, 0.8, 1.1, 1.7, 2.8, 3.9, 5.4, 7.0, 9.4, 12.0, 15.0],
        'EVs, % of new car sales': [0, 0, 0, 0, 0, 0.01, 0.2, 0.4, 0.9, 2.2, 4.2, 14.0, 22.0]
      }
    },
    // Reference curve for the Bass simulator overlay: internet users, years since 1995.
    bassReference: {
      label: 'Internet users, % of world (t₀ = 1995)',
      data: [0.8, 1.3, 2.0, 3.1, 4.6, 6.7, 8.1, 10.6, 12.3, 14.1, 15.8, 17.6, 20.6, 23.3, 25.8, 28.9, 31.8, 34.3, 36.9, 39.0, 40.9, 44.0, 46.3, 49.0, 53.6, 59.3, 62.6, 64.4, 67.4, 68.0]
    },
    // Two-margin diffusion scorecard (glossary: hardware club / token adoption).
    twoMargin: {
      source: 'Ember Global Electricity Review 2025 (solar, wind shares, 2024); IEA Global EV Outlook 2025 (EV share of new car sales, 2024); World Bank / IEA (electricity access). Thresholds follow the H Heuristics two-margin filter: solar ≥ 5 % with access ≥ 80 %, wind ≥ 5 %, EV ≥ 15 %. Values ≈.',
      approx: true,
      thresholds: { solar: 5, wind: 5, ev: 15, access: 80 },
      rows: [
        // country, solar %, wind %, EV %, electricity access %
        ['China', 8, 10, 48, 100], ['Germany', 14, 31, 19, 100], ['United Kingdom', 5, 30, 28, 100], ['Australia', 19, 13, 10, 100],
        ['United States', 7, 10, 10, 100], ['Brazil', 10, 15, 6, 100], ['Viet Nam', 9, 4, 17, 100], ['Mexico', 9, 7, 8, 100],
        ['Japan', 11, 1, 3.5, 100], ['India', 7, 4, 2, 99], ['South Africa', 7, 4, 0.5, 87], ['Kenya', 4, 17, 2, 76],
        ['Indonesia', 0.3, 0.2, 7, 100], ['Nigeria', 0.1, 0, 0, 61]
      ]
    }
  };

  /* ---------------------------------------------------------------------------
     03 · CONVERGENCE
  --------------------------------------------------------------------------- */
  D.convergence = {
    kpis: [
      { label: 'EMDE share of world GDP (PPP), 2024', value: '59 %', delta: 'From 43 % in 2000', dir: 'good', note: 'IMF WEO' },
      { label: '… excluding China', value: '40 %', delta: 'From 36 % in 2000', dir: 'neutral', note: 'The China wedge: 19 pp' },
      { label: 'Sub-Saharan Africa, % of US income', value: '6 %', delta: 'Flat since 2000', dir: 'bad', note: 'GDP per capita, PPP' },
      { label: 'Viet Nam, % of US income', value: '18 %', delta: 'From 6 % in 2000', dir: 'good', note: 'Hosted industrialiser' }
    ],
    relativeIncome: {
      source: 'IMF World Economic Outlook (Apr 2025) and World Bank WDI, GDP per capita PPP (current international $), expressed as % of the United States. Regional aggregates population-weighted. Values ≈.',
      approx: true,
      years: [2000, 2004, 2008, 2012, 2016, 2020, 2024],
      series: {
        'Korea': [52, 58, 63, 67, 70, 72, 72],
        'Poland': [36, 40, 45, 49, 52, 58, 60],
        'China': [7.8, 10.0, 13.8, 19.5, 24.0, 27.1, 29.6],
        'Latin America & Caribbean': [29, 28, 29, 28, 26.5, 24.5, 24],
        'Indonesia': [15, 15.3, 16.0, 17.0, 17.4, 17.3, 18.4],
        'Viet Nam': [6.3, 7.3, 9.0, 11.0, 13.0, 15.4, 18.0],
        'India': [4.6, 5.3, 6.6, 8.0, 9.2, 9.8, 12.4],
        'Bangladesh': [3.5, 4.0, 4.6, 5.4, 6.5, 8.2, 10.5],
        'Nigeria': [6.1, 7.6, 8.5, 9.0, 8.3, 7.6, 7.0],
        'Sub-Saharan Africa': [6.5, 6.7, 7.2, 7.2, 6.9, 6.3, 6.0],
        'Ethiopia': [1.6, 1.8, 2.3, 2.7, 3.3, 3.6, 3.9]
      },
      defaultOn: ['China', 'India', 'Viet Nam', 'Indonesia', 'Sub-Saharan Africa', 'Latin America & Caribbean', 'Poland']
    },
    chinaWedge: {
      source: 'IMF WEO, share of world GDP at PPP. EMDE = emerging market and developing economies. Values ≈.',
      approx: true,
      years: [2000, 2005, 2010, 2015, 2020, 2024],
      series: {
        'EMDEs incl. China': [43, 47, 53, 57, 58, 59],
        'EMDEs excl. China': [36, 38, 39, 40, 40, 40],
        'China alone': [7.4, 9.5, 13.9, 17.2, 18.4, 19.0]
      }
    },
    fourClocks: {
      source: 'World Bank WDI, ITU, ILO modelled estimates, latest year 2022–2024. Clock rules: income (GDP per capita PPP growth ≥ 2 %/yr since 2010), productivity (output per worker growth ≥ 1.5 %/yr), technology (internet ≥ 50 % and electricity access ≥ 90 %), structure (agricultural employment ≤ 40 % and manufacturing ≥ 10 % of GDP). Values ≈.',
      approx: true,
      columns: ['Country', 'Income growth %/yr', 'Productivity %/yr', 'Internet %', 'Electricity %', 'Agri. employment %', 'Manufacturing % GDP', 'Clocks closed'],
      rows: [
        ['China', 5.6, 5.9, 78, 100, 22, 26],
        ['Viet Nam', 5.0, 4.6, 79, 100, 27, 24],
        ['Bangladesh', 4.9, 4.2, 45, 99, 36, 22],
        ['India', 4.7, 4.3, 56, 99, 43, 13],
        ['Indonesia', 3.4, 2.9, 69, 100, 28, 18],
        ['Ethiopia', 4.8, 3.5, 19, 55, 62, 5],
        ['Kenya', 1.9, 1.2, 40, 76, 33, 7],
        ['Nigeria', 0.1, -0.5, 38, 61, 35, 13],
        ['Mexico', 0.7, 0.3, 83, 100, 12, 20],
        ['Brazil', 0.4, 0.2, 84, 100, 8, 11],
        ['South Africa', -0.4, -0.6, 75, 87, 20, 12]
      ]
    }
  };

  /* ---------------------------------------------------------------------------
     04 · DEMOGRAPHIC SHIFTS
  --------------------------------------------------------------------------- */
  D.demography = {
    kpis: [
      { label: 'US non-Hispanic white share, 2020', value: '57.8 %', delta: '−11.3 pp since 2000', dir: 'neutral', note: 'Census 2020; < 50 % projected mid-2040s' },
      { label: 'US births that are Hispanic, 2023', value: '26 %', delta: 'Under-18s already majority-minority', dir: 'neutral', note: 'CDC NVSS' },
      { label: 'Africa’s share of world births', value: '32 %', delta: '→ 41 % by 2050, > 50 % by 2100', dir: 'neutral', note: 'UN WPP 2024' },
      { label: 'Lowest TFR on record', value: '0.72', delta: 'South Korea, 2023 (0.75 in 2024)', dir: 'bad', note: 'Replacement ≈ 2.1' }
    ],
    usComposition: {
      source: 'US Census Bureau decennial counts (2000, 2010, 2020) and 2023 National Population Projections, main series (2030–2060). Non-Hispanic single-race groups; "Other / multiracial" absorbs the 2020 measurement change in the race question. Values ≈.',
      approx: true,
      years: [2000, 2010, 2020, 2030, 2040, 2050, 2060],
      series: {
        'White (non-Hispanic)': [69.1, 63.7, 57.8, 55.4, 51.6, 48.0, 44.9],
        'Hispanic or Latino': [12.5, 16.3, 18.7, 21.1, 23.6, 25.8, 27.5],
        'Black (non-Hispanic)': [12.1, 12.2, 12.1, 12.6, 13.0, 13.3, 13.6],
        'Asian (non-Hispanic)': [3.6, 4.7, 5.9, 6.6, 7.4, 8.1, 8.8],
        'Other / multiracial': [2.7, 3.1, 5.5, 4.3, 4.4, 4.8, 5.2]
      },
      projectionStart: 2030
    },
    usGenerationGap: {
      source: 'US Census Bureau, Vintage 2023 population estimates by age, race and Hispanic origin. Values ≈.',
      approx: true,
      groups: ['Under 18', '18–34', '35–64', '65 and over'],
      series: {
        'White (non-Hispanic)': [47, 52, 59, 74],
        'Hispanic or Latino': [26, 23, 18, 10],
        'Black (non-Hispanic)': [14, 14, 13, 9],
        'Asian (non-Hispanic)': [6, 7, 7, 5],
        'Other / multiracial': [7, 4, 3, 2]
      }
    },
    worldRegions: {
      source: 'UN World Population Prospects 2024, medium variant. Billions.',
      years: [1950, 1975, 2000, 2025, 2050, 2075, 2100],
      series: {
        'Africa': [0.23, 0.42, 0.82, 1.55, 2.49, 3.26, 3.81],
        'Asia': [1.38, 2.40, 3.74, 4.83, 5.29, 5.10, 4.64],
        'Europe': [0.55, 0.68, 0.73, 0.74, 0.70, 0.65, 0.59],
        'Latin America & Caribbean': [0.17, 0.32, 0.52, 0.67, 0.75, 0.72, 0.65],
        'Northern America': [0.17, 0.24, 0.31, 0.39, 0.43, 0.45, 0.45],
        'Oceania': [0.013, 0.021, 0.031, 0.047, 0.058, 0.066, 0.070]
      }
    },
    tfr: {
      source: 'UN WPP 2024 and national statistical offices, 2024 or latest. Replacement level ≈ 2.1.',
      items: [
        ['South Korea', 0.75], ['China', 1.0], ['Spain', 1.12], ['Japan', 1.15], ['Italy', 1.18], ['Germany', 1.35],
        ['United Kingdom', 1.44], ['United States', 1.60], ['Brazil', 1.6], ['Mexico', 1.8], ['India', 1.96],
        ['Indonesia', 2.1], ['World', 2.25], ['Egypt', 2.8], ['Pakistan', 3.5], ['Ethiopia', 3.9], ['Nigeria', 4.4],
        ['DR Congo', 6.0], ['Niger', 6.0]
      ]
    },
    medianAge: {
      source: 'UN WPP 2024, median age of the population, 2025.',
      items: [
        ['Niger', 15.1], ['Nigeria', 17.9], ['Ethiopia', 19.5], ['India', 28.8], ['Mexico', 30.3], ['Indonesia', 30.4],
        ['World', 30.9], ['Brazil', 34.5], ['United States', 38.5], ['China', 40.1], ['South Korea', 45.5],
        ['Germany', 46.7], ['Italy', 48.4], ['Japan', 49.9]
      ]
    }
  };

  /* ---------------------------------------------------------------------------
     05 · POLYCRISIS
  --------------------------------------------------------------------------- */
  D.polycrisis = {
    kpis: [
      { label: 'State-based armed conflicts, 2024', value: '61', delta: 'Most since records begin in 1946', dir: 'bad', note: 'UCDP / PRIO' },
      { label: 'Fossil CO₂ emissions, 2024', value: '37.4 Gt', delta: '+0.8 % YoY, new record', dir: 'bad', note: 'Global Carbon Project' },
      { label: 'Extreme poverty, 2022', value: '≈ 10.5 %', delta: '≈ 830 m people at $3.00 / day', dir: 'bad', note: 'World Bank PIP, 2021 PPP line' },
      { label: 'People in countries where interest > health or education spending', value: '3.4 bn', delta: 'Debt service as cascade channel', dir: 'bad', note: 'UNCTAD, A World of Debt 2024' }
    ],
    temperature: {
      source: 'WMO State of the Global Climate (consolidated six-dataset mean) and Copernicus ERA5, anomaly vs 1850–1900. Pre-2015 values ≈.',
      approx: true,
      years: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [0.45, 0.50, 0.60, 0.68, 0.70, 0.90, 0.95, 1.17, 1.29, 1.20, 1.14, 1.26, 1.27, 1.14, 1.17, 1.45, 1.55]
    },
    co2ppm: {
      source: 'NOAA Global Monitoring Laboratory, Mauna Loa annual mean.',
      years: [1960, 1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022, 2023, 2024],
      values: [316.9, 325.7, 338.8, 354.4, 369.6, 390.0, 400.8, 414.2, 418.5, 421.1, 424.6]
    },
    emissions: {
      source: 'Global Carbon Budget 2024, fossil CO₂ (GtCO₂/yr), 2024 projected.',
      years: [2000, 2005, 2010, 2015, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [25.0, 29.5, 33.3, 35.5, 36.7, 34.8, 36.6, 37.1, 37.1, 37.4]
    },
    displaced: {
      source: 'UNHCR Global Trends, people forcibly displaced worldwide at year-end, millions.',
      years: [2010, 2012, 2014, 2016, 2018, 2020, 2021, 2022, 2023, 2024],
      values: [43.7, 45.2, 59.5, 65.6, 70.8, 82.4, 89.3, 108.4, 117.3, 123.2]
    },
    conflicts: {
      source: 'UCDP / PRIO Armed Conflict Dataset, state-based conflicts active per year.',
      years: [2010, 2012, 2014, 2016, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [31, 33, 41, 53, 52, 54, 56, 54, 55, 59, 61]
    },
    poverty: {
      source: 'World Bank Poverty and Inequality Platform, share of world population below $2.15 / day (2017 PPP); 2024 nowcast, 2030 projection. The 2025 rebasing to $3.00 (2021 PPP) raises the 2022 level to ≈ 10.5 %. Values ≈.',
      approx: true,
      years: [1990, 1995, 2000, 2005, 2010, 2015, 2019, 2020, 2022, 2024, 2030],
      values: [37.9, 33.0, 29.3, 21.6, 16.3, 10.8, 8.5, 9.7, 9.0, 8.5, 7.3],
      projectionStart: 2024
    },
    inequality: {
      source: 'World Inequality Report 2022 (World Inequality Lab), global distribution, 2021.',
      groups: ['Bottom 50 %', 'Middle 40 %', 'Top 10 %'],
      income: [8.5, 39.5, 52.0],
      wealth: [2.0, 22.0, 76.0]
    },
    pm25: {
      source: 'State of Global Air 2024 (HEI / IHME) and IQAir 2024 World Air Quality Report, population-weighted annual PM₂.₅, µg/m³. WHO guideline 5; interim target 1 = 35. Values ≈.',
      approx: true,
      items: [
        ['South Asia', 52], ['Middle East & North Africa', 38], ['East Asia', 32], ['Sub-Saharan Africa', 32],
        ['Southeast Asia', 24], ['Latin America', 15], ['Europe', 12], ['Northern America', 8], ['Oceania', 6]
      ],
      guideline: 5, interim1: 35
    },
    // Coupling matrix: rows = source system, columns = affected system, 0–3 strength.
    // Analytical judgment (H Heuristics), not a measured quantity.
    coupling: {
      source: 'H Heuristics analytical judgment. Strength 0 (negligible) to 3 (load-bearing). Read row → column: how strongly stress in the row system transmits to the column system.',
      domains: ['Climate', 'Pollution', 'Conflict', 'Poverty & inequality', 'Demography', 'Energy system', 'Food & water', 'Sovereign finance'],
      matrix: [
        [null, 2, 2, 3, 2, 2, 3, 2],
        [2, null, 1, 3, 2, 1, 2, 1],
        [1, 2, null, 3, 3, 3, 3, 2],
        [1, 2, 2, null, 2, 2, 2, 2],
        [1, 1, 2, 2, null, 2, 2, 3],
        [3, 3, 2, 2, 1, null, 2, 2],
        [1, 1, 3, 3, 2, 1, null, 2],
        [2, 1, 2, 3, 1, 3, 2, null]
      ],
      mechanisms: [
        ['', 'Wildfire smoke, ozone formation', 'Resource stress, displacement', 'Crop loss, heat-labour losses', 'Climate migration', 'Hydro variability, cooling load', 'Yield, drought, glacier melt', 'Disaster liabilities, insurance retreat'],
        ['Black carbon; aerosol masking', '', 'Marginal grievance channel', 'Health costs, lost labour days', 'Mortality, fertility effects', 'Coal-retirement pressure', 'Water contamination', 'Health-spending burden'],
        ['War emissions, policy delay', 'Infrastructure destruction, burning', '', 'Livelihood collapse', 'Displacement, excess mortality', 'Price shocks (2022 gas)', 'Grain corridors, blockades', 'Defence crowd-out, arrears'],
        ['Adaptation deficit', 'Solid fuels, informal burning', 'Grievance, recruitment', '', 'High fertility, informal urbanisation', 'Payment capacity, PAYG only', 'Food share of income', 'Thin tax base'],
        ['Consumption shifts', 'Urban density effects', 'Youth bulge vs ageing', 'Dependency ratios', '', 'Cooling demand, access backlog', 'Caloric demand', 'Pensions, dependency, fiscal space'],
        ['Emissions pathway', 'Fossil combustion', 'Chokepoints, rents', 'Energy poverty, tariffs', 'Access gates fertility transition', '', 'Water for thermal plants', 'Subsidies, stranded assets'],
        ['Land-use change', 'Fertiliser runoff, residue burning', 'Food-price unrest', 'Caloric poverty', 'Migration pressure', 'Biofuel competition', '', 'Import bills, FX drain'],
        ['Adaptation finance gap', 'Deferred clean-up', 'Austerity, state retreat', 'Interest above health in 3.4 bn-person countries', 'Service delivery erosion', 'Cost of capital sets EMDE LCOE', 'Import finance', '']
      ]
    }
  };

  /* ---------------------------------------------------------------------------
     06 · HUMAN EXPOSURE
  --------------------------------------------------------------------------- */
  D.exposure = {
    kpis: [
      { label: 'Extra days of dangerous heat per person, 2024', value: '41', delta: 'Attributable to climate change', dir: 'bad', note: 'Climate Central / WWA' },
      { label: 'Potential labour hours lost to heat, 2023', value: '512 bn', delta: '+49 % vs 1990s average', dir: 'bad', note: 'Lancet Countdown 2024' },
      { label: 'People exposed to 1-in-100-year floods', value: '1.81 bn', delta: '23 % of humanity; 89 % in LMICs', dir: 'bad', note: 'Rentschler et al. 2022, World Bank' },
      { label: 'Household AC ownership, India', value: '≈ 8 %', delta: 'vs ≈ 90 % in the US at ⅓ the cooling load', dir: 'bad', note: 'IEA · the cooling gap' }
    ],
    // Billions of people exposed per hazard (not additive).
    exposureStack: {
      source: 'WHO (PM₂.₅, water, sanitation); Mekonnen & Hoekstra 2016 (water scarcity); IPCC AR6 WGII (climate vulnerability, 3.3–3.6 bn); IEA / WHO SDG7 2025 (clean cooking, electricity); Rentschler et al. 2022 (floods); UNHCR (displacement). Latest year 2022–2024.',
      items: [
        ['Breathing air above WHO PM₂.₅ guideline', 7.9],
        ['Severe water scarcity ≥ 1 month / yr', 4.0],
        ['Without safely managed sanitation', 3.5],
        ['Highly vulnerable to climate change (IPCC)', 3.5],
        ['Without safely managed drinking water', 2.2],
        ['Without clean cooking', 2.1],
        ['Exposed to 1-in-100-year flooding', 1.81],
        ['Without electricity', 0.67],
        ['Forcibly displaced', 0.123]
      ]
    },
    // Cooling gap: cooling degree days vs household AC ownership, bubble = population.
    coolingGap: {
      source: 'IEA, The Future of Cooling (2018) updated with IEA 2023–2024 country estimates (AC ownership); cooling degree days (18 °C base, population-weighted) from IEA / World Bank CCKP; population UN 2024. Values ≈.',
      approx: true,
      items: [
        // name, CDD, AC %, population (m)
        ['India', 3100, 8, 1450], ['Indonesia', 3500, 9, 283], ['Nigeria', 3400, 5, 232], ['Pakistan', 2900, 10, 250],
        ['Bangladesh', 2900, 6, 174], ['Philippines', 3300, 10, 115], ['DR Congo', 2800, 1, 105], ['Ethiopia', 1300, 1, 130],
        ['Viet Nam', 2900, 20, 100], ['Thailand', 3400, 30, 72], ['Egypt', 2200, 20, 115], ['Brazil', 2100, 16, 212],
        ['Mexico', 1300, 16, 130], ['China', 1000, 60, 1410], ['United States', 900, 90, 340], ['Japan', 800, 91, 124],
        ['South Korea', 700, 86, 52], ['European Union', 350, 20, 450]
      ],
      floors: { cddHot: 2000, acClub: 50 }
    },
    heatNiche: {
      source: 'Lenton et al. 2023, Nature Sustainability, "Quantifying the human cost of global warming". Share of projected 2100 population outside the historical human climate niche (MAT ≥ 29 °C).',
      items: [['Today (≈ 1.2 °C)', 9], ['1.5 °C pathway', 5], ['2.7 °C (current policies)', 22], ['3.6 °C (high)', 39]]
    },
    heatLabour: {
      source: 'Lancet Countdown 2024, potential labour hours lost to heat exposure, billions, by sector (2023).',
      items: [['Agriculture', 328], ['Construction', 92], ['Manufacturing', 61], ['Services', 31]]
    }
  };

  /* ---------------------------------------------------------------------------
     07 · CLEAN TRANSITION
  --------------------------------------------------------------------------- */
  D.transition = {
    kpis: [
      { label: 'Clean energy investment, 2025e', value: '$2.2 tn', delta: '2× fossil-fuel investment', dir: 'good', note: 'IEA World Energy Investment 2025' },
      { label: 'Solar PV added in 2024', value: '≈ 600 GW', delta: '+30 % YoY', dir: 'good', note: 'IEA / BNEF, approx.' },
      { label: 'Battery pack price, 2024', value: '$115 / kWh', delta: '−20 % YoY; −90 % since 2010', dir: 'good', note: 'BloombergNEF' },
      { label: 'People without electricity, 2023', value: '666 m', delta: '85 % in Sub-Saharan Africa', dir: 'bad', note: 'Tracking SDG7 2025' }
    ],
    investment: {
      source: 'IEA World Energy Investment 2025, USD trillion (current). Clean = renewables, grids, storage, nuclear, efficiency, end-use electrification, low-emission fuels. Values ≈.',
      approx: true,
      years: [2015, 2017, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      series: { 'Clean energy': [1.15, 1.20, 1.25, 1.30, 1.50, 1.60, 1.80, 2.00, 2.20], 'Fossil fuels': [1.25, 0.95, 1.05, 0.85, 0.95, 1.05, 1.10, 1.10, 1.10] },
      projectionStart: 2025
    },
    mix: {
      source: 'Ember Global Electricity Review 2025, share of global electricity generation, %.',
      years: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2023, 2024],
      series: { 'Fossil': [67.0, 67.5, 66.8, 65.6, 64.0, 61.5, 61.1, 60.6, 59.1], 'Hydro, nuclear, other': [31.3, 30.0, 29.3, 28.9, 29.0, 29.1, 26.9, 26.0, 25.9], 'Solar + wind': [1.7, 2.5, 3.9, 5.5, 7.0, 9.4, 12.0, 13.4, 15.0] }
    },
    evSales: {
      source: 'IEA Global EV Outlook 2025, electric car sales (BEV + PHEV), millions; 2025 estimate.',
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      values: [0.75, 1.2, 2.0, 2.1, 3.0, 6.6, 10.2, 13.8, 17.3, 20.5],
      projectionStart: 2025
    },
    costs: {
      source: 'IRENA / BNEF (solar module $/W, nominal); BloombergNEF Battery Price Survey (pack $/kWh, real 2024 $). Values ≈.',
      approx: true,
      years: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2023, 2024],
      solar: [2.00, 0.90, 0.65, 0.50, 0.30, 0.20, 0.25, 0.14, 0.10],
      battery: [1191, 726, 592, 295, 181, 137, 151, 139, 115]
    },
    // Share-sync scatter (glossary): solar+wind share vs fossil share, 2024, bubble = generation TWh.
    shareSync: {
      source: 'Ember 2024 generation data. Reference lines at 8 % solar + wind (power clock) and 55 % fossil (fossil-exit clock) follow the H Heuristics share-sync filter; 40 % fossil marks deep exit. Values ≈.',
      approx: true,
      items: [
        // name, solar+wind %, fossil %, generation TWh
        ['China', 18, 62, 10000], ['United States', 17, 58, 4400], ['India', 10, 76, 2000], ['European Union', 29, 29, 2700],
        ['Russia', 1, 63, 1170], ['Japan', 12, 66, 1000], ['Brazil', 23, 10, 720], ['South Korea', 7, 60, 600],
        ['Germany', 44, 43, 500], ['Saudi Arabia', 1, 99, 420], ['Indonesia', 1, 81, 360], ['Mexico', 13, 74, 360],
        ['Turkey', 17, 55, 340], ['Viet Nam', 13, 55, 310], ['United Kingdom', 35, 31, 290], ['Spain', 42, 22, 270],
        ['Australia', 30, 64, 270], ['South Africa', 10, 84, 230], ['Chile', 37, 40, 90], ['Nigeria', 0.2, 76, 40],
        ['Kenya', 17, 10, 13], ['Ethiopia', 1, 1, 17]
      ],
      lines: { power: 8, fossilExit: 55, deepExit: 40 }
    },
    access: {
      source: 'Tracking SDG7: The Energy Progress Report 2025. Millions without access.',
      years: [2010, 2015, 2019, 2021, 2022, 2023],
      series: { 'Without electricity': [1180, 958, 759, 675, 685, 666], 'Without clean cooking': [2900, 2600, 2400, 2300, 2200, 2100] }
    }
  };

  /* ---------------------------------------------------------------------------
     08 · AI & TECHNOLOGY
  --------------------------------------------------------------------------- */
  D.ai = {
    kpis: [
      { label: 'US private AI investment, 2024', value: '$109 bn', delta: '≈ 12× China ($9.3 bn)', dir: 'neutral', note: 'Stanford AI Index 2025' },
      { label: 'Inference cost, GPT-3.5-level', value: '−280×', delta: '$20 → $0.07 per m tokens, Nov 2022 → Oct 2024', dir: 'good', note: 'AI Index 2025' },
      { label: 'Data-centre electricity, 2024', value: '415 TWh', delta: '≈ 1.5 % of global demand → ≈ 945 TWh by 2030', dir: 'bad', note: 'IEA Energy and AI 2025' },
      { label: 'Organisations using AI in ≥ 1 function', value: '78 %', delta: 'From 55 % in 2023', dir: 'neutral', note: 'McKinsey State of AI 2025' }
    ],
    investment: {
      source: 'Stanford AI Index 2025 (Quid data), total global corporate investment in AI, USD billion, nominal. Values ≈.',
      approx: true,
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [14.6, 21.6, 30.5, 42.3, 59.2, 79.6, 95.9, 146.7, 276.1, 189.6, 200.0, 252.3]
    },
    compute: {
      source: 'Epoch AI, training compute of notable models (FLOP). Values ≈ to within a factor of 2.',
      approx: true,
      items: [
        ['AlexNet', 2012.7, 4.7e17], ['ResNet-50', 2015.9, 1.2e18], ['AlphaGo Zero', 2017.8, 1.9e23], ['BERT-Large', 2018.8, 2.9e20],
        ['GPT-2', 2019.1, 1.5e21], ['GPT-3', 2020.4, 3.1e23], ['AlphaFold 2', 2021.5, 1.0e23], ['PaLM', 2022.3, 2.5e24],
        ['GPT-4', 2023.2, 2.1e25], ['Gemini 1.0 Ultra', 2023.9, 5.0e25], ['Llama 3.1 405B', 2024.6, 3.8e25], ['Grok 3', 2025.1, 4.6e26]
      ]
    },
    datacentre: {
      source: 'IEA, Energy and AI (2025), global data-centre electricity consumption, TWh; base-case projection to 2030. Pre-2024 values ≈.',
      approx: true,
      years: [2015, 2018, 2020, 2022, 2024, 2026, 2028, 2030],
      values: [200, 250, 300, 350, 415, 560, 750, 945],
      projectionStart: 2024
    },
    adoption: {
      source: 'McKinsey Global Survey, The State of AI (2017–2025). Share of respondents whose organisations use AI / generative AI in at least one business function.',
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      series: { 'Any AI': [20, 47, 58, 50, 56, 50, 55, 72, 78], 'Generative AI': [null, null, null, null, null, null, 33, 65, 71] }
    },
    inferenceCost: {
      source: 'Stanford AI Index 2025 (Epoch AI / Artificial Analysis), cheapest model scoring ≥ MMLU 64.8 (GPT-3.5 level), USD per million tokens, blended. Values ≈.',
      approx: true,
      points: [['Nov 2022', 20], ['Mar 2023', 2.0], ['Nov 2023', 1.0], ['May 2024', 0.5], ['Aug 2024', 0.2], ['Oct 2024', 0.07]]
    },
    // Three AI-transition clocks (glossary: load-before-lever).
    clocks: {
      source: 'Ember (generation per capita, low-carbon share, 2024), ITU (internet), World Bank (industry % GDP). Rules: load (≥ 4,000 kWh per capita generation), lever (internet ≥ 50 % and industry ≥ 20 % of GDP), clean (low-carbon ≥ 40 %). Values ≈.',
      approx: true,
      columns: ['Country', 'Generation kWh / cap', 'Internet %', 'Industry % GDP', 'Low-carbon %', 'Cell'],
      rows: [
        ['Norway', 28000, 99, 40, 98], ['United States', 13000, 93, 18, 41], ['France', 8200, 87, 17, 95], ['Germany', 6000, 93, 27, 57],
        ['Japan', 8100, 86, 29, 32], ['South Korea', 11600, 97, 32, 40], ['China', 7000, 78, 38, 38], ['Saudi Arabia', 12400, 100, 45, 1],
        ['Brazil', 3400, 84, 20, 90], ['Viet Nam', 3100, 79, 37, 45], ['India', 1400, 56, 25, 24], ['Indonesia', 1300, 69, 40, 19],
        ['Kenya', 240, 40, 17, 90], ['Nigeria', 180, 38, 30, 24]
      ]
    }
  };

  /* ---------------------------------------------------------------------------
     09 · FRONTIER INNOVATION
  --------------------------------------------------------------------------- */
  D.frontier = {
    kpis: [
      { label: 'Global R&D spending, 2023', value: '≈ $2.8 tn', delta: 'PPP; ≈ 2.7 % of world GDP', dir: 'neutral', note: 'UNESCO / OECD MSTI, approx.' },
      { label: 'PCT patent filings, 2024', value: '273,900', delta: 'China 70,160 · US 54,087 · Japan 48,397', dir: 'neutral', note: 'WIPO' },
      { label: 'Cumulative private fusion investment', value: '$9.8 bn', delta: '+$2.6 bn in the past year', dir: 'neutral', note: 'Fusion Industry Association 2025' },
      { label: 'Industrial robot installations, 2023', value: '541,000', delta: 'Operational stock 4.3 m; China 51 % of installs', dir: 'neutral', note: 'IFR World Robotics 2024' }
    ],
    rd: {
      source: 'OECD Main Science and Technology Indicators; UNESCO UIS; national sources. Gross domestic expenditure on R&D, % of GDP, 2022–2024.',
      items: [
        ['Israel', 6.0], ['South Korea', 5.0], ['United States', 3.6], ['Japan', 3.4], ['Germany', 3.1], ['United Kingdom', 2.8],
        ['China', 2.7], ['OECD average', 2.7], ['France', 2.2], ['EU-27', 2.2], ['Brazil', 1.2], ['India', 0.65], ['Indonesia', 0.3], ['Nigeria', 0.1]
      ]
    },
    pct: {
      source: 'WIPO, Patent Cooperation Treaty international applications by origin, 2024.',
      items: [['China', 70160], ['United States', 54087], ['Japan', 48397], ['South Korea', 23851], ['Germany', 16721], ['France', 8000], ['United Kingdom', 5600], ['Switzerland', 5500], ['Netherlands', 4300], ['India', 3600]]
    },
    publications: {
      source: 'NSF Science & Engineering Indicators 2024 (Scopus), peer-reviewed S&E articles, thousands, fractional count, 2022. Values ≈.',
      approx: true,
      items: [['China', 898], ['United States', 457], ['India', 207], ['Germany', 115], ['United Kingdom', 110], ['Japan', 104], ['South Korea', 80], ['Brazil', 70]]
    },
    // Cost-collapse curves (log scale). Each: label, unit, points [[year, value]].
    costCurves: {
      source: 'NHGRI (genome sequencing cost); CSIS Aerospace Security and published launch prices (launch cost per kg to LEO, 2021 $); IRENA / BNEF (solar module $/W, nominal); BloombergNEF (battery pack $/kWh); AI Index 2025 (LLM inference, $ per million tokens at GPT-3.5 level). Values ≈.',
      approx: true,
      curves: [
        { label: 'Human genome', unit: '$ per genome', points: [[2001, 95000000], [2004, 20000000], [2007, 10000000], [2008, 1000000], [2010, 50000], [2012, 7000], [2015, 1500], [2018, 1000], [2020, 689], [2022, 525]] },
        { label: 'Launch to LEO', unit: '$ per kg', points: [[1981, 65400], [1990, 30000], [2002, 14000], [2010, 4600], [2018, 2700], [2022, 1500]] },
        { label: 'Solar module', unit: '$ per watt', points: [[1976, 100], [1985, 15], [1995, 6], [2005, 4], [2010, 2.0], [2015, 0.6], [2020, 0.2], [2024, 0.10]] },
        { label: 'Li-ion battery pack', unit: '$ per kWh', points: [[2010, 1191], [2013, 668], [2016, 295], [2019, 156], [2021, 132], [2024, 115]] },
        { label: 'LLM inference (GPT-3.5 level)', unit: '$ per million tokens', points: [[2022.9, 20], [2023.2, 2.0], [2023.9, 1.0], [2024.4, 0.5], [2024.8, 0.07]] },
        { label: 'DNA synthesis', unit: '$ per base', points: [[2000, 10], [2005, 1.0], [2010, 0.4], [2015, 0.1], [2020, 0.07], [2024, 0.05]] }
      ]
    },
    // Share of frontier output by actor, 2024 (notable AI models by country of developer).
    aiModels: {
      source: 'Stanford AI Index 2025, notable machine-learning models by country of origin, 2024.',
      items: [['United States', 40], ['China', 15], ['France', 3], ['Canada', 2], ['South Korea', 2], ['United Kingdom', 1], ['Other', 6]]
    }
  };

  return D;
})();
