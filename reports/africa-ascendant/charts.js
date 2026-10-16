/* ===========================================================================
   Charts and models — "Africa Ascendant" (hybrid dashboard)

   DATA: HYDE population 1500–1940 and UN WPP 2024 1950–2100 (Africa and
   world, annual), UN regions every five years, UN fertility 1950–2100, UN DESA
   migrant stock by destination 1990–2024, top countries, youth shares, and the
   Africa Ascendant dashboard's published worldwide-ancestry values.
   The scenario, ancestry and mixing models below are the same code the
   figures in the text were computed with in Node.js. Colours come from the
   theme's --c-* tokens; no hex values live in this file.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var DATA = {"hist":{"years":[1500,1600,1700,1710,1720,1730,1740,1750,1760,1770,1780,1790,1800,1810,1820,1830,1840,1850,1860,1870,1880,1890,1900,1910,1920,1930,1940],"africa":[58.6,68.6,78.6,78.0,78.3,78.6,78.9,79.4,79.9,80.5,81.1,81.9,81.3,82.4,84.4,91.5,100.8,112.3,117.0,122.1,128.2,135.1,138.8,144.1,150.9,169.9,193.3],"world":[503.1,516.1,595.5,618.0,648.2,670.9,702.2,753.3,788.3,828.0,900.9,942.3,983.1,1020.2,1089.5,1162.5,1219.6,1275.6,1298.0,1340.2,1414.6,1520.9,1627.3,1767.4,1895.4,2071.8,2292.0]},"un":{"years":[1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055,2056,2057,2058,2059,2060,2061,2062,2063,2064,2065,2066,2067,2068,2069,2070,2071,2072,2073,2074,2075,2076,2077,2078,2079,2080,2081,2082,2083,2084,2085,2086,2087,2088,2089,2090,2091,2092,2093,2094,2095,2096,2097,2098,2099,2100],"africa":[227.78,232.56,237.54,242.69,248.01,253.54,259.27,265.13,271.04,277.27,283.92,290.81,297.96,305.37,313.06,321.01,329.25,337.85,346.8,356.03,365.55,375.33,385.31,395.82,406.87,418.43,430.5,442.66,455.54,469.2,483.05,497.62,512.96,528.23,543.64,559.66,575.97,592.6,609.39,626.36,643.78,661.1,678.56,696.62,714.5,732.7,751.47,770.38,789.98,810.08,830.58,851.69,873.41,895.73,918.78,942.55,966.93,992.06,1018.07,1044.78,1072.22,1100.15,1128.84,1158.78,1189.22,1220.08,1251.21,1282.9,1315.41,1348.01,1380.82,1413.75,1446.88,1480.77,1515.14,1549.87,1584.99,1620.26,1655.68,1691.33,1727.21,1763.34,1799.68,1836.17,1872.85,1909.75,1946.78,1983.89,2021.07,2058.33,2095.65,2133.01,2170.36,2207.71,2245.03,2282.24,2319.34,2356.37,2393.3,2430.06,2466.65,2503.12,2539.45,2575.52,2611.38,2647.05,2682.48,2717.61,2752.44,2787.1,2821.5,2855.58,2889.31,2922.62,2955.59,2988.21,3020.43,3052.28,3083.69,3114.66,3145.22,3175.35,3205.07,3234.29,3263.03,3291.31,3319.03,3346.26,3373.02,3399.17,3424.7,3449.65,3474.07,3497.97,3521.29,3544.05,3566.32,3587.96,3608.88,3629.23,3649.05,3668.2,3686.7,3704.61,3721.93,3738.66,3754.85,3770.48,3785.52,3799.97,3813.88],"world":[2493.09,2536.93,2584.09,2634.11,2685.89,2740.21,2795.41,2852.62,2911.25,2965.95,3015.47,3064.87,3123.37,3192.81,3264.49,3334.53,3404.04,3473.41,3545.19,3619.49,3694.68,3769.85,3844.92,3920.81,3996.42,4070.74,4144.25,4217.86,4292.1,4368.54,4447.61,4528.78,4612.67,4697.33,4782.18,4868.94,4958.07,5049.75,5141.99,5234.43,5327.8,5418.74,5505.99,5591.54,5675.55,5758.88,5842.06,5924.79,6007.07,6089.01,6171.7,6254.94,6337.73,6420.36,6503.38,6586.97,6671.45,6757.31,6844.46,6932.77,7021.73,7110.92,7201.2,7291.79,7381.62,7470.49,7558.55,7645.62,7729.9,7811.29,7887.0,7954.45,8021.41,8091.73,8161.97,8231.61,8300.68,8369.09,8436.62,8503.29,8569.12,8634.12,8698.23,8761.45,8823.78,8885.21,8945.69,9005.15,9063.57,9120.93,9177.19,9232.28,9286.11,9338.66,9389.87,9439.64,9487.89,9534.55,9579.54,9622.82,9664.38,9704.19,9742.26,9778.61,9813.25,9846.24,9877.68,9907.64,9936.16,9963.34,9989.23,10013.92,10037.47,10059.95,10081.4,10101.85,10121.32,10139.81,10157.3,10173.78,10189.24,10203.68,10217.06,10229.33,10240.49,10250.5,10259.35,10267.05,10273.56,10278.89,10283.08,10286.16,10288.21,10289.25,10289.32,10288.46,10286.71,10284.11,10280.7,10276.52,10271.57,10265.86,10259.41,10252.18,10244.19,10235.4,10225.85,10215.55,10204.49,10192.69,10180.16]},"regions5":{"years":[1950,1955,1960,1965,1970,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020,2025,2030,2035,2040,2045,2050,2055,2060,2065,2070,2075,2080,2085,2090,2095,2100],"series":{"Africa":[227.78,253.54,283.92,321.01,365.55,418.43,483.05,559.66,643.78,732.7,830.58,942.55,1072.22,1220.08,1380.82,1549.87,1727.21,1909.75,2095.65,2282.24,2466.65,2647.05,2821.5,2988.21,3145.22,3291.31,3424.7,3544.05,3649.05,3738.66,3813.88],"Asia":[1368.08,1523.68,1692.35,1894.65,2137.56,2389.17,2632.33,2906.96,3209.88,3487.68,3747.78,3993.93,4239.82,4483.31,4688.11,4835.32,4969.23,5082.98,5174.59,5241.73,5280.38,5287.3,5266.84,5226.69,5172.53,5104.72,5022.37,4928.01,4826.5,4721.4,4612.67],"Europe":[548.87,575.44,605.82,634.41,657.0,677.28,694.28,708.94,724.14,729.38,728.16,732.05,738.15,744.24,749.52,744.4,738.43,730.59,722.1,713.28,703.03,690.46,676.16,661.86,648.64,636.81,626.43,617.22,608.69,600.61,592.25],"Latin America & Caribbean":[167.78,191.41,219.27,251.41,285.74,321.91,360.49,400.87,441.88,482.31,521.32,556.21,588.91,620.04,646.73,667.89,687.74,704.23,717.03,725.66,730.06,730.47,727.2,720.59,710.99,698.77,684.29,668.0,650.4,632.06,613.45],"Northern America":[168.01,182.0,198.25,215.43,229.34,242.39,254.5,267.73,281.28,297.79,312.5,328.28,345.39,362.21,377.73,387.53,397.43,406.31,414.28,421.07,426.58,431.36,436.17,441.45,447.17,452.66,457.62,462.13,466.5,470.93,474.97],"Oceania":[12.58,14.15,15.86,17.62,19.49,21.56,22.95,24.78,26.84,29.02,31.35,33.96,37.25,40.61,44.08,46.61,49.07,51.35,53.53,55.65,57.69,59.59,61.37,63.05,64.7,66.22,67.67,69.06,70.42,71.74,72.95]}},"tfr":{"years":[1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055,2056,2057,2058,2059,2060,2061,2062,2063,2064,2065,2066,2067,2068,2069,2070,2071,2072,2073,2074,2075,2076,2077,2078,2079,2080,2081,2082,2083,2084,2085,2086,2087,2088,2089,2090,2091,2092,2093,2094,2095,2096,2097,2098,2099,2100],"africa":[6.516,6.53,6.541,6.558,6.569,6.581,6.594,6.606,6.617,6.631,6.645,6.658,6.673,6.679,6.68,6.676,6.687,6.691,6.691,6.687,6.688,6.692,6.693,6.689,6.688,6.686,6.676,6.663,6.647,6.62,6.589,6.548,6.509,6.46,6.394,6.322,6.244,6.169,6.092,6.004,5.909,5.827,5.747,5.663,5.589,5.508,5.429,5.353,5.296,5.248,5.203,5.16,5.115,5.082,5.059,5.04,5.013,4.985,4.968,4.927,4.891,4.842,4.796,4.74,4.686,4.625,4.545,4.482,4.391,4.312,4.242,4.179,4.125,4.072,4.015,3.952,3.891,3.829,3.77,3.712,3.653,3.596,3.538,3.483,3.43,3.377,3.328,3.277,3.232,3.189,3.147,3.105,3.066,3.028,2.991,2.953,2.92,2.886,2.854,2.822,2.792,2.764,2.737,2.71,2.683,2.658,2.633,2.609,2.587,2.565,2.543,2.522,2.501,2.48,2.46,2.44,2.423,2.405,2.388,2.371,2.354,2.338,2.323,2.308,2.293,2.278,2.264,2.25,2.237,2.223,2.211,2.199,2.188,2.177,2.166,2.155,2.144,2.134,2.124,2.114,2.104,2.095,2.085,2.076,2.068,2.059,2.051,2.043,2.035,2.027,2.02],"world":[4.852,4.816,5.001,4.922,4.998,5.003,4.931,5.068,4.932,4.74,4.696,4.571,5.022,5.308,5.123,5.071,4.961,4.852,4.963,4.866,4.825,4.679,4.545,4.416,4.259,4.08,3.974,3.85,3.787,3.771,3.744,3.711,3.712,3.581,3.553,3.515,3.504,3.476,3.39,3.347,3.31,3.131,3.044,2.98,2.933,2.889,2.846,2.809,2.776,2.75,2.754,2.714,2.684,2.659,2.647,2.63,2.625,2.623,2.626,2.621,2.602,2.588,2.607,2.572,2.564,2.537,2.536,2.504,2.437,2.397,2.322,2.291,2.265,2.251,2.248,2.239,2.23,2.221,2.213,2.204,2.196,2.187,2.178,2.169,2.161,2.153,2.146,2.139,2.134,2.129,2.127,2.123,2.121,2.12,2.118,2.116,2.113,2.109,2.106,2.101,2.097,2.091,2.085,2.079,2.072,2.065,2.058,2.051,2.044,2.037,2.03,2.022,2.016,2.009,2.002,1.996,1.99,1.984,1.978,1.972,1.967,1.962,1.957,1.952,1.947,1.943,1.939,1.935,1.93,1.926,1.922,1.917,1.914,1.909,1.905,1.901,1.896,1.892,1.888,1.883,1.879,1.874,1.87,1.866,1.861,1.857,1.853,1.849,1.845,1.842,1.838]},"ims":{"years":[1990,1995,2000,2005,2010,2015,2020,2024],"byDest":{"World":[19677870,21240099,21162547,24080357,27829220,34659532,40006733,45750673],"Africa":[12866744,13711966,12453412,13237146,14196832,18084782,21322420,25050945],"Asia":[2168912,2357323,2533417,3058629,4350784,5922166,6220992,6699146],"Europe":[4098914,4525455,5178287,6442026,7512770,8338336,9605116,10577350],"Latin America and the Caribbean":[19964,28428,28050,30198,31216,43713,68346,61522],"Northern America":[380804,443904,747488,994100,1308565,1765286,2209597,2728055],"Oceania":[142532,173023,221893,318258,429053,505249,580262,633655]},"outside":[6811126,7528133,8709135,10843211,13632388,16574750,18684313,20699728]},"top":[["Nigeria",232.7,476.7],["DR Congo",109.3,430.7],["Ethiopia",132.1,367.3],["Tanzania",68.6,262.8],["Egypt",116.5,201.9],["Angola",37.9,150.0],["Sudan",50.4,136.9],["Uganda",50.0,120.8],["Mozambique",34.6,104.3],["Kenya",56.4,104.2],["C\u00f4te d'Ivoire",31.9,104.0],["South Africa",64.0,94.3]],"youth":{"years":[2000,2024,2050,2100],"under15":[19.0,29.4,38.8,46.9],"working":[11.5,16.3,25.5,40.6]},"median":{"years":[2000,2024,2050,2100],"africa":[17.1,19.2,24.4,35.1],"world":[25.1,30.6,36.1,42.1],"europe":[36.6,42.5,46.2,48.6]},"anchors":[[2000,0.36],[2025,0.44],[2050,0.62],[2100,1.05],[2200,1.62],[2300,2.1],[2400,2.45],[2500,2.7]]};
  var AA_WORLDWIDE = [[2000, 1190], [2024, 1950], [2100, 4860], [2500, 8300]]; // Africa Ascendant dashboard, millions

  /* --- model core (verbatim from the calibration script) ----------------------------- */

  /* ---- shared model core (verbatim in charts.js) ---- */
