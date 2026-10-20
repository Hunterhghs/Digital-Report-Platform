/* ===========================================================================
   Charts and interactions — "Six of Nine Boundaries Breached — What
   Transgressing Planetary Limits Actually Means" (hybrid dashboard)

   DATA (assembled in build.py):
   cv:    [id, boundary, control variable, unit, pre-industrial baseline,
           planetary boundary, high-risk line, current value [low, high],
           inverted (1 = lower is worse), position [low, high]] — values from
           the Planetary Health Check 2026 (PIK); baselines from Richardson et
           al. (2023) where the 2026 report does not restate them. Position =
           (current − boundary) / (high-risk line − boundary): below 0 safe,
           0–1 zone of increasing risk, above 1 high risk.
   co2:   NOAA global annual mean CO₂ (ppm); ods: ozone-depleting substance
           consumption (thousand ODP tonnes); hole: maximum Antarctic ozone hole
           area (million km²); lpi: Living Planet Index (1970 = 1); nfer: nitrogen
           fertiliser per hectare of cropland (kg); forest: forest share of land
           (%); count: boundaries assessed as transgressed by assessment year.
   Translation text below is the report's own synthesis of the sources cited.
   Colours come from the --z and --c tokens; no hex lives here.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var D = {"cv":[["co2","Climate change","CO₂ concentration","ppm",280,350,450,[426,426],0,[0.76,0.76]],["rf","Climate change","Radiative forcing","W/m²",0,1.0,1.5,[3.1,3.1],0,[4.2,4.2]],["ne","Novel entities","Untested synthetic chemicals released","%",0,0,null,null,0,null],["oz","Stratospheric ozone","Global ozone column","DU",292,277,263,[285.7,285.7],1,[-0.621,-0.621]],["aer","Atmospheric aerosols","Interhemispheric aerosol difference","ΔAOD",0.03,0.1,0.25,[0.07,0.07],0,[-0.2,-0.2]],["aers","Atmospheric aerosols","Aerosol optical depth, South Asia","AOD",null,0.25,0.5,[0.32,0.32],0,[0.28,0.28]],["oa","Ocean acidification","Surface aragonite saturation","Ω",3.575,2.86,2.5,[2.85,2.85],1,[0.028,0.028]],["p","Biogeochemical flows","Mined phosphorus applied to cropland","Tg P/yr",0,6.2,11.2,[18.2,18.2],0,[2.4,2.4]],["n","Biogeochemical flows","Nitrogen fixed for agriculture","Tg N/yr",0,62,82,[165,165],0,[5.15,5.15]],["bw","Freshwater change","Land with disturbed streamflow (blue water)","%",10.3,12.9,50,[22.6,22.6],0,[0.261,0.261]],["gw","Freshwater change","Land with disturbed soil moisture (green water)","%",null,12.4,50,[22.0,22.0],0,[0.255,0.255]],["land","Land system change","Forest cover remaining","% of potential",100,78,54,[64,64],1,[0.583,0.583]],["hanpp","Biosphere integrity","Human appropriation of plant production","%",1.9,10,20,[21,30],0,[1.1,2.0]],["emsy","Biosphere integrity","Extinction rate","E/MSY",1,10,100,[100,1000],0,[1.0,11.0]]],"co2":[[1979,336.85],[1980,338.91],[1981,340.11],[1982,340.85],[1983,342.53],[1984,344.07],[1985,345.54],[1986,346.97],[1987,348.68],[1988,351.16],[1989,352.79],[1990,354.06],[1991,355.4],[1992,356.09],[1993,356.84],[1994,358.33],[1995,360.18],[1996,361.93],[1997,363.04],[1998,365.7],[1999,367.79],[2000,368.96],[2001,370.57],[2002,372.58],[2003,375.14],[2004,376.95],[2005,378.98],[2006,381.15],[2007,382.9],[2008,385.02],[2009,386.5],[2010,388.75],[2011,390.62],[2012,392.65],[2013,395.4],[2014,397.34],[2015,399.65],[2016,403.07],[2017,405.22],[2018,407.61],[2019,410.07],[2020,412.45],[2021,414.7],[2022,417.08],[2023,419.35],[2024,422.79],[2025,425.62]],"ods":[[1986,1302.6],[1989,1658.2],[1990,977.6],[1991,892.3],[1992,857.5],[1993,765.8],[1994,490.1],[1995,406.7],[1996,292.7],[1997,269.8],[1998,338.1],[1999,287.7],[2000,263.1],[2001,207.9],[2002,162.7],[2003,170.6],[2004,127.9],[2005,92.9],[2006,86.5],[2007,61.6],[2008,43.8],[2009,49.2],[2010,43.7],[2011,40.2],[2012,43.9],[2013,29.2],[2014,30.8],[2015,23.0],[2016,21.5],[2017,20.6],[2018,20.7],[2019,21.3],[2020,9.5],[2021,16.7]],"hole":[[1979,1.1],[1980,3.3],[1981,3.1],[1982,10.8],[1983,12.2],[1984,14.7],[1985,18.8],[1986,14.4],[1987,22.5],[1988,13.8],[1989,21.7],[1990,21.1],[1991,22.6],[1992,24.9],[1993,25.8],[1994,25.2],[1996,26.9],[1997,25.1],[1998,27.9],[1999,25.8],[2000,29.9],[2001,26.5],[2002,21.9],[2003,28.4],[2004,22.8],[2005,27.2],[2006,29.6],[2007,25.2],[2008,27.0],[2009,24.4],[2010,22.6],[2011,26.1],[2012,21.1],[2013,24.0],[2014,24.1],[2015,28.2],[2016,22.8],[2017,19.6],[2018,24.8],[2019,16.4],[2020,24.8],[2021,24.8],[2022,26.5],[2023,26.0],[2024,22.4],[2025,22.9]],"lpi":[[1970,1.0,1.0,1.0],[1971,0.994,0.973,1.015],[1972,0.981,0.946,1.018],[1973,0.966,0.921,1.011],[1974,0.946,0.894,1.001],[1975,0.925,0.865,0.987],[1976,0.9,0.835,0.968],[1977,0.868,0.802,0.939],[1978,0.839,0.773,0.91],[1979,0.815,0.748,0.889],[1980,0.799,0.729,0.876],[1981,0.784,0.712,0.864],[1982,0.761,0.689,0.842],[1983,0.736,0.665,0.816],[1984,0.712,0.641,0.791],[1985,0.692,0.622,0.771],[1986,0.677,0.607,0.756],[1987,0.66,0.59,0.739],[1988,0.642,0.573,0.721],[1989,0.629,0.559,0.707],[1990,0.616,0.546,0.695],[1991,0.604,0.534,0.683],[1992,0.59,0.521,0.669],[1993,0.572,0.504,0.65],[1994,0.555,0.488,0.632],[1995,0.537,0.471,0.613],[1996,0.525,0.459,0.6],[1997,0.507,0.444,0.582],[1998,0.489,0.427,0.562],[1999,0.471,0.41,0.542],[2000,0.458,0.398,0.528],[2001,0.446,0.387,0.515],[2002,0.436,0.377,0.504],[2003,0.426,0.368,0.494],[2004,0.418,0.361,0.485],[2005,0.41,0.353,0.477],[2006,0.399,0.343,0.465],[2007,0.385,0.329,0.45],[2008,0.369,0.315,0.433],[2009,0.351,0.298,0.412],[2010,0.333,0.282,0.393],[2011,0.318,0.268,0.376],[2012,0.309,0.26,0.367],[2013,0.307,0.258,0.366],[2014,0.307,0.257,0.366],[2015,0.302,0.253,0.36],[2016,0.293,0.244,0.35],[2017,0.29,0.241,0.348],[2018,0.289,0.238,0.349],[2019,0.287,0.235,0.349],[2020,0.278,0.227,0.339],[2021,0.272,0.221,0.332],[2022,0.268,0.217,0.327]],"nfer":[[1961,7.59],[1962,8.54],[1963,9.64],[1964,10.86],[1965,12.53],[1966,14.65],[1967,15.94],[1968,17.33],[1969,18.67],[1970,20.9],[1971,22.33],[1972,23.94],[1973,25.82],[1974,25.51],[1975,29.12],[1976,29.75],[1977,32.49],[1978,35.5],[1979,37.28],[1980,39.63],[1981,39.67],[1982,40.19],[1983,43.21],[1984,45.43],[1985,45.02],[1986,46.17],[1987,48.24],[1988,50.78],[1989,50.18],[1990,49.27],[1991,48.11],[1992,47.32],[1993,45.97],[1994,46.24],[1995,49.93],[1996,52.9],[1997,51.48],[1998,52.41],[1999,53.71],[2000,51.29],[2001,51.87],[2002,53.49],[2003,54.96],[2004,56.39],[2005,56.65],[2006,58.53],[2007,60.59],[2008,59.67],[2009,61.0],[2010,63.41],[2011,65.22],[2012,64.89],[2013,65.82],[2014,66.31],[2015,65.23],[2016,65.87],[2017,67.05],[2018,66.1],[2019,65.95],[2020,69.66],[2021,68.6],[2022,66.34],[2023,67.72]],"forest":[[1990,33.47],[1991,33.39],[1992,33.31],[1993,33.23],[1994,33.14],[1995,33.06],[1996,32.98],[1997,32.9],[1998,32.81],[1999,32.73],[2000,32.65],[2001,32.62],[2002,32.59],[2003,32.57],[2004,32.54],[2005,32.51],[2006,32.48],[2007,32.46],[2008,32.43],[2009,32.4],[2010,32.37],[2011,32.34],[2012,32.31],[2013,32.28],[2014,32.25],[2015,32.22],[2016,32.2],[2017,32.17],[2018,32.15],[2019,32.12],[2020,32.1],[2021,32.06],[2022,32.02],[2023,31.98],[2024,31.94],[2025,31.91]],"count":[[2009,3],[2015,4],[2023,6],[2025,7],[2026,7]]};
  var CV = D.cv.map(function (r) { return { id: r[0], b: r[1], name: r[2], unit: r[3], base: r[4], pb: r[5], hr: r[6], cur: r[7], inv: r[8], pos: r[9] }; });
  var BY = {}; CV.forEach(function (c) { BY[c.id] = c; });

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mix(h1, h2, t) { var a = rgb(h1), b = rgb(h2); return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }).join(',') + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  var Z = { safe: tok('--z-safe'), zone: tok('--z-zone'), high: tok('--z-high'), deep: tok('--z-deep'), unk: tok('--z-unk') };
  var C = { ink: tok('--c-ink'), good: tok('--c-good'), bad: tok('--c-bad'), muted: tok('--c-muted') };
  var INK = tok('--text'), MUTED = tok('--text-muted');
  function zcol(p) { if (p === null || p === undefined) return Z.unk; if (p < 0) return Z.safe; if (p < 1) return mix(Z.zone, Z.high, p * 0.35); return p < 3 ? Z.high : Z.deep; }
  function pmid(c) { return c.pos ? (c.pos[0] + c.pos[1]) / 2 : null; }
  function status(c) {
    if (!c.pos) return c.id === 'ne' ? 'Transgressed — not quantified' : '—';
    var lo = c.pos[0], hi = c.pos[1];
    if (hi < 0) return 'Within the safe operating space';
    if (lo >= 1) return 'High-risk zone';
    if (hi >= 1) return 'Zone of increasing risk to high risk';
    return 'Zone of increasing risk';
  }
  function fv(v) { return Math.abs(v) >= 100 ? Math.round(v).toLocaleString('en-US') : Math.abs(v) >= 10 ? v.toFixed(1).replace(/\.0$/, '') : v.toFixed(2).replace(/0$/, ''); }
  function curTxt(c) { return c.cur ? (c.cur[0] === c.cur[1] ? fv(c.cur[0]) : fv(c.cur[0]) + '–' + fv(c.cur[1])) + ' ' + c.unit : 'transgressed'; }
  // multiple of the safe disturbance: (current − baseline) / (boundary − baseline)
  function mult(c, v) { return c.base === null || c.base === undefined || !c.cur ? null : (v - c.base) / (c.pb - c.base); }

  /* --- translations: the decision-language card for each control variable ------------------- */

  var T = {
    co2: { plain: 'How much heat-trapping carbon dioxide is in the air. It accumulates: what is emitted stays for centuries.', stake: 'Beyond 350 ppm the risk of crossing climate tipping points and destabilising ice sheets, monsoons and ecosystems rises; 450 ppm marks the start of high risk.', gap: 'The concentration must stop rising — which requires net-zero CO₂ emissions — and then fall, which requires net removals.', who: 'Energy, finance, transport and industry ministries; utilities; investors.', lever: 'Cumulative carbon budgets, carbon pricing, clean-power and electrification standards, ending fossil subsidies, removals.', deal: 'Paris Agreement; nationally determined contributions.', rev: 'Reversible only over decades to centuries, because CO₂ is long-lived.' },
    rf: { plain: 'The total extra energy that all human emissions — CO₂, methane, other gases, minus cooling aerosols — are trapping at the top of the atmosphere.', stake: 'Forcing drives warming; at more than three times the safe level, heating of land, ocean and ice is accelerating.', gap: 'Cutting methane and other short-lived gases lowers forcing within years; CO₂ cuts lower it over decades.', who: 'Energy, agriculture and waste ministries; environment regulators.', lever: 'Methane rules for oil, gas, coal, landfills and livestock; HFC phase-down; CO₂ policies above.', deal: 'Paris Agreement; Global Methane Pledge; Kigali Amendment.', rev: 'Partly fast (methane), mostly slow (CO₂).' },
    ne: { plain: 'Synthetic chemicals, plastics and other human-made substances released without adequate testing of their effects on Earth systems.', stake: 'Tens of thousands of substances are produced and released faster than they can be assessed; some persist for decades and spread worldwide.', gap: 'The boundary is set at zero untested release; the current share is unknown but far above zero.', who: 'Chemicals and environment regulators; health ministries; manufacturers and retailers.', lever: 'Testing before release, essential-use rules, persistent-chemical restrictions, producer responsibility, plastics limits.', deal: 'Stockholm Convention; Global Framework on Chemicals; plastics treaty negotiations.', rev: 'Persistent substances can remain for decades to centuries once released.' },
    oz: { plain: 'The thickness of the ozone layer that shields life from ultraviolet radiation.', stake: 'Ozone loss raises skin cancer and cataract risk and harms crops and plankton.', gap: 'Within the safe space and recovering; the task is to keep it there.', who: 'Environment regulators; customs authorities; refrigeration and chemical industries.', lever: 'Continued enforcement of bans on ozone-depleting substances; vigilance on illegal emissions.', deal: 'Montreal Protocol — the model of a boundary pulled back into safety.', rev: 'Reversible: on current policies recovery to 1980 values by about 2040–2066 depending on region.' },
    aer: { plain: 'The difference in fine particles and haze between the Northern and Southern hemispheres, which can shift monsoons and rainfall.', stake: 'Large imbalances can disrupt tropical rainfall; aerosols also harm health.', gap: 'Within the safe space globally and declining since about 2010.', who: 'Environment and health ministries; energy and transport regulators.', lever: 'Clean-air standards for power, industry, vehicles and household fuels.', deal: 'National clean-air laws; regional air-quality agreements.', rev: 'Fast: aerosols leave the air within days to weeks once emissions fall.' },
    aers: { plain: 'Haze over South Asia, where the Planetary Health Check proposes an additional regional boundary.', stake: 'Regional aerosol loading can weaken the monsoon and causes very high air-pollution mortality.', gap: 'Above the proposed regional boundary of 0.25.', who: 'National and state governments in South Asia; power, industry and agriculture regulators.', lever: 'Cleaner power and industry, crop-residue alternatives, clean household energy, regional coordination.', deal: 'National clean-air programmes; regional cooperation.', rev: 'Fast once emissions fall.' },
    oa: { plain: 'How easily shell-building marine life can form carbonate structures. The ocean absorbs CO₂, which makes it more acidic.', stake: 'Corals, pteropods and shellfish are affected; fisheries and coastal protection depend on them.', gap: 'Just past the boundary in 2025–26; it moves with atmospheric CO₂.', who: 'The same actors as for CO₂; fisheries and marine-protection agencies.', lever: 'CO₂ emissions cuts above all; reducing local stressors such as nutrient run-off and overfishing.', deal: 'Paris Agreement; marine protected areas; High Seas Treaty.', rev: 'Very slow: ocean chemistry recovers over centuries to millennia.' },
    p: { plain: 'Mined phosphorus spread on farmland each year, much of which runs off into rivers and seas.', stake: 'Excess phosphorus drives algal blooms and dead zones in lakes and coasts.', gap: 'About three times the safe level; reaching it means roughly a two-thirds cut in mined phosphorus applied, through efficiency and recycling.', who: 'Agriculture and water ministries; fertiliser industry; food companies; wastewater utilities.', lever: 'Precision fertilisation, nutrient recycling from manure and sewage, run-off controls, diet shifts.', deal: 'Kunming-Montreal Target 7: halve excess nutrients lost to the environment by 2030.', rev: 'Slow: legacy phosphorus in soils and sediments keeps leaking for decades.' },
    n: { plain: 'Nitrogen deliberately fixed for agriculture, mainly as synthetic fertiliser and nitrogen-fixing crops.', stake: 'Surplus nitrogen pollutes water and air, forms nitrous oxide (a greenhouse gas) and degrades ecosystems.', gap: 'More than two and a half times the safe level; returning to it implies cutting about three-fifths of intentional fixation or its losses.', who: 'Agriculture and environment ministries; fertiliser and food industries; farmers.', lever: 'Nitrogen-use efficiency, fertiliser pricing and subsidy reform, manure management, diet shifts.', deal: 'Kunming-Montreal Target 7.', rev: 'Moderate: nitrogen surplus responds within years, ecosystems more slowly.' },
    bw: { plain: 'The share of land where rivers and streamflow have moved outside their natural range because of dams, withdrawals and climate.', stake: 'Disturbed flows harm freshwater ecosystems, fisheries and downstream water security.', gap: 'Disturbed area is nearly twice the safe level.', who: 'Water, energy and agriculture ministries; basin authorities.', lever: 'Environmental flow rules, irrigation efficiency, water pricing and allocation, basin planning.', deal: 'UN Water Convention; transboundary basin agreements.', rev: 'Moderate where flows can be restored; slow where aquifers are depleted.' },
    gw: { plain: 'The share of land where soil moisture available to plants has moved outside its natural range.', stake: 'Soil moisture sustains crops, forests and rainfall recycling; disturbances raise drought and fire risk.', gap: 'Disturbed area is nearly twice the safe level.', who: 'Agriculture, land and forestry ministries; farmers.', lever: 'Protect forests and wetlands, soil-carbon and water-retaining farming, deforestation controls.', deal: 'UNCCD land-degradation neutrality; Kunming-Montreal Targets 2 and 3.', rev: 'Moderate with land restoration.' },
    land: { plain: 'How much of the world’s potential forest still stands.', stake: 'Forests regulate climate, rainfall and biodiversity; tropical forests such as the Amazon risk tipping into degraded states.', gap: 'Forest cover must rise from 64% to 78% of its potential — keeping what remains and restoring about a fifth more.', who: 'Agriculture, forestry, trade and finance ministries; commodity traders; investors.', lever: 'Zero-deforestation supply chains, land-use planning, Indigenous land rights, restoration finance.', deal: 'Kunming-Montreal Targets 2 and 3; Glasgow forest pledge; deforestation-free trade rules.', rev: 'Slow: forests take decades to regrow and lost primary forest is effectively irreplaceable.' },
    hanpp: { plain: 'The share of the land’s natural plant growth that humans take or prevent — through harvests, grazing and land conversion — leaving less energy for the rest of life.', stake: 'Less energy for ecosystems weakens their functioning and the land carbon sink.', gap: '21–30% against a safe level of 10%.', who: 'Agriculture, food, forestry and energy ministries; food and bioenergy companies.', lever: 'Higher yields on existing land, less food waste, diet shifts, limits on land-hungry bioenergy.', deal: 'Kunming-Montreal Framework; national food strategies.', rev: 'Moderate: falls as land is released and recovers.' },
    emsy: { plain: 'How fast species are going extinct, measured as extinctions per million species-years.', stake: 'Extinction is permanent; losing species erodes the genetic basis for adaptation and ecosystem function.', gap: 'Ten to a hundred times the safe rate.', who: 'Environment ministries; land and sea planners; trade and finance actors driving habitat loss.', lever: 'Protected and conserved areas, habitat restoration, ending overexploitation, invasive-species control.', deal: 'Kunming-Montreal Framework, including Target 3 (30% conserved by 2030).', rev: 'Irreversible for lost species.' },
  };

  /* --- wheel (SVG built here) and gauges ------------------------------------------------------------ */

  var ORDER = [['co2', 'rf'], ['ne'], ['oz'], ['aer', 'aers'], ['oa'], ['p', 'n'], ['bw', 'gw'], ['land'], ['hanpp', 'emsy']];
  var GNAME = ['Climate change', 'Novel entities', 'Stratospheric ozone', 'Aerosol loading', 'Ocean acidification', 'Biogeochemical flows', 'Freshwater change', 'Land system change', 'Biosphere integrity'];
  var picked = 'co2';
  function show(id) {
    picked = id; var c = BY[id], t = T[id], p = pmid(c), col = zcol(c.id === 'ne' ? 1.5 : p);
    var card = document.getElementById('tcard'); if (card) card.style.setProperty('--tc', col);
    setText('tc-kick', c.b); setText('tc-title', c.name); setText('tc-status', status(c));
    var m = c.cur ? [mult(c, c.cur[0]), mult(c, c.cur[1])] : null;
    var dl = document.getElementById('tc-dl');
    if (dl) dl.innerHTML =
      '<dt>Where we are</dt><dd>' + curTxt(c) + ' · boundary ' + fv(c.pb) + (c.hr !== null ? ' · high-risk line ' + fv(c.hr) : '') + (m && m[0] !== null ? ' · <b>' + (m[0] === m[1] ? m[0].toFixed(1) : m[0].toFixed(1) + '–' + m[1].toFixed(0)) + '×</b> the safe disturbance' : '') + '</dd>' +
      '<dt>In plain words</dt><dd>' + t.plain + '</dd>' +
      '<dt>What is at stake</dt><dd>' + t.stake + '</dd>' +
      '<dt>The gap</dt><dd>' + t.gap + '</dd>' +
      '<dt>Who decides</dt><dd>' + t.who + '</dd>' +
      '<dt>Levers</dt><dd>' + t.lever + '</dd>' +
      '<dt>Agreements</dt><dd>' + t.deal + '</dd>' +
      '<dt>Reversibility</dt><dd>' + t.rev + '</dd>';
    Array.prototype.forEach.call(document.querySelectorAll('[data-cv]'), function (e) { var on = e.getAttribute('data-cv') === id; e.classList.toggle('is-on', on); e.classList.toggle('is-dim', !on && e.tagName.toLowerCase() === 'path'); });
  }
  (function () {
    var svg = document.getElementById('wheel'); if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg', cx = 320, cy = 250, R0 = 62;
    function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; }
    function rad(p) { return p === null ? R0 * 1.9 : p < 0 ? R0 * (1 + 0.6 * p) : R0 * (1 + Math.min(p, 2.2)); }
    function arc(a0, a1, r) { var x0 = cx + r * Math.sin(a0), y0 = cy - r * Math.cos(a0), x1 = cx + r * Math.sin(a1), y1 = cy - r * Math.cos(a1); return 'M' + cx + ' ' + cy + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z'; }
    el('circle', { cx: cx, cy: cy, r: R0 * 2, fill: 'none', stroke: Z.high, 'stroke-dasharray': '5 4', 'stroke-opacity': 0.8 });
    var w = 2 * Math.PI / 9, gap = 0.035;
    ORDER.forEach(function (g, i) {
      var a0 = i * w, sub = (w - 2 * gap) / g.length;
      g.forEach(function (id, j) {
        var c = BY[id], p = id === 'ne' ? null : pmid(c), b0 = a0 + gap + j * sub, b1 = b0 + sub - 0.012;
        var d = el('path', { d: arc(b0, b1, rad(p)), fill: id === 'ne' ? alpha(Z.unk, 0.75) : zcol(p), class: 'wd', 'data-cv': id, tabindex: 0, 'aria-label': c.name });
        if (c.pos && c.pos[1] !== c.pos[0]) el('path', { d: arc(b0, b1, rad(Math.min(c.pos[1], 2.2))), fill: alpha(zcol(c.pos[1]), 0.35), class: 'wd', 'data-cv': id });
        d.addEventListener('click', function () { show(id); }); d.addEventListener('focus', function () { show(id); }); d.addEventListener('mouseenter', function () { show(id); });
      });
      var am = a0 + w / 2, rr = R0 * 3.45, tx = cx + rr * Math.sin(am), ty = cy - rr * Math.cos(am);
      var t = el('text', { x: tx.toFixed(0), y: ty.toFixed(0), 'text-anchor': Math.sin(am) > 0.2 ? 'start' : Math.sin(am) < -0.2 ? 'end' : 'middle', 'dominant-baseline': 'middle' }); t.textContent = GNAME[i];
    });
    el('circle', { cx: cx, cy: cy, r: R0, fill: alpha(Z.safe, 0.22), stroke: Z.safe, 'stroke-width': 2.5, 'pointer-events': 'none' });
    var lab = el('text', { x: cx, y: cy + 4, 'text-anchor': 'middle' }); lab.textContent = 'safe operating space';
  })();
  (function () {
    var el = document.getElementById('gauges'); if (!el) return;
    // gauge scale: position −1 … 3 maps to 0 … 100% (safe 0–25%, zone 25–50%, high 50–100%)
    function x(p) { return Math.max(0, Math.min(100, (p + 1) * 25)); }
    el.innerHTML = '<div class="gscale"><span></span><span><em>safe</em><em>boundary</em><em>high-risk line</em><em>3× zone</em></span><span></span></div>' + CV.map(function (c) {
      var bar = !c.pos ? '<div class="gbar unk"></div>' : '<div class="gbar">' + (c.pos[0] !== c.pos[1] ? '<u style="left:' + x(c.pos[0]) + '%;width:' + (x(c.pos[1]) - x(c.pos[0])) + '%"></u>' : '') + '<i style="left:calc(' + x(c.pos[0]) + '% - 2px)"></i></div>';
      return '<div class="gauge-row" data-cv="' + c.id + '" tabindex="0"><div class="gl">' + c.name + '<b>' + c.b + '</b></div>' + bar + '<div class="gv">' + curTxt(c) + '</div></div>';
    }).join('');
    Array.prototype.forEach.call(el.querySelectorAll('.gauge-row'), function (r) { r.addEventListener('click', function () { show(r.getAttribute('data-cv')); }); r.addEventListener('keydown', function (e) { if (e.key === 'Enter') show(r.getAttribute('data-cv')); }); });
  })();
  show('co2');

  /* --- role lens on the decision matrix -------------------------------------------------------- */

  (function () {
    var rows = document.querySelectorAll('#matrix tbody tr');
    Array.prototype.forEach.call(document.querySelectorAll('[data-role]'), function (b, _, all) {
      b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false');
      b.addEventListener('click', function () {
        var r = b.getAttribute('data-role');
        Array.prototype.forEach.call(all, function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        Array.prototype.forEach.call(rows, function (tr) { tr.classList.toggle('is-dim', r !== 'all' && (tr.getAttribute('data-roles') || '').split(' ').indexOf(r) < 0); });
      });
    });
  })();

  /* --- charts -------------------------------------------------------------------------------------- */

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, tick = { color: MUTED, font: { size: 11 } };

    HH.chart('chart-count', {
      type: 'bar',
      data: { labels: D.count.map(function (c) { return String(c[0]); }), datasets: [
        { label: 'Transgressed', data: D.count.map(function (c) { return c[1]; }), backgroundColor: D.count.map(function (c) { return c[1] >= 7 ? Z.deep : c[1] >= 6 ? Z.high : Z.zone; }), stack: 's', borderRadius: 2 },
        { label: 'Within the safe space or not yet quantified', data: D.count.map(function (c) { return 9 - c[1]; }), backgroundColor: alpha(Z.safe, 0.45), stack: 's', borderRadius: 2 },
      ] },
      options: { plugins: { legend: { position: 'bottom' } }, scales: { x: Object.assign(axis({ grid: false }), { stacked: true }), y: Object.assign(axis({ title: 'of nine planetary boundaries' }), { stacked: true, min: 0, max: 9, ticks: Object.assign({ stepSize: 1 }, tick) }) } },
      plugins: [HH.valueLabels({ format: function (v) { return v; }, only: [0, 1, 2, 3, 4] })],
    });

    var MU = CV.filter(function (c) { return c.cur && c.base !== null && c.base !== undefined; }).map(function (c) { return { c: c, lo: mult(c, c.cur[0]), hi: mult(c, c.cur[1]) }; }).sort(function (a, b) { return b.lo - a.lo; });
    HH.chart('chart-mult', {
      type: 'bar',
      data: { labels: MU.map(function (m) { return m.c.name; }), datasets: [
        { label: 'Multiple of the safe disturbance', data: MU.map(function (m) { return +m.lo.toFixed(2); }), backgroundColor: MU.map(function (m) { return m.lo < 1 ? Z.safe : m.lo < 2 ? Z.zone : m.lo < 5 ? Z.high : Z.deep; }), borderRadius: 2 },
      ] },
      options: { indexAxis: 'y', layout: { padding: { right: 64 } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { var m = MU[c.dataIndex]; return (m.lo === m.hi ? m.lo.toFixed(2) : m.lo.toFixed(1) + '–' + m.hi.toFixed(0)) + '× the disturbance the boundary allows'; } } } }, scales: { x: Object.assign(axis({ title: '(current − pre-industrial) ÷ (boundary − pre-industrial) · log scale · 1 = at the boundary' }), { type: 'logarithmic', min: 0.3, max: 150 }), y: Object.assign(axis({ grid: false }), { ticks: Object.assign({ autoSkip: false }, tick) }) } },
      plugins: [{ id: 'one', afterDatasetsDraw: function (ch) { var x = ch.scales.x.getPixelForValue(1), a = ch.chartArea, ctx = ch.ctx; ctx.save(); ctx.strokeStyle = INK; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x, a.top); ctx.lineTo(x, a.bottom); ctx.stroke(); ctx.setLineDash([]);
        var m = ch.getDatasetMeta(0); ctx.font = '600 11px ' + tok('--mono'); ctx.fillStyle = INK; ctx.textBaseline = 'middle';
        m.data.forEach(function (b, i) { var q = MU[i]; if (q.hi !== q.lo) { var xh = ch.scales.x.getPixelForValue(q.hi); ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(xh, b.y); ctx.moveTo(xh, b.y - 5); ctx.lineTo(xh, b.y + 5); ctx.stroke(); ctx.fillText((q.lo.toFixed(1)) + '–' + q.hi.toFixed(0) + '×', xh + 5, b.y); } else ctx.fillText(q.lo.toFixed(1) + '×', b.x + 5, b.y); });
        ctx.restore(); } }],
    });

    var Y0 = D.co2.map(function (r) { return r[0]; });
    function yearAxis(ys, step) { return Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return ys[i] % step === 0 ? ys[i] : ''; } }, tick) }); }
    function hline(vals) { return { id: 'h' + Math.random().toString(36).slice(2, 6), beforeDatasetsDraw: function (ch) { var ys = ch.scales.y, a = ch.chartArea, ctx = ch.ctx; ctx.save(); ctx.font = '11px ' + tok('--mono'); vals.forEach(function (v) { if (v[0] > ys.max || v[0] < ys.min) return; var y = ys.getPixelForValue(v[0]); ctx.strokeStyle = v[1]; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = v[1]; ctx.fillText(v[2], a.left + 6, y - 5); }); ctx.restore(); } }; }
    HH.chart('chart-co2', {
      type: 'line',
      data: { labels: Y0, datasets: [{ label: 'Global mean CO₂ (NOAA)', data: D.co2.map(function (r) { return r[1]; }), borderColor: Z.high, backgroundColor: alpha(Z.high, 0.12), fill: 'origin', borderWidth: 2.6, pointRadius: 0 }] },
      options: { plugins: { legend: { display: false } }, scales: { x: yearAxis(Y0, 10), y: Object.assign(axis({ title: 'ppm' }), { min: 320, max: 460 }) } },
      plugins: [hline([[350, Z.safe, 'boundary 350 ppm'], [450, Z.deep, 'high-risk line 450 ppm']])],
    });

    var LY = D.lpi.map(function (r) { return r[0]; });
    HH.chart('chart-lpi', {
      type: 'line',
      data: { labels: LY, datasets: [
        { label: 'Upper', data: D.lpi.map(function (r) { return r[3]; }), borderColor: 'transparent', backgroundColor: alpha(Z.high, 0.15), fill: '+1', pointRadius: 0 },
        { label: 'Lower', data: D.lpi.map(function (r) { return r[2]; }), borderColor: 'transparent', backgroundColor: 'transparent', fill: false, pointRadius: 0 },
        { label: 'Living Planet Index', data: D.lpi.map(function (r) { return r[1]; }), borderColor: Z.high, backgroundColor: Z.high, borderWidth: 2.6, pointRadius: 0 },
      ] },
      options: { plugins: { legend: { display: false }, tooltip: { filter: function (c) { return c.datasetIndex === 2; }, callbacks: { label: function (c) { return 'Index ' + c.raw.toFixed(2) + ' (1970 = 1)'; } } } }, scales: { x: yearAxis(LY, 10), y: Object.assign(axis({ title: 'average change in monitored populations, 1970 = 1' }), { min: 0, max: 1.05 }) } },
    });

    var NY = D.nfer.map(function (r) { return r[0]; });
    HH.chart('chart-nfer', {
      type: 'line',
      data: { labels: NY, datasets: [{ label: 'Nitrogen fertiliser per hectare of cropland', data: D.nfer.map(function (r) { return r[1]; }), borderColor: Z.zone, backgroundColor: alpha(Z.zone, 0.15), fill: 'origin', borderWidth: 2.4, pointRadius: 0 }] },
      options: { plugins: { legend: { display: false } }, scales: { x: yearAxis(NY, 10), y: Object.assign(axis({ title: 'kg N per hectare of cropland' }), { min: 0 }) } },
    });

    var OY = D.ods.map(function (r) { return r[0]; }), HY = {}; D.hole.forEach(function (r) { HY[r[0]] = r[1]; });
    HH.chart('chart-ozone', {
      type: 'bar',
      data: { labels: OY, datasets: [
        { type: 'bar', label: 'Ozone-depleting substance consumption (thousand ODP tonnes)', data: D.ods.map(function (r) { return Math.max(0, r[1]); }), backgroundColor: alpha(C.ink, 0.7), yAxisID: 'y', order: 2 },
        { type: 'line', label: 'Maximum Antarctic ozone hole (million km²)', data: OY.map(function (y) { return HY[y] === undefined ? null : HY[y]; }), borderColor: Z.high, backgroundColor: Z.high, borderWidth: 2.2, pointRadius: 2, yAxisID: 'y2', order: 1, spanGaps: true },
      ] },
      options: { plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false } }, scales: { x: yearAxis(OY, 5), y: Object.assign(axis({ title: 'thousand ODP tonnes' }), { min: 0 }), y2: Object.assign(axis({ title: 'million km²', grid: false }), { position: 'right', min: 0, max: 32 }) } },
    });
  });
})();
