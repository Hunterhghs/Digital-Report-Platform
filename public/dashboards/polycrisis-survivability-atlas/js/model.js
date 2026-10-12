// Polycrisis projection model.
// Each dimension evolves from its 2025 baseline under a scenario's warming path
// and socio-economic narrative (Shared Socioeconomic Pathways, IPCC AR6).
(function () {
  const BASE_YEAR = 2025, END_YEAR = 2100;
  const T_NOW = 1.35; // °C above 1850–1900, c. 2025

  const DIMS = [
    { key: "clim", label: "Climate hazard", short: "Climate" },
    { key: "poll", label: "Pollution", short: "Pollution" },
    { key: "conf", label: "Conflict & violence", short: "Conflict" },
    { key: "ineq", label: "Inequality & poverty", short: "Inequality" },
    { key: "food", label: "Food & water insecurity", short: "Food/water" },
    { key: "gov", label: "Adaptive-capacity deficit", short: "Capacity gap" },
  ];

  // Median warming (AR6 WGI SPM, best estimates) and narrative multipliers applied by 2100.
  //   gov  – adaptive-capacity deficit multiplier (development & institutions)
  //   poll – pollution multiplier (air-quality policy & energy transition)
  //   ineq – inequality multiplier (within/between-country convergence)
  //   pollGov – extra pollution growth where capacity is weak (rapid, unregulated growth)
  const SCENARIOS = [
    { id: "ssp126", label: "SSP1-2.6", name: "Sustainability", blurb: "Rapid decarbonisation, inclusive development, strong cooperation.",
      T: [[2025, 1.35], [2040, 1.6], [2060, 1.75], [2080, 1.75], [2100, 1.8]], gov: 0.5, poll: 0.4, ineq: 0.7, pollGov: 0 },
    { id: "ssp245", label: "SSP2-4.5", name: "Middle of the road", blurb: "Historical trends continue; uneven progress, moderate emissions cuts.",
      T: [[2025, 1.35], [2040, 1.7], [2060, 2.1], [2080, 2.45], [2100, 2.7]], gov: 0.78, poll: 0.7, ineq: 0.9, pollGov: 0.1 },
    { id: "ssp370", label: "SSP3-7.0", name: "Regional rivalry", blurb: "Fragmentation, nationalism, slow development and high emissions.",
      T: [[2025, 1.35], [2040, 1.75], [2060, 2.35], [2080, 3.0], [2100, 3.6]], gov: 1.05, poll: 1.0, ineq: 1.15, pollGov: 0.2 },
    { id: "ssp585", label: "SSP5-8.5", name: "Fossil-fuelled growth", blurb: "Fast growth on fossil energy; high capacity, very high warming.",
      T: [[2025, 1.35], [2040, 1.85], [2060, 2.6], [2080, 3.5], [2100, 4.4]], gov: 0.6, poll: 0.6, ineq: 0.85, pollGov: 0 },
  ];

  const TIERS = [
    { min: 0, label: "Low" },
    { min: 20, label: "Moderate" },
    { min: 35, label: "Elevated" },
    { min: 50, label: "High" },
    { min: 65, label: "Severe" },
    { min: 80, label: "Critical" },
  ];

  const clamp = (v) => Math.max(0, Math.min(100, v));

  function warming(scen, year) {
    const T = scen.T;
    if (year <= T[0][0]) return T[0][1];
    for (let i = 1; i < T.length; i++) {
      if (year <= T[i][0]) {
        const [y0, t0] = T[i - 1], [y1, t1] = T[i];
        return t0 + (t1 - t0) * (year - y0) / (y1 - y0);
      }
    }
    return T[T.length - 1][1];
  }

  // Saturating response: moves a baseline toward 100 as forcing increases.
  const saturate = (base, k) => base + (100 - base) * (1 - Math.exp(-k));

  function project(c, scen, year) {
    const frac = Math.max(0, Math.min(1, (year - BASE_YEAR) / (END_YEAR - BASE_YEAR)));
    const dT = Math.max(0, warming(scen, year) - T_NOW);
    const h = c.h;

    // Adaptive-capacity deficit follows the scenario's development narrative.
    const gov = clamp(c.gov * Math.pow(scen.gov, frac));
    const capFactor = 0.4 + 0.6 * gov / 100; // weak capacity transmits more of the shock

    const clim = clamp(saturate(c.clim, 0.25 * h * dT));

    const pm = scen.poll * (1 + scen.pollGov * (c.gov - 50) / 50);
    const poll = clamp(c.poll * Math.pow(Math.max(0.2, pm), frac) + 2.5 * dT * h);

    const ineq = clamp(c.ineq * Math.pow(scen.ineq, frac) + 2.5 * h * dT * capFactor);

    const foodBase = c.food * (1 - 0.35 * (1 - gov / Math.max(1, c.gov)));
    const food = clamp(foodBase + (100 - foodBase) * (1 - Math.exp(-0.18 * h * dT)) * capFactor);

    // Conflict relaxes from today's level toward a structural level set by the other stressors.
    const structural = 0.35 * gov + 0.2 * ineq + 0.25 * food + 0.2 * clim;
    const w = Math.exp(-1.5 * frac);
    const conf = clamp(c.conf * w + structural * (1 - w));

    return { clim, poll, conf, ineq, food, gov };
  }

  function composite(dims, weights, amplify) {
    let s = 0, ws = 0, n = 0;
    for (const d of DIMS) {
      const w = weights[d.key];
      s += w * dims[d.key];
      ws += w;
      if (w > 0 && dims[d.key] >= 60) n++;
    }
    if (ws === 0) return 0;
    const mean = s / ws;
    const active = DIMS.filter((d) => weights[d.key] > 0).length || 1;
    // Polycrisis amplification: co-occurring high stresses compound (up to +15%).
    return clamp(amplify ? mean * (1 + 0.15 * n / active) : mean);
  }

  function population(c, year) {
    const frac = Math.max(0, Math.min(1, (year - BASE_YEAR) / (END_YEAR - BASE_YEAR)));
    return c.pop25 + (c.pop100 - c.pop25) * frac;
  }

  function tierOf(v) {
    let t = TIERS[0];
    for (const x of TIERS) if (v >= x.min) t = x;
    return t;
  }

  window.Model = { BASE_YEAR, END_YEAR, DIMS, SCENARIOS, TIERS, warming, project, composite, population, tierOf };
})();
