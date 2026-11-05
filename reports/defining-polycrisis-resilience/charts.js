/* ===========================================================================
   Charts and interactions — "Defining and Understanding Polycrisis
   Resilience" (hybrid dashboard)

   DATA (assembled in analyse.py and build.py): 160 countries with the fields
   named in D.k: for the 2009 financial crisis (g_) and the 2020 pandemic
   (c_) five resilience measures (res = growth shortfall in the shock year,
   rec = gap of log GDP per person to the pre-shock trend after three or four
   years, sta = minus the rise in inflation, ada = post-shock growth minus
   pre-shock growth, con = life expectancy against its pre-shock trend), all
   oriented so higher = more resilient; plus structural features (log income,
   trade openness, reserves, interest burden, government effectiveness).
   Percentile ranks, composites, correlations and the explorer are computed
   here.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var D = {"k":["iso","name","inc","reg","pop","gpc","g_res","g_rec","g_sta","g_ada","g_con","c_res","c_rec","c_sta","c_ada","c_con","lny","trade","reserves","intr","ge"],"c":[["AFG","Afghanistan","LIC","MEA",41.45,2927.0,12.96,12.17,null,1.29,0.41,-4.78,-36.49,-1.9,-2.21,-2.86,7.982,null,13.7,0.1,-1.97],["AGO","Angola","LMC","SSF",36.75,9713.0,-8.64,-24.27,24.95,-5.05,0.06,-4.64,2.53,4.69,3.82,-1.1,9.181,60.4,6.4,25.2,-0.79],["ALB","Albania","UMC","ECS",2.41,16761.0,-2.84,-11.68,-0.71,-3.29,-0.88,-6.44,1.61,-3.93,1.28,-3.18,9.727,75.4,5.9,7.4,0.36],["ARE","United Arab Emirates","HIC","MEA",10.48,72823.0,-10.98,-17.01,null,0.98,-0.93,-7.92,-2.25,-2.42,0.89,-3.77,11.196,163.8,null,3.0,1.13],["ARG","Argentina","UMC","LCN",45.54,26630.0,-14.56,-31.16,null,-3.72,0.54,-9.22,6.68,null,1.77,-3.02,10.19,32.6,5.9,8.5,0.19],["ARM","Armenia","UMC","ECS",2.96,16215.0,-27.23,-60.71,-2.25,-8.55,0.27,-12.27,-2.45,-3.67,3.0,-4.62,9.694,97.8,4.1,12.6,-0.31],["AUS","Australia","HIC","EAS",26.66,58049.0,-2.17,-5.07,-0.33,-0.79,-0.39,-2.26,0.82,-4.27,0.22,0.15,10.969,46.0,1.8,3.1,1.72],["AUT","Austria","HIC","ECS",9.13,64609.0,-5.92,-8.92,0.0,-0.64,-0.76,-7.92,-4.95,-6.31,-0.74,-1.06,11.076,108.2,1.1,3.1,1.5],["AZE","Azerbaijan","UMC","ECS",10.15,20101.0,-13.15,-85.09,-2.42,-19.76,0.43,-4.28,8.14,-5.38,3.76,-2.76,9.909,85.8,3.9,0.9,-0.04],["BDI","Burundi","LIC","SSF",13.69,1055.0,-0.4,5.44,-8.83,1.41,-0.62,-3.27,-4.89,-18.69,-0.2,-1.12,6.961,null,1.2,2.4,-1.14],["BEL","Belgium","HIC","ECS",11.78,60480.0,-4.75,-11.4,-0.2,-1.4,-0.84,-6.39,-0.62,-4.95,0.25,-0.71,11.01,165.5,0.7,4.5,1.28],["BEN","Benin","LMC","SSF",14.11,3281.0,-1.46,-1.92,-1.86,-0.48,-0.73,-0.79,4.93,-1.48,2.13,-0.66,8.096,63.7,null,null,-0.21],["BFA","Burkina Faso","LIC","SSF",23.03,2392.0,-3.0,-0.45,-4.6,1.04,0.15,-3.25,-7.33,-7.45,-1.97,-0.84,7.78,60.4,null,9.7,-0.88],["BGD","Bangladesh","LMC","SAS",171.47,6838.0,-0.65,0.49,0.07,0.5,-0.08,-3.59,-6.02,-3.18,-1.69,-2.56,8.83,31.6,5.9,20.8,-0.57],["BGR","Bulgaria","HIC","ECS",6.45,29150.0,-9.99,-26.19,-1.71,-5.16,0.4,-6.6,-5.15,-9.72,-1.04,-4.15,10.28,125.3,7.2,1.4,0.12],["BHR","Bahrain","HIC","MEA",1.58,56750.0,-3.11,7.69,-0.8,3.36,0.54,-5.79,-0.61,-0.36,1.83,-2.45,10.946,135.4,1.5,31.9,0.42],["BIH","Bosnia and Herzegovina","UMC","ECS",3.19,17029.0,-7.28,-17.68,null,-3.76,0.88,-6.48,-4.18,-9.13,-0.8,-2.99,9.743,94.5,7.3,2.4,-0.51],["BLR","Belarus","UMC","ECS",9.18,26799.0,-9.54,-24.26,0.56,-4.77,-1.04,-0.47,2.73,-4.6,1.67,-2.46,10.196,130.9,2.5,4.2,-0.8],["BOL","Bolivia","LMC","LCN",12.24,11931.0,-0.74,3.23,-3.45,0.74,-0.05,-15.83,-10.82,0.15,-1.64,-6.7,9.387,45.8,6.0,null,-0.55],["BRA","Brazil","UMC","LCN",211.14,18019.0,-3.91,-0.89,1.92,0.72,-0.34,-2.62,10.58,-3.32,4.04,-3.12,9.799,28.9,12.2,30.1,-0.19],["BWA","Botswana","UMC","SSF",2.48,18106.0,-19.21,-22.34,-1.69,0.27,-0.51,-11.32,-0.69,-5.26,-0.96,-5.84,9.804,83.1,8.4,3.4,0.51],["CAF","Central African Republic","LIC","SSF",5.15,1145.0,9.31,20.57,-3.87,4.01,-3.97,-3.46,-11.94,-1.46,-3.22,18.95,7.043,50.1,null,4.2,-1.62],["CAN","Canada","HIC","NAC",40.05,57584.0,-5.61,-7.43,0.86,-0.0,0.16,-6.72,-1.78,-3.4,-0.33,-0.87,10.961,66.2,1.4,8.4,1.74],["CHE","Switzerland","HIC","ECS",8.89,81695.0,-5.09,-9.16,-0.09,-1.1,-0.4,-3.88,0.77,-1.87,-0.14,-0.66,11.311,123.0,16.5,0.9,1.88],["CHL","Chile","HIC","LCN",19.66,28228.0,-6.75,-7.86,-1.59,0.4,-0.13,-7.5,2.66,-7.22,0.79,-1.61,10.248,57.6,4.7,5.2,1.01],["CHN","China","UMC","EAS",1410.71,18821.0,-2.2,-13.15,0.04,-2.38,-0.17,-4.05,-5.89,1.08,-1.56,-0.31,9.843,35.5,13.6,3.4,0.7],["CIV","Cote d'Ivoire","LMC","SSF",31.17,5895.0,3.04,14.24,-1.06,2.55,0.32,-5.55,-4.86,-4.18,-0.01,-0.98,8.682,44.7,null,18.0,-0.35],["CMR","Cameroon","LMC","SSF",28.37,4882.0,-2.05,-6.82,-2.41,-0.99,0.16,-3.69,-5.15,-5.43,-0.4,-1.55,8.493,43.4,4.4,6.8,-0.82],["COD","Congo, Dem. Rep.","LIC","SSF",105.79,1395.0,-5.79,-8.4,3.59,-1.04,-0.04,-2.48,10.91,null,4.48,-0.99,7.24,60.9,0.8,0.5,-1.72],["COG","Congo, Rep.","LMC","SSF",6.18,6939.0,8.06,24.76,-1.87,4.57,-0.51,-3.16,9.61,-2.4,4.74,1.29,8.845,91.6,1.8,9.0,-1.15],["COL","Colombia","UMC","LCN",52.32,17337.0,-4.08,-6.5,-0.02,-0.05,0.04,-9.53,1.9,-7.26,1.08,-4.46,9.761,37.6,7.7,13.9,-0.04],["CRI","Costa Rica","HIC","LCN",5.11,23497.0,-6.33,-8.93,0.64,-0.5,-0.41,-7.34,1.43,-2.42,1.77,-2.19,10.065,65.4,4.3,16.6,0.39],["CUB","Cuba","UMC","LCN",11.02,8125.0,-6.38,-25.61,null,-5.1,0.22,-12.66,-16.57,null,-1.89,-4.05,9.003,22.8,null,null,-0.4],["CYP","Cyprus","HIC","ECS",1.34,45454.0,-7.46,-25.41,0.23,-5.31,0.17,-9.23,-6.04,-5.23,-1.16,-0.88,10.724,150.5,0.2,2.8,0.8],["CZE","Czechia","HIC","ECS",10.86,47764.0,-10.43,-26.19,-1.66,-4.07,-0.47,-9.07,-14.57,-10.4,-3.4,-2.33,10.774,138.2,9.1,3.5,1.14],["DEU","Germany","HIC","ECS",83.29,62950.0,-7.02,-2.91,0.15,1.71,-0.41,-5.45,-4.65,-4.85,-1.22,-0.83,11.05,79.1,1.7,2.5,1.51],["DJI","Djibouti","LMC","MEA",1.15,5809.0,null,null,-3.49,null,0.39,-4.62,-5.84,-1.97,0.55,-1.33,8.667,320.9,1.2,null,-0.51],["DNK","Denmark","HIC","ECS",5.95,66759.0,-7.24,-13.78,-0.63,-1.21,0.12,-3.82,-3.71,-4.61,-0.93,-0.42,11.109,111.9,3.9,1.4,1.89],["DOM","Dominican Republic","UMC","LCN",11.33,21451.0,-4.34,-8.5,13.32,-0.6,0.76,-13.66,-10.91,-3.91,-1.58,-1.42,9.974,50.9,3.6,19.3,0.08],["DZA","Algeria","UMC","MEA",46.16,15199.0,-3.67,-10.69,-2.18,-1.56,-0.28,-6.78,-0.95,-5.36,2.09,-0.74,9.629,46.5,14.5,null,-0.21],["ECU","Ecuador","UMC","LCN",17.98,13870.0,-3.1,4.44,-3.1,1.9,0.52,-10.06,4.2,-2.69,1.31,-5.07,9.538,48.1,1.2,4.7,-0.15],["EGY","Egypt, Arab Rep.","LMC","MEA",114.54,15027.0,-0.34,-4.84,-7.52,-2.14,0.01,-0.85,-0.4,-6.2,-0.17,-2.78,9.618,41.1,5.8,33.3,-0.17],["ERI","Eritrea","LIC","SSF",3.47,null,3.63,null,null,null,-0.24,null,null,null,null,-1.06,null,null,null,null,-1.51],["ESP","Spain","HIC","ECS",48.35,46896.0,-6.26,-18.09,1.26,-3.07,-0.19,-13.95,-9.33,-4.52,0.53,-1.15,10.756,66.4,1.7,6.5,1.16],["EST","Estonia","HIC","ECS",1.37,42215.0,-23.33,-50.71,-1.24,-3.98,1.49,-6.48,-15.85,-11.23,-5.75,-2.23,10.651,140.4,0.7,1.4,1.32],["ETH","Ethiopia","LIC","SSF",128.69,2438.0,-0.16,5.61,-15.12,1.79,0.38,-2.79,-11.71,-18.61,-2.24,-1.49,7.799,28.8,1.8,12.6,-0.69],["FIN","Finland","HIC","ECS",5.58,56922.0,-11.79,-22.42,-0.88,-2.4,-0.06,-4.19,-7.76,-5.73,-2.07,-0.35,10.949,80.6,1.1,2.9,1.81],["FRA","France","HIC","ECS",68.37,53449.0,-4.8,-7.84,0.38,-0.43,-0.95,-8.95,-3.27,-3.72,0.22,-0.75,10.886,66.4,2.2,4.2,1.2],["GAB","Gabon","UMC","SSF",2.48,19491.0,-1.98,4.27,-1.58,3.95,0.23,-3.64,-2.08,-0.64,1.23,-0.77,9.878,73.4,null,18.9,-0.64],["GBR","United Kingdom","HIC","ECS",68.53,53374.0,-7.34,-14.11,-0.8,-1.25,0.2,-11.61,-5.56,-5.16,-0.39,-0.93,10.885,65.0,1.7,8.3,1.2],["GEO","Georgia","UMC","ECS",3.72,18187.0,-13.14,-29.56,0.77,-2.62,1.04,-11.03,2.97,-2.69,3.81,-2.99,9.808,117.8,3.2,5.5,0.31],["GHA","Ghana","LMC","SSF",33.79,6508.0,-0.49,17.07,-0.74,5.02,0.06,-4.47,-7.51,-25.57,-0.71,-0.81,8.781,76.8,2.9,21.6,0.09],["GIN","Guinea","LMC","SSF",14.41,3557.0,-4.23,2.98,null,2.16,-0.03,-2.61,-9.4,0.25,-2.26,-0.75,8.177,78.4,3.7,null,-0.91],["GMB","Gambia, The","LIC","SSF",2.7,2751.0,3.63,0.39,4.2,-1.89,-0.17,-4.0,-1.49,-7.02,1.02,-1.31,7.92,56.0,4.6,null,-0.44],["GNB","Guinea-Bissau","LIC","SSF",2.15,2442.0,-0.26,4.71,-2.95,1.16,0.12,-1.96,-1.53,-7.47,-0.0,-1.55,7.801,49.9,null,21.0,-1.47],["GNQ","Equatorial Guinea","UMC","SSF",1.85,18447.0,-15.5,-60.91,-0.74,-14.62,-0.06,2.93,22.45,-2.71,6.63,-0.68,9.823,94.9,null,4.2,-1.23],["GRC","Greece","HIC","ECS",10.41,33503.0,-8.55,-50.0,0.53,-11.98,0.5,-10.43,3.4,-5.89,2.37,-1.86,10.419,80.6,1.1,7.5,0.26],["GTM","Guatemala","UMC","LCN",18.12,11466.0,-3.4,-5.92,0.53,-0.59,-0.24,-4.89,0.97,-2.59,0.58,-4.14,9.347,45.5,7.4,12.5,-0.75],["HKG","Hong Kong SAR, China","HIC","EAS",7.54,65388.0,-8.66,-20.71,-2.06,-2.43,-0.18,-7.35,-6.1,0.27,-0.96,-0.07,11.088,353.7,6.3,null,1.38],["HND","Honduras","LMC","LCN",10.64,6264.0,-7.92,-14.37,-1.03,-1.61,-0.27,-12.44,-4.35,-3.66,0.15,-3.03,8.743,99.5,4.9,10.6,-0.58],["HRV","Croatia","HIC","ECS",3.86,35123.0,-11.51,-31.65,-1.58,-5.68,-0.05,-11.79,-0.95,-8.23,0.78,-2.27,10.467,101.4,7.1,4.2,0.74],["HTI","Haiti","LMC","LCN",11.64,3362.0,3.54,-2.23,8.48,-1.9,-16.75,-4.26,-12.49,-21.44,-3.45,-2.27,8.12,44.6,5.8,null,-2.03],["HUN","Hungary","HIC","ECS",9.59,37663.0,-10.3,-21.55,0.24,-2.81,0.42,-8.57,-11.05,-13.02,-2.88,-2.63,10.536,159.9,2.5,12.2,0.48],["IDN","Indonesia","UMC","EAS",281.19,12758.0,-0.79,1.34,1.25,0.69,-0.13,-6.86,-7.35,-0.59,0.33,-3.31,9.454,37.6,6.3,null,0.27],["IND","India","LMC","SAS",1438.07,7702.0,0.17,-8.66,-4.82,-1.24,0.07,-12.16,-7.75,-2.51,0.93,-4.17,8.949,39.9,8.3,34.0,0.51],["IRL","Ireland","HIC","ECS",5.31,96206.0,-8.89,-25.59,3.6,-2.34,-0.02,-2.49,-13.05,-6.47,-7.61,-1.07,11.474,257.7,0.1,2.3,1.61],["IRN","Iran, Islamic Rep.","UMC","MEA",90.61,14841.0,-4.17,-20.18,-5.08,-3.63,-1.04,4.1,15.69,-22.05,3.71,-3.58,9.605,48.6,null,null,-0.73],["IRQ","Iraq","UMC","MEA",45.07,14910.0,-3.72,3.95,18.37,1.88,3.97,-16.04,-20.46,-4.56,-2.01,-1.18,9.61,69.0,10.9,0.0,-1.13],["ISR","Israel","HIC","MEA",9.85,44492.0,-3.8,-5.31,-3.12,-0.05,0.46,-5.27,-0.11,-3.69,-0.84,-0.68,10.703,56.5,12.3,9.4,1.28],["ITA","Italy","HIC","ECS",58.98,49691.0,-6.39,-12.52,0.1,-1.19,-0.49,-9.62,1.37,-5.92,1.09,-1.33,10.814,58.7,3.3,9.4,0.84],["JAM","Jamaica","UMC","LCN",2.84,10816.0,-6.23,-15.19,-4.51,-2.03,0.71,-10.39,-2.14,-4.41,1.02,-2.11,9.289,null,4.8,22.4,0.19],["JOR","Jordan","UMC","MEA",11.44,10168.0,-0.44,-7.35,-2.72,-2.72,-0.23,-1.22,8.13,-0.31,3.04,-3.56,9.227,null,8.0,18.6,0.1],["JPN","Japan","HIC","EAS",124.52,46055.0,-7.56,-9.69,-0.06,0.34,-0.22,-5.03,-1.28,-2.24,0.03,-0.19,10.738,34.4,15.4,null,2.07],["KAZ","Kazakhstan","UMC","ECS",20.33,33298.0,-8.79,-27.03,-4.13,-3.74,1.01,-5.32,-1.71,-8.45,1.52,-4.34,10.413,64.9,4.5,9.0,0.07],["KEN","Kenya","LMC","SSF",55.34,5172.0,-2.04,-4.96,-6.54,0.77,-0.02,-4.77,-0.65,-1.69,0.49,-2.04,8.551,31.8,4.9,24.3,-0.19],["KGZ","Kyrgyz Republic","LMC","ECS",7.1,6088.0,-2.44,-10.76,-10.24,-3.77,1.68,-11.03,-0.29,-10.39,5.93,-0.17,8.714,94.4,4.5,2.6,-0.92],["KHM","Cambodia","LMC","EAS",17.42,6449.0,-6.8,-23.36,-6.15,-4.19,-0.64,-11.48,-22.33,-1.3,-2.48,-1.19,8.772,115.7,8.1,1.8,-0.4],["KOR","Korea, Rep.","HIC","EAS",51.71,49791.0,-3.99,-7.85,-0.79,-0.51,-0.43,-3.43,-2.21,-3.08,-0.48,-0.3,10.816,71.4,7.7,5.3,1.4],["KWT","Kuwait","HIC","MEA",4.85,51381.0,-18.0,-50.93,-4.62,-7.53,0.44,-0.87,4.89,-2.54,0.4,-4.53,10.847,91.7,8.2,null,0.16],["LAO","Lao PDR","LMC","EAS",7.66,8075.0,0.38,3.41,4.98,1.12,0.46,-5.94,-16.21,-25.03,-2.85,-0.72,8.997,null,1.5,11.8,-0.64],["LBN","Lebanon","LMC","MEA",5.77,15660.0,5.77,6.78,null,-0.81,-0.3,-20.76,-34.9,-191.81,-3.95,-4.52,9.659,63.0,17.7,5.4,-1.15],["LBR","Liberia","LIC","SSF",5.49,1576.0,6.49,38.23,-2.91,8.23,-2.62,-2.91,10.82,12.14,4.32,-1.06,7.362,null,2.6,null,-1.15],["LBY","Libya","UMC","MEA",7.31,14337.0,-12.58,-39.53,-5.22,8.98,-0.19,-34.14,-28.85,8.83,-3.6,-1.53,9.571,79.0,38.1,null,-1.5],["LKA","Sri Lanka","UMC","SAS",22.04,14637.0,-2.79,1.84,-2.74,2.03,1.07,-7.69,-21.63,-28.68,-3.66,-0.77,9.591,49.4,3.4,79.9,-0.24],["LSO","Lesotho","LMC","SSF",2.31,2773.0,-6.03,-4.47,8.91,0.41,3.33,-8.18,-2.5,-2.51,3.04,-2.75,7.928,140.5,4.0,3.5,-0.59],["LTU","Lithuania","HIC","ECS",2.87,43079.0,-23.93,-45.05,-5.26,-4.35,3.24,-4.79,-12.15,-11.49,-3.73,-3.23,10.671,148.4,1.4,1.9,1.06],["LVA","Latvia","HIC","ECS",1.88,35208.0,-26.12,-64.19,-2.97,-7.5,2.65,-6.58,-9.45,-10.37,-3.15,-2.86,10.469,125.3,2.4,2.7,0.79],["MAR","Morocco","LMC","MEA",37.71,8768.0,-1.28,-3.96,-0.55,-1.02,-0.05,-10.12,-6.28,-5.42,0.06,-1.54,9.079,76.0,5.6,8.1,0.18],["MDA","Moldova","UMC","ECS",2.46,14621.0,-12.01,-16.93,5.91,-1.96,0.62,-11.95,-9.86,-16.26,-3.16,-1.22,9.59,87.6,5.2,4.3,0.19],["MDG","Madagascar","LIC","SSF",31.2,1708.0,-9.87,-22.38,1.21,-4.23,-0.32,-10.55,-8.92,-1.41,0.64,-1.06,7.443,62.6,3.9,4.8,-0.84],["MEX","Mexico","UMC","LCN",129.74,21704.0,-9.0,-7.7,-1.05,1.19,-0.44,-9.7,-1.66,-1.85,1.27,-4.83,9.985,77.5,3.9,20.0,-0.19],["MKD","North Macedonia","UMC","ECS",1.83,21767.0,-4.75,-12.36,-2.52,-2.78,0.78,-7.02,-5.99,-10.59,-0.36,-3.96,9.988,138.6,4.2,5.9,0.12],["MLI","Mali","LIC","SSF",23.77,2916.0,1.54,-2.47,-4.84,-1.22,-0.36,-6.36,-10.9,-5.71,-0.82,-0.78,7.978,54.0,null,7.6,-1.36],["MMR","Myanmar","LMC","EAS",54.13,6563.0,-2.37,-23.51,6.97,-5.64,0.23,-15.26,-42.43,null,-4.92,-1.49,8.789,null,3.3,9.6,-1.64],["MNG","Mongolia","UMC","EAS",3.48,15791.0,-10.46,-4.91,-9.63,2.57,-0.35,-8.81,-7.49,-6.61,1.88,0.47,9.667,124.4,4.7,4.3,-0.28],["MOZ","Mozambique","LIC","SSF",33.64,1529.0,-2.17,-6.87,null,-1.06,0.38,-5.19,-5.4,-1.43,-0.09,-2.34,7.332,105.6,4.5,15.1,-0.74],["MRT","Mauritania","LMC","SSF",5.02,6162.0,-7.72,-28.58,3.44,-4.29,-0.78,-4.33,-2.57,-4.7,2.46,-1.45,8.726,93.5,3.2,null,-0.88],["MUS","Mauritius","UMC","SSF",1.25,25958.0,-0.85,-0.54,0.14,-0.15,0.06,-17.83,-12.56,-6.48,2.94,-0.5,10.164,127.9,5.3,10.4,0.91],["MWI","Malawi","LIC","SSF",21.1,1687.0,2.22,-0.66,3.1,-1.39,-0.71,-2.93,-6.7,-13.76,-2.17,-1.55,7.431,44.2,2.9,35.8,-0.63],["MYS","Malaysia","UMC","EAS",35.13,31301.0,-7.04,-6.47,-0.79,0.62,-0.51,-9.85,-7.71,-1.13,1.47,-2.29,10.351,123.0,5.3,15.6,0.87],["NAM","Namibia","LMC","SSF",2.96,10813.0,-6.08,-14.22,-4.26,-1.42,0.49,-8.72,1.49,-1.26,3.93,-4.46,9.289,82.9,3.8,14.7,0.18],["NER","Niger","LIC","SSF",26.16,1605.0,-1.85,10.88,-4.64,3.14,-0.62,-0.7,-0.54,-2.87,2.5,-1.08,7.381,39.3,null,null,-0.87],["NGA","Nigeria","LMC","SSF",227.88,8362.0,0.85,-3.73,0.04,-1.28,-0.39,-7.15,-1.63,-8.42,2.95,-0.09,9.031,null,4.2,null,-0.96],["NIC","Nicaragua","LMC","LCN",6.82,6757.0,-7.58,-4.91,-3.03,1.34,-1.27,-3.65,9.58,-4.7,2.27,-3.72,8.818,94.0,4.2,7.0,-1.04],["NLD","Netherlands","HIC","ECS",17.88,67848.0,-6.18,-11.92,-0.29,-1.77,-0.6,-6.2,-3.81,-5.01,-0.85,-1.1,11.125,160.7,0.5,1.7,1.77],["NOR","Norway","HIC","ECS",5.52,90773.0,-5.02,-12.88,-1.45,-1.74,-0.15,-2.84,0.27,-3.36,0.04,-0.12,11.416,68.9,4.7,1.6,1.84],["NPL","Nepal","LMC","SAS",29.69,4608.0,1.21,7.14,-5.59,1.22,-0.85,-9.21,-14.55,-3.14,-1.42,-1.88,8.435,49.2,7.5,8.0,-0.7],["NZL","New Zealand","HIC","EAS",5.2,47392.0,-3.25,-10.55,-0.47,-1.06,0.0,-3.58,-0.77,-4.76,-1.21,-0.07,10.766,54.5,3.1,4.7,1.84],["OMN","Oman","HIC","MEA",5.05,38292.0,3.18,-6.58,-5.49,-5.04,0.78,-1.23,1.42,-0.74,-1.02,-4.28,10.553,86.5,5.0,null,0.45],["PAK","Pakistan","LMC","MEA",247.5,5296.0,-2.76,-17.36,-9.98,-3.46,-0.16,-6.27,-10.63,-18.74,-2.38,-1.5,8.575,28.9,3.1,null,-0.54],["PAN","Panama","HIC","LCN",4.46,33164.0,-7.09,-5.73,-3.51,0.4,-0.09,-21.71,-3.23,-1.75,2.85,-1.98,10.409,80.4,1.2,28.9,0.25],["PER","Peru","UMC","LCN",33.85,15461.0,-4.88,-0.34,-2.1,0.79,-0.96,-13.65,-7.41,-5.14,-0.73,-4.95,9.646,46.9,12.7,6.6,-0.15],["PHL","Philippines","UMC","EAS",114.89,9452.0,-4.12,-5.1,-1.84,0.19,-0.04,-15.74,-16.14,-2.38,0.24,-3.12,9.154,68.8,7.7,17.3,0.08],["PNG","Papua New Guinea","LMC","EAS",10.39,4302.0,2.02,-1.08,-4.45,0.72,0.49,-6.7,-8.24,0.8,1.08,-1.4,8.367,null,3.4,14.2,-0.77],["POL","Poland","HIC","ECS",36.69,38182.0,-2.48,-8.37,-1.98,-1.64,0.52,-5.57,-5.42,-10.94,-1.47,-2.78,10.55,101.6,4.6,5.6,0.72],["PRI","Puerto Rico (US)","HIC","LCN",3.2,41656.0,-2.48,-6.6,null,-0.59,0.52,-3.6,2.66,null,2.89,-2.05,10.637,107.6,null,null,-0.37],["PRK","Korea, Dem. People's Rep.","LIC","EAS",26.42,null,null,null,null,null,1.51,null,null,null,null,0.46,null,null,null,null,-1.33],["PRT","Portugal","HIC","ECS",10.58,40188.0,-4.13,-11.31,1.81,-2.1,-0.12,-11.05,-7.13,-5.17,0.27,-0.57,10.601,86.8,2.5,5.4,0.98],["PRY","Paraguay","UMC","LCN",6.84,15319.0,-4.28,-0.89,2.24,0.53,-0.03,-3.67,-2.79,-3.75,0.56,-5.67,9.637,71.2,6.0,10.3,-0.23],["PSE","West Bank and Gaza","LMC","MEA",5.17,6270.0,-1.49,-13.04,-2.88,-2.75,0.42,-14.45,-15.8,-4.27,-9.75,-2.54,8.744,69.0,0.8,null,-1.34],["QAT","Qatar","HIC","MEA",2.66,113161.0,-4.02,7.78,3.6,5.79,0.47,-6.5,12.32,-4.02,0.85,-2.44,11.637,90.0,5.9,null,0.98],["ROU","Romania","HIC","ECS",19.06,36399.0,-12.12,-27.4,2.79,-6.05,-0.05,-8.35,-11.43,-8.83,-2.71,-3.15,10.502,84.9,4.1,7.3,0.4],["RUS","Russian Federation","HIC","ECS",143.83,37319.0,-15.72,-30.36,-1.7,-3.76,-0.67,-3.35,3.36,-6.13,1.95,-4.13,10.527,49.2,14.5,2.4,-0.36],["RWA","Rwanda","LIC","SSF",13.95,2754.0,-0.92,4.8,-4.86,0.9,-1.18,-9.77,-5.32,-14.97,1.36,-0.48,7.921,48.9,4.3,9.5,0.34],["SAU","Saudi Arabia","HIC","MEA",33.7,62648.0,-6.04,5.07,-5.87,3.59,-0.51,-9.63,-2.26,-2.65,-0.9,-1.49,11.045,56.8,25.6,3.5,0.65],["SDN","Sudan","LIC","SSF",50.04,3626.0,-8.78,-21.17,-3.46,-3.16,-0.81,-3.28,-39.2,null,-13.3,-2.06,8.196,26.1,null,5.1,-1.9],["SEN","Senegal","LMC","SSF",18.08,4071.0,-1.18,-5.0,-0.52,-1.19,-0.82,-4.46,-7.06,-6.64,-0.79,-1.41,8.312,64.2,null,12.3,0.24],["SGP","Singapore","HIC","EAS",5.92,120678.0,-8.8,-18.51,-2.48,0.19,0.05,-5.57,-1.35,-4.95,-2.08,-0.93,11.701,324.3,4.8,0.5,2.11],["SLE","Sierra Leone","LIC","SSF",8.46,2853.0,-3.8,2.94,null,2.91,-0.53,-3.86,4.78,-21.07,2.48,-1.4,7.956,37.6,3.7,null,-0.98],["SLV","El Salvador","UMC","LCN",6.31,10544.0,-4.6,-4.0,0.09,0.37,0.32,-10.29,-1.0,-4.9,0.31,-2.17,9.263,76.0,3.8,14.3,-0.27],["SOM","Somalia, Fed. Rep.","LIC","SSF",18.36,1491.0,0.61,5.7,null,1.83,-2.11,-9.92,-20.35,null,-3.13,-2.64,7.307,70.3,null,0.6,-1.97],["SRB","Serbia","UMC","ECS",6.62,21541.0,-8.87,-25.05,0.76,-5.16,-0.19,-4.04,2.77,-9.86,0.99,-3.48,9.978,107.6,5.2,3.6,0.08],["SSD","South Sudan","LIC","SSF",11.48,null,null,null,null,null,-0.27,null,null,null,null,-10.27,null,null,1.0,null,-2.22],["SVK","Slovak Republic","HIC","ECS",5.43,37194.0,-12.93,-26.91,2.1,-3.8,0.45,-5.8,-6.51,-9.49,-1.44,-3.6,10.524,183.7,0.8,3.5,0.64],["SVN","Slovenia","HIC","ECS",2.12,44578.0,-13.1,-31.09,0.3,-5.35,-0.42,-8.16,-6.37,-6.54,-1.49,-1.23,10.705,160.0,0.3,2.9,1.11],["SWE","Sweden","HIC","ECS",10.54,61071.0,-7.91,-15.17,-0.21,-0.81,-0.05,-4.01,-3.76,-6.61,-1.17,-0.51,11.02,92.8,2.4,1.1,1.77],["SWZ","Eswatini","LMC","SSF",1.23,10100.0,-3.65,-12.71,-4.27,-1.75,2.78,-6.16,-7.84,null,-0.85,-4.08,9.22,86.6,2.1,7.4,-0.92],["SYR","Syrian Arab Republic","LIC","MEA",23.59,4928.0,3.06,-27.22,-3.05,-8.56,-0.52,-0.54,null,null,null,-2.4,8.503,42.0,null,null,-1.73],["TCD","Chad","LIC","SSF",19.32,2605.0,-14.34,-37.42,-10.16,-4.14,0.45,-2.0,-0.76,-7.72,1.45,-0.69,7.865,46.7,null,null,-1.12],["TGO","Togo","LMC","SSF",8.22,2863.0,4.25,22.85,-4.32,5.29,0.03,-2.78,0.69,-6.52,1.58,-0.64,7.959,56.3,null,14.0,-0.81],["THA","Thailand","UMC","EAS",71.7,21280.0,-6.13,-10.85,0.89,-0.18,-0.03,-9.29,-12.31,-2.84,-0.4,0.09,9.966,109.7,8.9,5.8,0.21],["TJK","Tajikistan","LMC","ECS",10.39,3650.0,-4.69,-11.1,-2.72,-1.74,-0.18,-2.35,2.72,1.21,1.66,-2.02,8.202,56.0,4.7,2.9,-0.68],["TKM","Turkmenistan","UMC","ECS",7.36,15081.0,-2.6,9.29,null,2.69,0.71,-0.31,0.12,null,0.39,-0.22,9.621,37.7,null,null,-1.16],["TLS","Timor-Leste","LMC","EAS",1.38,5103.0,8.6,33.71,0.28,5.47,-0.44,26.02,-29.24,-6.33,-20.15,-0.88,8.538,70.6,6.0,0.1,-0.65],["TTO","Trinidad and Tobago","HIC","LCN",1.37,33749.0,-14.28,-43.02,-3.38,-7.18,0.0,-6.05,3.84,-3.93,4.52,-1.7,10.427,null,8.7,13.2,0.21],["TUN","Tunisia","LMC","MEA",12.2,13244.0,-2.31,-14.71,-1.09,-3.71,-0.15,-10.38,-7.18,-2.37,0.23,-3.07,9.491,102.3,5.0,null,-0.26],["TUR","Turkiye","UMC","ECS",85.33,28741.0,-12.62,-19.84,3.0,0.15,-0.08,-2.12,8.12,-48.87,1.1,-2.61,10.266,62.6,5.2,11.7,-0.05],["TZA","Tanzania","LMC","SSF",66.62,3485.0,-1.39,-5.26,-5.34,-0.79,-0.63,-3.85,-7.58,0.02,-0.79,-0.92,8.156,33.0,null,14.4,-0.28],["UGA","Uganda","LIC","SSF",48.66,2689.0,-0.88,-4.44,-5.67,-1.36,-0.91,-2.14,-3.17,-2.71,0.64,-1.17,7.897,39.4,3.6,21.0,-0.36],["UKR","Ukraine","UMC","ECS",37.73,17637.0,-23.54,-46.72,-10.62,-5.23,2.42,-3.98,-13.86,-5.42,-2.38,-2.91,9.778,90.5,3.5,8.3,-0.57],["URY","Uruguay","HIC","LCN",3.39,30011.0,-0.68,2.51,2.08,0.56,-0.26,-8.14,0.63,-0.25,2.27,-2.18,10.309,49.7,9.5,6.9,0.86],["USA","United States","HIC","NAC",336.76,69121.0,-5.46,-10.46,1.14,-0.68,-0.16,-4.34,-0.16,-3.93,0.08,-2.51,11.144,26.3,1.6,20.3,1.3],["UZB","Uzbekistan","LMC","ECS",35.65,9169.0,0.58,2.11,null,0.3,0.13,-4.8,-4.48,4.61,-0.29,-0.79,9.124,62.3,12.2,3.3,-0.2],["VEN","Venezuela, RB","LMC","LCN",28.3,1759.0,-10.47,-27.17,null,-4.66,-1.23,-12.01,45.53,null,22.27,-1.11,7.473,58.1,null,null,-1.47],["VNM","Viet Nam","UMC","EAS",100.35,11629.0,-2.11,-7.94,-7.91,-1.05,0.11,-3.93,-8.22,0.08,0.27,-0.19,9.361,164.7,3.4,null,-0.13],["XKX","Kosovo","UMC","ECS",1.68,11774.0,null,null,-3.18,null,-1.12,-10.59,-1.71,-6.52,3.17,-2.88,9.374,85.8,2.5,null,-0.09],["YEM","Yemen, Rep.","LIC","MEA",39.39,null,-0.2,-16.07,-1.41,-4.68,-0.37,null,null,null,null,-0.45,null,null,null,null,-1.89],["ZAF","South Africa","UMC","SSF",63.21,14353.0,-6.39,-14.6,-5.28,-2.15,3.41,-7.28,-3.09,-1.96,0.19,-5.07,9.572,53.9,5.4,18.2,-0.16],["ZMB","Zambia","LMC","SSF",20.72,3592.0,1.43,1.75,2.55,0.28,0.08,-5.6,2.11,-3.2,1.88,-1.64,8.186,68.8,2.0,28.3,-0.43],["ZWE","Zimbabwe","LMC","SSF",16.34,4994.0,19.88,72.99,null,23.1,2.7,-9.07,5.43,null,2.87,-1.96,8.516,36.5,0.3,13.5,-0.96]]};
  var C = D.c.map(function (r) { var o = {}; D.k.forEach(function (k, i) { o[k] = r[i]; }); return o; });
  var BY = {}; C.forEach(function (c) { BY[c.iso] = c; });
  var DIM = ['res', 'rec', 'sta', 'ada', 'con'];
  var DN = { res: 'Resistance', rec: 'Recovery', sta: 'Price stability', ada: 'Adaptation', con: 'Continuity' };
  var DS = { res: 'RES', rec: 'REC', sta: 'STA', ada: 'ADA', con: 'CON' };

  function tok(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function rgb(h) { if (h.indexOf('rgb') === 0) return h.match(/\d+/g).slice(0, 3).map(Number); h = h.replace('#', ''); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function alpha(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mix(h1, h2, t) { var a = rgb(h1), b = rgb(h2); t = Math.max(0, Math.min(1, t)); return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }).join(',') + ')'; }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function fmt(v, d) { if (v === null || v === undefined || isNaN(v)) return '—'; return v.toLocaleString('en-US', { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }).replace('-', '−'); }
  function nn(v, d, u) { return v === null || v === undefined ? '—' : fmt(v, d) + (u || ''); }
  function sg(v, d) { return v === null || v === undefined ? '—' : (v >= 0 ? '+' : '−') + fmt(Math.abs(v), d === undefined ? 1 : d); }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function mean(a) { return a.length ? sum(a) / a.length : 0; }
  function med(a) { var s = a.slice().sort(function (x, y) { return x - y; }), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : 0; }
  function ranks(v) { var idx = v.map(function (x, i) { return [x, i]; }).sort(function (a, b) { return a[0] - b[0]; }), r = new Array(v.length), i = 0; while (i < idx.length) { var j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; var avg = (i + j) / 2 + 1; for (var k = i; k <= j; k++) r[idx[k][1]] = avg; i = j + 1; } return r; }
  function pearson(a, b) { var ma = mean(a), mb = mean(b), sa = 0, sb = 0, sab = 0; for (var i = 0; i < a.length; i++) { sa += (a[i] - ma) * (a[i] - ma); sb += (b[i] - mb) * (b[i] - mb); sab += (a[i] - ma) * (b[i] - mb); } return sab / Math.sqrt(sa * sb); }
  function spearman(a, b) { return pearson(ranks(a), ranks(b)); }
  function spk(ka, kb, set) { var ks = (set || C).filter(function (c) { return c[ka] !== null && c[ka] !== undefined && c[kb] !== null && c[kb] !== undefined; }); return ks.length > 2 ? [spearman(ks.map(function (c) { return c[ka]; }), ks.map(function (c) { return c[kb]; })), ks.length] : [0, 0]; }
  function shortName(n) { return n.replace(', Dem. Rep.', ' (DRC)').replace(', Rep.', '').replace(', Arab Rep.', '').replace(', Islamic Rep.', '').replace('Syrian Arab Republic', 'Syria').replace('Russian Federation', 'Russia').replace(', RB', '').replace('Lao PDR', 'Laos').replace(', Fed. Rep.', '').replace('West Bank and Gaza', 'Palestine').replace('Central African Republic', 'CAR').replace("Korea, Dem. People's Rep.", 'North Korea').replace('Kyrgyz Republic', 'Kyrgyzstan').replace('Turkiye', 'Türkiye').replace('Egypt, Arab Rep.', 'Egypt').replace('Gambia, The', 'The Gambia'); }
  var _sn = shortName; shortName = function (n) { return _sn(n.replace("Korea, Dem. People's Rep.", 'North Korea').replace('Korea, Rep.', 'South Korea').replace('Bosnia and Herzegovina', 'Bosnia & Herz.')); };
  function segs(attr, fn) { Array.prototype.forEach.call(document.querySelectorAll('[' + attr + ']'), function (b, _, all) { b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false'); b.addEventListener('click', function () { Array.prototype.forEach.call(all, function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); }); fn(b.getAttribute(attr)); }); }); }

  var SINK = tok('--s-ink'), ROSE = tok('--s-rose'), TEAL = tok('--s-teal'), AMB = tok('--s-amber'), BLUE = tok('--s-blue'), VIO = tok('--s-violet'), GREY = tok('--s-grey');
  var GC = { HIC: tok('--g-hic'), UMC: tok('--g-umc'), LMC: tok('--g-lmc'), LIC: tok('--g-lic') };
  var IGN = { LIC: 'Low income', LMC: 'Lower-middle income', UMC: 'Upper-middle income', HIC: 'High income' };
  var IGS = ['HIC', 'UMC', 'LMC', 'LIC'];
  var DCOL = { res: ROSE, rec: TEAL, sta: AMB, ada: BLUE, con: VIO };
  var INK = tok('--text'), MUTED = tok('--text-muted'), PAPER = tok('--bg-accent'), NONE = tok('--map-none') || '#cfd8e3';
  var narrow = window.innerWidth < 640;

  /* --- percentile ranks and composites ------------------------------------------------------------ */
  var EPS = ['g', 'c'];
  EPS.forEach(function (e) {
    C.forEach(function (c) { c['p' + e] = {}; });
    DIM.forEach(function (d) {
      var ks = C.filter(function (c) { return c[e + '_' + d] !== null; }), r = ranks(ks.map(function (c) { return c[e + '_' + d]; }));
      ks.forEach(function (c, i) { c['p' + e][d] = (r[i] - 1) / (ks.length - 1) * 100; });
    });
  });
  function comp(c, e, w) {
    var num = 0, den = 0, n = 0;
    DIM.forEach(function (d, i) { var p = c['p' + e][d]; if (p !== undefined) { n++; num += (w ? w[i] : 1) * p; den += (w ? w[i] : 1); } });
    return n >= 4 && den > 0 ? num / den : null;
  }
  C.forEach(function (c) { c.gc = comp(c, 'g'); c.cc = comp(c, 'c'); c.chg = c.gc !== null && c.cc !== null ? c.cc - c.gc : null; c.both = c.gc !== null && c.cc !== null && c.gc >= 66.7 && c.cc >= 66.7; });
  var POPT = sum(C.map(function (c) { return c.pop; }));

  /* --- atlas ------------------------------------------------------------------------------------- */
  var st = { layer: 'cc', pick: 'GHA' };
  var svgA = document.querySelector('.atlas'), shapes = svgA ? svgA.querySelectorAll('[data-iso]') : [];
  function seq(t, col) { t = Math.max(0, Math.min(1, t)); return mix(PAPER, col, 0.1 + 0.9 * t); }
  function ramp(vals, f, unit, lab) { return vals.map(function (v, i) { return '<span><i style="background:' + f(v) + '"></i>' + lab[i] + '</span>'; }).join('') + '<span>' + unit + '</span>'; }
  function dv(v) { return v < 0 ? mix(PAPER, ROSE, Math.min(1, -v / 60)) : mix(PAPER, TEAL, Math.min(1, v / 60)); }
  var LAY = {
    cc: { f: function (c) { return c.cc === null ? null : seq(c.cc / 100, TEAL); }, leg: function () { return ramp([0, 25, 50, 75, 100], function (v) { return seq(v / 100, TEAL); }, 'composite resilience, 2020 episode, percentile (higher = more resilient)', ['0', '25', '50', '75', '100']); } },
    gc: { f: function (c) { return c.gc === null ? null : seq(c.gc / 100, BLUE); }, leg: function () { return ramp([0, 25, 50, 75, 100], function (v) { return seq(v / 100, BLUE); }, 'composite resilience, 2009 episode, percentile', ['0', '25', '50', '75', '100']); } },
    chg: { f: function (c) { return c.chg === null ? null : dv(c.chg); }, leg: function () { return ramp([-60, -30, 0, 30, 60], function (v) { return dv(v); }, 'change in composite percentile, 2009 → 2020', ['−60', '−30', '0', '+30', '+60']); } }
  };
  DIM.forEach(function (d) { LAY['c_' + d] = { f: function (c) { return c.pc[d] === undefined ? null : seq(c.pc[d] / 100, DCOL[d]); }, leg: function () { return ramp([0, 25, 50, 75, 100], function (v) { return seq(v / 100, DCOL[d]); }, DN[d] + ', 2020 episode, percentile', ['0', '25', '50', '75', '100']); } }; });
  function paint() {
    var L = LAY[st.layer];
    Array.prototype.forEach.call(shapes, function (p) { var c = BY[p.getAttribute('data-iso')]; var col = c ? L.f(c) : null; p.style.fill = col || NONE; p.classList.toggle('is-in', !!c && !!col); p.classList.toggle('is-pick', !!c && c.iso === st.pick); });
    var el = document.getElementById('atlas-legend'); if (el) el.innerHTML = L.leg();
  }
  function card(c) {
    if (!c) return;
    setText('cc-name', shortName(c.name));
    var cl = document.getElementById('cc-class'); if (cl) cl.innerHTML = '<span class="tagchip" style="--k:' + GC[c.inc] + '">' + IGN[c.inc] + '</span>' + (c.both ? '<span class="tagchip" style="--k:' + TEAL + '">top third in both</span>' : '') + (c.chg !== null && Math.abs(c.chg) >= 25 ? '<span class="tagchip" style="--k:' + (c.chg > 0 ? TEAL : ROSE) + '">moved ' + sg(c.chg, 0) + ' points</span>' : '');
    var el = document.getElementById('country-card'); if (el) el.style.setProperty('--cc', c.chg === null ? GREY : (c.chg >= 0 ? TEAL : ROSE));
    var b = document.getElementById('cc-bar');
    if (b) b.innerHTML = '<svg viewBox="0 0 250 56" style="width:100%;height:56px;display:block"><line x1="10" x2="240" y1="46" y2="46" stroke="' + MUTED + '" stroke-dasharray="2 3"/>' + [['g', 'pg', BLUE, 14], ['c', 'pc', TEAL, 24]].map(function (x) { return ''; }).join('') + (c.gc !== null && c.cc !== null ? '<line x1="25" y1="' + (50 - c.gc * 0.44) + '" x2="225" y2="' + (50 - c.cc * 0.44) + '" stroke="' + (c.chg >= 0 ? TEAL : ROSE) + '" stroke-width="2.4"/><circle cx="25" cy="' + (50 - c.gc * 0.44) + '" r="4" fill="' + BLUE + '"/><circle cx="225" cy="' + (50 - c.cc * 0.44) + '" r="4" fill="' + TEAL + '"/>' : '') + '</svg>';
    setText('cc-bar-lab', 'Composite percentile: 2009 (left) to 2020 (right)');
    var rows = [['Composite 2009 · 2020', nn(c.gc, 0) + ' · ' + nn(c.cc, 0)], ['Growth shortfall 2020 (resistance)', nn(c.c_res, 1, ' pts')], ['GDP vs trend, 2023 (recovery)', nn(c.c_rec, 1, ' pts')], ['Inflation rise 2022–23 (stability)', c.c_sta === null ? '—' : fmt(-c.c_sta, 1) + ' pts'], ['Growth 2022–24 vs 2015–19 (adaptation)', nn(c.c_ada, 1, ' pts')], ['Life expectancy vs trend, 2021 (continuity)', nn(c.c_con, 1, ' yrs')], ['Growth shortfall 2009 · gap to trend 2012', nn(c.g_res, 1) + ' · ' + nn(c.g_rec, 1) + ' pts'], ['GDP per person (PPP)', c.gpc ? '$' + fmt(c.gpc, 0) : '—'], ['Population', fmt(c.pop, 1) + ' m']];
    var dl = document.getElementById('cc-kv'); if (dl) dl.innerHTML = rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
  }
  function pick(iso) { st.pick = iso; paint(); card(BY[iso]); profile(); }
  if (svgA) {
    svgA.addEventListener('mouseover', function (e) { var t = e.target.closest('[data-iso]'); if (t && BY[t.getAttribute('data-iso')]) card(BY[t.getAttribute('data-iso')]); });
    svgA.addEventListener('mouseleave', function () { card(BY[st.pick]); });
    svgA.addEventListener('click', function (e) { var t = e.target.closest('[data-iso]'); if (t && BY[t.getAttribute('data-iso')]) pick(t.getAttribute('data-iso')); });
  }
  segs('data-layer', function (v) { st.layer = v; paint(); });

  /* --- table ----------------------------------------------------------------------------------- */
  var tb = { key: 'cc', dir: -1, q: '', f: 'all' }, body = document.getElementById('tb-body');
  function val(c, k) { return k === 'name' ? shortName(c.name) : c[k]; }
  function keep(c) { return tb.f === 'all' || (tb.f === 'mov' && c.chg !== null && Math.abs(c.chg) >= 25) || (tb.f === 'both' && c.both) || (tb.f === 'dev' && c.inc !== 'HIC'); }
  function table() {
    if (!body) return;
    var rows = C.filter(function (c) { return keep(c) && (!tb.q || shortName(c.name).toLowerCase().indexOf(tb.q) >= 0); }).sort(function (a, b) {
      var x = val(a, tb.key), y = val(b, tb.key);
      if (typeof x === 'string') return tb.dir * x.localeCompare(y);
      if (x === null || x === undefined) return 1; if (y === null || y === undefined) return -1; return tb.dir * (x - y);
    });
    body.innerHTML = rows.map(function (c) {
      return '<tr data-iso="' + c.iso + '"><td><b style="color:' + GC[c.inc] + '">●</b> ' + shortName(c.name) + '</td><td class="n">' + nn(c.cc, 0) + '</td><td class="n">' + nn(c.gc, 0) + '</td><td class="n" style="color:' + (c.chg === null ? INK : (c.chg >= 0 ? TEAL : ROSE)) + '">' + (c.chg === null ? '—' : sg(c.chg, 0)) + '</td><td class="n">' + nn(c.c_res, 1) + '</td><td class="n">' + nn(c.c_rec, 1) + '</td><td class="n">' + nn(c.c_sta, 1) + '</td><td class="n">' + nn(c.c_ada, 1) + '</td><td class="n">' + nn(c.c_con, 1) + '</td></tr>';
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

  /* --- static tables ------------------------------------------------------------------------------ */
  var DF = [
    ['Holling (1973), ecology', 'The capacity of a system to absorb disturbance and still persist; distinguished from stability, the tendency to return to an equilibrium after disturbance', 'Absorption and persistence'],
    ['Holling (1996), engineering vs ecological', 'Engineering resilience is the speed of return to a steady state; ecological resilience is the size of disturbance a system can absorb before it changes state', 'Speed against magnitude'],
    ['UNDRR (2017), disaster risk reduction', 'The ability of a system exposed to hazards to resist, absorb, accommodate, adapt to, transform and recover from their effects in a timely and efficient manner, preserving and restoring essential structures and functions', 'Several properties at once, including adaptation and function'],
    ['WEF Global Risks Report 2023, polycrisis (secondary sources)', 'A cluster of related global risks whose compounding effects make the overall impact larger than the sum of the parts', 'Interaction; resilience to combinations, not single events']
  ];
  var dft = document.getElementById('def-table');
  if (dft) dft.innerHTML = '<thead><tr><th>Source</th><th>Definition (paraphrased)</th><th>Emphasis</th></tr></thead><tbody>' + DF.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody>';
  var DM = [
    ['Resistance', 'resist, absorb', 'Growth in the shock year minus mean growth over the five pre-shock years (points)', 'Impact year'],
    ['Recovery', 'recover', 'Log GDP per person three (2009) or four (2020) years on against the pre-shock trend (points)', '+3 / +4 years'],
    ['Price stability', 'preserve function', 'Minus the rise in mean inflation over its pre-shock mean (points)', '2008–09 / 2022–23'],
    ['Continuity', 'preserve function', 'Life expectancy two or three years on against its pre-shock level plus trend (years)', '+2 / +3 years'],
    ['Adaptation', 'adapt, transform', 'Mean growth in the post-shock years minus the pre-shock mean (points)', '2010–12 / 2022–24']
  ];
  var dmt = document.getElementById('dim-table');
  if (dmt) dmt.innerHTML = '<thead><tr><th>Measure</th><th>UN verbs</th><th>Definition</th><th>Horizon</th></tr></thead><tbody>' + DM.map(function (r, i) { return '<tr><td><b style="color:' + DCOL[DIM[[0, 1, 2, 4, 3][i]]] + '">●</b> <b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('') + '</tbody>';
  var ART = [['ZWE', 'Prices stopped collapsing after hyperinflation, which counts as a gain in price stability'], ['GNQ', 'Pre-shock path already falling, so little to lose relative to trend'], ['LBN', 'Strong 2009 (little hit by the crisis), then the 2019–20 financial collapse'], ['IRQ', 'Top-third in 2009 on a rebound after conflict; bottom-third in 2020'], ['VEN', 'Collapsing economy in 2009, a rebound from a deep trough by 2020']];
  var art = document.getElementById('art-table');
  if (art) art.innerHTML = '<thead><tr><th>Country</th><th class="n">2009</th><th class="n">2020</th><th>Why the ranking is not a resilience verdict</th></tr></thead><tbody>' + ART.map(function (a) { var c = BY[a[0]]; return c ? '<tr><td><b>' + shortName(c.name) + '</b></td><td class="n">' + nn(c.gc, 0) + '</td><td class="n">' + nn(c.cc, 0) + '</td><td>' + a[1] + '</td></tr>' : ''; }).join('') + '</tbody>';

  /* --- profile + charts ------------------------------------------------------------------------------ */
  var cProf = null;
  function profile() {
    var c = BY[st.pick]; if (!c || !cProf) return;
    cProf.data.datasets[0].data = DIM.map(function (d) { return c.pg[d] === undefined ? null : c.pg[d]; });
    cProf.data.datasets[1].data = DIM.map(function (d) { return c.pc[d] === undefined ? null : c.pc[d]; });
    cProf.update('none'); setText('prof-title', shortName(c.name) + ': profile');
  }
  var UW = [20, 20, 20, 20, 20], UE = 'c';
  function score(c, e, w) { if (e === 'b') { var a = comp(c, 'g', w), b = comp(c, 'c', w); return a !== null && b !== null ? (a + b) / 2 : null; } return comp(c, e, w); }

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;
    var axis = HH.axis, tick = { color: MUTED, font: { size: 11 } };
    var legB = { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12 } };
    var xt = function (rot) { return Object.assign(axis({ grid: false }), { ticks: Object.assign({ autoSkip: false, maxRotation: narrow ? 45 : (rot || 0) }, tick) }); };

    /* 2. measures */
    HH.chart('chart-shock', {
      type: 'bar',
      data: { labels: ['Resistance: growth shortfall in the shock year', 'Recovery: gap to trend after 3–4 years'], datasets: [['g', '2009 financial crisis', BLUE], ['c', '2020 pandemic', TEAL]].map(function (e) { return { label: e[1], data: [+med(C.filter(function (c) { return c[e[0] + '_res'] !== null; }).map(function (c) { return c[e[0] + '_res']; })).toFixed(1), +med(C.filter(function (c) { return c[e[0] + '_rec'] !== null; }).map(function (c) { return c[e[0] + '_rec']; })).toFixed(1)], backgroundColor: e[2], borderRadius: 2 }; }) },
      options: { layout: { padding: { top: 14, bottom: 14 } }, plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': median ' + sg(c.raw, 1) + ' points'; } } } }, scales: { x: Object.assign(xt(), { ticks: Object.assign({ autoSkip: false, maxRotation: 0, callback: function (v, i) { return ['Resistance', 'Recovery'][i]; } }, tick) }), y: Object.assign(axis({ title: 'points (median country)' }), { ticks: tick }) } },
      plugins: [HH.valueLabels({ format: function (v) { return sg(v, 1); } })]
    });
    HH.chart('chart-inc', {
      type: 'bar',
      data: { labels: IGS.map(function (g) { return IGN[g]; }), datasets: [['gc', '2009 financial crisis', BLUE], ['cc', '2020 pandemic', TEAL]].map(function (e) { return { label: e[1], data: IGS.map(function (g) { return +mean(C.filter(function (c) { return c.inc === g && c[e[0]] !== null; }).map(function (c) { return c[e[0]]; })).toFixed(0); }), backgroundColor: e[2], borderRadius: 2 }; }) },
      options: { layout: { padding: { top: 14 } }, plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + fmt(c.raw, 0); } } } }, scales: { x: xt(), y: Object.assign(axis({ title: 'mean composite percentile' }), { min: 0, max: 100, ticks: tick }) } },
      plugins: [HH.valueLabels({ format: function (v) { return fmt(v, 0); } })]
    });

    /* 3. agreement */
    var PAIRS = []; for (var i = 0; i < 5; i++) for (var j = i + 1; j < 5; j++) PAIRS.push([DIM[i], DIM[j]]);
    HH.chart('chart-within', {
      type: 'bar',
      data: { labels: PAIRS.map(function (p) { return DS[p[0]] + ' × ' + DS[p[1]]; }), datasets: [['g', '2009 episode', BLUE], ['c', '2020 episode', TEAL]].map(function (e) { return { label: e[1], data: PAIRS.map(function (p) { return +spk(e[0] + '_' + p[0], e[0] + '_' + p[1])[0].toFixed(2); }), backgroundColor: e[2], borderRadius: 2 }; }) },
      options: { indexAxis: 'y', plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': r = ' + sg(c.raw, 2); } } } }, scales: { x: Object.assign(axis({ title: 'Spearman correlation' }), { min: -0.3, max: 1, ticks: tick }), y: Object.assign(axis({ grid: false }), { ticks: Object.assign({ autoSkip: false }, tick, { font: { size: 10.5 } }) }) } }
    });
    function cnt(e) { var ks = C.filter(function (c) { return DIM.every(function (d) { return c['p' + e][d] !== undefined; }); }), o = [0, 0, 0, 0, 0, 0]; ks.forEach(function (c) { o[DIM.filter(function (d) { return c['p' + e][d] >= 66.7; }).length]++; }); return { o: o, n: ks.length }; }
    function binom(n) { var p = 1 / 3, f = [1, 1, 2, 6, 24, 120]; return [0, 1, 2, 3, 4, 5].map(function (k) { return n * f[5] / (f[k] * f[5 - k]) * Math.pow(p, k) * Math.pow(1 - p, 5 - k); }); }
    var CG = cnt('g'), CCn = cnt('c');
    HH.chart('chart-count', {
      type: 'bar',
      data: { labels: ['0', '1', '2', '3', '4', '5'], datasets: [{ label: '2020 episode (' + CCn.n + ')', data: CCn.o, backgroundColor: TEAL, borderRadius: 2 }, { label: '2009 episode (' + CG.n + ')', data: CG.o, backgroundColor: BLUE, borderRadius: 2 }, { type: 'line', label: 'If independent (2020 sample)', data: binom(CCn.n).map(function (v) { return +v.toFixed(1); }), borderColor: ROSE, backgroundColor: ROSE, borderWidth: 2.4, pointRadius: 3, borderDash: [5, 4] }] },
      options: { layout: { padding: { top: 14 } }, plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': ' + fmt(c.raw, c.dataset.type === 'line' ? 1 : 0) + ' countries'; } } } }, scales: { x: Object.assign(axis({ title: 'number of dimensions in the top third (of five)' }), { grid: false, ticks: tick }), y: Object.assign(axis({ title: 'countries' }), { min: 0, ticks: tick }) } },
      plugins: [HH.valueLabels({ format: function (v) { return fmt(v, 0); } })]
    });

    /* 4. trait */
    var AC = DIM.map(function (d) { return spk('g_' + d, 'c_' + d)[0]; }).concat([spk('gc', 'cc')[0]]);
    HH.chart('chart-across', {
      type: 'bar',
      data: { labels: DIM.map(function (d) { return DN[d]; }).concat(['Composite']), datasets: [{ label: 'Rank correlation, 2009 vs 2020', data: AC.map(function (v) { return +v.toFixed(2); }), backgroundColor: DIM.map(function (d) { return DCOL[d]; }).concat([SINK]), borderRadius: 2 }] },
      options: { layout: { padding: { top: 16 } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return 'r = ' + sg(c.raw, 2) + ' between the two episodes'; } } } }, scales: { x: xt(15), y: Object.assign(axis({ title: 'Spearman correlation' }), { min: -0.3, max: 0.5, ticks: tick }) } },
      plugins: [HH.valueLabels({ format: function (v) { return sg(v, 2); } })]
    });
    var SC = C.filter(function (c) { return c.gc !== null && c.cc !== null; });
    HH.chart('chart-trait', {
      type: 'scatter',
      data: { datasets: IGS.slice().reverse().map(function (g) { return { label: IGN[g], data: SC.filter(function (c) { return c.inc === g; }).map(function (c) { return { x: c.gc, y: c.cc, c: c }; }), backgroundColor: alpha(GC[g], 0.78), borderColor: GC[g], pointRadius: 4.2 }; }).concat([{ type: 'line', label: 'Same rank', data: [{ x: 0, y: 0 }, { x: 100, y: 100 }], borderColor: SINK, borderDash: [6, 4], borderWidth: 1.4, pointRadius: 0 }]) },
      options: { plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.raw.c ? shortName(c.raw.c.name) + ': ' + fmt(c.raw.x, 0) + ' in 2009, ' + fmt(c.raw.y, 0) + ' in 2020' : c.dataset.label; } } } }, scales: { x: Object.assign(axis({ title: 'composite percentile, 2009' }), { min: 0, max: 100, ticks: tick }), y: Object.assign(axis({ title: 'composite percentile, 2020' }), { min: 0, max: 100, ticks: tick }) } }
    });
    HH.chart('chart-shocks', {
      type: 'bar',
      data: { labels: ['2009 × 2015', '2009 × 2020', '2015 × 2020'], datasets: [{ label: 'Growth shortfall (vs prior five years)', data: [0.06, 0.21, -0.14], backgroundColor: ROSE, borderRadius: 2 }, { label: 'Raw growth in the shock year', data: [0.16, 0.17, 0.23], backgroundColor: alpha(SINK, 0.6), borderRadius: 2 }] },
      options: { layout: { padding: { top: 14 } }, plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': r = ' + sg(c.raw, 2); } } } }, scales: { x: xt(), y: Object.assign(axis({ title: 'Spearman correlation' }), { min: -0.2, max: 0.35, ticks: tick }) } },
      plugins: [HH.valueLabels({ format: function (v) { return sg(v, 2); } })]
    });
    HH.chart('chart-pers', {
      type: 'bar',
      data: { labels: IGS.map(function (g) { return IGN[g]; }), datasets: [{ label: 'Composite, 2009 vs 2020', data: IGS.map(function (g) { return +spk('gc', 'cc', C.filter(function (c) { return c.inc === g; }))[0].toFixed(2); }), backgroundColor: IGS.map(function (g) { return GC[g]; }), borderRadius: 2 }] },
      options: { layout: { padding: { top: 14 } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return 'r = ' + sg(c.raw, 2) + ' (n = ' + spk('gc', 'cc', C.filter(function (x) { return x.inc === IGS[c.dataIndex]; }))[1] + ')'; } } } }, scales: { x: xt(), y: Object.assign(axis({ title: 'Spearman correlation' }), { min: -0.3, max: 0.6, ticks: tick }) } },
      plugins: [HH.valueLabels({ format: function (v) { return sg(v, 2); } })]
    });

    /* 5. predictors */
    var PRD = [['lny', 'Income (log GDP per person)', ROSE], ['trade', 'Trade openness', TEAL], ['reserves', 'Reserves (months)', AMB], ['intr', 'Interest % of revenue', BLUE], ['ge', 'Government effectiveness', VIO]];
    ['g', 'c'].forEach(function (e) {
      HH.chart('chart-pred-' + e, {
        type: 'bar',
        data: { labels: DIM.map(function (d) { return DN[d]; }), datasets: PRD.map(function (p) { return { label: p[1], data: DIM.map(function (d) { return +spk(p[0], e + '_' + d)[0].toFixed(2); }), backgroundColor: p[2], borderRadius: 2 }; }) },
        options: { plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': r = ' + sg(c.raw, 2); } } } }, scales: { x: xt(15), y: Object.assign(axis({ title: 'Spearman correlation' }), { min: -0.6, max: 0.5, ticks: tick }) } }
      });
    });

    /* 7. explorer */
    var cp = document.getElementById('cc-pick');
    var CCH = C.slice().sort(function (a, b) { return shortName(a.name).localeCompare(shortName(b.name)); });
    if (cp) cp.innerHTML = CCH.map(function (c) { return '<option value="' + c.iso + '">' + shortName(c.name) + '</option>'; }).join('');
    function gv(id) { return +document.getElementById(id).value; }
    cProf = HH.chart('chart-prof', {
      type: 'bar',
      data: { labels: DIM.map(function (d) { return DN[d]; }), datasets: [{ label: '2009 episode', data: [0, 0, 0, 0, 0], backgroundColor: BLUE, borderRadius: 2 }, { label: '2020 episode', data: [0, 0, 0, 0, 0], backgroundColor: TEAL, borderRadius: 2 }] },
      options: { layout: { padding: { top: 16 } }, plugins: { legend: legB, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ': percentile ' + fmt(c.raw, 0); } } } }, scales: { x: xt(15), y: Object.assign(axis({ title: 'percentile (higher = more resilient)' }), { min: 0, max: 100, ticks: tick }) } },
      plugins: [HH.valueLabels({ format: function (v) { return fmt(v, 0); } })]
    });
    function explore() {
      UW = DIM.map(function (d) { return gv('w-' + d); }); if (sum(UW) === 0) UW = [20, 20, 20, 20, 20];
      var t = sum(UW); DIM.forEach(function (d, i) { setText('w-' + d + '-o', fmt(100 * UW[i] / t, 0) + '%'); });
      var S = C.map(function (c) { return score(c, UE, UW); }), Q = C.map(function (c) { return score(c, UE, null); }), O = C.map(function (c) { return UE === 'c' ? score(c, 'g', UW) : (UE === 'g' ? score(c, 'c', UW) : score(c, 'c', UW)); });
      C.forEach(function (c, i) { c._s = S[i]; c._q = Q[i]; c._o = O[i]; });
      var V = C.filter(function (c) { return c._s !== null; }).sort(function (a, b) { return b._s - a._s; });
      V.forEach(function (c, i) { c._r = i + 1; });
      var VQ = C.filter(function (c) { return c._q !== null; }).sort(function (a, b) { return b._q - a._q; }), q20 = VQ.slice(0, 20).map(function (c) { return c.iso; });
      var VO = C.filter(function (c) { return c._o !== null; }).sort(function (a, b) { return b._o - a._o; }), o20 = VO.slice(0, 20).map(function (c) { return c.iso; });
      var t20 = V.slice(0, 20), kept = t20.filter(function (c) { return q20.indexOf(c.iso) >= 0; }).length, inO = t20.filter(function (c) { return o20.indexOf(c.iso) >= 0; }).length;
      var both = C.filter(function (c) { return c._s !== null && c._o !== null; }), rc = both.length > 3 ? spearman(both.map(function (c) { return c._s; }), both.map(function (c) { return c._o; })) : 0;
      var gp = C.filter(function (c) { return comp(c, 'g', UW) !== null && comp(c, 'c', UW) !== null; }), pers = spearman(gp.map(function (c) { return comp(c, 'g', UW); }), gp.map(function (c) { return comp(c, 'c', UW); }));
      var inc = {}; IGS.forEach(function (g) { inc[g] = t20.filter(function (c) { return c.inc === g; }).length; });
      var out = document.getElementById('calc-out');
      if (out) out.innerHTML = [
        [kept + ' of 20', 'of the equal-weight top twenty for this episode are still in your top twenty', TEAL],
        [inO + ' of 20', UE === 'b' ? 'of your top twenty are also in the top twenty of the 2020 episode alone' : 'of your top twenty are also in the top twenty under the other episode', ROSE],
        [fmt(rc, 2), UE === 'b' ? 'rank correlation of your average with the 2020-only score' : 'rank correlation of your score with the other episode’s score', BLUE],
        [fmt(pers, 2), 'rank correlation between 2009 and 2020 composites under your weights', VIO],
        [shortName(V[0].name), 'ranks first under your definition (score ' + fmt(V[0]._s, 0) + ')', AMB],
        [IGS.map(function (g) { return inc[g]; }).join(' · '), 'income groups in your twenty: high · upper-middle · lower-middle · low', SINK],
        [fmt(sum(t20.map(function (c) { return c.pop; })), 0) + ' m', 'people in your twenty (' + fmt(100 * sum(t20.map(function (c) { return c.pop; })) / POPT, 0) + '% of the 160 countries)', GREY],
        [fmt(C.filter(function (c) { return c._s !== null && c._q !== null && Math.abs(c._s - c._q) >= 10; }).length, 0), 'countries whose score moves 10 points or more against equal weights', TEAL]
      ].map(function (x) { return '<div style="--k:' + x[2] + '"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('');
      var tbd = document.getElementById('top-body');
      if (tbd) tbd.innerHTML = V.slice(0, 15).map(function (c) { var pp = UE === 'g' ? c.pg : c.pc; return '<tr data-iso="' + c.iso + '"><td>' + c._r + '</td><td>' + shortName(c.name) + '</td><td class="n">' + fmt(c._s, 0) + '</td>' + DIM.map(function (d) { return '<td class="n">' + (pp[d] === undefined ? '—' : fmt(pp[d], 0)) + '</td>'; }).join('') + '</tr>'; }).join('');
      setText('calc-note', 'Episode: ' + { c: '2020 pandemic', g: '2009 financial crisis', b: 'both (average)' }[UE] + ' · weights ' + DIM.map(function (d, i) { return DS[d] + ' ' + fmt(100 * UW[i] / t, 0) + '%'; }).join(', ') + '. Scores are percentile ranks relative to each country’s own pre-shock path and describe these two episodes only; the top of the list contains countries that had little to lose (see section 6).');
      profile();
    }
    DIM.forEach(function (d) { document.getElementById('w-' + d).addEventListener('input', explore); });
    segs('data-ep', function (v) { UE = v; explore(); });
    var tbl = document.getElementById('top-body'); if (tbl) tbl.addEventListener('click', function (e) { var t = e.target.closest('tr[data-iso]'); if (t) { pick(t.getAttribute('data-iso')); if (cp) cp.value = t.getAttribute('data-iso'); } });
    if (cp) { cp.value = st.pick; cp.addEventListener('change', function () { pick(cp.value); }); }
    explore();
    window.HHdef = { C: C, spk: spk, comp: comp };
  });
})();
