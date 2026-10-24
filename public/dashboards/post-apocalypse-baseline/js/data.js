/* ============================================================
   POST-APOCALYPSE BASELINE — data layer
   Qualitative indices (0–1) derived from the source essay and
   its cited datasets (WRI Aqueduct, Nature Sustainability, UN WPP).
   ============================================================ */
'use strict';

window.APX = window.APX || {};

/* ---------- country profiles for the divergence map ----------
   tfr  : total fertility rate, 2024 (Eurostat / national)
   heat : thermal hazard index 0–1 (qualitative, heat + wet-bulb)
   water: baseline water stress index 0–1 (qualitative, WRI)
   pop  : population multiplier 2020 → 2100 (UN WPP medium, approx.)
----------------------------------------------------------------- */
APX.COUNTRY_DATA = {
  // --- Western core (collapsing) ---
  "Malta":                    { tfr: 1.01, heat: 0.50, water: 0.60, pop: 0.80 },
  "Spain":                    { tfr: 1.10, heat: 0.45, water: 0.55, pop: 0.69 },
  "Italy":                    { tfr: 1.18, heat: 0.40, water: 0.50, pop: 0.64 },
  "Japan":                    { tfr: 1.20, heat: 0.35, water: 0.30, pop: 0.61 },
  "Poland":                   { tfr: 1.23, heat: 0.25, water: 0.35, pop: 0.72 },
  "Portugal":                 { tfr: 1.24, heat: 0.45, water: 0.55, pop: 0.70 },
  "Canada":                   { tfr: 1.30, heat: 0.15, water: 0.20, pop: 1.35 },
  "Greece":                   { tfr: 1.30, heat: 0.50, water: 0.55, pop: 0.62 },
  "Germany":                  { tfr: 1.35, heat: 0.25, water: 0.30, pop: 0.83 },
  "Russia":                   { tfr: 1.40, heat: 0.15, water: 0.20, pop: 0.92 },
  "Netherlands":              { tfr: 1.43, heat: 0.20, water: 0.30, pop: 0.92 },
  "Sweden":                   { tfr: 1.44, heat: 0.15, water: 0.15, pop: 1.10 },
  "United Kingdom":           { tfr: 1.44, heat: 0.20, water: 0.30, pop: 0.95 },
  "Australia":                { tfr: 1.50, heat: 0.45, water: 0.40, pop: 1.41 },
  "United States of America": { tfr: 1.60, heat: 0.40, water: 0.45, pop: 1.18 },
  "France":                   { tfr: 1.62, heat: 0.30, water: 0.35, pop: 0.94 },
  "South Korea":              { tfr: 0.72, heat: 0.30, water: 0.35, pop: 0.46 },
  "China":                    { tfr: 1.00, heat: 0.45, water: 0.60, pop: 0.54 },
  "Iran":                     { tfr: 1.70, heat: 0.75, water: 0.85, pop: 0.92 },
  "Thailand":                 { tfr: 1.20, heat: 0.70, water: 0.50, pop: 0.62 },
  "Brazil":                   { tfr: 1.60, heat: 0.65, water: 0.45, pop: 0.87 },
  "Mexico":                   { tfr: 1.80, heat: 0.60, water: 0.60, pop: 0.89 },

  // --- Equatorial / thermal frontier (trapped growth) ---
  "Nigeria":         { tfr: 4.60, heat: 0.85, water: 0.75, pop: 2.45 },
  "Niger":           { tfr: 6.70, heat: 0.92, water: 0.90, pop: 6.20 },
  "Mali":            { tfr: 5.60, heat: 0.90, water: 0.88, pop: 3.60 },
  "Chad":            { tfr: 5.80, heat: 0.92, water: 0.88, pop: 3.40 },
  "Burkina Faso":    { tfr: 5.00, heat: 0.90, water: 0.85, pop: 2.90 },
  "Sudan":           { tfr: 4.30, heat: 0.90, water: 0.88, pop: 2.70 },
  "Ethiopia":        { tfr: 3.90, heat: 0.80, water: 0.80, pop: 2.60 },
  "Democratic Republic of the Congo": { tfr: 6.00, heat: 0.80, water: 0.55, pop: 4.20 },
  "United Republic of Tanzania":        { tfr: 4.50, heat: 0.80, water: 0.70, pop: 3.60 },
  "Kenya":           { tfr: 3.20, heat: 0.75, water: 0.75, pop: 2.40 },
  "Uganda":          { tfr: 4.30, heat: 0.75, water: 0.60, pop: 3.00 },
  "Somalia":         { tfr: 6.10, heat: 0.92, water: 0.85, pop: 4.60 },
  "Mozambique":      { tfr: 4.40, heat: 0.85, water: 0.65, pop: 2.80 },
  "Angola":          { tfr: 5.10, heat: 0.80, water: 0.65, pop: 3.40 },
  "South Africa":    { tfr: 2.30, heat: 0.65, water: 0.75, pop: 1.10 },
  "Ghana":           { tfr: 3.40, heat: 0.85, water: 0.60, pop: 1.80 },
  "Ivory Coast":   { tfr: 4.10, heat: 0.85, water: 0.55, pop: 2.20 },
  "Senegal":         { tfr: 4.10, heat: 0.88, water: 0.80, pop: 2.30 },
  "Cameroon":        { tfr: 4.20, heat: 0.85, water: 0.60, pop: 2.10 },
  "Zambia":          { tfr: 3.90, heat: 0.80, water: 0.70, pop: 2.70 },
  "Madagascar":      { tfr: 3.80, heat: 0.80, water: 0.65, pop: 2.40 },
  "India":           { tfr: 1.90, heat: 0.80, water: 0.80, pop: 1.03 },
  "Pakistan":        { tfr: 3.30, heat: 0.85, water: 0.85, pop: 1.94 },
  "Bangladesh":      { tfr: 1.90, heat: 0.90, water: 0.85, pop: 1.02 },
  "Afghanistan":     { tfr: 4.10, heat: 0.80, water: 0.85, pop: 2.20 },
  "Nepal":           { tfr: 2.00, heat: 0.70, water: 0.55, pop: 1.20 },
  "Sri Lanka":       { tfr: 1.90, heat: 0.80, water: 0.60, pop: 0.92 },
  "Egypt":           { tfr: 2.60, heat: 0.80, water: 0.85, pop: 1.80 },
  "Iraq":            { tfr: 3.20, heat: 0.88, water: 0.90, pop: 1.90 },
  "Saudi Arabia":    { tfr: 2.20, heat: 0.92, water: 0.92, pop: 1.20 },
  "Yemen":           { tfr: 3.70, heat: 0.90, water: 0.90, pop: 2.30 },
  "Syria":           { tfr: 2.70, heat: 0.80, water: 0.85, pop: 1.50 },
  "Algeria":         { tfr: 2.60, heat: 0.80, water: 0.85, pop: 1.15 },
  "Morocco":         { tfr: 2.20, heat: 0.70, water: 0.80, pop: 0.98 },
  "Libya":           { tfr: 2.30, heat: 0.82, water: 0.88, pop: 1.05 },
  "Turkey":          { tfr: 1.80, heat: 0.60, water: 0.65, pop: 0.95 },
  "Indonesia":       { tfr: 2.10, heat: 0.75, water: 0.55, pop: 1.05 },
  "Philippines":     { tfr: 2.40, heat: 0.70, water: 0.55, pop: 1.57 },
  "Vietnam":         { tfr: 1.90, heat: 0.70, water: 0.50, pop: 0.90 },
  "Myanmar":         { tfr: 2.10, heat: 0.80, water: 0.50, pop: 1.02 },
  "Papua New Guinea":{ tfr: 3.10, heat: 0.80, water: 0.35, pop: 2.10 },
  "Colombia":        { tfr: 1.60, heat: 0.70, water: 0.40, pop: 0.90 },
  "Peru":            { tfr: 2.00, heat: 0.55, water: 0.60, pop: 0.95 },
  "Bolivia":         { tfr: 2.40, heat: 0.60, water: 0.60, pop: 1.15 },
  "Venezuela":       { tfr: 2.10, heat: 0.70, water: 0.40, pop: 1.00 },
  "Guatemala":       { tfr: 2.30, heat: 0.65, water: 0.50, pop: 1.20 },
  "Haiti":           { tfr: 2.50, heat: 0.75, water: 0.60, pop: 1.15 },
  "Cuba":            { tfr: 1.40, heat: 0.70, water: 0.50, pop: 0.70 },
  "Kazakhstan":      { tfr: 3.00, heat: 0.55, water: 0.70, pop: 1.20 },
  "Uzbekistan":      { tfr: 3.10, heat: 0.65, water: 0.85, pop: 1.10 },
  "Turkmenistan":    { tfr: 2.60, heat: 0.75, water: 0.90, pop: 1.00 }
};

