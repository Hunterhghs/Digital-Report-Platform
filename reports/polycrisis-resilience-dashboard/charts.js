/* ===========================================================================
   Charts — "Polycrisis Resilience in the Twenty-First Century" (dashboard)

   Data embedded below are taken directly from the published sources named in
   each panel. ND_GAIN rows are the ND-GAIN 2026 release (2024 values, plus the
   2015 score for change), joined to World Bank region and income groups:
   [iso3, name, vulnerability, readiness, gain2024, gain2015, income, region].
   Colour roles: coral = pressure, teal = capacity, amber = buffers; the four
   income groups keep fixed colours everywhere they appear.
   =========================================================================== */

(function () {
  'use strict';

  // report.js defines HH and loads first; bail out rather than throw if it did not.
  if (!window.HH) return;

  var ND_GAIN = {"regions":["East Asia & Pacific","Europe & Central Asia","Latin America & Caribbean","Middle East, North Africa, Afghanistan & Pakistan","North America","South Asia","Sub-Saharan Africa"],"rows":[["AFG","Afghanistan",0.612,0.272,33.0,31.3,"L",3],["ALB","Albania",0.416,0.468,52.6,48.2,"UM",1],["DZA","Algeria",0.43,0.378,47.4,42.7,"UM",3],["AND","Andorra",0.351,0.611,63.0,58.4,"H",1],["AGO","Angola",0.528,0.257,36.4,34.2,"LM",6],["ATG","Antigua and Barbuda",0.485,0.441,47.8,49.1,"H",2],["ARG","Argentina",0.408,0.415,50.4,46.7,"UM",2],["ARM","Armenia",0.394,0.457,53.2,54.3,"UM",1],["AUS","Australia",0.3,0.658,67.9,69.3,"H",0],["AUT","Austria",0.323,0.679,67.8,68.9,"H",1],["AZE","Azerbaijan",0.428,0.43,50.1,49.8,"UM",1],["BHS","Bahamas, The",0.447,0.422,48.7,50.1,"H",2],["BHR","Bahrain",0.499,0.466,48.3,48.9,"H",3],["BGD","Bangladesh",0.544,0.284,37.0,34.7,"LM",5],["BRB","Barbados",0.397,0.569,58.6,54.1,"H",2],["BLR","Belarus",0.355,0.434,54.0,54.4,"UM",1],["BEL","Belgium",0.366,0.605,62.0,61.4,"H",1],["BLZ","Belize",0.483,0.366,44.2,42.5,"UM",2],["BEN","Benin",0.584,0.372,39.4,36.2,"LM",6],["BTN","Bhutan",0.528,0.414,44.3,45.2,"LM",5],["BOL","Bolivia",0.453,0.312,42.9,40.9,"LM",2],["BIH","Bosnia and Herzegovina",0.38,0.38,50.0,49.3,"UM",1],["BWA","Botswana",0.484,0.384,45.0,46.5,"UM",6],["BRA","Brazil",0.366,0.381,50.7,49.1,"UM",2],["BRN","Brunei Darussalam",0.424,0.417,49.6,54.1,"H",0],["BGR","Bulgaria",0.361,0.486,56.3,54.8,"H",1],["BFA","Burkina Faso",0.523,0.27,37.4,37.6,"L",6],["BDI","Burundi",0.61,0.25,32.0,32.3,"L",6],["CPV","Cabo Verde",0.478,0.381,45.1,48.9,"UM",6],["KHM","Cambodia",0.472,0.321,42.4,38.4,"LM",0],["CMR","Cameroon",0.478,0.276,39.9,39.0,"LM",6],["CAN","Canada",0.282,0.643,68.0,68.8,"H",4],["CAF","Central African Republic",0.588,0.137,27.4,26.9,"L",6],["TCD","Chad",0.638,0.166,26.4,26.5,"L",6],["CHL","Chile",0.347,0.548,60.1,59.6,"H",2],["CHN","China",0.394,0.455,53.0,52.6,"UM",0],["COL","Colombia",0.407,0.416,50.5,47.9,"UM",2],["COM","Comoros",0.49,0.259,38.5,39.9,"LM",6],["COD","Congo, Dem. Rep.",0.571,0.178,30.4,30.0,"L",6],["COG","Congo, Rep.",0.549,0.224,33.7,33.8,"LM",6],["CRI","Costa Rica",0.387,0.477,54.5,53.5,"H",2],["CIV","Cote d'Ivoire",0.488,0.307,41.0,39.3,"LM",6],["HRV","Croatia",0.399,0.542,57.1,54.9,"H",1],["CUB","Cuba",0.457,0.326,43.4,43.7,"UM",2],["CYP","Cyprus",0.355,0.504,57.5,57.9,"H",1],["CZE","Czechia",0.305,0.607,65.1,63.6,"H",1],["DNK","Denmark",0.342,0.707,68.3,73.0,"H",1],["DJI","Djibouti",0.598,0.327,36.4,34.9,"LM",3],["DMA","Dominica",0.442,0.612,58.5,55.9,"UM",2],["DOM","Dominican Republic",0.47,0.405,46.7,44.3,"UM",2],["ECU","Ecuador",0.476,0.348,43.6,41.9,"UM",2],["EGY","Egypt, Arab Rep.",0.469,0.377,45.4,42.3,"LM",3],["SLV","El Salvador",0.452,0.328,43.8,44.9,"UM",2],["GNQ","Equatorial Guinea",0.45,0.161,35.6,39.1,"UM",6],["ERI","Eritrea",0.629,0.176,27.4,27.7,"L",6],["EST","Estonia",0.361,0.609,62.4,63.9,"H",1],["SWZ","Eswatini",0.482,0.301,40.9,40.0,"LM",6],["ETH","Ethiopia",0.508,0.262,37.7,37.3,"L",6],["FJI","Fiji",0.489,0.438,47.5,48.7,"UM",0],["FIN","Finland",0.306,0.727,71.1,72.9,"H",1],["FRA","France",0.321,0.639,65.9,66.7,"H",1],["GAB","Gabon",0.45,0.302,42.6,42.6,"UM",6],["GMB","Gambia, The",0.551,0.273,36.1,36.7,"L",6],["GEO","Georgia",0.413,0.519,55.3,56.5,"UM",1],["DEU","Germany",0.296,0.68,69.2,70.3,"H",1],["GHA","Ghana",0.455,0.357,45.1,42.5,"LM",6],["GRC","Greece",0.356,0.564,60.4,57.7,"H",1],["GRD","Grenada",0.425,0.528,55.2,54.8,"UM",2],["GTM","Guatemala",0.455,0.328,43.6,41.9,"UM",2],["GIN","Guinea",0.474,0.288,40.7,40.1,"LM",6],["GNB","Guinea-Bissau",0.622,0.276,32.7,30.9,"L",6],["GUY","Guyana",0.467,0.385,45.9,40.3,"H",2],["HTI","Haiti",0.534,0.2,33.3,34.0,"LM",2],["HND","Honduras",0.471,0.298,41.3,40.0,"LM",2],["HUN","Hungary",0.38,0.529,57.4,56.6,"H",1],["ISL","Iceland",0.315,0.609,64.7,70.9,"H",1],["IND","India",0.475,0.362,44.4,39.4,"LM",5],["IDN","Indonesia",0.431,0.398,48.3,45.3,"UM",0],["IRN","Iran, Islamic Rep.",0.429,0.379,47.5,49.5,"UM",3],["IRQ","Iraq",0.497,0.21,35.6,38.6,"UM",3],["IRL","Ireland",0.317,0.605,64.4,65.5,"H",1],["ISR","Israel",0.344,0.54,59.8,59.0,"H",3],["ITA","Italy",0.357,0.601,62.2,57.9,"H",1],["JAM","Jamaica",0.451,0.402,47.5,46.5,"UM",2],["JPN","Japan",0.353,0.667,65.7,67.4,"H",0],["JOR","Jordan",0.429,0.427,49.9,49.2,"UM",3],["KAZ","Kazakhstan",0.355,0.484,56.4,55.8,"UM",1],["KEN","Kenya",0.482,0.268,39.3,38.2,"LM",6],["KIR","Kiribati",0.528,0.373,42.3,40.3,"LM",0],["PRK","Korea, Dem. People's Rep.",0.513,0.38,43.3,41.6,"L",0],["KOR","Korea, Rep.",0.356,0.722,68.3,68.4,"H",0],["KWT","Kuwait",0.435,0.418,49.2,48.3,"H",3],["KGZ","Kyrgyz Republic",0.344,0.372,51.4,49.0,"LM",1],["LAO","Lao PDR",0.452,0.299,42.4,40.2,"LM",0],["LVA","Latvia",0.387,0.589,60.1,59.8,"H",1],["LBN","Lebanon",0.455,0.33,43.7,43.2,"LM",3],["LSO","Lesotho",0.507,0.274,38.4,40.4,"LM",6],["LBR","Liberia",0.582,0.296,35.7,35.0,"L",6],["LBY","Libya",0.49,0.29,40.0,36.3,"UM",3],["LTU","Lithuania",0.374,0.579,60.2,60.7,"H",1],["LUX","Luxembourg",0.341,0.661,66.0,68.5,"H",1],["MDG","Madagascar",0.55,0.25,35.0,35.4,"L",6],["MWI","Malawi",0.567,0.281,35.7,34.3,"L",6],["MYS","Malaysia",0.365,0.465,55.0,56.8,"UM",0],["MDV","Maldives",0.534,0.405,43.6,43.6,"UM",5],["MLI","Mali",0.585,0.266,34.1,34.5,"L",6],["MLT","Malta",0.351,0.487,56.8,57.8,"H",3],["MHL","Marshall Islands",0.499,0.42,46.1,45.2,"UM",0],["MRT","Mauritania",0.655,0.293,31.9,34.0,"LM",6],["MUS","Mauritius",0.455,0.478,51.2,53.8,"UM",6],["MEX","Mexico",0.412,0.364,47.6,48.4,"UM",2],["FSM","Micronesia, Fed. Sts.",0.621,0.361,37.0,37.3,"UM",0],["MDA","Moldova",0.45,0.484,51.7,47.4,"UM",1],["MCO","Monaco",0.39,0.715,66.2,64.9,"H",1],["MNG","Mongolia",0.396,0.39,49.7,50.5,"UM",0],["MNE","Montenegro",0.421,0.463,52.1,52.1,"UM",1],["MAR","Morocco",0.45,0.403,47.7,46.7,"LM",3],["MOZ","Mozambique",0.511,0.234,36.1,38.5,"L",6],["MMR","Myanmar",0.488,0.217,36.5,36.2,"LM",0],["NAM","Namibia",0.511,0.348,41.9,42.5,"LM",6],["NRU","Naoero",0.502,0.571,53.4,52.0,"H",0],["NPL","Nepal",0.504,0.327,41.1,40.8,"LM",5],["NLD","Netherlands",0.371,0.659,64.4,67.2,"H",1],["NZL","New Zealand",0.297,0.622,66.2,75.1,"H",0],["NIC","Nicaragua",0.423,0.305,44.1,44.1,"LM",2],["NER","Niger",0.587,0.295,35.4,35.0,"L",6],["NGA","Nigeria",0.49,0.242,37.6,36.2,"LM",6],["MKD","North Macedonia",0.41,0.459,52.4,53.2,"UM",1],["NOR","Norway",0.263,0.7,71.8,76.7,"H",1],["OMN","Oman",0.45,0.436,49.3,51.4,"H",3],["PAK","Pakistan",0.525,0.31,39.3,37.2,"LM",3],["PLW","Palau",0.482,0.582,55.0,50.8,"H",0],["PAN","Panama",0.428,0.378,47.5,49.6,"H",2],["PNG","Papua New Guinea",0.549,0.223,33.7,37.2,"LM",0],["PRY","Paraguay",0.38,0.336,47.8,48.0,"UM",2],["PER","Peru",0.418,0.383,48.3,48.5,"UM",2],["PHL","Philippines",0.43,0.372,47.1,43.9,"UM",0],["POL","Poland",0.314,0.57,62.8,63.3,"H",1],["PRT","Portugal",0.352,0.572,61.0,60.9,"H",1],["QAT","Qatar",0.418,0.462,52.2,53.8,"H",3],["ROU","Romania",0.398,0.518,56.0,54.0,"H",1],["RUS","Russian Federation",0.31,0.437,56.3,59.9,"H",1],["RWA","Rwanda",0.61,0.422,40.6,38.6,"L",6],["WSM","Samoa",0.538,0.34,40.1,45.3,"UM",0],["STP","Sao Tome and Principe",0.527,0.359,41.6,41.7,"LM",6],["SAU","Saudi Arabia",0.471,0.494,51.1,50.8,"H",3],["SEN","Senegal",0.529,0.376,42.3,39.5,"LM",6],["SRB","Serbia",0.47,0.479,50.5,48.1,"UM",1],["SYC","Seychelles",0.428,0.402,48.7,50.6,"H",6],["SLE","Sierra Leone",0.602,0.266,33.2,34.6,"L",6],["SGP","Singapore",0.379,0.749,68.5,70.8,"H",0],["SVK","Slovak Republic",0.367,0.533,58.3,56.9,"H",1],["SVN","Slovenia",0.344,0.607,63.2,63.8,"H",1],["SLB","Solomon Islands",0.622,0.382,38.0,40.4,"LM",0],["SOM","Somalia, Fed. Rep.",0.638,0.178,27.0,30.0,"L",6],["ZAF","South Africa",0.436,0.316,44.0,46.0,"UM",6],["ESP","Spain",0.323,0.557,61.7,61.1,"H",1],["LKA","Sri Lanka",0.436,0.346,45.5,46.2,"UM",5],["KNA","St. Kitts and Nevis",0.473,0.62,57.3,54.7,"H",2],["LCA","St. Lucia",0.345,0.417,53.6,56.4,"UM",2],["VCT","St. Vincent and the Grenadines",0.418,0.472,52.7,54.2,"UM",2],["SDN","Sudan",0.629,0.194,28.3,31.0,"L",6],["SUR","Suriname",0.442,0.37,46.4,44.7,"UM",2],["SWE","Sweden",0.323,0.681,67.9,71.7,"H",1],["CHE","Switzerland",0.296,0.674,68.9,71.5,"H",1],["SYR","Syrian Arab Republic",0.521,0.281,38.0,37.1,"L",3],["TJK","Tajikistan",0.367,0.316,47.4,44.5,"LM",1],["TZA","Tanzania",0.505,0.336,41.5,39.3,"LM",6],["THA","Thailand",0.443,0.351,45.4,49.9,"UM",0],["TLS","Timor-Leste",0.545,0.286,37.0,40.9,"LM",0],["TGO","Togo",0.509,0.354,42.2,39.0,"LM",6],["TON","Tonga",0.595,0.353,37.9,40.5,"UM",0],["TTO","Trinidad and Tobago",0.386,0.327,47.1,48.9,"H",2],["TUN","Tunisia",0.441,0.34,45.0,50.4,"LM",3],["TUR","Turkiye",0.396,0.472,53.8,52.8,"UM",1],["TKM","Turkmenistan",0.448,0.235,39.4,39.7,"UM",1],["TUV","Tuvalu",0.573,0.45,43.9,41.8,"UM",0],["UGA","Uganda",0.536,0.255,35.9,36.0,"L",6],["UKR","Ukraine",0.385,0.455,53.5,49.2,"UM",1],["ARE","United Arab Emirates",0.416,0.49,53.7,56.6,"H",3],["GBR","United Kingdom",0.282,0.653,68.6,71.9,"H",1],["USA","United States",0.317,0.632,65.7,68.2,"H",4],["URY","Uruguay",0.394,0.488,54.7,55.0,"H",2],["UZB","Uzbekistan",0.393,0.442,52.5,45.5,"LM",1],["VUT","Vanuatu",0.547,0.301,37.7,40.0,"LM",0],["VEN","Venezuela, RB",0.386,0.232,42.3,40.7,"LM",2],["VNM","Viet Nam",0.499,0.417,45.9,44.9,"UM",0],["YEM","Yemen, Rep.",0.629,0.256,31.3,33.4,"L",3],["ZMB","Zambia",0.492,0.274,39.1,40.8,"LM",6],["ZWE","Zimbabwe",0.511,0.22,35.4,34.4,"LM",6]]};
  var TEMP = [[1950, -0.17], [1951, -0.07], [1952, 0.01], [1953, 0.08], [1954, -0.13], [1955, -0.14], [1956, -0.19], [1957, 0.05], [1958, 0.06], [1959, 0.03], [1960, -0.02], [1961, 0.06], [1962, 0.03], [1963, 0.05], [1964, -0.2], [1965, -0.11], [1966, -0.06], [1967, -0.02], [1968, -0.08], [1969, 0.05], [1970, 0.03], [1971, -0.08], [1972, 0.01], [1973, 0.16], [1974, -0.07], [1975, -0.01], [1976, -0.1], [1977, 0.18], [1978, 0.07], [1979, 0.16], [1980, 0.26], [1981, 0.32], [1982, 0.14], [1983, 0.31], [1984, 0.16], [1985, 0.12], [1986, 0.18], [1987, 0.32], [1988, 0.39], [1989, 0.27], [1990, 0.45], [1991, 0.41], [1992, 0.22], [1993, 0.23], [1994, 0.31], [1995, 0.45], [1996, 0.33], [1997, 0.47], [1998, 0.61], [1999, 0.38], [2000, 0.39], [2001, 0.53], [2002, 0.63], [2003, 0.62], [2004, 0.53], [2005, 0.68], [2006, 0.64], [2007, 0.66], [2008, 0.54], [2009, 0.66], [2010, 0.72], [2011, 0.61], [2012, 0.65], [2013, 0.67], [2014, 0.75], [2015, 0.89], [2016, 1.01], [2017, 0.91], [2018, 0.85], [2019, 0.98], [2020, 1.01], [2021, 0.85], [2022, 0.89], [2023, 1.17], [2024, 1.28], [2025, 1.18]];
  var TREND = {"years": ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"], "series": {"High income": [56.6, 56.4, 56.5, 56.5, 56.5, 56.7, 57.1, 57.6, 57.9, 57.7, 58.2, 58.4, 58.6, 58.8, 58.7, 58.4, 58.4, 59.1, 59.1, 59.1, 59.7, 59.7, 59.7, 59.8, 60.2, 60.4, 60.6, 60.1, 60.1, 60.3], "Upper middle income": [44.2, 44.2, 44.4, 44.9, 45.0, 44.8, 45.1, 45.0, 45.5, 45.7, 46.0, 46.0, 46.4, 46.3, 46.2, 46.4, 46.7, 46.8, 47.1, 47.6, 47.9, 48.1, 48.1, 48.2, 48.3, 48.4, 48.5, 48.1, 47.9, 47.6], "Lower middle income": [39.7, 39.7, 39.6, 39.9, 39.6, 39.4, 39.3, 39.4, 39.3, 39.4, 39.4, 39.4, 39.3, 38.7, 39.1, 39.3, 39.4, 39.6, 39.4, 39.4, 40.0, 40.0, 40.1, 40.3, 40.5, 41.2, 41.0, 41.1, 41.5, 41.1], "Low income": [32.6, 32.5, 32.7, 32.7, 32.9, 33.1, 32.8, 32.8, 33.2, 33.5, 33.7, 34.3, 34.5, 34.8, 35.3, 35.3, 35.8, 35.0, 34.8, 34.4, 34.5, 34.3, 34.6, 34.7, 34.8, 35.2, 34.7, 34.3, 34.2, 34.5]}};

  var INCOME = {
    H:  { label: 'High income',         color: '#7aa2f7' },
    UM: { label: 'Upper middle income', color: '#2dd4bf' },
    LM: { label: 'Lower middle income', color: '#f5b942' },
    L:  { label: 'Low income',          color: '#ff6b5b' },
  };
  var ORDER = ['H', 'UM', 'LM', 'L'];

  // Global medians (author's calculation from the 190 countries shown).
  var MED_V = 0.45;
  var MED_R = 0.3845;

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;

    var axis = HH.axis;
    var labels = HH.valueLabels;
    var C = HH.palette;
    var mono = getComputedStyle(document.documentElement).getPropertyValue('--mono');

    /* --- Pressures: temperature ------------------------------------------- */

    HH.chart('chart-temp', {
      type: 'bar',
      data: {
        labels: TEMP.map(function (d) { return d[0]; }),
        datasets: [{
          label: 'Anomaly vs 1951–1980, °C',
          data: TEMP.map(function (d) { return d[1]; }),
          backgroundColor: TEMP.map(function (d) {
            return d[1] >= 1 ? '#ff6b5b' : d[1] >= 0.5 ? '#f5b942' : d[1] >= 0 ? '#8b98a5' : '#7aa2f7';
          }),
          borderRadius: 1,
          barPercentage: 0.9,
          categoryPercentage: 1,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return (c.parsed.y > 0 ? '+' : '') + c.parsed.y.toFixed(2) + ' °C'; } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), {
            ticks: {
              maxRotation: 0, autoSkip: false,
              callback: function (v, i) { var y = TEMP[i][0]; return y % 10 === 0 ? y : ''; },
            },
          }),
          y: Object.assign(axis({ title: '°C vs 1951–1980' }), { suggestedMin: -0.3, suggestedMax: 1.4 }),
        },
      },
    });

    /* --- Pressures: displacement ------------------------------------------ */

    HH.chart('chart-displaced', {
      type: 'bar',
      data: {
        labels: ['2015', '2020', '2024', '2025'],
        datasets: [{
          label: 'Millions forcibly displaced',
          data: [65.3, 82.4, 122, 117.8],
          backgroundColor: ['#8b98a5', '#f5b942', '#ff6b5b', '#ff6b5b'],
          barThickness: 30,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.y + ' million'; } } },
        },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Millions' }), { beginAtZero: true, max: 140 }),
        },
      },
      plugins: [labels({ axis: 'y', format: function (v) { return v + 'm'; } })],
    });

    /* --- Explorer ---------------------------------------------------------- */

    var byIso = {};
    ND_GAIN.rows.forEach(function (r) { byIso[r[0]] = r; });
    var ranked = ND_GAIN.rows.slice().sort(function (a, b) { return b[4] - a[4]; });
    var rankOf = {};
    ranked.forEach(function (r, i) { rankOf[r[0]] = i + 1; });

    var regionSel = document.getElementById('ex-region');
    var search = document.getElementById('ex-search');
    var list = document.getElementById('ex-countries');
    var reset = document.getElementById('ex-reset');
    var selected = null;
    var regionFilter = 'all';

    if (regionSel) {
      ND_GAIN.regions.forEach(function (name, i) {
        var o = document.createElement('option');
        o.value = String(i); o.textContent = name;
        regionSel.appendChild(o);
      });
    }
    if (list) {
      ND_GAIN.rows.forEach(function (r) {
        var o = document.createElement('option');
        o.value = r[1];
        list.appendChild(o);
      });
    }

    function point(r) { return { x: r[2], y: r[3], iso: r[0] }; }
    function visible(r) { return regionFilter === 'all' || String(r[7]) === regionFilter; }

    function buildDatasets() {
      var sets = ORDER.map(function (k) {
        return {
          label: INCOME[k].label,
          data: ND_GAIN.rows.filter(function (r) { return r[6] === k && visible(r); }).map(point),
          backgroundColor: INCOME[k].color + 'cc',
          borderColor: INCOME[k].color,
          borderWidth: 0.5,
          pointRadius: 4,
          pointHoverRadius: 7,
        };
      });
      var sel = selected && byIso[selected];
      sets.push({
        label: 'Selected',
        data: sel ? [point(sel)] : [],
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 2,
        pointRadius: 9,
        pointHoverRadius: 10,
        pointStyle: 'rectRot',
      });
      return sets;
    }

    // Median reference lines, quadrant label, and the selected country's name.
    var guides = {
      id: 'explorerGuides',
      afterDatasetsDraw: function (chart) {
        var x = chart.scales.x, y = chart.scales.y, a = chart.chartArea, ctx = chart.ctx;
        ctx.save();
        ctx.strokeStyle = 'rgba(230, 237, 243, 0.35)';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1;
        var px = x.getPixelForValue(MED_V), py = y.getPixelForValue(MED_R);
        ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(a.left, py); ctx.lineTo(a.right, py); ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '600 10px ' + mono;
        ctx.fillStyle = 'rgba(255, 107, 91, 0.9)';
        ctx.textAlign = 'right';
        ctx.fillText('HIGH VULNERABILITY · LOW READINESS', a.right - 6, a.bottom - 8);
        ctx.fillStyle = 'rgba(122, 162, 247, 0.9)';
        ctx.textAlign = 'left';
        ctx.fillText('LOW VULNERABILITY · HIGH READINESS', a.left + 6, a.top + 14);
        var sel = selected && byIso[selected];
        if (sel) {
          var sx = x.getPixelForValue(sel[2]), sy = y.getPixelForValue(sel[3]);
          ctx.font = '600 12px ' + mono;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = sx > (a.left + a.right) / 2 ? 'right' : 'left';
          ctx.fillText(sel[1], sx + (ctx.textAlign === 'left' ? 12 : -12), sy - 10);
        }
        ctx.restore();
      },
    };

    var explorer = HH.chart('chart-explorer', {
      type: 'scatter',
      data: { datasets: buildDatasets() },
      options: {
        animation: false,
        plugins: {
          legend: {
            position: 'top', align: 'start',
            labels: {
              boxWidth: 10, usePointStyle: true, font: { size: 11 },
              filter: function (item) { return item.text !== 'Selected'; },
            },
          },
          tooltip: {
            callbacks: {
              label: function (c) {
                var r = byIso[c.raw.iso];
                return r[1] + ' — GAIN ' + r[4].toFixed(1) + ' (vuln ' + r[2].toFixed(2) + ', ready ' + r[3].toFixed(2) + ')';
              },
            },
          },
        },
        onClick: function (evt, els) {
          if (!els.length) return;
          var el = els[0];
          var p = explorer.data.datasets[el.datasetIndex].data[el.index];
          select(p.iso);
        },
        scales: {
          x: Object.assign(axis({ title: 'Vulnerability (higher is more exposed and sensitive) →' }), { min: 0.2, max: 0.7 }),
          y: Object.assign(axis({ title: 'Readiness (higher is better able to adapt) →' }), { min: 0.1, max: 0.85 }),
        },
      },
      plugins: [guides],
    });

    function quadrant(r) {
      var hv = r[2] > MED_V, hr = r[3] >= MED_R;
      if (hv && !hr) return 'High vulnerability, low readiness';
      if (hv && hr) return 'High vulnerability, high readiness';
      if (!hv && !hr) return 'Low vulnerability, low readiness';
      return 'Low vulnerability, high readiness';
    }

    function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

    function renderCard() {
      var r = selected && byIso[selected];
      if (!r) {
        setText('cc-name', 'None selected');
        setText('cc-meta', 'Search, or click a point on the chart.');
        ['cc-gain', 'cc-change', 'cc-vul', 'cc-ready', 'cc-rank', 'cc-quad'].forEach(function (id) { setText(id, '—'); });
        return;
      }
      setText('cc-name', r[1]);
      setText('cc-meta', INCOME[r[6]].label + ' · ' + ND_GAIN.regions[r[7]]);
      setText('cc-gain', r[4].toFixed(1));
      if (r[5] != null) {
        var d = r[4] - r[5];
        setText('cc-change', (d >= 0 ? '+' : '') + d.toFixed(1) + ' (from ' + r[5].toFixed(1) + ')');
      } else {
        setText('cc-change', 'n/a');
      }
      setText('cc-vul', r[2].toFixed(3));
      setText('cc-ready', r[3].toFixed(3));
      setText('cc-rank', String(rankOf[r[0]]));
      setText('cc-quad', quadrant(r));
      var card = document.getElementById('ex-card');
      if (card) card.dataset.income = r[6];
    }

    function refresh() {
      if (!explorer) return;
      explorer.data.datasets = buildDatasets();
      explorer.update();
      renderCard();
    }

    function select(iso) {
      selected = iso;
      // A selected country outside the current region filter widens the filter.
      var r = byIso[iso];
      if (r && regionFilter !== 'all' && String(r[7]) !== regionFilter) {
        regionFilter = 'all';
        if (regionSel) regionSel.value = 'all';
      }
      if (search && r) search.value = r[1];
      refresh();
    }

    if (search) {
      search.addEventListener('change', function () {
        var q = search.value.trim().toLowerCase();
        var hit = ND_GAIN.rows.filter(function (r) { return r[1].toLowerCase() === q; })[0]
          || ND_GAIN.rows.filter(function (r) { return r[1].toLowerCase().indexOf(q) === 0; })[0];
        if (hit) select(hit[0]);
      });
    }
    if (regionSel) {
      regionSel.addEventListener('change', function () {
        regionFilter = regionSel.value;
        // Drop a selection the new filter would hide, so the card never
        // describes a country that is not on the chart.
        var r = selected && byIso[selected];
        if (r && !visible(r)) { selected = null; if (search) search.value = ''; }
        refresh();
      });
    }
    if (reset) {
      reset.addEventListener('click', function () {
        selected = null; regionFilter = 'all';
        if (regionSel) regionSel.value = 'all';
        if (search) search.value = '';
        refresh();
      });
    }
    renderCard();

    /* --- The capacity gap -------------------------------------------------- */

    HH.chart('chart-gap-trend', {
      type: 'line',
      data: {
        labels: TREND.years,
        datasets: ORDER.map(function (k) {
          return {
            label: INCOME[k].label,
            data: TREND.series[INCOME[k].label],
            borderColor: INCOME[k].color,
            backgroundColor: INCOME[k].color,
            borderWidth: 2.2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.25,
          };
        }),
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(1); } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), {
            ticks: { maxRotation: 0, autoSkip: false, callback: function (v, i) { var y = +TREND.years[i]; return y % 5 === 0 ? y : ''; } },
          }),
          y: Object.assign(axis({ title: 'Median ND-GAIN score' }), { min: 25, max: 65 }),
        },
      },
    });

    HH.chart('chart-improved', {
      type: 'bar',
      data: {
        labels: ORDER.map(function (k) { return INCOME[k].label; }),
        datasets: [{
          label: '% improving since 2015',
          // 24/62, 28/58, 31/46, 11/24 — author's count from ND-GAIN 2026.
          data: [38.7, 48.3, 67.4, 45.8],
          backgroundColor: ORDER.map(function (k) { return INCOME[k].color; }),
          barThickness: 22,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) {
                var n = [['24', '62'], ['28', '58'], ['31', '46'], ['11', '24']][c.dataIndex];
                return n[0] + ' of ' + n[1] + ' countries (' + c.parsed.x.toFixed(0) + '%)';
              },
            },
          },
        },
        scales: {
          x: Object.assign(axis({ title: '% of countries whose 2024 score exceeds 2015' }), {
            beginAtZero: true, max: 100, ticks: { callback: function (v) { return v + '%'; } },
          }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return Math.round(v) + '%'; } })],
    });

    /* --- Buffers ------------------------------------------------------------ */

    HH.chart('chart-adapt', {
      type: 'bar',
      data: {
        labels: ['Needs by 2035', 'Flows, 2023'],
        datasets: [{
          label: 'US$ billions a year',
          data: [[310, 365], [0, 26]],
          backgroundColor: ['#f5b942', '#8b98a5'],
          barThickness: 34,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { var r = c.raw; return r[0] === 0 ? '$' + r[1] + 'bn' : '$' + r[0] + '–' + r[1] + 'bn'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions a year' }), { beginAtZero: true, max: 420, ticks: { callback: function (v) { return '$' + v; } } }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v[0] === 0 ? '$' + v[1] + 'bn' : '$' + v[0] + '–' + v[1] + 'bn'; } })],
    });

    HH.chart('chart-protect', {
      type: 'bar',
      data: {
        labels: ['2024 losses'],
        datasets: [
          { label: 'Insured', data: [137], backgroundColor: '#2dd4bf', barThickness: 46 },
          { label: 'Uninsured (57%)', data: [181], backgroundColor: '#ff6b5b', barThickness: 46 },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 10, font: { size: 11 } } },
          tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': $' + c.parsed.x + 'bn'; } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'US$ billions' }), { stacked: true, beginAtZero: true, max: 340, ticks: { callback: function (v) { return '$' + v; } } }),
          y: Object.assign(axis({ grid: false }), { stacked: true, ticks: { display: false } }),
        },
      },
      plugins: [{
        id: 'protectLabels',
        afterDatasetsDraw: function (chart) {
          var ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = '#0f1419';
          ctx.font = '600 12px ' + mono;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          chart.data.datasets.forEach(function (ds, di) {
            var bar = chart.getDatasetMeta(di).data[0];
            ctx.fillText('$' + ds.data[0] + 'bn', bar.base + (bar.x - bar.base) / 2, bar.y);
          });
          ctx.restore();
        },
      }],
    });

    HH.chart('chart-social', {
      type: 'bar',
      data: {
        labels: ['High income', 'Upper middle', 'World', 'Lower middle', 'Low income'],
        datasets: [{
          label: '% covered',
          data: [85.9, 71.2, 52.4, 32.4, 9.7],
          backgroundColor: ['#7aa2f7', '#2dd4bf', '#8b98a5', '#f5b942', '#ff6b5b'],
          barThickness: 20,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.x + '% covered'; } } } },
        scales: {
          x: Object.assign(axis({ title: '% of population' }), { beginAtZero: true, max: 100, ticks: { callback: function (v) { return v + '%'; } } }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 10.5 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + '%'; } })],
    });

    HH.chart('chart-interest', {
      type: 'bar',
      data: {
        labels: ['Interest', 'Education', 'Health'],
        datasets: [{
          label: 'US$ per person',
          data: [70, 63, 44],
          backgroundColor: ['#ff6b5b', '#2dd4bf', '#2dd4bf'],
          barThickness: 26,
        }],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '$' + c.parsed.x + ' per person'; } } } },
        scales: {
          x: Object.assign(axis({ title: 'US$ per person per year' }), { beginAtZero: true, max: 85, ticks: { callback: function (v) { return '$' + v; } } }),
          y: Object.assign(axis({ grid: false }), { ticks: { font: { size: 11 } } }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '$' + v; } })],
    });

    /* --- Gains --------------------------------------------------------------- */

    HH.chart('chart-ews', {
      type: 'bar',
      data: {
        labels: ['2015', '2024', '2025'],
        datasets: [{
          label: 'Countries reporting a multi-hazard early warning system',
          data: [52, 108, 119],
          backgroundColor: ['#8b98a5', '#2dd4bf', '#2dd4bf'],
          barThickness: 34,
        }],
      },
      options: {
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + ' countries'; } } } },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: 'Countries' }), { beginAtZero: true, max: 140 }),
        },
      },
      plugins: [labels({ axis: 'y', format: function (v) { return v; } })],
    });

    HH.chart('chart-social-trend', {
      type: 'bar',
      data: {
        labels: ['2015', 'Latest (2024–26 report)'],
        datasets: [{
          label: '% of world population covered',
          data: [42.8, 52.4],
          backgroundColor: ['#8b98a5', '#2dd4bf'],
          barThickness: 34,
        }],
      },
      options: {
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + '% covered'; } } } },
        scales: {
          x: axis({ grid: false }),
          y: Object.assign(axis({ title: '% of world population' }), { beginAtZero: true, max: 70, ticks: { callback: function (v) { return v + '%'; } } }),
        },
      },
      plugins: [labels({ axis: 'y', format: function (v) { return v + '%'; } })],
    });
  });
})();
