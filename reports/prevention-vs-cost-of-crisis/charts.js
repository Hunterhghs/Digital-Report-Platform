/* ===========================================================================
   Charts and interactions — "The Economics of Prevention Versus the Cost
   of Crisis" (hybrid dashboard)

   DATA (assembled in analyse.py and build.py): countries with the fields
   named in D.k (OECD CRS response = emergency response + reconstruction,
   prevention = disaster prevention and preparedness, humanitarian and all
   ODA received 2015–2024, constant 2024 US$ m, all official donors
   excluding Türkiye; EM-DAT damages as % of GDP, average and worst year
   2000–2024). D.g holds the aggregate CRS series (US$ bn), EM-DAT world
   damages, the ten domains and the 17-item evidence base (central BCR,
   range, range type, setting, lag, persistence, domain weights, source).
   Colours come from the --v, --d and --g tokens.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var D = {"k":["iso","name","reg","inc","pop","rsp","prv","hum","oda","dmg","dmgmax","dmgyr","dmgn"],"c":[["AFG","Afghanistan","MEA","LIC",42.65,9920.0,256.9,10176.9,43493.8,0.093,1.27,2023,9],["AGO","Angola","SSF","LMC",37.89,144.9,22.6,167.5,3078.9,0.004,0.11,2000,2],["ALB","Albania","ECS","UMC",2.38,48.7,27.9,76.6,4662.7,0.209,4.78,2019,4],["ARE","United Arab Emirates","MEA","HIC",10.99,0,0,0,0,0.0,0,null,0],["ARG","Argentina","LCN","UMC",45.7,22.3,5.3,27.5,2323.8,0.104,0.9,2003,16],["ARM","Armenia","ECS","UMC",3.03,110.2,20.7,130.9,4590.2,0.239,5.23,2000,4],["AUS","Australia","EAS","HIC",27.19,0,0,0,0,0.188,0.62,2011,24],["AUT","Austria","ECS","HIC",9.18,0,0,0,0,0.085,1.13,2002,9],["AZE","Azerbaijan","ECS","UMC",10.2,46.6,1.7,48.3,2067.2,0.114,2.09,2000,2],["BDI","Burundi","SSF","LIC",14.05,1026.8,83.5,1110.3,6495.9,0.022,0.3,2015,3],["BEL","Belgium","ECS","HIC",11.86,0,0,0,0,0.021,0.33,2021,5],["BEN","Benin","SSF","LMC",14.46,54.5,142.0,196.5,9173.9,0.0,0,null,0],["BFA","Burkina Faso","SSF","LIC",23.55,1520.1,108.1,1628.1,15604.8,0.074,1.59,2009,3],["BGD","Bangladesh","SAS","LMC",173.56,4101.6,1539.8,5641.4,56417.1,0.392,4.15,2004,14],["BGR","Bulgaria","ECS","HIC",6.44,0,0,0,0,0.135,1.63,2014,8],["BHR","Bahrain","MEA","HIC",1.59,0,0,0,0,0.0,0,null,0],["BIH","Bosnia and Herzegovina","ECS","UMC",3.16,295.9,30.5,326.5,6448.3,0.299,2.84,2000,6],["BLR","Belarus","ECS","UMC",9.13,31.8,2.8,34.6,1885.9,0.01,0.24,2000,2],["BOL","Bolivia","LCN","LMC",12.41,24.3,429.5,453.8,7971.6,0.388,2.25,2008,14],["BRA","Brazil","LCN","UMC",212.0,157.5,11.8,169.3,10314.9,0.096,0.62,2024,23],["BTN","Bhutan","SAS","LMC",0.79,17.4,41.7,59.1,1630.1,0.0,0.0,null,0],["BWA","Botswana","SSF","UMC",2.52,12.2,4.1,16.3,1289.4,0.016,0.33,2015,2],["CAF","Central African Republic","SSF","LIC",5.33,2726.3,69.2,2795.5,7236.4,0.211,5.27,2024,1],["CAN","Canada","NAC","HIC",41.26,0,0,0,0,0.072,0.4,2013,18],["CHE","Switzerland","ECS","HIC",9.01,0,0,0,0,0.042,0.49,2005,8],["CHL","Chile","LCN","HIC",19.76,9.2,4.3,13.5,514.7,0.716,13.82,2010,17],["CHN","China","EAS","UMC",1408.97,112.8,11.4,124.2,14899.6,0.35,2.38,2008,25],["CIV","Cote d'Ivoire","SSF","LMC",31.93,234.5,92.4,326.8,18148.6,0.0,0,null,0],["CMR","Cameroon","SSF","LMC",29.12,1275.2,104.1,1379.3,13339.5,0.002,0.03,2022,2],["COD","Congo, Dem. Rep.","SSF","LIC",109.28,8516.4,304.7,8821.0,35842.2,0.007,0.1,2002,4],["COG","Congo, Rep.","SSF","LMC",6.33,167.1,19.0,186.1,2931.0,0.0,0,null,0],["COL","Colombia","LCN","UMC",52.89,1979.5,167.3,2146.8,17958.4,0.048,0.75,2011,11],["COM","Comoros","SSF","LMC",0.87,31.0,76.6,107.6,1289.8,0.02,0.49,2012,1],["CPV","Cabo Verde","SSF","UMC",0.52,4.9,26.4,31.3,1748.0,0.003,0.06,2015,1],["CRI","Costa Rica","LCN","HIC",5.13,44.8,10.4,55.1,2137.3,0.066,0.65,2009,9],["CUB","Cuba","LCN","UMC",10.98,85.5,12.4,97.8,7271.3,0.877,6.34,2008,9],["CYP","Cyprus","ECS","HIC",1.36,0,0,0,0,0.009,0.15,2021,2],["CZE","Czechia","ECS","HIC",10.91,0,0,0,0,0.196,2.93,2002,11],["DEU","Germany","ECS","HIC",83.52,0,0,0,0,0.106,0.92,2021,17],["DJI","Djibouti","MEA","LMC",1.17,166.3,28.0,194.3,2499.2,0.0,0,null,0],["DNK","Denmark","ECS","HIC",5.98,0,0,0,0,0.021,0.49,2005,2],["DOM","Dominican Republic","LCN","UMC",11.43,35.7,23.5,59.2,3966.8,0.099,1.33,2004,12],["DZA","Algeria","MEA","UMC",46.81,296.7,5.4,302.1,2727.9,0.316,6.8,2003,8],["ECU","Ecuador","LCN","UMC",18.14,687.0,38.8,725.8,4754.4,0.178,2.06,2016,10],["EGY","Egypt, Arab Rep.","MEA","LMC",116.54,444.7,11.3,456.0,43726.0,0.001,0.02,2020,2],["ERI","Eritrea","SSF","LIC",3.54,69.9,3.5,73.4,1289.6,0.0,0.0,null,0],["ESP","Spain","ECS","HIC",48.85,0,0,0,0,0.074,0.67,2024,20],["EST","Estonia","ECS","HIC",1.37,0,0,0,0,0.037,0.92,2005,1],["ETH","Ethiopia","SSF","LIC",132.06,10831.8,659.2,11491.0,55996.4,0.105,1.23,2016,9],["FIN","Finland","ECS","HIC",5.62,0,0,0,0,0.0,0,null,0],["FJI","Fiji","EAS","UMC",0.93,123.6,71.3,194.8,2451.1,0.937,12.17,2016,13],["FRA","France","ECS","HIC",68.55,0,0,0,0,0.052,0.32,2003,18],["GAB","Gabon","SSF","UMC",2.54,3.0,4.4,7.4,1227.1,0.0,0,null,0],["GBR","United Kingdom","ECS","HIC",69.28,0,0,0,0,0.045,0.44,2000,15],["GEO","Georgia","ECS","UMC",3.81,166.2,8.9,175.0,7921.1,0.695,10.31,2002,6],["GHA","Ghana","SSF","LMC",34.43,64.0,63.4,127.4,19349.7,0.001,0.02,2015,1],["GIN","Guinea","SSF","LMC",14.75,273.6,25.1,298.7,6959.2,0.0,0,null,0],["GMB","Gambia, The","SSF","LIC",2.76,35.9,40.0,75.9,2897.5,0.0,0,null,0],["GNB","Guinea-Bissau","SSF","LIC",2.2,16.4,12.6,29.0,1748.0,0.0,0,null,0],["GNQ","Equatorial Guinea","SSF","UMC",1.89,3.8,2.6,6.4,225.2,0.0,0,null,0],["GRC","Greece","ECS","HIC",10.41,0,0,0,0,0.074,0.56,2007,11],["GTM","Guatemala","LCN","UMC",18.41,289.0,40.2,329.2,5268.2,0.321,3.69,2005,14],["GUY","Guyana","LCN","HIC",0.83,6.6,4.4,11.0,1383.9,2.557,56.38,2005,3],["HKG","Hong Kong SAR, China","EAS","HIC",7.52,0,0,0,0,0.009,0.22,2017,2],["HND","Honduras","LCN","LMC",10.83,324.5,247.0,571.4,8550.0,0.166,1.27,2002,9],["HRV","Croatia","ECS","HIC",3.87,0,0,0,0,1.002,22.47,2020,5],["HTI","Haiti","LCN","LMC",11.77,1519.7,259.4,1779.1,11425.0,3.827,67.46,2010,12],["HUN","Hungary","ECS","HIC",9.56,0,0,0,0,0.027,0.33,2010,7],["IDN","Indonesia","EAS","UMC",283.49,399.8,571.5,971.3,26955.6,0.199,1.78,2004,24],["IND","India","SAS","LMC",1450.94,447.1,755.8,1202.9,59657.5,0.292,1.15,2014,25],["IRL","Ireland","ECS","HIC",5.4,0,0,0,0,0.009,0.13,2011,2],["IRN","Iran, Islamic Rep.","MEA","UMC",91.57,326.6,11.3,338.0,2366.8,0.214,1.1,2000,19],["IRQ","Iraq","MEA","UMC",46.04,8226.6,68.4,8295.0,23313.1,0.003,0.06,2020,3],["ISR","Israel","MEA","HIC",10.0,0,0,0,0,0.017,0.16,2016,4],["ITA","Italy","ECS","HIC",58.95,0,0,0,0,0.132,0.82,2012,18],["JAM","Jamaica","LCN","UMC",2.84,6.6,26.4,33.0,1156.3,0.681,8.8,2004,11],["JOR","Jordan","MEA","UMC",11.55,4646.1,33.4,4679.5,33534.1,0.0,0.0,null,0],["JPN","Japan","EAS","HIC",123.98,0,0,0,0,0.308,3.38,2011,23],["KAZ","Kazakhstan","ECS","UMC",20.59,26.2,4.1,30.3,1070.5,0.007,0.1,2008,6],["KEN","Kenya","SSF","LMC",56.43,2579.1,690.6,3269.7,36440.9,0.059,0.62,2004,8],["KGZ","Kyrgyz Republic","ECS","LMC",7.22,34.5,82.7,117.1,6308.7,0.015,0.18,2015,4],["KHM","Cambodia","EAS","LMC",17.64,19.1,52.7,71.8,13179.4,0.485,4.33,2000,9],["KOR","Korea, Rep.","EAS","HIC",51.75,0,0,0,0,0.071,0.7,2002,16],["KWT","Kuwait","MEA","HIC",4.9,0,0,0,0,0.0,0,null,0],["LAO","Lao PDR","EAS","LMC",7.77,37.0,90.5,127.5,6639.0,0.24,1.86,2024,9],["LBN","Lebanon","MEA","LMC",5.81,6422.5,46.1,6468.6,16823.3,0.0,0,null,0],["LBR","Liberia","SSF","LIC",5.61,744.8,34.7,779.5,7695.4,0.0,0,null,0],["LBY","Libya","MEA","UMC",7.38,978.2,13.1,991.3,3216.1,0.564,14.08,2023,2],["LKA","Sri Lanka","SAS","UMC",21.92,179.9,145.9,325.9,9317.2,0.39,6.37,2004,12],["LSO","Lesotho","SSF","LMC",2.34,70.0,25.5,95.5,2073.0,0.0,0,null,0],["LTU","Lithuania","ECS","HIC",2.89,0,0,0,0,0.035,0.75,2006,2],["LUX","Luxembourg","ECS","HIC",0.68,0,0,0,0,0.002,0.06,2010,1],["LVA","Latvia","ECS","HIC",1.87,0,0,0,0,0.08,1.99,2005,1],["MAC","Macao SAR, China","EAS","HIC",0.69,0,0,0,0,0.113,2.82,2017,1],["MAR","Morocco","MEA","LMC",38.08,183.4,7.0,190.4,25069.4,0.309,4.79,2023,8],["MDA","Moldova","ECS","UMC",2.4,276.9,18.6,295.4,6752.9,0.479,9.22,2007,4],["MDG","Madagascar","SSF","LIC",31.96,749.4,332.4,1081.8,11117.1,0.529,4.94,2004,15],["MDV","Maldives","SAS","UMC",0.53,8.0,15.6,23.6,1763.3,1.533,38.32,2004,1],["MEX","Mexico","LCN","UMC",130.86,182.8,6.5,189.3,8816.5,0.184,0.86,2005,25],["MKD","North Macedonia","ECS","UMC",1.82,60.7,8.1,68.8,3429.4,0.074,0.86,2015,4],["MLI","Mali","SSF","LIC",24.48,1999.4,87.2,2086.6,16419.0,0.025,0.62,2024,1],["MLT","Malta","MEA","HIC",0.57,0,0,0,0,0.0,0,null,0],["MMR","Myanmar","EAS","LMC",54.5,2341.9,130.7,2472.6,16905.5,0.852,12.55,2008,9],["MNE","Montenegro","ECS","UMC",0.62,19.3,0.8,20.0,2085.1,0.0,0,null,0],["MNG","Mongolia","EAS","UMC",3.52,22.4,16.5,39.0,4912.7,0.321,7.04,2000,5],["MOZ","Mozambique","SSF","LIC",34.63,1332.9,513.3,1846.3,26220.6,0.97,14.38,2019,11],["MRT","Mauritania","SSF","LMC",5.17,434.6,44.6,479.2,5642.3,0.001,0.03,2013,1],["MUS","Mauritius","SSF","UMC",1.25,14.7,4.8,19.5,1655.5,0.041,1.02,2002,2],["MWI","Malawi","SSF","LIC",21.66,687.9,258.2,946.2,15881.7,0.394,4.23,2015,5],["MYS","Malaysia","EAS","UMC",35.56,75.6,10.3,85.9,975.4,0.057,0.5,2007,12],["NAM","Namibia","SSF","LMC",3.03,26.1,6.0,32.0,2812.5,0.051,0.49,2013,6],["NER","Niger","SSF","LIC",27.03,2181.1,262.8,2443.9,16075.2,0.156,1.95,2012,6],["NGA","Nigeria","SSF","LMC",232.68,5998.4,196.2,6194.6,40907.1,0.038,0.65,2022,12],["NIC","Nicaragua","LCN","LMC",6.92,98.7,81.7,180.4,7291.5,0.338,7.22,2020,6],["NLD","Netherlands","ECS","HIC",17.99,0,0,0,0,0.013,0.11,2016,9],["NOR","Norway","ECS","HIC",5.57,0,0,0,0,0.003,0.04,2005,2],["NPL","Nepal","SAS","LMC",29.65,759.6,793.9,1553.5,16808.8,1.038,21.24,2015,14],["NZL","New Zealand","EAS","HIC",5.29,0,0,0,0,0.822,10.69,2011,18],["OMN","Oman","MEA","HIC",5.28,0,0,0,0,0.408,8.07,2007,6],["PAK","Pakistan","MEA","LMC",251.27,2050.3,991.4,3041.7,43928.7,0.723,4.88,2010,19],["PAN","Panama","LCN","HIC",4.52,80.3,7.4,87.7,1821.7,0.031,0.43,2013,10],["PER","Peru","LCN","UMC",34.22,333.1,60.5,393.6,7133.3,0.128,1.52,2017,10],["PHL","Philippines","EAS","UMC",115.84,615.3,176.9,792.2,15282.9,0.378,4.38,2013,25],["PNG","Papua New Guinea","EAS","LMC",10.58,78.1,60.4,138.5,8843.0,0.034,0.28,2015,4],["POL","Poland","ECS","HIC",36.56,0,0,0,0,0.045,0.64,2010,9],["PRI","Puerto Rico (US)","LCN","HIC",3.2,0,0,0,0,2.79,65.74,2017,7],["PRK","Korea, Dem. People's Rep.","EAS","LIC",26.5,173.3,19.7,193.0,929.8,0.0,0,null,0],["PRT","Portugal","ECS","HIC",10.69,0,0,0,0,0.155,1.34,2005,8],["PRY","Paraguay","LCN","UMC",6.93,14.5,10.7,25.2,2253.7,0.01,0.17,2007,4],["PSE","West Bank and Gaza","MEA","LMC",5.29,8757.0,122.4,8879.4,27708.3,0.0,0,null,0],["QAT","Qatar","MEA","HIC",2.86,0,0,0,0,0.0,0.01,2018,1],["ROU","Romania","ECS","HIC",19.05,0,0,0,0,0.159,1.61,2000,8],["RUS","Russian Federation","ECS","HIC",143.67,0,0,0,0,0.035,0.24,2010,21],["RWA","Rwanda","SSF","LIC",14.26,398.5,104.7,503.3,14670.3,0.03,0.75,2018,2],["SAU","Saudi Arabia","MEA","HIC",35.3,0,0,0,0,0.01,0.21,2009,4],["SDN","Sudan","SSF","LIC",50.45,6981.1,70.7,7051.8,19451.1,0.094,0.92,2020,6],["SEN","Senegal","SSF","LMC",18.5,201.9,148.3,350.2,15362.7,0.029,0.58,2002,3],["SGP","Singapore","EAS","HIC",6.04,0,0,0,0,0.0,0,null,0],["SLB","Solomon Islands","EAS","LMC",0.82,9.6,62.5,72.1,2441.0,0.09,1.8,2014,3],["SLE","Sierra Leone","SSF","LIC",8.64,780.7,91.7,872.4,7698.3,0.021,0.52,2017,1],["SLV","El Salvador","LCN","UMC",6.34,181.6,28.0,209.6,4018.1,1.187,15.23,2001,11],["SOM","Somalia, Fed. Rep.","SSF","LIC",19.01,8399.0,463.7,8862.7,22115.7,0.549,5.29,2022,6],["SRB","Serbia","ECS","UMC",6.59,138.7,18.2,156.9,12352.2,0.19,4.17,2014,4],["SSD","South Sudan","SSF","LIC",11.94,10864.2,231.7,11095.9,20699.4,0.0,0,null,0],["SUR","Suriname","LCN","UMC",0.63,1.3,3.4,4.6,347.8,0.022,0.55,2022,1],["SVK","Slovak Republic","ECS","HIC",5.42,0,0,0,0,0.057,0.89,2004,6],["SVN","Slovenia","ECS","HIC",2.13,0,0,0,0,0.258,4.7,2023,7],["SWE","Sweden","ECS","HIC",10.57,0,0,0,0,0.03,0.71,2005,3],["SWZ","Eswatini","SSF","LMC",1.24,43.3,5.1,48.4,1430.6,0.0,0.0,2000,1],["SYR","Syrian Arab Republic","MEA","LIC",24.67,22935.9,129.8,23065.7,32410.5,0.0,0.0,null,0],["TCD","Chad","SSF","LIC",20.3,2644.4,117.8,2762.2,10774.2,0.081,1.91,2024,3],["TGO","Togo","SSF","LMC",8.41,27.3,56.3,83.6,4856.7,0.0,0,null,0],["THA","Thailand","EAS","UMC",71.67,431.4,14.3,445.7,4336.4,0.551,10.59,2011,22],["TJK","Tajikistan","ECS","LMC",10.59,87.3,89.2,176.4,5807.0,1.348,16.27,2008,14],["TKM","Turkmenistan","ECS","UMC",7.49,6.6,2.1,8.7,384.9,0.0,0.0,null,0],["TLS","Timor-Leste","EAS","LMC",1.4,32.4,47.8,80.3,2546.6,0.047,0.92,2020,2],["TTO","Trinidad and Tobago","LCN","HIC",1.37,0,0,0,0,0.001,0.02,2018,2],["TUN","Tunisia","MEA","LMC",12.28,106.9,12.8,119.7,16072.2,0.003,0.08,2018,1],["TUR","Turkiye","ECS","UMC",85.52,6881.8,684.7,7566.5,35880.0,0.149,2.98,2023,12],["TZA","Tanzania","SSF","LMC",68.56,761.2,233.5,994.6,31084.4,0.046,0.92,2016,3],["UGA","Uganda","SSF","LIC",50.02,2497.8,121.8,2619.6,25646.9,0.001,0.01,2013,3],["UKR","Ukraine","ECS","UMC",37.86,10474.1,222.2,10696.3,120519.2,0.101,0.93,2012,10],["URY","Uruguay","LCN","HIC",3.39,0.8,0.2,1.0,146.2,0.075,0.69,2000,10],["USA","United States","NAC","HIC",340.0,0,0,0,0,0.324,1.22,2005,25],["UZB","Uzbekistan","ECS","LMC",36.36,77.2,8.3,85.4,13376.1,0.016,0.27,2001,2],["VEN","Venezuela, RB","LCN","LMC",28.41,1207.3,36.1,1243.5,2430.1,0.007,0.07,2020,6],["VNM","Viet Nam","EAS","UMC",100.99,184.9,287.7,472.6,27918.1,0.579,2.43,2016,24],["XKX","Kosovo","ECS","UMC",1.59,0,0,0,0,0.0,0,null,0],["YEM","Yemen, Rep.","MEA","LIC",40.58,18845.9,245.4,19091.3,41557.6,0.078,1.49,2008,2],["ZAF","South Africa","SSF","UMC",64.01,110.7,22.9,133.6,16000.9,0.087,0.9,2022,16],["ZMB","Zambia","SSF","LMC",21.31,136.2,117.6,253.9,14878.4,0.0,0.01,2024,1],["ZWE","Zimbabwe","SSF","LMC",16.63,1162.6,70.0,1232.6,9456.8,0.353,3.49,2003,10]],"g":{"ys":[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],"agg":{"15220":[2.048,1.771,1.654,1.827,1.81,2.027,2.276,2.734,3.179,3.005,2.915,3.052,2.947,2.789,2.637],"700":[13.662,14.269,12.68,15.347,19.167,20.993,23.16,24.888,25.707,27.069,27.478,31.412,33.743,36.942,32.18],"740":[0.527,0.747,0.881,1.067,1.025,1.467,1.579,1.602,1.486,1.797,1.781,1.845,2.273,2.833,4.037],"730":[1.157,1.312,0.729,0.625,1.143,1.174,1.307,1.548,1.818,1.298,0.922,0.887,0.891,1.838,1.058],"720":[11.978,12.21,11.07,13.655,16.998,18.351,20.274,21.739,22.403,23.974,24.776,28.679,30.579,32.271,27.084],"1000":[161.53,162.993,159.766,176.1,176.728,194.366,208.639,213.582,210.295,208.483,237.902,237.203,290.916,290.536,281.79],"230":[7.362,8.014,8.836,9.011,10.135,11.018,10.924,12.304,12.386,12.588,11.423,10.963,13.752,12.826,13.474],"140":[6.284,6.273,6.41,6.507,7.378,7.692,8.125,7.654,8.417,7.994,7.019,6.877,7.42,6.984,8.065],"120":[10.273,10.057,10.661,12.837,12.209,13.704,14.253,16.149,14.681,15.97,20.908,26.541,28.821,18.704,17.286],"12250":[1.22,1.317,1.069,1.483,1.453,2.738,2.447,2.917,2.281,2.535,3.438,2.154,4.031,3.795,4.033],"152":[4.016,3.788,3.23,3.315,3.389,3.65,4.141,4.599,5.195,4.883,4.644,5.119,4.53,4.436,4.406],"160":[5.34,5.005,4.826,5.164,4.943,5.14,5.656,5.884,5.256,6.17,10.333,9.036,8.755,8.705,9.337],"311":[7.401,6.756,6.458,7.235,7.942,8.41,9.021,9.046,8.404,8.747,9.511,8.11,8.889,9.056,8.503],"410":[5.895,4.574,4.916,5.384,5.441,5.616,5.924,5.463,5.074,5.08,5.224,5.499,5.001,6.252,7.378],"520":[1.897,1.871,1.822,1.446,1.337,1.818,1.863,1.844,2.286,1.791,1.726,2.003,1.886,1.171,1.033]},"agg_all":{"720":[11.978,12.21,11.07,13.655,16.998,21.178,26.493,30.119,32.021,34.156,35.228,38.273,37.747,39.252,33.135],"730":[1.157,1.312,0.729,0.625,1.143,1.174,1.307,1.548,1.818,1.298,0.999,0.891,0.892,1.838,1.077],"740":[0.527,0.747,0.881,1.067,1.025,1.467,1.579,1.602,1.486,1.797,1.781,1.846,2.273,2.834,4.038],"700":[13.662,14.269,12.68,15.347,19.167,23.82,29.379,33.268,35.326,37.251,38.008,41.01,40.912,43.924,38.25],"1000":[161.53,162.993,159.766,176.1,176.728,198.595,215.729,223.255,221.329,219.868,249.535,247.993,300.346,298.391,289.092]},"wd":{"1980":32.4,"1981":12.1,"1982":15.0,"1983":18.0,"1984":9.6,"1985":18.0,"1986":14.2,"1987":15.1,"1988":28.3,"1989":29.0,"1990":44.4,"1991":41.0,"1992":53.6,"1993":53.9,"1994":72.8,"1995":156.3,"1996":46.3,"1997":40.7,"1998":86.9,"1999":108.8,"2000":47.0,"2001":29.0,"2002":52.2,"2003":71.5,"2004":134.9,"2005":216.2,"2006":34.5,"2007":74.0,"2008":191.3,"2009":44.5,"2010":126.7,"2011":371.2,"2012":160.6,"2013":119.4,"2014":96.2,"2015":78.2,"2016":159.4,"2017":327.3,"2018":133.9,"2019":100.2,"2020":177.7,"2021":255.8,"2022":226.0,"2023":207.9,"2024":278.0,"2025":172.2},"dom":["airdis","climate","poverty","food","water","energy","infra","pandemic","eco","conflict"],"ev":[{"id":"air","name":"Clean-air regulation (US Clean Air Act Amendments)","bcr":30,"lo":3,"hi":90,"rng":"pub","set":"HIC","lag":2,"per":0.5,"w":[0.85,0,0,0.05,0,0,0,0,0.1,0],"src":"US EPA (2011)","url":"https://www.epa.gov/clean-air-act-overview/benefits-and-costs-clean-air-act-1990-2020-second-prospective-study","note":"Central, low and high estimates for 2020; 85% of benefits from avoided PM2.5 deaths."},{"id":"adapt","name":"Climate adaptation portfolio (warnings, resilient infrastructure, dryland agriculture, mangroves, water)","bcr":4.9,"lo":2,"hi":10,"rng":"pub","set":"Global","lag":3,"per":0.7,"w":[0,0.4,0,0.15,0.15,0,0.2,0,0.1,0],"src":"Global Commission on Adaptation (2019)","url":"https://www.wri.org/news/2019/09/global-leaders-call-urgent-action-climate-adaptation-commission-finds-adaptation-can","note":"$1.8 tn invested 2020-30 yields $7.1 tn net benefits (BCR about 4.9); range 2:1 to 10:1."},{"id":"ews","name":"Early warning systems in developing countries","bcr":9,"lo":4,"hi":20,"rng":"pub","set":"LMIC","lag":1,"per":0.3,"w":[0,0.5,0,0.1,0,0,0.2,0,0,0.2],"src":"GCA (2019); WMO","url":"https://wmo.int/node/25794","note":"Derived: $0.8 bn of systems avoid $3-16 bn of losses a year; 24 hours of warning cuts damage by 30%."},{"id":"codes","name":"Modern building codes (US, 2018 I-Codes)","bcr":11,"lo":6,"hi":12,"rng":"pub","set":"HIC","lag":5,"per":0.9,"w":[0,0.4,0,0,0,0,0.6,0,0,0],"src":"NIBS, Natural Hazard Mitigation Saves (2019)","url":"https://nibs.org/projects/natural-hazard-mitigation-saves-2019-report","note":"National $11 per $1; interim hazard range 6 (flood) to 12 (earthquake)."},{"id":"grants","name":"Federal hazard mitigation grants (US)","bcr":6,"lo":3,"hi":8,"rng":"assumed","set":"HIC","lag":3,"per":0.8,"w":[0,0.5,0,0,0,0,0.5,0,0,0],"src":"NIBS (2019)","url":"https://nibs.org/projects/natural-hazard-mitigation-saves-2019-report","note":"$6 per $1 nationally; about $3 for earthquake and $5 for wind grants; upper bound assumed."},{"id":"lifelines","name":"Resilient new infrastructure in low- and middle-income countries","bcr":4,"lo":2,"hi":8,"rng":"assumed","set":"LMIC","lag":5,"per":0.9,"w":[0,0.15,0,0,0.15,0.2,0.5,0,0,0],"src":"World Bank, Lifelines (2019)","url":"https://sdg.iisd.org/news/world-bank-report-illustrates-benefits-of-resilient-infrastructure/","note":"$4 per $1; net benefit $4.2 tn (median of 3,000 scenarios). Disruptions cost households and firms at least $390 bn a year."},{"id":"san","name":"Universal sanitation","bcr":5.5,"lo":2.75,"hi":11,"rng":"assumed","set":"LMIC","lag":2,"per":0.6,"w":[0.1,0,0.2,0,0.4,0,0,0.3,0,0],"src":"Hutton, WHO (2012)","url":"https://www.who.int/publications/i/item/WHO-HSE-WSH-12.01","note":"Global BCR 5.5 (health and time savings)."},{"id":"water","name":"Universal drinking-water supply","bcr":2.0,"lo":1,"hi":4,"rng":"assumed","set":"LMIC","lag":2,"per":0.6,"w":[0,0,0.25,0,0.6,0,0,0.15,0,0],"src":"Hutton, WHO (2012)","url":"https://www.who.int/publications/i/item/WHO-HSE-WSH-12.01","note":"Global BCR 2.0; water and sanitation combined 4.3."},{"id":"vacc","name":"Childhood immunization, 94 low- and middle-income countries","bcr":16,"lo":10,"hi":25,"rng":"pub","set":"LMIC","lag":1,"per":0.5,"w":[0.1,0,0.2,0,0,0,0,0.7,0,0],"src":"Ozawa et al., Health Affairs (2016)","url":"https://doi.org/10.1377/hlthaff.2015.1086","note":"Cost-of-illness return 16 (10-25); full-income return 44 (27-67)."},{"id":"tb","name":"Tuberculosis: Global Plan scale-up","bcr":46,"lo":23,"hi":92,"rng":"assumed","set":"LMIC","lag":2,"per":0.5,"w":[0,0,0.3,0,0,0,0,0.7,0,0],"src":"Copenhagen Consensus / JBCA (2023)","url":"https://www.cambridge.org/core/product/A74F0D10F1017092A250EB604ED39B1B/core-reader","note":"Central BCR 46."},{"id":"malaria","name":"Malaria: insecticide-treated net scale-up","bcr":48,"lo":24,"hi":96,"rng":"assumed","set":"LMIC","lag":1,"per":0.4,"w":[0,0.1,0.3,0,0,0,0,0.6,0,0],"src":"Copenhagen Consensus (2023)","url":"https://copenhagenconsensus.com/investments-digitisation-malaria-maternal-health-and-tb-are-highly-cost-effective-top-economists","note":"Central BCR 48."},{"id":"mnh","name":"Maternal and newborn health","bcr":87,"lo":43,"hi":174,"rng":"assumed","set":"LMIC","lag":1,"per":0.6,"w":[0.6,0,0.4,0,0,0,0,0,0,0],"src":"Copenhagen Consensus (2023)","url":"https://www.exemplars.health/stories/bjorn-lomborg-argues-for-the-boring-stuff","note":"Central BCR 87."},{"id":"nutr","name":"Child nutrition to reduce stunting, 17 high-burden countries","bcr":18,"lo":3.6,"hi":48,"rng":"pub","set":"LMIC","lag":10,"per":0.9,"w":[0.2,0,0.5,0.3,0,0,0,0,0,0],"src":"Hoddinott et al., Maternal & Child Nutrition (2013)","url":"https://www.ifpri.org/blog/nutrition-spending-biggest-bang-your-development-buck/","note":"Median 18 (Bangladesh); range 3.6 (DRC) to 48 (Indonesia)."},{"id":"agrd","name":"Agricultural research and development in the Global South","bcr":33,"lo":16,"hi":66,"rng":"assumed","set":"LMIC","lag":8,"per":0.9,"w":[0,0.1,0.25,0.6,0,0,0,0,0.05,0],"src":"Rosegrant et al., JBCA (2023)","url":"https://www.cambridge.org/core/product/5E4F7A33E8DBCD5326D3C164AB51F84C/core-reader","note":"Central BCR 33; $61 bn present cost, $2.1 tn present benefit at 8%."},{"id":"pand","name":"Primary pandemic prevention (surveillance, wildlife trade, deforestation)","bcr":7,"lo":2.8,"hi":14,"rng":"assumed","set":"Global","lag":3,"per":0.6,"w":[0,0.15,0,0,0,0,0,0.6,0.25,0],"src":"Bernstein et al., Science Advances (2022)","url":"https://doi.org/10.1126/sciadv.abl4183","note":"Derived: ~$20 bn a year against $562 bn of annual losses ($350 bn lives, $212 bn economic); BCR = 28 × share of losses prevented, assumed 25% (10-50%)."},{"id":"drought","name":"Drought resilience and early response (Ethiopia, Kenya, Somalia)","bcr":2.8,"lo":2.3,"hi":3.3,"rng":"pub","set":"LMIC","lag":1,"per":0.5,"w":[0,0.1,0.25,0.35,0,0,0,0,0,0.3],"src":"USAID, Economics of Resilience to Drought (2018)","url":"https://www.preventionweb.net/publication/economics-resilience-drought-ethiopia-kenya-and-somalia","note":"$2.3-3.3 per $1 over 15 years; earlier response cuts humanitarian costs ~30%."},{"id":"peace","name":"Peacebuilding in 31 conflict-affected countries","bcr":16,"lo":5,"hi":30,"rng":"assumed","set":"LMIC","lag":5,"per":0.7,"w":[0,0,0.2,0.1,0,0,0,0,0,0.7],"src":"Institute for Economics and Peace (2017)","url":"https://www.visionofhumanity.org/measuring-peacebuilding-cost-effectiveness/","note":"Modelled average 1:16; strong assumptions."}]}};
  var GL = D.g, EV = GL.ev, DOM = GL.dom;
  var C = D.c.map(function (r) { var o = {}; D.k.forEach(function (k, i) { o[k] = r[i]; }); return o; });
  var BY = {}; C.forEach(function (c) { BY[c.iso] = c; });

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { if (h.indexOf('rgb') === 0) return h.match(/\d+/g).slice(0, 3).map(Number); h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mix(h1, h2, t) { var a = rgb(h1), b = rgb(h2); t = Math.max(0, Math.min(1, t)); return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }).join(',') + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function fmt(v, d) { if (v === null || v === undefined || isNaN(v)) return '—'; return v.toLocaleString('en-US', { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }).replace('-', '−'); }
  function nn(v, d, u) { return v === null || v === undefined ? '—' : fmt(v, d) + (u || ''); }
  function bcrf(v) { return v >= 10 ? fmt(v, 0) : fmt(v, 1); }
  function shortName(n) { return n.replace(', Dem. Rep.', ' (DRC)').replace(', Rep.', '').replace(', Arab Rep.', '').replace(', Islamic Rep.', '').replace('Syrian Arab Republic', 'Syria').replace('Russian Federation', 'Russia').replace(', RB', '').replace('Lao PDR', 'Laos').replace(', Fed. Rep.', '').replace('West Bank and Gaza', 'Palestine').replace('Central African Republic', 'CAR').replace("Korea, Dem. People's Rep.", 'North Korea').replace('Kyrgyz Republic', 'Kyrgyzstan').replace('Turkiye', 'Türkiye').replace('Egypt, Arab Rep.', 'Egypt').replace('Gambia, The', 'The Gambia'); }
  var _sn = shortName; shortName = function (n) { return _sn(n.replace("Korea, Dem. People's Rep.", 'North Korea').replace('Korea, Rep.', 'South Korea').replace('Bosnia and Herzegovina', 'Bosnia & Herz.')); };
  function segs(attr, fn) { Array.prototype.forEach.call(document.querySelectorAll('[' + attr + ']'), function (b, _, all) { b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false'); b.addEventListener('click', function () { Array.prototype.forEach.call(all, function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); }); fn(b.getAttribute(attr)); }); }); }

  var PREV = tok('--v-prev'), CRI = tok('--v-crisis'), REC = tok('--v-recon'), GOLD = tok('--v-gold'), VINK = tok('--v-ink'), BLUE = tok('--v-blue'), GREY = tok('--v-grey');
  var DC = {}; DOM.forEach(function (d) { DC[d] = tok('--d-' + d); });
  var DN = { airdis: 'Air pollution & preventable disease', climate: 'Climate & environmental degradation', poverty: 'Poverty & vulnerability', food: 'Food insecurity', water: 'Water scarcity & contamination', energy: 'Energy insecurity', infra: 'Infrastructure deterioration', pandemic: 'Infectious disease & pandemics', eco: 'Ecosystem degradation', conflict: 'Conflict & humanitarian emergencies' };
  var SETC = { HIC: BLUE, LMIC: GOLD, Global: PREV }, SETN = { HIC: 'High-income setting', LMIC: 'Low- and middle-income setting', Global: 'Global' };
  var GC = { LIC: tok('--g-lic'), LMC: tok('--g-lmc'), UMC: tok('--g-umc'), HIC: tok('--g-hic') };
  var IGN = { LIC: 'Low income', LMC: 'Lower-middle income', UMC: 'Upper-middle income', HIC: 'High income' };
  var INK = tok('--text'), MUTED = tok('--text-muted'), PAPER = tok('--bg-accent'), NONE = tok('--map-none');
  var narrow = window.innerWidth < 640;
  EV.forEach(function (e) { e.lead = Math.max.apply(null, e.w); e.leadDom = DOM[e.w.indexOf(e.lead)]; });

  /* --- evidence table ---------------------------------------------------------------------------- */
  var et = document.getElementById('ev-table');
  if (et) {
    var S = EV.slice().sort(function (a, b) { return b.bcr - a.bcr; });
    et.innerHTML = '<thead><tr><th>Intervention</th><th>Setting</th><th class="n">BCR</th><th class="n">Range</th><th class="n">Lag</th><th class="n">Persists</th><th>Benefits by domain</th><th>Source and note</th></tr></thead><tbody>' + S.map(function (e) {
      return '<tr><td>' + e.name + '</td><td><span class="tagchip" style="--k:' + SETC[e.set] + '">' + (e.set === 'LMIC' ? 'LMIC' : e.set) + '</span></td><td class="n"><b>' + bcrf(e.bcr) + '</b></td><td class="n">' + bcrf(e.lo) + '–' + bcrf(e.hi) + ' <span class="flag">' + (e.rng === 'pub' ? 'pub' : 'assumed') + '</span></td><td class="n">' + e.lag + ' yr</td><td class="n">' + fmt(100 * e.per, 0) + '%</td><td><span class="dombar">' + e.w.map(function (w, i) { return w > 0 ? '<i style="width:' + (100 * w) + '%;background:' + DC[DOM[i]] + '" title="' + DN[DOM[i]] + ' ' + fmt(100 * w, 0) + '%"></i>' : ''; }).join('') + '</span></td><td class="src"><a href="' + e.url + '" target="_blank" rel="noopener">' + e.src + '</a>. ' + e.note + '</td></tr>';
    }).join('') + '</tbody>';
  }

  /* --- portfolio engine ------------------------------------------------------------------------- */
  function ann(r, n) { r = r / 100; return r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r; }
  function hfac(e, r, H) { return (1 - e.per) + e.per * ann(r, H) / ann(5, 30); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function draw(e, u) {     // log-triangular between lo and hi with mode at the central estimate
    var a = Math.log(e.lo), b = Math.log(e.hi), c = Math.log(e.bcr), f = (c - a) / (b - a);
    var x = u < f ? a + Math.sqrt(u * (b - a) * (c - a)) : b - Math.sqrt((1 - u) * (b - a) * (b - c));
    return Math.exp(x);
  }
  function q(arr, p) { var s = arr.slice().sort(function (a, b) { return a - b; }); var i = (s.length - 1) * p, lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); }
  function runPF(sel, o) {
    var R = rng(20261030), N = 2000, port = [], per = sel.map(function () { return []; });
    for (var k = 0; k < N; k++) {
      var s = 0;
      sel.forEach(function (e, i) {
        var v = draw(e, R()) * o.cap * Math.pow(1 + o.r / 100, -o.delay) * hfac(e, o.r, o.H) * (o.silo ? e.lead : 1);
        per[i].push(v); s += v;
      });
      port.push(s / sel.length);
    }
    return { port: port, per: per };
  }
  window.HHpvc = { runPF: runPF, EV: EV, q: q };

  /* --- atlas ------------------------------------------------------------------------------------- */
  C.forEach(function (c) { c.ps = c.rsp + c.prv > 1 ? 100 * c.prv / (c.rsp + c.prv) : null; c.rpc = c.inc !== 'HIC' && c.rsp > 0 ? c.rsp / c.pop : (c.inc !== 'HIC' ? 0 : null); });
  var st = { layer: 'rpc', pick: 'BGD' };
  var svgA = document.querySelector('.atlas'), shapes = svgA ? svgA.querySelectorAll('[data-iso]') : [];
  function seq(t, col) { t = Math.max(0, Math.min(1, t)); return mix(PAPER, col, 0.1 + 0.9 * t); }
  function ramp(vals, f, unit, lab) { return vals.map(function (v, i) { return '<span><i style="background:' + f(v) + '"></i>' + lab[i] + '</span>'; }).join('') + '<span>' + unit + '</span>'; }
  var LAY = {
    rpc: { f: function (c) { return c.rpc === null ? null : seq(Math.log(1 + c.rpc) / Math.log(1 + 1500), CRI); }, leg: function () { return ramp([0, 10, 50, 200, 1500], function (v) { return seq(Math.log(1 + v) / Math.log(1501), CRI); }, 'response and reconstruction aid per person, 2015–2024, US$', ['0', '10', '50', '200', '1,500+']); } },
    ps: { f: function (c) { return c.ps === null || c.inc === 'HIC' ? null : seq(c.ps / 40, PREV); }, leg: function () { return ramp([0, 5, 10, 20, 40], function (v) { return seq(v / 40, PREV); }, 'prevention share of disaster-related aid, %', ['0', '5', '10', '20', '40+']); } },
    dmg: { f: function (c) { return c.dmgn ? seq(Math.sqrt(c.dmg / 2), GOLD) : null; }, leg: function () { return ramp([0, 0.05, 0.2, 0.8, 2], function (v) { return seq(Math.sqrt(v / 2), GOLD); }, 'recorded disaster damages, average % of GDP a year, 2000–2024', ['0', '0.05', '0.2', '0.8', '2+']); } },
    dmax: { f: function (c) { return c.dmgn ? seq(Math.sqrt(c.dmgmax / 20), REC) : null; }, leg: function () { return ramp([0, 1, 5, 10, 20], function (v) { return seq(Math.sqrt(v / 20), REC); }, 'damages in the worst year, % of GDP', ['0', '1', '5', '10', '20+']); } }
  };
  function paint() {
    var L = LAY[st.layer];
    Array.prototype.forEach.call(shapes, function (p) { var c = BY[p.getAttribute('data-iso')]; var col = c ? L.f(c) : null; p.style.fill = col || NONE; p.classList.toggle('is-in', !!c); p.classList.toggle('is-pick', !!c && c.iso === st.pick); });
    var el = document.getElementById('atlas-legend'); if (el) el.innerHTML = L.leg();
  }
  function card(c) {
    if (!c) return;
    setText('cc-name', shortName(c.name));
    var cl = document.getElementById('cc-class'); if (cl) cl.innerHTML = '<span class="tagchip" style="--k:' + GC[c.inc] + '">' + IGN[c.inc] + '</span>';
    var el = document.getElementById('country-card'); if (el) el.style.setProperty('--cc', c.ps !== null && c.ps >= 10 ? PREV : CRI);
    var tot = c.rsp + c.prv, b = document.getElementById('cc-bar');
    if (b) b.innerHTML = tot > 0 ? '<i style="width:' + (100 * c.rsp / tot) + '%;background:' + CRI + '" title="response"></i><i style="width:' + (100 * c.prv / tot) + '%;background:' + PREV + '" title="prevention"></i>' : '';
    setText('cc-bar-lab', tot > 0 ? 'Disaster-related aid 2015–24: response ' + fmt(100 * c.rsp / tot, 0) + '% · prevention ' + fmt(100 * c.prv / tot, 1) + '%' : (c.inc === 'HIC' ? 'High income: not an aid recipient' : 'No disaster-related aid recorded'));
    var rows = [
      ['Response + reconstruction aid', c.inc === 'HIC' ? '—' : '$' + fmt(c.rsp, 0) + ' m'],
      ['Prevention and preparedness aid', c.inc === 'HIC' ? '—' : '$' + fmt(c.prv, 0) + ' m'],
      ['Response per $1 of prevention', c.prv > 0 ? '$' + fmt(c.rsp / c.prv, 1) : '—'],
      ['Response aid per person', c.rpc === null ? '—' : '$' + fmt(c.rpc, 0)],
      ['All aid received, 2015–24', c.oda ? '$' + fmt(c.oda / 1000, 1) + ' bn' : '—'],
      ['Disaster damages, average', c.dmgn ? fmt(c.dmg, 2) + '% of GDP' : '—'],
      ['Worst year', c.dmgn && c.dmgyr ? fmt(c.dmgmax, 1) + '% of GDP (' + c.dmgyr + ')' : '—'],
      ['Years with recorded damage', c.dmgn + ' of 25']
    ];
    var dl = document.getElementById('cc-kv'); if (dl) dl.innerHTML = rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
  }
  function pick(iso) { st.pick = iso; paint(); card(BY[iso]); }
  if (svgA) {
    svgA.addEventListener('mouseover', function (e) { var t = e.target.closest('[data-iso]'); if (t && BY[t.getAttribute('data-iso')]) card(BY[t.getAttribute('data-iso')]); });
    svgA.addEventListener('mouseleave', function () { card(BY[st.pick]); });
    svgA.addEventListener('click', function (e) { var t = e.target.closest('[data-iso]'); if (t && BY[t.getAttribute('data-iso')]) pick(t.getAttribute('data-iso')); });
  }
  segs('data-layer', function (v) { st.layer = v; paint(); });
  var tb = { key: 'rsp', dir: -1, q: '', f: 'dev' }, body = document.getElementById('tb-body');
  function val(c, k) { return k === 'name' ? shortName(c.name) : c[k]; }
  function keep(c) { return tb.f === 'all' || (tb.f === 'dev' && c.inc !== 'HIC') || (tb.f === 'LIC' && c.inc === 'LIC'); }
  function table() {
    if (!body) return;
    var rows = C.filter(function (c) { return keep(c) && (!tb.q || shortName(c.name).toLowerCase().indexOf(tb.q) >= 0); }).sort(function (a, b) {
      var x = val(a, tb.key), y = val(b, tb.key);
      if (typeof x === 'string') return tb.dir * x.localeCompare(y);
      if (x === null) return 1; if (y === null) return -1; return tb.dir * (x - y);
    });
    body.innerHTML = rows.map(function (c) {
      return '<tr data-iso="' + c.iso + '"><td><b style="color:' + GC[c.inc] + '">●</b> ' + shortName(c.name) + '</td><td class="n">' + (c.inc === 'HIC' ? '—' : fmt(c.rsp, 0)) + '</td><td class="n">' + (c.inc === 'HIC' ? '—' : fmt(c.prv, 0)) + '</td><td class="n">' + nn(c.ps, 1, '%') + '</td><td class="n">' + (c.rpc === null ? '—' : '$' + fmt(c.rpc, 0)) + '</td><td class="n">' + (c.dmgn ? fmt(c.dmg, 2) + '%' : '—') + '</td><td class="n">' + (c.dmgn ? fmt(c.dmgmax, 1) + '%' : '—') + '</td></tr>';
    }).join('');
  }
  Array.prototype.forEach.call(document.querySelectorAll('#tb-table [data-sort]'), function (b, _, all) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-sort');
      if (tb.key === k) tb.dir = -tb.dir; else { tb.key = k; tb.dir = k === 'name' ? 1 : -1; }
      Array.prototype.forEach.call(all, function (x) { x.removeAttribute('aria-sort'); });
      b.setAttribute('aria-sort', tb.dir > 0 ? 'ascending' : 'descending'); table();
    });
  });
  var qi = document.getElementById('tb-q'); if (qi) qi.addEventListener('input', function () { tb.q = qi.value.trim().toLowerCase(); table(); });
  segs('data-tf', function (v) { tb.f = v; table(); });
  if (body) body.addEventListener('click', function (e) { var t = e.target.closest('tr[data-iso]'); if (t) pick(t.getAttribute('data-iso')); });
  paint(); card(BY[st.pick]); table();

  /* --- charts --------------------------------------------------------------------------------- */
  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, tick = { color: MUTED, font: { size: 11 } };
    var legB = { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12 } };
    var A = GL.agg, YS = GL.ys;
    var logX = function (min, max, title) { return Object.assign(axis({ title: title }), { type: 'logarithmic', min: min, max: max, ticks: Object.assign({ callback: function (v) { return [0.5, 1, 2, 5, 10, 20, 50, 100, 200].indexOf(+v.toPrecision(3)) >= 0 ? v + ':1' : ''; } }, tick) }); };

    /* 2. reactive bias */
    HH.chart('chart-aid', {
      type: 'bar',
      data: { labels: YS, datasets: [
        { label: 'Emergency response', data: A['720'], backgroundColor: CRI, stack: 's', yAxisID: 'y', order: 2 },
        { label: 'Reconstruction relief', data: A['730'], backgroundColor: REC, stack: 's', yAxisID: 'y', order: 2 },
        { label: 'Prevention and preparedness', data: A['740'], backgroundColor: PREV, stack: 's', yAxisID: 'y', order: 2 },
        { type: 'line', label: 'Response per $1 of prevention', data: YS.map(function (y, i) { return +((A['720'][i] + A['730'][i]) / A['740'][i]).toFixed(1); }), borderColor: VINK, backgroundColor: VINK, borderWidth: 2, pointRadius: 2, tension: 0.2, yAxisID: 'y1', order: 1 }
      ] },
      options: { plugins: { legend: legB, tooltip: { mode: 'index', intersect: false, callbacks: { label: function (c) { return c.datasetIndex === 3 ? 'Response per $1 of prevention: $' + fmt(c.raw, 1) : c.dataset.label + ': $' + fmt(c.raw, 1) + ' bn'; } } } }, scales: { x: Object.assign(axis({ grid: false }), { stacked: true, ticks: Object.assign({ maxTicksLimit: 8 }, tick) }), y: Object.assign(axis({ title: 'US$ billion (2024)' }), { stacked: true, min: 0, ticks: tick }), y1: Object.assign(axis({ title: 'response per $1 of prevention', grid: false }), { position: 'right', min: 0, ticks: tick }) } }
    });
    var WD = GL.wd, WY = Object.keys(WD).filter(function (y) { return +y >= 2000; }).sort();
    HH.chart('chart-dmg', {
      type: 'bar',
      data: { labels: WY, datasets: [{ label: 'Recorded damages', data: WY.map(function (y) { return WD[y]; }), backgroundColor: WY.map(function (y) { return +y >= 2015 && +y <= 2024 ? CRI : alpha(CRI, 0.45); }), borderRadius: 1 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '$' + fmt(c.raw, 0) + ' bn'; } } } }, scales: { x: Object.assign(axis({ grid: false }), { ticks: Object.assign({ maxTicksLimit: 9 }, tick) }), y: Object.assign(axis({ title: 'US$ billion (current)' }), { min: 0, ticks: tick }) } }
    });

    /* 3. evidence range chart */
    var ES = EV.slice().sort(function (a, b) { return b.bcr - a.bcr; }), EL = ES.map(function (e) { return narrow ? e.name.split(' (')[0].split(':')[0].slice(0, 26) : e.name.split(' (')[0].slice(0, 54); });
    HH.chart('chart-ev', {
      type: 'bar',
      data: { labels: EL, datasets: [
        { label: 'Range', data: ES.map(function (e) { return [e.lo, e.hi]; }), backgroundColor: ES.map(function (e) { return alpha(SETC[e.set], e.rng === 'pub' ? 0.45 : 0.18); }), borderColor: ES.map(function (e) { return SETC[e.set]; }), borderWidth: ES.map(function (e) { return e.rng === 'pub' ? 0 : 1; }), borderSkipped: false, barPercentage: 0.55, order: 2 },
        { type: 'scatter', label: 'Central estimate', data: ES.map(function (e, i) { return { x: e.bcr, y: EL[i] }; }), backgroundColor: ES.map(function (e) { return SETC[e.set]; }), borderColor: INK, borderWidth: 1, pointRadius: 6, order: 1 }
      ] },
      options: { indexAxis: 'y', plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { var e = ES[c.dataIndex]; return e.name + ': ' + bcrf(e.bcr) + ':1 (' + bcrf(e.lo) + '–' + bcrf(e.hi) + ', ' + (e.rng === 'pub' ? 'published' : 'assumed') + ' range) · ' + SETN[e.set]; } } } }, scales: { x: logX(0.5, 200, 'benefit-cost ratio (log)'), y: Object.assign(axis({ grid: false }), { type: 'category', labels: EL, ticks: Object.assign({ autoSkip: false }, tick, { font: { size: 10.5 } }) }) } },
      plugins: [{ id: 'be', afterDatasetsDraw: function (ch) { var x = ch.scales.x, y = ch.scales.y, px = x.getPixelForValue(1), ctx = ch.ctx; ctx.save(); ctx.strokeStyle = CRI; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(px, y.top); ctx.lineTo(px, y.bottom); ctx.stroke(); ctx.restore(); } }]
    });

    /* 4. escalation */
    var DL = []; for (var d = 0; d <= 180; d += 2) DL.push(d);
    var esT = document.getElementById('es-t'), esD = document.getElementById('es-d');
    var cEsc = HH.chart('chart-esc', {
      type: 'line',
      data: { labels: DL, datasets: [[3, CRI], [14, REC], [60, GOLD], [180, PREV]].map(function (s) { return { label: 'Doubles every ' + s[0] + ' days', data: DL.map(function (x) { return Math.min(1e6, Math.pow(2, x / s[0])); }), borderColor: s[1], backgroundColor: s[1], borderWidth: 2.2, pointRadius: 0, tension: 0 }; }).concat([{ type: 'scatter', label: 'Your settings', data: [], backgroundColor: VINK, borderColor: '#fff', borderWidth: 1.5, pointRadius: 7 }]) },
      options: { plugins: { legend: legB, tooltip: { mode: 'index', intersect: false, callbacks: { title: function (it) { return 'Delay ' + it[0].label + ' days'; }, label: function (c) { var v = c.raw && c.raw.y !== undefined ? c.raw.y : c.raw; return c.dataset.label + ': ×' + fmt(v, v < 10 ? 1 : 0); } } } }, scales: { x: Object.assign(axis({ grid: false, title: 'delay before acting, days' }), { ticks: Object.assign({ autoSkip: false, maxRotation: 0, callback: function (v, i) { return DL[i] % 30 === 0 ? DL[i] : ''; } }, tick) }), y: Object.assign(axis({ title: 'cost relative to acting at once (log)' }), { type: 'logarithmic', min: 1, max: 1e6, ticks: Object.assign({ callback: function (v) { return [1, 10, 100, 1000, 10000, 100000, 1000000].indexOf(v) >= 0 ? '×' + fmt(v, 0) : ''; } }, tick) }) } }
    });
    function escCalc() {
      if (!esT) return;
      var T = +esT.value, dly = +esD.value, m = Math.pow(2, dly / T);
      setText('es-t-o', T + ' days'); setText('es-d-o', dly + ' days');
      if (cEsc) { var di = Math.round(dly / 2) * 2; cEsc.data.datasets[4].data = DL.map(function (x) { return x === di ? Math.min(1e6, Math.pow(2, x / T)) : null; }); cEsc.update('none'); }
      var out = document.getElementById('esc-out');
      if (out) out.innerHTML = [['×' + (m < 10 ? fmt(m, 1) : fmt(Math.min(m, 1e9), 0)), 'cost of acting after the delay, relative to acting at once', CRI], [fmt(dly / T, 1), 'doublings during the delay', REC], [fmt(100 * (1 - 1 / m), 0) + '%', 'of the eventual cost avoided by acting at once', PREV]].map(function (x) { return '<div style="--k:' + x[2] + '"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('');
      setText('esc-note', 'If cost is proportional to the size of a problem that doubles every ' + T + ' days, waiting ' + dly + ' days multiplies it by ' + (m < 10 ? fmt(m, 1) : fmt(Math.min(m, 1e9), 0)) + '. Real crises stop compounding eventually (an epidemic runs out of susceptible people, a drought breaks), so the multiplier is an upper bound on the arithmetic.');
    }
    [esT, esD].forEach(function (el) { if (el) el.addEventListener('input', escCalc); }); escCalc();

    /* 5. domains and silos */
    HH.chart('chart-dom', {
      type: 'bar',
      data: { labels: EL, datasets: DOM.map(function (d, j) { return { label: DN[d], data: ES.map(function (e) { return +(e.bcr * e.w[j]).toFixed(2); }), backgroundColor: DC[d] }; }) },
      options: { indexAxis: 'y', plugins: { legend: { position: 'bottom', labels: { font: { size: 9.5 }, boxWidth: 10 } }, tooltip: { callbacks: { label: function (c) { return c.raw > 0 ? c.dataset.label + ': ' + fmt(c.raw, 1) + ' of ' + bcrf(ES[c.dataIndex].bcr) : null; } }, filter: function (it) { return it.raw > 0; } } }, scales: { x: Object.assign(axis({ title: 'central BCR, divided by domain' }), { stacked: true, min: 0, ticks: tick }), y: Object.assign(axis({ grid: false }), { stacked: true, ticks: Object.assign({ autoSkip: false }, tick, { font: { size: 10.5 } }) }) } }
    });
    HH.chart('chart-silo', {
      type: 'bar',
      data: { labels: EL, datasets: [
        { label: 'Gap', data: ES.map(function (e) { return [e.bcr * e.lead, e.bcr]; }), backgroundColor: alpha(GREY, 0.35), barPercentage: 0.25, order: 3 },
        { type: 'scatter', label: 'Lead domain only', data: ES.map(function (e, i) { return { x: e.bcr * e.lead, y: EL[i] }; }), backgroundColor: CRI, pointRadius: 5, order: 1 },
        { type: 'scatter', label: 'All benefits', data: ES.map(function (e, i) { return { x: e.bcr, y: EL[i] }; }), backgroundColor: PREV, pointRadius: 5, order: 2 }
      ] },
      options: { indexAxis: 'y', plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10, filter: function (it) { return it.datasetIndex > 0; } } }, tooltip: { callbacks: { label: function (c) { var e = ES[c.dataIndex]; return 'All benefits ' + bcrf(e.bcr) + ':1 · lead domain (' + DN[e.leadDom] + ', ' + fmt(100 * e.lead, 0) + '%) ' + bcrf(e.bcr * e.lead) + ':1'; } } } }, scales: { x: logX(0.5, 200, 'benefit-cost ratio (log)'), y: Object.assign(axis({ grid: false }), { type: 'category', labels: EL, ticks: Object.assign({ autoSkip: false }, tick, { font: { size: 10.5 } }) }) } },
      plugins: [{ id: 'be2', afterDatasetsDraw: function (ch) { var x = ch.scales.x, y = ch.scales.y, px = x.getPixelForValue(1), ctx = ch.ctx; ctx.save(); ctx.strokeStyle = CRI; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(px, y.top); ctx.lineTo(px, y.bottom); ctx.stroke(); ctx.restore(); } }]
    });

    /* 6. setting and income */
    var SETS = ['HIC', 'LMIC', 'Global'], SL = ['High-income settings', 'Low- and middle-income settings', 'Global'];
    function med(a) { var s = a.slice().sort(function (x, y) { return x - y; }), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
    HH.chart('chart-set', {
      type: 'scatter',
      data: { datasets: SETS.map(function (s, j) { return { label: SL[j], data: EV.filter(function (e) { return e.set === s; }).map(function (e, k, arr) { return { x: j + (arr.length > 1 ? (k / (arr.length - 1) - 0.5) * 0.5 : 0), y: e.bcr, e: e }; }), backgroundColor: alpha(SETC[s], 0.8), borderColor: SETC[s], pointRadius: 6 }; }).concat(SETS.map(function (s, j) { var m = med(EV.filter(function (e) { return e.set === s; }).map(function (e) { return e.bcr; })); return { type: 'line', label: 'Median ' + SL[j] + ': ' + bcrf(m), data: [{ x: j - 0.35, y: m }, { x: j + 0.35, y: m }], borderColor: INK, borderWidth: 2.5, pointRadius: 0 }; })) },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.raw.e ? c.raw.e.name + ': ' + bcrf(c.raw.e.bcr) + ':1' : c.dataset.label; } } } }, scales: { x: Object.assign(axis({ grid: false }), { type: 'linear', min: -0.6, max: 2.6, ticks: Object.assign({ stepSize: 1, callback: function (v) { return SL[v] || ''; } }, tick) }), y: Object.assign(axis({ title: 'central benefit-cost ratio (log)' }), { type: 'logarithmic', min: 1, max: 120, ticks: Object.assign({ callback: function (v) { return [1, 2, 5, 10, 20, 50, 100].indexOf(v) >= 0 ? v + ':1' : ''; } }, tick) }) } }
    });
    var IG = ['LIC', 'LMC', 'UMC'];
    var IR = IG.map(function (g) { var S = C.filter(function (c) { return c.inc === g; }); return { r: S.reduce(function (a, c) { return a + c.rsp; }, 0) / 1000, p: S.reduce(function (a, c) { return a + c.prv; }, 0) / 1000 }; });
    HH.chart('chart-inc', {
      type: 'bar',
      data: { labels: IG.map(function (g) { return IGN[g]; }), datasets: [{ label: 'Response + reconstruction', data: IR.map(function (x) { return +x.r.toFixed(1); }), backgroundColor: CRI, borderRadius: 2 }, { label: 'Prevention + preparedness', data: IR.map(function (x) { return +x.p.toFixed(1); }), backgroundColor: PREV, borderRadius: 2 }] },
      options: { layout: { padding: { top: 22 } }, plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': $' + fmt(c.raw, 1) + ' bn'; } } } }, scales: { x: Object.assign(axis({ grid: false }), { ticks: tick }), y: Object.assign(axis({ title: 'US$ billion, 2015–2024' }), { min: 0, ticks: tick }) } },
      plugins: [{ id: 'ratio', afterDatasetsDraw: function (ch) { var ctx = ch.ctx, m = ch.getDatasetMeta(0); ctx.save(); ctx.font = '700 12px ' + tok('--mono'); ctx.fillStyle = INK; ctx.textAlign = 'center'; m.data.forEach(function (b, i) { ctx.fillText(fmt(IR[i].r / IR[i].p, 0) + ' : 1', b.x + 12, b.y - 8); }); ctx.restore(); } }]
    });

    /* 7. generations */
    var RRs = []; for (var r = 0.5; r <= 8.001; r += 0.25) RRs.push(+r.toFixed(2));
    HH.chart('chart-gen', {
      type: 'line',
      data: { labels: RRs, datasets: [[30, GREY], [50, GOLD], [100, PREV], [200, VINK]].map(function (s) { return { label: s[0] + '-year horizon', data: RRs.map(function (r) { return +(0.1 + 0.9 * ann(r, s[0]) / ann(5, 30)).toFixed(3); }), borderColor: s[1], backgroundColor: s[1], borderWidth: 2.4, pointRadius: 0, tension: 0.2 }; }) },
      options: { plugins: { legend: legB, tooltip: { mode: 'index', intersect: false, callbacks: { title: function (it) { return 'Discount rate ' + it[0].label + '%'; }, label: function (c) { return c.dataset.label + ': ×' + fmt(c.raw, 2); } } } }, scales: { x: Object.assign(axis({ grid: false, title: 'discount rate, %' }), { ticks: Object.assign({ autoSkip: false, maxRotation: 0, callback: function (v, i) { return RRs[i] % 1 === 0 ? RRs[i] + '%' : ''; } }, tick) }), y: Object.assign(axis({ title: 'value relative to 30 years at 5%' }), { min: 0, ticks: Object.assign({ callback: function (v) { return '×' + v; } }, tick) }) } },
      plugins: [{ id: 'one', afterDatasetsDraw: function (ch) { var x = ch.scales.x, y = ch.scales.y, py = y.getPixelForValue(1), ctx = ch.ctx; ctx.save(); ctx.strokeStyle = MUTED; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x.left, py); ctx.lineTo(x.right, py); ctx.stroke(); ctx.restore(); } }]
    });

    /* 8. portfolio */
    var pl = document.getElementById('pf-list');
    if (pl) pl.innerHTML = ES.map(function (e) { return '<label><input type="checkbox" data-ev="' + e.id + '" checked> ' + e.name.split(' (')[0].split(':')[0] + '</label>'; }).join('');
    var pfSilo = false;
    var cPf = HH.chart('chart-pf', {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Share of draws', data: [], backgroundColor: [], borderRadius: 1, barPercentage: 1, categoryPercentage: 1 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { title: function (it) { return 'Portfolio BCR ' + it[0].label; }, label: function (c) { return fmt(c.raw, 1) + '% of draws'; } } } }, scales: { x: Object.assign(axis({ grid: false, title: 'portfolio benefit-cost ratio (log bins)' }), { ticks: Object.assign({ autoSkip: true, maxTicksLimit: 8, maxRotation: 0 }, tick) }), y: Object.assign(axis({ title: '% of 2,000 draws' }), { min: 0, ticks: tick }) } }
    });
    var cPfi = HH.chart('chart-pfi', {
      type: 'bar',
      data: { labels: [], datasets: [{ label: '10th–90th percentile', data: [], backgroundColor: [], barPercentage: 0.55, order: 2 }, { type: 'scatter', label: 'Median', data: [], backgroundColor: VINK, pointRadius: 5, order: 1 }] },
      options: { indexAxis: 'y', plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { var v = c.raw; return Array.isArray(v) ? '10th–90th: ' + bcrf(v[0]) + '–' + bcrf(v[1]) : 'Median ' + bcrf(v.x); } } } }, scales: { x: logX(0.1, 300, 'adjusted benefit-cost ratio (log)'), y: Object.assign(axis({ grid: false }), { type: 'category', ticks: Object.assign({ autoSkip: false }, tick, { font: { size: 10 } }) }) } },
      plugins: [{ id: 'be3', afterDatasetsDraw: function (ch) { var x = ch.scales.x, y = ch.scales.y, px = x.getPixelForValue(1), ctx = ch.ctx; ctx.save(); ctx.strokeStyle = CRI; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(px, y.top); ctx.lineTo(px, y.bottom); ctx.stroke(); ctx.restore(); } }]
    });
    function g(id) { return +document.getElementById(id).value; }
    function pf() {
      var o = { cap: g('pf-k'), delay: g('pf-d'), r: g('pf-r'), H: g('pf-h'), silo: pfSilo }, bud = g('pf-b');
      setText('pf-b-o', '$' + bud + ' bn'); setText('pf-k-o', fmt(100 * o.cap, 0) + '%'); setText('pf-d-o', o.delay + ' yrs'); setText('pf-r-o', fmt(o.r, 1) + '%'); setText('pf-h-o', o.H + ' yrs');
      var ids = Array.prototype.filter.call(document.querySelectorAll('#pf-list input'), function (x) { return x.checked; }).map(function (x) { return x.getAttribute('data-ev'); });
      var sel = ES.filter(function (e) { return ids.indexOf(e.id) >= 0; });
      var out = document.getElementById('pf-out');
      if (!sel.length) { if (out) out.innerHTML = '<div><b>—</b><span>select at least one intervention</span></div>'; return; }
      var res = runPF(sel, o), P = res.port, m = q(P, 0.5), p10 = q(P, 0.1), p90 = q(P, 0.9), pr = P.filter(function (v) { return v > 1; }).length / P.length;
      var robust = res.per.filter(function (a) { return q(a, 0.1) > 1; }).length;
      if (out) out.innerHTML = [
        [bcrf(m) + ' : 1', 'median portfolio benefit-cost ratio', PREV],
        [bcrf(p10) + ' – ' + bcrf(p90), '10th to 90th percentile of the portfolio ratio', GOLD],
        [fmt(100 * pr, pr > 0.995 && pr < 1 ? 1 : 0) + '%', 'chance the portfolio returns more than it costs', BLUE],
        ['$' + fmt(bud * m, 0) + ' bn', 'present value of benefits from one year of spending (median)', PREV],
        ['$' + fmt(bud * (m - 1), 0) + ' bn', 'net benefit from one year of spending (median)', VINK],
        [robust + ' of ' + sel.length, 'interventions that beat break-even even at their 10th percentile', CRI]
      ].map(function (x) { return '<div style="--k:' + x[2] + '"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('');
      if (cPf) {
        var edges = []; for (var e = -1; e <= 2.5001; e += 0.04) edges.push(Math.pow(10, e));
        var cnt = edges.slice(0, -1).map(function () { return 0; });
        P.forEach(function (v) { for (var i = 0; i < edges.length - 1; i++) if (v >= edges[i] && v < edges[i + 1]) { cnt[i]++; break; } });
        var lo = cnt.findIndex(function (c) { return c > 0; }), hi = cnt.length - 1 - cnt.slice().reverse().findIndex(function (c) { return c > 0; });
        lo = Math.max(0, lo - 1); hi = Math.min(cnt.length - 1, hi + 1);
        cPf.data.labels = edges.slice(lo, hi + 1).map(function (v) { return bcrf(v); });
        cPf.data.datasets[0].data = cnt.slice(lo, hi + 1).map(function (c) { return +(100 * c / P.length).toFixed(1); });
        cPf.data.datasets[0].backgroundColor = edges.slice(lo, hi + 1).map(function (v) { return v < 1 ? CRI : PREV; });
        cPf.update();
      }
      if (cPfi) {
        var labs = sel.map(function (e) { return e.name.split(' (')[0].split(':')[0].slice(0, 30); });
        cPfi.data.labels = labs; cPfi.options.scales.y.labels = labs;
        cPfi.data.datasets[0].data = res.per.map(function (a) { return [q(a, 0.1), q(a, 0.9)]; });
        cPfi.data.datasets[0].backgroundColor = res.per.map(function (a) { return alpha(q(a, 0.1) > 1 ? PREV : GOLD, 0.55); });
        cPfi.data.datasets[1].data = res.per.map(function (a, i) { return { x: q(a, 0.5), y: labs[i] }; });
        cPfi.update();
      }
      setText('pf-note', 'Assumptions: ' + fmt(100 * o.cap, 0) + '% of published benefits delivered, ' + o.delay + ' extra years before benefits, ' + fmt(o.r, 1) + '% discount rate over ' + o.H + ' years, ' + (o.silo ? 'lead-domain accounting' : 'all benefits counted') + '. Draws are independent across interventions; diminishing returns at scale are not modelled, so large budgets overstate benefits.');
    }
    ['pf-b', 'pf-k', 'pf-d', 'pf-r', 'pf-h'].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener('input', pf); });
    if (pl) pl.addEventListener('change', pf);
    segs('data-pfa', function (v) { pfSilo = v === 'silo'; pf(); });
    pf();
  });
})();