/* ---------- chart series ---------- */

APX.TFR_CHART = [
  { label: "South Korea",            value: 0.72, group: "west" },
  { label: "Malta",                  value: 1.01, group: "west" },
  { label: "Spain",                  value: 1.10, group: "west" },
  { label: "Italy",                  value: 1.18, group: "west" },
  { label: "Japan",                  value: 1.20, group: "west" },
  { label: "Poland",                 value: 1.23, group: "west" },
  { label: "EU-27 (2024)",           value: 1.34, group: "west" },
  { label: "Germany",                value: 1.35, group: "west" },
  { label: "US (non-Hisp. White)",   value: 1.60, group: "west" },
  { label: "France",                 value: 1.62, group: "west" },
  { label: "India",                  value: 1.90, group: "frontier" },
  { label: "Pakistan",               value: 3.30, group: "frontier" },
  { label: "Nigeria",                value: 4.60, group: "frontier" },
  { label: "DR Congo",               value: 6.00, group: "frontier" },
  { label: "Niger",                  value: 6.70, group: "frontier" }
];

APX.POP_YEARS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
APX.POP_SERIES = {
  "Europe":            [100, 110, 120, 126, 131, 132, 134, 136, 135, 133, 131, 128, 124, 120, 115, 108],
  "North America":     [100, 119, 134, 148, 163, 182, 200, 216, 228, 238, 247, 254, 259, 263, 265, 264],
  "Sub-Saharan Africa":[100, 126, 161, 211, 283, 372, 483, 633, 800, 983, 1177, 1372, 1561, 1733, 1928, 2117],
  "South Asia":        [100, 120, 147, 181, 223, 268, 323, 396, 434, 464, 485, 498, 504, 506, 509, 511]
};