var GEN = 29, REPL = 2.1, TAU = 50, G_ANC = 30, L_STAY = 30;
// Extend a population from its 2099/2100 values to 2500: growth converges from the
// 2100 rate toward the stable-population rate implied by long-run fertility.
function extendPop(p2099, p2100, tfr) {
  var r0 = Math.log(p2100 / p2099), rL = Math.log(tfr / REPL) / GEN, p = p2100, out = [p2100];
  for (var t = 2101; t <= 2500; t++) { var r = rL + (r0 - rL) * Math.exp(-(t - 2100) / TAU); p *= Math.exp(r); out.push(p); }
  return out; // index 0 = 2100
}
// Annual series 1950..2500 for Africa and the rest of the world (millions).
function scenario(un, tfrA, tfrR) {
  var n = un.years.length, A = un.africa.slice(), R = un.world.map(function (w, i) { return w - un.africa[i]; });
  var ea = extendPop(A[n - 2], A[n - 1], tfrA), er = extendPop(R[n - 2], R[n - 1], tfrR);
  for (var i = 1; i < ea.length; i++) { A.push(ea[i]); R.push(er[i]); }
  var years = []; for (var y = 1950; y <= 2500; y++) years.push(y);
  return { years: years, africa: A, rest: R };
}
// People outside Africa with any recent African ancestry, 2025..2500 (millions).
// m: mixing intensity per generation (1 = random mating); s: Africa-born abroad as a share of Africa.
function ancestry(sc, m, s, a0) {
  var i0 = sc.years.indexOf(2025), a = a0, out = [a0];
  for (var i = i0 + 1; i < sc.years.length; i++) {
    var N = sc.rest[i], Np = sc.rest[i - 1];
    a *= N / Np;
    a += (m / G_ANC) * a * (1 - a / N);
    a += s * sc.africa[i] / L_STAY * (1 - a / N);
    a = Math.min(a, N); out.push(a);
  }
  return out; // index 0 = 2025
}

  /* --- mixing illustration (verbatim) ------------------------------------------------- */

  function micro(f0, m, G){
  const N=256; let d=new Float64Array(N+1); d[N]=f0; d[0]=1-f0;
  const out=[];
  const stats=()=>{ let p=0,q=0,h=0,e=0; for(let k=0;k<=N;k++){ if(k>0)p+=d[k]; q+=d[k]*k/N; if(k>=N/4)h+=d[k]; if(k>=N/16) e+=d[k]; } return {prev:p,mean:q,quarter:h,sixteenth:e}; };
  out.push(stats());
  for(let g=0;g<G;g++){
    const nd=new Float64Array(N+1);
    const nz=[]; for(let k=0;k<=N;k++) if(d[k]>1e-12) nz.push(k);
    for(const i of nz) for(const j of nz){ const w=m*d[i]*d[j], h=(i+j)/2, lo=Math.floor(h); if(lo===h) nd[lo]+=w; else { nd[lo]+=w/2; nd[lo+1]+=w/2; } }
    for(let k=0;k<=N;k++) nd[k]+=(1-m)*d[k];
    d=nd; out.push(stats());
  }
  return out;
}

  /* --- helpers ----------------------------------------------------------------------- */

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function bn(m) { return (m / 1000).toFixed(2) + ' bn'; }
  function pc(x) { return Math.round(x) + '%'; }

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, labels = HH.valueLabels;
    var AF = tok('--c-africa'), AFD = tok('--c-africa-dark'), REST = tok('--c-rest'), DIA = tok('--c-diaspora'), MIX = tok('--c-mixed'), MUT = tok('--c-muted'), INK = tok('--text');
    var tick = { color: tok('--text-muted'), font: { size: 10.5 } };
    var linX = function (title, min, max, step) { return Object.assign(axis({ grid: false, title: title }), { type: 'linear', min: min, max: max, ticks: Object.assign({ stepSize: step, callback: function (v) { return v; } }, tick) }); };

    var tfrA = 2.136, tfrR = 2.098, sc = scenario(DATA.un, tfrA, tfrR);
    function iy(y) { return sc.years.indexOf(y); }

    /* --- 1. the arc --------------------------------------------------------------------- */

    function arcData() {
      var h = DATA.hist.years.map(function (y, i) { return { x: y, y: 100 * DATA.hist.africa[i] / DATA.hist.world[i] }; });
      var u = DATA.un.years.map(function (y, i) { return { x: y, y: 100 * DATA.un.africa[i] / DATA.un.world[i] }; });
      var s = []; for (var y = 2100; y <= 2500; y += 5) { var i = iy(y); s.push({ x: y, y: 100 * sc.africa[i] / (sc.africa[i] + sc.rest[i]) }); }
      return [h, u, s];
    }
    var eras = {
      id: 'eras',
      beforeDatasetsDraw: function (c) {
        var x = c.scales.x, a = c.chartArea, ctx = c.ctx;
        [[1500, 1950, 'Reconstruction (HYDE)', alpha(MUT, 0.12)], [1950, 2100, 'UN WPP 2024', alpha(AF, 0.1)], [2100, 2500, 'Scenario', alpha(REST, 0.08)]].forEach(function (e) {
          var x0 = x.getPixelForValue(e[0]), x1 = x.getPixelForValue(e[1]);
          ctx.save(); ctx.fillStyle = e[3]; ctx.fillRect(x0, a.top, x1 - x0, a.bottom - a.top);
          ctx.fillStyle = tok('--text-muted'); ctx.font = '600 10.5px ' + tok('--mono'); ctx.textBaseline = 'top'; ctx.fillText(e[2], x0 + 6, a.top + 6); ctx.restore();
        });
        var y50 = c.scales.y.getPixelForValue(50);
        ctx.save(); ctx.strokeStyle = INK; ctx.globalAlpha = 0.35; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(a.left, y50); ctx.lineTo(a.right, y50); ctx.stroke(); ctx.restore();
      },
    };
    var ad = arcData();
    var arcChart = HH.chart('chart-arc', {
      type: 'line',
      data: { datasets: [
        { label: 'Historical reconstruction', data: ad[0], borderColor: MUT, backgroundColor: MUT, borderWidth: 2.4, pointRadius: 0, tension: 0.25 },
        { label: 'UN WPP 2024', data: ad[1], borderColor: AF, backgroundColor: AF, borderWidth: 3, pointRadius: 0, tension: 0.2 },
        { label: 'Scenario', data: ad[2], borderColor: AFD, backgroundColor: AFD, borderDash: [6, 4], borderWidth: 2.4, pointRadius: 0, tension: 0.2 },
      ] },
      options: {
        animation: false,
        interaction: { mode: 'nearest', intersect: false, axis: 'x' },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 14, boxHeight: 3, font: { size: 11 } } }, tooltip: { callbacks: { title: function (c) { return String(c[0].parsed.x); }, label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1) + '% of humanity'; } } } },
        scales: { x: linX(null, 1500, 2500, 100), y: Object.assign(axis({ title: 'Per cent of world population' }), { min: 0, max: 60, ticks: tick }) },
      },
      plugins: [eras],
    });

    /* --- 2. the UN century ------------------------------------------------------------------- */

    var R5 = DATA.regions5, regColors = { 'Africa': AF, 'Asia': REST, 'Europe': tok('--chart-blue-light'), 'Latin America & Caribbean': DIA, 'Northern America': tok('--chart-purple'), 'Oceania': MUT };
    HH.chart('chart-regions', {
      type: 'line',
      data: { labels: R5.years, datasets: Object.keys(R5.series).map(function (k) { return { label: k, data: R5.series[k].map(function (v) { return v / 1000; }), borderColor: regColors[k], backgroundColor: regColors[k], borderWidth: k === 'Africa' ? 3.2 : 1.8, pointRadius: 0, tension: 0.25 }; }) },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, boxHeight: 3, font: { size: 10.5 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(2) + ' bn'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return R5.years[i] % 25 === 0 ? R5.years[i] : ''; } }, tick) }), y: Object.assign(axis({ title: 'Billions' }), { min: 0, ticks: tick }) },
      },
    });

    var TF = DATA.tfr;
    HH.chart('chart-tfr', {
      type: 'line',
      data: { labels: TF.years, datasets: [
        { label: 'Africa', data: TF.africa, borderColor: AF, backgroundColor: AF, borderWidth: 3, pointRadius: 0, tension: 0.2 },
        { label: 'World', data: TF.world, borderColor: REST, backgroundColor: REST, borderWidth: 2, pointRadius: 0, tension: 0.2 },
      ] },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, boxHeight: 3, font: { size: 11 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(2) + ' children per woman'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxRotation: 0, autoSkip: false, callback: function (v, i) { return TF.years[i] % 25 === 0 ? TF.years[i] : ''; } }, tick) }), y: Object.assign(axis({ title: 'Children per woman' }), { min: 0, max: 7, ticks: tick }) },
      },
      plugins: [{ id: 'repl', beforeDatasetsDraw: function (c) { var y = c.scales.y.getPixelForValue(2.1), a = c.chartArea, ctx = c.ctx; ctx.save(); ctx.strokeStyle = INK; ctx.globalAlpha = 0.4; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke(); ctx.restore(); } }],
    });

    var YO = DATA.youth;
    HH.chart('chart-youth', {
      type: 'bar',
      data: { labels: YO.years.map(String), datasets: [
        { label: 'Children under 15', data: YO.under15, backgroundColor: AF, barPercentage: 0.8 },
        { label: 'Working age, 15–64', data: YO.working, backgroundColor: REST, barPercentage: 0.8 },
      ] },
      options: {
        layout: { padding: { top: 16 } },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1) + '% of world total'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { ticks: tick }), y: Object.assign(axis({ title: 'Africa, per cent of world' }), { min: 0, max: 55, ticks: tick }) },
      },
      plugins: [labels({ format: function (v) { return Math.round(v) + '%'; } })],
    });

    var TOP = DATA.top;
    HH.chart('chart-top', {
      type: 'bar',
      data: { labels: TOP.map(function (t) { return t[0]; }), datasets: [
        { label: '2024', data: TOP.map(function (t) { return t[1]; }), backgroundColor: alpha(AF, 0.4), barPercentage: 0.9, categoryPercentage: 0.8 },
        { label: '2100', data: TOP.map(function (t) { return t[2]; }), backgroundColor: AF, barPercentage: 0.9, categoryPercentage: 0.8 },
      ] },
      options: {
        indexAxis: 'y',
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + Math.round(c.parsed.x) + ' m'; } } } },
        scales: { x: Object.assign(axis({ title: 'Millions' }), { min: 0, ticks: tick }), y: Object.assign(axis({ grid: false }), { ticks: { color: INK, font: { size: 10.5 } } }) },
      },
    });

    /* --- 3. beyond 2100 -------------------------------------------------------------------- */

    function popPoints(series, from, to) { var out = []; for (var y = from; y <= to; y++) out.push({ x: y, y: series[iy(y)] / 1000 }); return out; }
    var scChart = HH.chart('chart-scenario', {
      type: 'line',
      data: { datasets: [] },
      options: {
        animation: false,
        interaction: { mode: 'nearest', intersect: false, axis: 'x' },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 14, boxHeight: 3, font: { size: 11 }, filter: function (it) { return !/scenario$/.test(it.text); } } }, tooltip: { callbacks: { title: function (c) { return String(c[0].parsed.x); }, label: function (c) { return c.dataset.label.replace(' scenario', '') + ': ' + c.parsed.y.toFixed(2) + ' bn'; } } } },
        scales: { x: linX(null, 1950, 2500, 50), y: Object.assign(axis({ title: 'Billions' }), { min: 0, ticks: tick }) },
      },
      plugins: [{ id: 'yr2100', beforeDatasetsDraw: function (c) { var x = c.scales.x.getPixelForValue(2100), a = c.chartArea, ctx = c.ctx; ctx.save(); ctx.strokeStyle = INK; ctx.globalAlpha = 0.3; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(x, a.top); ctx.lineTo(x, a.bottom); ctx.stroke(); ctx.globalAlpha = 0.8; ctx.fillStyle = tok('--text-muted'); ctx.font = '600 10.5px ' + tok('--mono'); ctx.fillText('UN projections end', x + 6, a.top + 12); ctx.restore(); } }],
    });
    function drawScenario() {
      if (scChart) {
        scChart.data.datasets = [
          { label: 'Africa', data: popPoints(sc.africa, 1950, 2100), borderColor: AF, backgroundColor: AF, borderWidth: 3, pointRadius: 0 },
          { label: 'Rest of world', data: popPoints(sc.rest, 1950, 2100), borderColor: REST, backgroundColor: REST, borderWidth: 2.4, pointRadius: 0 },
          { label: 'Africa scenario', data: popPoints(sc.africa, 2100, 2500), borderColor: AF, backgroundColor: AF, borderWidth: 3, borderDash: [7, 5], pointRadius: 0 },
          { label: 'Rest of world scenario', data: popPoints(sc.rest, 2100, 2500), borderColor: REST, backgroundColor: REST, borderWidth: 2.4, borderDash: [7, 5], pointRadius: 0 },
        ];
        scChart.update();
      }
      var a25 = sc.africa[iy(2500)], w25 = a25 + sc.rest[iy(2500)];
      setText('t-a2300', bn(sc.africa[iy(2300)]));
      setText('t-a2500', bn(a25));
      setText('t-a2500-l', 'Africa in 2500 · ' + pc(100 * a25 / w25) + ' of humanity');
      setText('t-w2500', bn(w25));
      var half = null; for (var y = 2100; y <= 2500; y++) { var i = iy(y); if (sc.africa[i] >= sc.rest[i]) { half = y; break; } }
      setText('t-half', half ? String(half) : 'not by 2500');
      setText('o-tfra', tfrA.toFixed(3));
      setText('o-tfrr', tfrR.toFixed(3));
    }

    /* --- 4. diaspora ---------------------------------------------------------------------- */

    var IM = DATA.ims, dests = [['Europe', DIA], ['Asia', REST], ['Northern America', tok('--chart-purple')], ['Oceania', MUT], ['Latin America and the Caribbean', AF]];
    HH.chart('chart-ims', {
      type: 'bar',
      data: { labels: IM.years.map(String), datasets: dests.map(function (d) { return { label: d[0], data: IM.byDest[d[0]].map(function (v) { return v / 1e6; }), backgroundColor: d[1], stack: 's', barPercentage: 0.75 }; }) },
      options: {
        layout: { padding: { top: 16 } },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 10, font: { size: 10.5 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1) + ' m'; }, footer: function (c) { return 'Total outside Africa: ' + (IM.outside[c[0].dataIndex] / 1e6).toFixed(1) + ' m'; } } } },
        scales: { x: Object.assign(axis({ grid: false }), { stacked: true, ticks: tick }), y: Object.assign(axis({ title: 'Millions' }), { stacked: true, min: 0, ticks: tick }) },
      },
      plugins: [labels({ only: [], format: function () { return ''; } }), { id: 'totals', afterDatasetsDraw: function (c) { var ctx = c.ctx, meta = c.getDatasetMeta(c.data.datasets.length - 1); ctx.save(); ctx.fillStyle = INK; ctx.font = '600 10.5px ' + tok('--mono'); ctx.textAlign = 'center'; meta.data.forEach(function (b, i) { var top = c.scales.y.getPixelForValue(IM.outside[i] / 1e6); ctx.fillText((IM.outside[i] / 1e6).toFixed(1), b.x, top - 5); }); ctx.restore(); } }],
    });

    var envChart = HH.chart('chart-envelope', {
      type: 'line',
      data: { datasets: [] },
      options: {
        animation: false,
        interaction: { mode: 'nearest', intersect: false, axis: 'x' },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 14, boxHeight: 3, font: { size: 11 } } }, tooltip: { callbacks: { title: function (c) { return String(c[0].parsed.x); }, label: function (c) { return c.dataset.label + ': ' + Math.round(c.parsed.y) + ' m'; } } } },
        scales: { x: linX(null, 2024, 2500, 50), y: Object.assign(axis({ title: 'Millions' }), { min: 0, ticks: tick }) },
      },
    });
    function drawEnvelope() {
      if (!envChart) return;
      var mk = function (s) { var o = []; for (var y = 2024; y <= 2500; y += 2) o.push({ x: y, y: s * sc.africa[iy(y)] }); return o; };
      envChart.data.datasets = [
        { label: '3%', data: mk(0.03), borderColor: alpha(DIA, 0.45), backgroundColor: alpha(DIA, 0.08), borderWidth: 1.6, pointRadius: 0, fill: '+2' },
        { label: '2%', data: mk(0.02), borderColor: alpha(DIA, 0.7), backgroundColor: alpha(DIA, 0.7), borderWidth: 1.6, pointRadius: 0, borderDash: [4, 3] },
        { label: '1.47% (about today)', data: mk(0.0147), borderColor: DIA, backgroundColor: DIA, borderWidth: 2.6, pointRadius: 0 },
      ];
      envChart.update();
    }

    /* --- 5. prevalence vs proportion -------------------------------------------------------- */

    var microChart = HH.chart('chart-micro', {
      type: 'line',
      data: { labels: Array.from({ length: 16 }, function (_, i) { return i; }), datasets: [] },
      options: {
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 14, boxHeight: 3, font: { size: 11 } } }, tooltip: { callbacks: { title: function (c) { return 'Generation ' + c[0].label + ' (≈ ' + c[0].label * 30 + ' years)'; }, label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1) + '%'; } } } },
        scales: { x: Object.assign(axis({ grid: false, title: 'Generations' }), { ticks: tick }), y: Object.assign(axis({ title: 'Per cent of population' }), { min: 0, max: 100, ticks: tick }) },
      },
    });
    function drawMicro() {
      var m = parseFloat(document.getElementById('s-mix').value), f0 = parseFloat(document.getElementById('s-f0').value);
      setText('o-mix', m.toFixed(2)); setText('o-f0', Math.round(f0 * 100) + '%');
      var o = micro(f0, m, 15);
      if (microChart) {
        microChart.data.datasets = [
          { label: 'Any ancestry from the group (prevalence)', data: o.map(function (s) { return 100 * s.prev; }), borderColor: MIX, backgroundColor: alpha(MIX, 0.12), fill: true, borderWidth: 3, pointRadius: 2.5 },
          { label: 'A quarter or more', data: o.map(function (s) { return 100 * s.quarter; }), borderColor: AF, backgroundColor: AF, borderWidth: 2, pointRadius: 0, borderDash: [5, 3] },
          { label: 'Average ancestry share (proportion)', data: o.map(function (s) { return 100 * s.mean; }), borderColor: REST, backgroundColor: REST, borderWidth: 2.4, pointRadius: 0 },
        ];
        microChart.update();
      }
      setText('micro-note', 'After 10 generations: ' + Math.round(100 * o[10].prev) + '% have some of the group\'s ancestry; after 15: ' + Math.round(100 * o[15].prev) + '%. Average share throughout: ' + (100 * o[15].mean).toFixed(1) + '%. A quarter or more after 15 generations: ' + Math.round(100 * o[15].quarter) + '%.');
    }
    ['s-mix', 's-f0'].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener('input', drawMicro); });

    /* --- 6. worldwide ---------------------------------------------------------------------- */

    var mix = 0.2, base = 440, mob = 0.0147;
    var wwChart = HH.chart('chart-worldwide', {
      type: 'line',
      data: { datasets: [] },
      options: {
        animation: false,
        layout: { padding: { right: 12, top: 6 } },
        interaction: { mode: 'nearest', intersect: false, axis: 'x' },
        plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 11 } } }, tooltip: { callbacks: { title: function (c) { return String(c[0].parsed.x); }, label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(2) + ' bn'; } } } },
        scales: { x: linX(null, 2025, 2500, 50), y: Object.assign(axis({ title: 'Billions' }), { min: 0, ticks: tick }) },
      },
    });
    function worldwide(m) { var a = ancestry(sc, m, mob, base); return function (y) { return { abroad: a[y - 2025], africa: sc.africa[iy(y)], total: sc.africa[iy(y)] + sc.rest[iy(y)] }; }; }
    function drawWorldwide() {
      var f = worldwide(mix);
      if (wwChart) {
        var af = [], ww = [], world = [];
        for (var y = 2025; y <= 2500; y += 5) { var v = f(y); af.push({ x: y, y: v.africa / 1000 }); ww.push({ x: y, y: (v.africa + v.abroad) / 1000 }); world.push({ x: y, y: v.total / 1000 }); }
        wwChart.data.datasets = [
          { label: 'In Africa', data: af, borderColor: AF, backgroundColor: alpha(AF, 0.55), fill: 'origin', borderWidth: 2, pointRadius: 0 },
          { label: 'Plus outside Africa with any African ancestry', data: ww, borderColor: MIX, backgroundColor: alpha(MIX, 0.35), fill: '-1', borderWidth: 2.4, pointRadius: 0 },
          { label: 'World population', data: world, borderColor: REST, backgroundColor: REST, borderDash: [5, 4], borderWidth: 1.8, pointRadius: 0, fill: false },
          { type: 'scatter', label: 'Africa Ascendant dashboard', data: AA_WORLDWIDE.filter(function (p) { return p[0] >= 2025; }).map(function (p) { return { x: p[0], y: p[1] / 1000 }; }), backgroundColor: INK, borderColor: '#fff', borderWidth: 2, pointRadius: 6, pointStyle: 'rectRot' },
        ];
        wwChart.update();
      }
      var v21 = f(2100), v25 = f(2500);
      setText('t-ab2100', bn(v21.abroad));
      setText('t-ww2100', bn(v21.africa + v21.abroad)); setText('t-ww2100-l', 'Worldwide, 2100 · ' + pc(100 * (v21.africa + v21.abroad) / v21.total) + ' of humanity');
      setText('t-ww2500', bn(v25.africa + v25.abroad)); setText('t-ww2500-l', 'Worldwide, 2500 · ' + pc(100 * (v25.africa + v25.abroad) / v25.total) + ' of humanity');
      var lo = worldwide(0.1)(2100), hi = worldwide(0.6)(2100);
      setText('t-env', pc(100 * (lo.africa + lo.abroad) / lo.total) + '–' + pc(100 * (hi.africa + hi.abroad) / hi.total));
      setText('o-m', mix.toFixed(2));
    }
    var sm = document.getElementById('s-m'); if (sm) sm.addEventListener('input', function () { mix = parseFloat(sm.value); drawWorldwide(); });
    function segGroup(attr, fn) {
      var bs = document.querySelectorAll('[data-' + attr + ']');
      Array.prototype.forEach.call(bs, function (b) { b.addEventListener('click', function () { Array.prototype.forEach.call(bs, function (x) { x.classList.toggle('is-on', x === b); }); fn(b.getAttribute('data-' + attr)); }); });
    }
    segGroup('base', function (v) { base = parseFloat(v); drawWorldwide(); });
    segGroup('mob', function (v) { mob = parseFloat(v); drawWorldwide(); });

    /* --- scenario controls drive sections 1, 3, 4 and 6 --------------------------------------- */

    function redrawAll() {
      sc = scenario(DATA.un, tfrA, tfrR);
      drawScenario(); drawEnvelope(); drawWorldwide();
      if (arcChart) { var d = arcData(); arcChart.data.datasets[2].data = d[2]; arcChart.update(); }
    }
    var sa = document.getElementById('s-tfra'), sr = document.getElementById('s-tfrr');
    function fromSliders() { tfrA = parseFloat(sa.value); tfrR = parseFloat(sr.value); Array.prototype.forEach.call(document.querySelectorAll('[data-preset]'), function (x) { x.classList.remove('is-on'); }); redrawAll(); }
    if (sa) sa.addEventListener('input', fromSliders);
    if (sr) sr.addEventListener('input', fromSliders);
    var PRESETS = { aa: [2.136, 2.098], repl: [2.1, 2.1], low: [2.02, 1.84] };
    segGroup('preset', function (k) { tfrA = PRESETS[k][0]; tfrR = PRESETS[k][1]; if (sa) sa.value = tfrA; if (sr) sr.value = tfrR; redrawAll(); });

    redrawAll();
    drawMicro();
  });
})();
