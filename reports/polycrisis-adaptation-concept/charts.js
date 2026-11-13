/* ===========================================================================
   Charts and interactions — "Polycrisis Adaptation: the H Heuristics concept"
   DATA (D): lp = local-projection estimates of the effect of a severe climate
   shock on GDP per person [horizon, estimate %, s.e., n] for three income
   groups (report 2026-56); traj = the illustrative conceptual trajectories of
   the framework article (Figure 2).
   =========================================================================== */
(function () {
  'use strict';
  if (!window.HH) return;
  var D = {"lp":{"LICLMC_cs2":[[-3,1.77,0.901,88],[-2,0.654,0.56,89],[-1,0.0,0.0,90],[0,-1.721,0.743,88],[1,-1.388,0.894,82],[2,-2.511,1.401,82],[3,-3.864,2.091,78],[4,-5.104,2.529,77],[5,-4.985,2.741,74],[6,-5.02,2.827,73],[7,-3.725,2.234,72],[8,-3.659,2.118,71]],"UMC_cs2":[[-3,2.923,1.849,47],[-2,1.47,0.841,47],[-1,0.0,0.0,47],[0,-2.376,1.173,47],[1,-2.28,2.253,44],[2,-2.714,3.286,42],[3,-1.207,3.388,41],[4,-0.562,2.932,41],[5,-0.679,2.753,41],[6,-1.705,3.114,41],[7,-1.8,3.588,41],[8,-0.621,4.019,40]],"HIC_cs2":[[-3,2.544,2.901,10],[-2,2.265,2.427,10],[-1,0.0,0.0,10],[0,-0.903,1.126,10],[1,-2.216,2.653,9],[2,-1.297,3.488,8],[3,-0.832,3.52,8],[4,-2.115,2.992,8],[5,-1.577,2.726,8],[6,-2.256,3.313,8],[7,-2.554,3.696,8],[8,-2.286,4.46,7]]},"traj":{"t":[0,4,8,12,16,20],"i":[50,58,69,82,95,110],"s":[50,48,45,41,38,35],"shocks":[[6,"Climate + supply shock"],[14,"Tech + geopolitical shock"]]}};
  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function fmt(v, d) { if (v === null || v === undefined || isNaN(v)) return '—'; return v.toLocaleString('en-US', { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }).replace('-', '−'); }
  function sg(v, d) { return (v >= 0 ? '+' : '−') + fmt(Math.abs(v), d === undefined ? 1 : d); }
  function dl(pairs) { return '<dl>' + pairs.map(function (p) { return '<dt>' + p[0] + '</dt><dd>' + p[1] + '</dd>'; }).join('') + '</dl>'; }
  function shortName(n) { return n.replace(', Dem. Rep.', ' (DRC)').replace(', Rep.', '').replace(', Arab Rep.', '').replace(', Islamic Rep.', '').replace('Syrian Arab Republic', 'Syria').replace('Russian Federation', 'Russia').replace(', RB', '').replace('Lao PDR', 'Laos').replace(', Fed. Rep.', '').replace('West Bank and Gaza', 'Palestine').replace('Central African Republic', 'CAR').replace("Korea, Dem. People's Rep.", 'North Korea').replace('Kyrgyz Republic', 'Kyrgyzstan').replace('Turkiye', 'Türkiye').replace('Egypt, Arab Rep.', 'Egypt').replace('Gambia, The', 'The Gambia'); }
  var _sn = shortName; shortName = function (n) { return _sn(n.replace("Korea, Dem. People's Rep.", 'North Korea').replace('Korea, Rep.', 'South Korea').replace('Bosnia and Herzegovina', 'Bosnia & Herz.')); };
  function segs(attr, fn) { Array.prototype.forEach.call(document.querySelectorAll('[' + attr + ']'), function (b, _, all) { b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false'); b.addEventListener('click', function () { Array.prototype.forEach.call(all, function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); }); fn(b.getAttribute(attr)); }); }); }
  var INKC = tok('--p-ink'), BRASS = tok('--p-brass'), TEAL = tok('--p-teal'), ROSE = tok('--p-rose'), BLUE = tok('--p-blue'), GREY = tok('--p-grey'), MUTED = tok('--text-muted');
  var narrow = window.innerWidth < 640;

  function tbl(id, head, rows, boldFirst) {
    var el = document.getElementById(id); if (!el) return;
    el.innerHTML = '<thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td>' + (i === 0 && boldFirst ? '<b>' + c + '</b>' : c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
  }
  var V = { s: ['Supported', TEAL], p: ['Partly supported', BRASS], o: ['Open', GREY] };
  function chip(k) { return '<span class="verdict" style="--k:' + V[k][1] + '">' + V[k][0] + '</span>'; }

  tbl('cmp-table', ['', 'Siloed, crisis-by-crisis response', 'Integrated Polycrisis Adaptation'], [
    ['Unit of analysis', 'The single hazard', 'Interacting risks across environmental, economic, technological, demographic and geopolitical domains'],
    ['Timing', 'After the shock: emergency relief and repair', 'Before, between and after shocks: a continuous process of adjustment'],
    ['Budget logic', 'A defensive cost against one uncertain hazard, often deferred', 'Evaluated for its multi-risk payoff across systems'],
    ['Ownership', 'One ministry or sector at a time', 'Cross-ministry risk coordination across environmental, economic and security silos'],
    ['Trajectory', 'Accumulating hidden vulnerability; eroding fiscal space', 'Compounding adaptive capacity carried across shock cycles']
  ], true);

  var DIMS = [
    { name: 'Economic', k: '#c79a2b', h: 'Economic Adaptation', m: 'Adjusting economic structures, production systems, and development pathways to interconnected risks.', rows: [['What it does', 'Diversifies industrial capabilities and trade portfolios, builds strategic buffers and aligns capital allocation with long-term risk exposure, so the economy absorbs shocks without derailing living standards or productivity growth.'], ['Depends on', 'Institutions to manage public finance and coordinate; infrastructure for productivity; social adaptation so workers can move between activities.'], ['Observed', 'Fiscal space is the first thing to go: by 2025, 3.4 billion people lived in countries that spend more on interest than on health or education (UNCTAD).']] },
    { name: 'Institutional', k: '#5a4aa8', h: 'Institutional Adaptation', m: 'Improving governance, coordination, and institutional capabilities to respond to emerging challenges.', rows: [['What it does', 'Cross-agency planning and responsive permitting; one function responsible for how crises would interact; stress tests and learning loops built into every policy cycle.'], ['Depends on', 'An educated public, economic resources and information systems.'], ['Observed', 'In 2020–23, national steering (coordination) was the one resilience function associated with better outcomes: 62 fewer excess deaths per 100,000 and a 5.7-point smaller rise in hunger (report 2026-62).']] },
    { name: 'Infrastructure', k: '#2f7f95', h: 'Infrastructure Adaptation', m: 'Strengthening energy, water, transportation, housing, and digital infrastructure against systemic disruptions.', rows: [['What it does', 'Protects the networks everything else depends on, by designing for the hazards an asset will face over its lifetime and by adding redundancy where failure would cascade.'], ['Depends on', 'Economic resources, and institutions to regulate and maintain it.'], ['Observed', 'Resilient infrastructure in low- and middle-income countries returns about $4 for each $1, a net benefit of US$4.2 trillion over the lifetime of new assets (Hallegatte et al., 2019).']] },
    { name: 'Social', k: '#b44a68', h: 'Social Adaptation', m: 'Improving human development, socioeconomic security, and community capacity to manage changing conditions.', rows: [['What it does', 'Health, education, social protection and community organisation that let households and workers absorb shocks and move through economic transitions without permanent harm.'], ['Depends on', 'Infrastructure for services, fiscal resources and delivery institutions.'], ['Observed', 'Adaptive social protection scales up when a shock strikes; in Kenya, mobile money let households cope with income shocks without cutting consumption, while non-users’ consumption fell about 7% (Jack and Suri, 2014).']] },
    { name: 'Technological', k: '#3f8a3a', h: 'Technological Adaptation', m: 'Deploying technological innovations that reduce vulnerability and improve adaptive capabilities.', rows: [['What it does', 'From grid-level forecasting to climate-resilient agriculture, digital early warning and modular clean energy: tools that cut vulnerability and widen the options for adjustment.'], ['Depends on', 'Economic resources and the institutions to regulate it; delivers durable security only when paired with social adaptation.'], ['Observed', 'Solar modules are about 1,100 times cheaper than in 1975; but about half of countries reported multi-hazard early-warning systems in 2023, so adoption, not invention, is the constraint.']] }
  ];
  (function () {
    var box = document.getElementById('dim-pick'), det = document.getElementById('dim-detail'); if (!box || !det) return;
    box.innerHTML = DIMS.map(function (d, i) { return '<button type="button" data-i="' + i + '" aria-pressed="false" style="--k:' + d.k + '">' + (i + 1) + ' · ' + d.name + '</button>'; }).join('');
    function show(i) { Array.prototype.forEach.call(box.children, function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); }); var d = DIMS[i]; det.style.setProperty('--k', d.k); det.innerHTML = '<h3>' + d.h + '</h3><p class="d-q">' + d.m + '</p>' + dl(d.rows); }
    box.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (b) show(+b.getAttribute('data-i')); });
    show(0);
  })();

  tbl('prop-table', ['Proposition (from the framework)', 'What the evidence shows', 'Verdict'], [
    ['<b>1. Adaptation capacity shapes long-term vulnerability.</b> Economies with higher institutional, infrastructural, and social adaptation capacity suffer markedly smaller persistent output losses when exposed to interconnected environmental and economic shocks.', 'After severe climate shocks, GDP per person in low- and lower-middle-income countries was 3.7% lower eight years later (88 shocks); in upper-middle-income countries the loss faded (−0.6%, 47 shocks) and in high-income countries it is small but imprecise (−2.3%, 10 shocks). GDP was back above its pre-shock level within three years after 56% of severe shocks in low-income countries against 78% in upper-middle-income ones (report 2026-56). The data cover climate shocks, not the interacting shocks the proposition names, and the richer-group estimates are imprecise.', chip('p')],
    ['<b>2. Technological diffusion accelerates adaptation in developing economies.</b> Rapidly diffusing modular clean energy, digital early-warning systems, and resilient agricultural technologies enables lower-income countries to strengthen adaptive capacity without waiting decades for legacy capital accumulation.', 'The tools exist and are cheap: solar modules about 1,100 times cheaper since 1975; mobile money cushioned Kenyan households against shocks. Diffusion is the constraint: infrastructure-embedded technologies diffuse about five times more slowly (report 2026-75, US data) and only about half of countries had multi-hazard early warning in 2023. At the pace the 75th-percentile peer already achieves, 624 million more people would be online by 2035 than on current trends (report 2026-88).', chip('p')],
    ['<b>3. Sustainable development investments serve dual purposes.</b> Well-designed investments in clean water, reliable power, education, and resilient housing simultaneously raise adaptive capacity and accelerate economic convergence, eliminating the false trade-off between resilience and growth.', 'Returns are consistently positive: 17 published prevention and adaptation estimates return 2 to 87 dollars per dollar, all above 1 (report 2026-74), and resilient infrastructure about 4 to 1. Across 101 developing economies, faster gains in capabilities were not associated with environmental deterioration (+0.17), though across countries today higher capability goes with a worse environmental score (−0.43): the trade-off disappears for gains that are designed in, not automatically (report 2026-88).', chip('s')],
    ['<b>4. Institutional and infrastructural upgrades yield compounding multi-domain benefits.</b> Upgrading governance coordination alongside core physical networks reduces vulnerability not just to climate hazards, but also to supply-chain interruptions, demographic pressures, and geopolitical shocks.', 'Gains travel together but weakly: average partial correlation +0.06 across 15 pairs of dimensions, 8 positive; strongest links are technology with institutions (+0.33) and human development with infrastructure and institutions (+0.22). Only 9 of 42 cross-system spillovers were significant (report 2026-85), and exposure to different risk domains is close to independent (report 2026-82), so benefits in one domain do not automatically appear in another.', chip('p')]
  ], false);

  var ARCH = [
    ['card--f', 'The process', 'Polycrisis Adaptation', 'The active, ongoing process of adjustment: how institutions, markets, networks and communities reconfigure as risks evolve.'],
    ['card--a', 'The goal', 'Polycrisis Resilience', 'Reducing interconnected vulnerabilities and withstanding shocks. Adaptation operationalises it in motion.'],
    ['card--b', 'The yardstick', 'Polycrisis-Adjusted Development', 'Evaluates development progress against systemic risk exposure; paired with adaptation so progress is not counted if it builds exposure.'],
    ['card--c', 'The extension', 'Adaptive Development', 'Extended by explicitly modelling how environmental, economic, technological, demographic and geopolitical risks interact.'],
    ['card--d', 'The route', 'Sustainable Convergence', 'Narrowing disparities on sustainable paths; adaptive capacity must be built into the infrastructure and technology that convergence adds.'],
    ['card--e', 'The programme', 'Century Pathways', 'Sustaining human-development gains in a century of rising hazards depends on embedding adaptive capacity in infrastructure, institutions and diffusion.']
  ];
  var ac = document.getElementById('arch-cards'); if (ac) ac.innerHTML = ARCH.map(function (p) { return '<div class="card ' + p[0] + '"><p class="tag">' + p[1] + '</p><h3>' + p[2] + '</h3><p>' + p[3] + '</p></div>'; }).join('');

  tbl('shift-table', ['Shift', 'What it means', 'Evidence and examples'], [
    ['1. Cross-ministry risk coordination', 'Break down environmental, economic and security silos; give one function, often at the centre of government or in the finance ministry, responsibility for how crises would interact.', 'In 2020–23, national steering was the one resilience function associated with better outcomes (62 fewer excess deaths per 100,000; report 2026-62). Adaptive social protection links national delivery systems to local shocks (Bowen et al., 2020).'],
    ['2. Multi-hazard stress testing', 'Test major infrastructure and development portfolios against combinations and sequences of shocks, not single scenarios: combined climate, price and interest-rate stress tests and dependency mapping.', 'Resilient infrastructure returns about 4 to 1 (Hallegatte et al., 2019); a day’s warning of a storm or heatwave can cut damage by 30% (Global Commission on Adaptation, 2019).'],
    ['3. Blended finance for adaptive capital', 'Lower the upfront cost of adaptive capital in emerging economies with guarantees, local-currency lending, contingent credit and concessional layers.', 'Clean-energy capital costs two to three times higher in developing economies than in rich ones (IEA, 2024); disaster finance arranged in advance arrives faster and is better spent (Clarke and Dercon, 2016).']
  ], true);

  tbl('use-table', ['Form', 'Text'], [
    ['One sentence', 'Polycrisis Adaptation is the process through which economic, social, institutional, technological, and infrastructural systems adjust to interconnected and evolving global risks, strengthening their capacity to manage disruptions and changing conditions.'],
    ['One paragraph', 'Polycrisis Adaptation, a concept developed by Hunter Hughes of H Heuristics, treats adaptation as an integrated development process rather than a collection of isolated responses to individual crises. It organises adjustment across five dimensions (economic, institutional, infrastructure, social, technological), evaluates investments for their multi-risk payoff, and builds a learning loop so each policy cycle updates standards and shifts capital to proven resilience multipliers.'],
    ['Cite', 'Polycrisis Adaptation (Hughes, 2026); Hughes, H. (2026), Polycrisis Adaptation: An Integrated Framework for Development in an Era of Interconnected Global Risks, H Heuristics, 13 November 2026; H Heuristics (2026), Digital Reports 2026-89.'],
    ['Claim carefully', 'The concept is a proposed framework open to testing. “Adaptation” is established (IPCC, UNDRR); the compound phrase and the five-dimension framework are H Heuristics’s. The compounding trajectory is illustrative.'],
    ['Related concept', 'Polycrisis Resilience: the capacity of individuals, communities, institutions, economies, societies, and interconnected systems to anticipate, withstand, adapt to, recover from, and reduce their vulnerability to multiple interacting crises.']
  ], true);

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, tick = { color: MUTED, font: { size: 11 } };
    var legB = { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12 } };
    var T = D.traj, chT = null;
    function pts(arr) { return T.t.map(function (t, i) { return { x: t, y: arr[i] }; }); }
    var shockPlugin = { id: 'shocks', afterDatasetsDraw: function (c) {
      var x = c.scales.x, y = c.scales.y, ctx = c.ctx; ctx.save(); ctx.setLineDash([2, 4]); ctx.strokeStyle = MUTED; ctx.fillStyle = MUTED; ctx.font = '11px sans-serif'; ctx.lineWidth = 1;
      T.shocks.forEach(function (s) { var px = x.getPixelForValue(s[0]); ctx.beginPath(); ctx.moveTo(px, y.top); ctx.lineTo(px, y.bottom); ctx.stroke(); ctx.fillText(narrow ? 'shock' : s[1], px + 4, y.top + 12); });
      ctx.restore(); } };
    function blend(sh) { return T.t.map(function (t, i) { return T.s[i] + (T.i[i] - T.s[i]) * sh; }); }
    function runT() {
      var sh = +document.getElementById('m-int').value / 100; setText('m-int-o', fmt(sh * 100) + '%');
      var b = blend(sh); if (chT) { chT.data.datasets[2].data = pts(b); chT.update('none'); }
      var end = b[b.length - 1], out = document.getElementById('m-out');
      if (out) out.innerHTML = [[fmt(end, 0), 'capacity index in year 20 on your blend (start 50)', sh >= 0.5 ? TEAL : ROSE], [sg(end - 50, 0), 'change from year 0', INKC], [sg(end - T.s[5], 0), 'against the siloed path (35)', BRASS], [fmt(sh * 100) + '%', 'integrated share: 0% = siloed, 100% = integrated', GREY]].map(function (x) { return '<div style="--k:' + x[2] + '"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('');
      setText('m-note', sh === 1 ? 'Fully integrated: capacity compounds from 50 to 110 across both shocks.' : sh === 0 ? 'Fully siloed: capacity erodes from 50 to 35, with each shock leaving a vulnerability the next inherits.' : 'A blend: ' + fmt(sh * 100) + '% of effort is integrated across domains. Illustrative trajectory from the H Heuristics framework, interpolated linearly between the two paths; it is not an estimate.');
    }
    chT = HH.chart('chart-traj', {
      type: 'line', plugins: [shockPlugin],
      data: { datasets: [
        { label: 'Integrated Polycrisis Adaptation', data: pts(T.i), borderColor: alpha(TEAL, 0.5), backgroundColor: TEAL, borderWidth: 2, pointRadius: 4, tension: 0 },
        { label: 'Siloed crisis-by-crisis response', data: pts(T.s), borderColor: alpha(ROSE, 0.5), backgroundColor: ROSE, borderWidth: 2, pointRadius: 4, borderDash: [6, 4], tension: 0 },
        { label: 'Your blend', data: pts(T.i), borderColor: INKC, backgroundColor: INKC, borderWidth: 3.2, pointRadius: 0, tension: 0 }] },
      options: { parsing: false, interaction: { mode: 'nearest', axis: 'x', intersect: false }, plugins: { legend: legB, tooltip: { callbacks: { title: function (it) { return 'Year ' + it[0].raw.x; }, label: function (c) { return c.dataset.label + ': ' + fmt(c.raw.y, 0); } } } }, scales: { x: Object.assign(axis({ title: 'planning horizon, years' }), { type: 'linear', min: 0, max: 20, ticks: Object.assign({ stepSize: 4 }, tick) }), y: Object.assign(axis({ title: 'systemic adaptive capacity index (year 0 = 50)' }), { min: 25, max: 120, ticks: tick }) } }
    });
    document.getElementById('m-int').addEventListener('input', runT); runT();

    var G = [['LICLMC_cs2', 'Low and lower-middle income (88 shocks)', ROSE, 'LIC'], ['UMC_cs2', 'Upper-middle income (47 shocks)', TEAL, 'UMC'], ['HIC_cs2', 'High income (10 shocks)', BLUE, 'HIC']];
    var lpMode = 'all', chL = null;
    function lpSets() {
      var out = [];
      G.forEach(function (g) {
        if (lpMode !== 'all' && lpMode !== g[3]) return;
        var rows = D.lp[g[0]];
        out.push({ label: g[1], data: rows.map(function (r) { return { x: r[0], y: r[1] }; }), borderColor: g[2], backgroundColor: g[2], borderWidth: 2.6, pointRadius: 3, tension: 0.1, order: 1 });
        out.push({ label: g[1] + ' upper', data: rows.map(function (r) { return { x: r[0], y: r[1] + r[2] }; }), borderWidth: 0, pointRadius: 0, backgroundColor: alpha(g[2], 0.14), fill: '+1', order: 2 });
        out.push({ label: g[1] + ' lower', data: rows.map(function (r) { return { x: r[0], y: r[1] - r[2] }; }), borderWidth: 0, pointRadius: 0, fill: false, order: 2 });
      });
      return out;
    }
    function lpNote() {
      if (lpMode === 'LIC') return 'Low- and lower-middle-income countries, 88 severe climate shocks: −1.7% in the shock year, −2.5% after two years, −5.1% after four (significant at the 5% level), −5.0% after six and −3.7% after eight (standard error 2.1). The loss deepens before it heals and has not healed after eight years: the scar that low adaptive capacity leaves.';
      if (lpMode === 'UMC') return 'Upper-middle-income countries, 47 severe shocks: −2.4% in the shock year, about −1% after three years and −0.6% after eight (standard error 4.0). Income recovers: the adaptive capacity that insurance, reserves, credit and a functioning state provide.';
      if (lpMode === 'HIC') return 'High-income countries, only 10 severe shocks: −0.9% in the shock year and −2.3% after eight, with a standard error of 4.5. Too few events to say much; the estimate is shown for completeness, and the bands overlap the other groups.';
      return 'The point estimates show a lasting loss in poorer economies and a smaller, fading one in richer ones, but the bands overlap at long horizons and the high-income group has only 10 events. This is an association estimated with country and year fixed effects, not proof that adaptive capacity is the cause. In the pre-shock years the estimates are small and positive, not a declining trend.';
    }
    function drawLP() { if (chL) { chL.data.datasets = lpSets(); chL.update(); } setText('lp-note', lpNote()); }
    chL = HH.chart('chart-lp', {
      type: 'line', data: { datasets: lpSets() },
      options: { parsing: false, interaction: { mode: 'nearest', axis: 'x', intersect: false }, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12, filter: function (i) { return !/ (upper|lower)$/.test(i.text); } } }, tooltip: { filter: function (it) { return !/ (upper|lower)$/.test(it.dataset.label); }, callbacks: { title: function (it) { return it[0].raw.x < 0 ? it[0].raw.x + ' years before the shock' : 'Year ' + it[0].raw.x + ' after the shock'; }, label: function (c) { return c.dataset.label + ': ' + sg(c.raw.y, 1) + '%'; } } } }, scales: { x: Object.assign(axis({ title: 'years from the shock (0 = year of shock; −1 = reference)' }), { type: 'linear', min: -3, max: 8, ticks: Object.assign({ stepSize: 1 }, tick) }), y: Object.assign(axis({ title: 'change in GDP per person, %' }), { min: -14, max: 8, ticks: tick }) } }
    });
    segs('data-lp', function (v) { lpMode = v; drawLP(); });
    drawLP();
  });
})();