APX.NICHE_CHART = {
  labels: ["≈1.2°C\n(now)", "≈1.5°C", "≈2.0°C\n(net-zero 2050)", "≈2.7°C\n(current policies)", "≈3.6°C"],
  values: [0.6, 1.0, 1.6, 2.8, 4.4],
  highlight: { current: 3, netzero: 2 }   // index of highlighted bar
};

APX.SHARE_CHART = {
  labels: ["Europe", "North America", "East Asia", "South Asia", "Sub-Saharan Africa", "Rest of world"],
  y2020:  [9.6, 4.8, 21.4, 23.8, 14.6, 25.8],
  y2100: [5.8, 4.4, 12.2, 23.3, 36.9, 17.4]
};

APX.DEEPTIME_YEARS = [2000, 2020, 2050, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000];
APX.DEEPTIME = {
  current: {
    temp:  [0.6, 1.2, 2.0, 3.5, 3.6, 3.6, 3.5, 3.5, 3.5, 3.5, 3.4, 3.4, 3.4],
    tempLo:[0.6, 1.2, 2.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.9, 2.9, 2.9],
    tempHi:[0.6, 1.2, 2.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 3.9, 3.9, 3.9],
    slr:   [0, 0.03, 0.15, 0.5, 1.1, 1.9, 3.0, 4.5, 6.0, 7.5, 8.8, 9.6, 10.0],
    slrLo: [0, 0.02, 0.10, 0.4, 0.8, 1.3, 2.1, 3.0, 4.4, 5.8, 7.0, 8.0, 8.0],
    slrHi: [0, 0.04, 0.20, 0.7, 1.5, 2.5, 3.9, 6.0, 7.8, 9.5, 10.6, 11.5, 12.0]
  },
  netzero: {
    temp:  [0.6, 1.2, 1.7, 2.0, 1.9, 1.85, 1.8, 1.75, 1.7, 1.65, 1.6, 1.55, 1.5],
    tempLo:[0.6, 1.2, 1.7, 1.7, 1.6, 1.55, 1.5, 1.45, 1.4, 1.35, 1.3, 1.25, 1.2],
    tempHi:[0.6, 1.2, 1.7, 2.3, 2.2, 2.15, 2.1, 2.05, 2.0, 1.95, 1.9, 1.85, 1.8],
    slr:   [0, 0.03, 0.12, 0.35, 0.7, 1.1, 1.6, 2.2, 2.8, 3.3, 3.7, 4.0, 4.3],
    slrLo: [0, 0.02, 0.09, 0.28, 0.5, 0.8, 1.1, 1.5, 2.0, 2.5, 2.9, 3.2, 3.0],
    slrHi: [0, 0.04, 0.15, 0.45, 0.9, 1.4, 2.0, 3.0, 3.7, 4.4, 5.0, 5.4, 5.5]
  }
};

APX.CARBON_CHART = [
  { year: 1,        pct: 100 },
  { year: 10,       pct: 99 },
  { year: 100,      pct: 96 },
  { year: 1000,     pct: 82 },
  { year: 10000,    pct: 30 },
  { year: 100000,   pct: 7 }
];

APX.RADAR_CHART = {
  labels: ["Thermal stress", "Water stress", "Air toxics", "Food stress", "Institutional fragility"],
  west:     [30, 25, 35, 20, 45],
  frontier: [85, 82, 78, 80, 72]
};

APX.VECTORS_CHART = [
  { label: "Toxic mortality (annual)",         value: 9,    unit: "M / yr" },
  { label: "Climate displacement (by 2050)",   value: 216,  unit: "M cumulative" },
  { label: "Extreme water stress (S. Asia + Sahel)", value: 2000, unit: "M people" },
  { label: "Outside Holocene niche (current policies)", value: 3800, unit: "M people" }
];

APX.ATTRITION_CHART = {
  points: [
    { year: 2020,   buf: 100 },
    { year: 2100,   buf: 74 },
    { year: 2200,   buf: 62 },
    { year: 2500,   buf: 48 },
    { year: 3000,   buf: 36 },
    { year: 5000,   buf: 24 },
    { year: 10000,  buf: 16 },
    { year: 20000,  buf: 10 },
    { year: 50000,  buf: 6 },
    { year: 100000, buf: 3.5 }
  ],
  floor: 5
};
