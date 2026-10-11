/* ===========================================================================
   Charts — "Resilience in an Age of Polycrisis" (hybrid dashboard)

   DATA is built from the World Bank Pink Sheet, the FAO Food Price Index,
   FAOSTAT food CPIs and the World Development Indicators (see Sources):
     months / chain   global stages, monthly, rebased to 2019 average = 100
     ladder           height (rise %) and length (months above half the rise)
     dom              cross-country food inflation: n, median, % > 5, % > 10
     lags             countries by month of peak relative to March 2022
     countries        [name, iso3, region, income, peak %, peak month,
                       FX change % 2021→23, food share of imports % 2021,
                       reserves months 2021, food inflation % 2019]
     episodes         2022 and 2026, indexed to February of each year = 100
   Rank correlations, bucket medians and the explorer are computed here so the
   page can be checked against the method. Colours come from the theme's
   --stage-* tokens; no hex values live in this file.
   =========================================================================== */

(function () {
  'use strict';

  if (!window.HH) return;

  var DATA = {"months":["2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08","2026-09"],"chain":{"gas_eu":[151.1,125.1,107.8,102.4,90.4,74.7,75.4,76.6,87.6,105.3,107.2,96.2,75.6,60.6,56.6,44.1,32.9,36.4,37.5,59.5,82.2,101.8,100.8,122.0,151.4,128.2,127.6,148.9,185.5,214.4,260.4,321.2,475.5,646.4,575.0,791.7,588.3,566.9,882.5,670.4,607.3,698.7,1068.6,1458.2,1230.4,812.4,743.7,750.3,420.1,344.3,287.5,281.5,210.5,215.5,198.8,233.0,240.5,303.3,301.7,239.6,199.0,169.7,178.0,189.2,210.7,226.3,215.5,257.5,245.2,269.0,290.0,288.5,305.2,319.4,275.6,241.3,242.7,257.5,241.9,232.1,231.5,226.7,216.9,197.4,244.8,234.0,372.9,320.8,336.6,315.8,376.0,439.5,529.2],"fert_idx":[106.7,104.2,103.6,104.1,103.7,103.0,101.6,100.4,95.6,95.5,92.2,89.2,88.9,87.1,89.4,88.7,83.3,83.8,88.5,96.2,97.8,98.1,98.3,100.2,106.0,129.6,136.8,135.5,143.4,166.5,188.1,196.0,197.5,252.6,295.0,299.3,288.5,271.3,316.7,361.0,319.5,311.0,295.5,282.2,286.0,267.8,248.2,229.4,214.7,201.6,194.2,191.7,187.4,170.0,179.0,193.7,193.6,198.9,193.2,146.8,142.5,145.0,141.7,139.9,133.4,145.3,147.9,147.5,145.9,151.8,147.1,147.0,152.8,164.1,157.8,158.8,163.7,175.8,189.9,192.1,183.8,171.6,172.7,163.4,167.3,178.2,224.9,256.5,245.5,191.9,183.5,179.9,180.7],"grains_idx":[99.4,101.2,98.5,97.5,99.9,107.5,104.5,96.8,95.6,99.0,99.1,101.1,105.2,103.3,104.0,106.2,99.1,99.9,101.3,102.4,109.8,115.6,117.8,121.5,134.9,138.5,134.2,139.1,150.3,143.9,137.9,135.7,133.0,136.2,141.5,145.1,149.7,155.8,178.4,185.0,190.0,177.5,162.8,155.6,166.5,176.0,169.2,161.8,164.7,163.6,155.5,160.3,153.9,151.1,147.3,140.9,143.7,141.1,135.0,137.9,136.0,130.4,129.5,127.9,134.1,129.9,122.6,119.5,124.9,122.1,122.1,123.2,123.0,123.1,117.7,118.1,114.9,112.5,108.9,105.7,108.8,107.4,111.1,115.4,114.9,117.2,118.4,121.0,126.7,123.5,128.7,134.2,141.0],"fpi":[98.1,98.8,98.0,98.5,99.2,100.5,100.2,98.8,98.2,100.1,103.5,106.2,108.0,104.9,100.3,97.3,96.1,98.1,98.8,100.8,103.1,106.7,111.1,114.3,119.6,122.7,125.5,128.6,135.3,132.1,131.1,134.8,136.0,140.4,142.6,140.8,143.0,149.3,168.8,167.3,167.2,164.0,149.2,146.1,144.6,144.0,143.3,140.2,138.4,137.7,134.8,135.3,131.2,129.6,131.1,128.3,128.2,127.2,127.0,125.5,123.9,123.7,125.3,125.6,126.9,127.5,127.4,128.2,131.3,133.7,134.5,134.1,131.3,133.4,134.0,135.1,133.9,134.9,136.7,137.0,135.5,133.2,131.9,131.2,130.7,132.2,135.6,138.0,138.0,137.1,138.7,141.2,143.3]},"ladder":[{"key":"gas_eu","label":"Natural gas, Europe","rise":1358,"peak":"2022-08","dur":4,"start":"2022-07","end":"2022-10"},{"key":"fert_idx","label":"Fertilizer price index","rise":261,"peak":"2022-04","dur":14,"start":"2021-10","end":"2022-11"},{"key":"grains_idx","label":"Grains price index","rise":90,"peak":"2022-05","dur":20,"start":"2021-12","end":"2023-07"},{"key":"fpi","label":"FAO Food Price Index","rise":69,"peak":"2022-03","dur":21,"start":"2021-08","end":"2023-04"},{"key":"dom","label":"Domestic food inflation (median country)","peakval":13.32,"base":2.37,"peak":"2023-02","dur":18,"start":"2022-03","end":"2023-08"}],"dom":{"months":["2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12"],"n":[191,190,199,190,189,198,191,190,198,189,189,199,191,190,198,184,186,196,190,189,198,190,189,199,191,189,198,184,186,196,190,186,196,187,187,198,190,188,198,189,186,196,189,185,194,185,186,195,190,189,197,188,188,197,189,188,197,188,188,197,188,187,196,187,187,196,188,186,195,184,183,193,159,158,168,159,158,167,158,156,162,150,151,155],"median":[1.83,1.88,2.35,2.25,2.31,2.36,2.65,2.66,2.49,2.41,2.6,2.65,3.13,3.21,3.29,4.26,3.94,3.68,3.36,3.66,3.36,3.35,3.34,3.14,2.64,2.48,2.05,1.77,2.32,2.76,2.8,3.73,4.27,4.73,5.43,5.74,6.52,7.34,7.98,9.21,10.33,11.05,12.23,12.56,12.95,13.14,12.73,13.15,12.8,13.32,12.34,11.26,10.61,10.15,8.83,8.17,7.56,6.53,5.92,5.6,4.99,4.26,3.75,3.52,3.58,3.52,3.37,3.39,3.01,3.04,3.27,3.17,3.59,3.4,3.51,3.55,3.82,3.69,3.43,3.25,3.03,2.78,2.87,2.98],"gt5":[25.1,23.7,23.1,27.9,27.5,27.3,28.8,32.6,28.3,30.7,34.4,32.2,34.0,35.3,34.8,39.7,39.8,36.2,35.3,36.5,34.8,35.8,34.9,31.7,35.6,36.5,33.8,34.2,34.4,37.2,37.9,42.5,44.4,47.6,54.5,56.1,61.1,67.6,73.2,78.8,82.8,87.8,89.4,89.2,87.6,89.2,87.6,88.7,89.5,88.4,84.3,81.4,76.1,74.6,74.1,71.8,68.5,63.8,58.0,54.3,50.0,40.1,36.7,35.3,36.4,32.7,34.6,34.9,32.3,32.1,30.6,34.7,36.5,34.8,38.7,35.8,37.3,36.5,34.8,37.8,31.5,32.7,28.5,27.1],"gt10":[10.5,10.5,9.5,11.1,11.1,12.1,11.0,13.2,13.1,13.8,14.3,15.6,17.3,16.8,17.7,21.7,20.4,18.9,19.5,19.0,18.7,18.9,17.5,16.1,14.7,18.5,16.7,15.2,16.1,16.3,18.4,20.4,22.4,23.0,24.1,26.3,28.9,34.0,37.9,45.5,51.1,54.1,59.8,65.9,66.5,67.6,67.7,69.2,68.9,63.5,62.4,55.9,53.7,52.3,44.4,33.5,28.9,23.4,20.2,19.8,17.0,16.6,16.3,15.0,13.9,15.3,15.4,15.6,14.4,14.1,13.7,13.0,15.7,12.7,11.3,9.4,11.4,12.6,13.3,10.9,11.1,11.3,11.3,7.7]},"lags":[[-14,3],[-13,5],[-12,2],[-10,1],[-9,1],[-8,1],[-7,2],[-4,1],[-3,1],[-2,3],[0,4],[1,3],[2,3],[3,9],[4,7],[5,9],[6,9],[7,9],[8,18],[9,9],[10,15],[11,14],[12,18],[13,6],[14,5],[15,2],[16,1],[17,1],[18,5],[19,1],[21,2],[22,1],[23,2],[24,1],[27,3],[28,2],[30,1],[32,1],[33,2]],"countries":[["Afghanistan","AFG","Middle East, North Africa, Afghanistan & Pakistan","LIC",26.0,"2022-06",null,null,null,3.8],["Albania","ALB","Europe & Central Asia","UMC",14.7,"2022-11",-2.8,14.3,7.8,2.9],["Algeria","DZA","Middle East, North Africa, Afghanistan & Pakistan","UMC",16.9,"2022-06",0.6,null,13.8,-0.5],["Andorra","AND","Europe & Central Asia","HIC",16.3,"2023-03",9.4,21.2,null,1.1],["Angola","AGO","Sub-Saharan Africa ","LMC",34.3,"2022-01",8.5,18.4,6.9,16.5],["Antigua and Barbuda","ATG","Latin America & Caribbean ","HIC",14.4,"2022-09",0.0,24.5,4.7,1.6],["Argentina","ARG","Latin America & Caribbean ","UMC",251.3,"2023-12",211.9,7.5,5.6,58.7],["Armenia","ARM","Europe & Central Asia","UMC",17.1,"2022-06",-22.1,17.4,5.6,1.9],["Aruba","ABW","Latin America & Caribbean ","HIC",13.3,"2022-12",0.0,33.5,8.6,11.1],["Austria","AUT","Europe & Central Asia","HIC",17.0,"2023-01",9.4,7.4,1.3,1.0],["Azerbaijan","AZE","Europe & Central Asia","UMC",22.5,"2022-09",0.0,18.5,5.1,3.3],["Bahamas, The","BHS","Latin America & Caribbean ","HIC",18.0,"2022-10",0.0,21.9,5.1,0.2],["Bahrain","BHR","Middle East, North Africa, Afghanistan & Pakistan","HIC",12.7,"2022-11",0.0,12.3,1.8,2.4],["Bangladesh","BGD","South Asia","LMC",13.1,"2023-10",24.9,null,6.3,5.6],["Barbados","BRB","Latin America & Caribbean ","HIC",27.4,"2023-01",0.0,21.9,null,6.0],["Belarus","BLR","Europe & Central Asia","UMC",19.8,"2022-07",18.5,10.3,2.1,6.4],["Belgium","BEL","Europe & Central Asia","HIC",18.0,"2023-03",9.4,9.3,0.9,0.8],["Belize","BLZ","Latin America & Caribbean ","UMC",15.8,"2023-03",0.0,20.9,3.8,0.6],["Benin","BEN","Sub-Saharan Africa ","LMC",15.5,"2022-01",9.4,35.1,null,-0.6],["Bermuda","BMU","North America","HIC",10.6,"2022-09",0.0,21.8,null,2.7],["Bhutan","BTN","South Asia","LMC",6.2,"2022-07",11.7,null,10.5,3.6],["Bolivia","BOL","Latin America & Caribbean ","LMC",6.8,"2023-01",0.0,7.7,5.0,3.4],["Bosnia and Herzegovina","BIH","Europe & Central Asia","UMC",26.2,"2022-09",9.4,15.6,8.3,1.1],["Botswana","BWA","Sub-Saharan Africa ","UMC",17.8,"2023-03",22.6,11.4,6.0,1.4],["Brazil","BRA","Latin America & Caribbean ","UMC",14.7,"2022-07",-7.4,5.4,11.1,4.9],["Brunei Darussalam","BRN","East Asia & Pacific","HIC",7.0,"2022-08",-0.1,7.2,5.9,-0.7],["Bulgaria","BGR","Europe & Central Asia","HIC",26.6,"2022-11",9.4,10.9,8.3,5.2],["Burkina Faso","BFA","Sub-Saharan Africa ","LIC",37.7,"2022-07",9.4,11.7,null,-6.3],["Burundi","BDI","Sub-Saharan Africa ","LIC",48.9,"2023-03",30.3,14.3,2.6,-2.8],["Cabo Verde","CPV","Sub-Saharan Africa ","UMC",17.9,"2022-09",9.2,21.2,7.9,1.4],["Cambodia","KHM","East Asia & Pacific","LMC",6.5,"2022-06",0.3,6.1,7.0,2.1],["Cameroon","CMR","Sub-Saharan Africa ","LMC",16.4,"2022-11",9.4,22.3,5.2,2.9],["Canada","CAN","North America","HIC",11.4,"2022-11",7.7,8.7,1.7,3.7],["Chad","TCD","Sub-Saharan Africa ","LIC",21.6,"2022-11",9.4,null,null,-5.2],["Chile","CHL","Latin America & Caribbean ","HIC",24.7,"2022-12",10.7,11.4,4.7,2.6],["China","CHN","East Asia & Pacific","UMC",8.7,"2022-09",9.8,8.1,11.5,9.4],["Colombia","COL","Latin America & Caribbean ","UMC",27.8,"2022-12",15.5,13.8,8.1,4.9],["Comoros","COM","Sub-Saharan Africa ","LMC",20.3,"2023-01",9.4,25.3,9.4,5.1],["Congo, Rep.","COG","Sub-Saharan Africa ","LMC",9.5,"2022-03",9.4,31.7,1.6,null],["Costa Rica","CRI","Latin America & Caribbean ","HIC",22.4,"2022-08",-12.4,13.3,3.1,0.8],["Cote d'Ivoire","CIV","Sub-Saharan Africa ","LMC",11.9,"2022-01",9.4,22.0,null,-3.6],["Croatia","HRV","Europe & Central Asia","HIC",19.8,"2022-10",null,12.8,8.4,-0.1],["Curacao","CUW","Latin America & Caribbean ","HIC",16.0,"2023-05",0.0,null,null,6.0],["Cyprus","CYP","Europe & Central Asia","HIC",15.5,"2022-11",9.4,15.2,0.2,0.6],["Czechia","CZE","Europe & Central Asia","HIC",26.0,"2022-11",2.4,5.6,9.4,2.8],["Denmark","DNK","Europe & Central Asia","HIC",15.9,"2022-08",9.6,12.9,4.2,1.4],["Djibouti","DJI","Middle East, North Africa, Afghanistan & Pakistan","LMC",25.7,"2022-06",0.0,41.1,1.3,5.7],["Dominica","DMA","Latin America & Caribbean ","UMC",10.1,"2023-09",0.0,24.9,7.0,1.9],["Dominican Republic","DOM","Latin America & Caribbean ","UMC",13.0,"2022-06",-1.9,16.8,4.6,3.8],["Ecuador","ECU","Latin America & Caribbean ","UMC",8.2,"2023-08",0.0,12.5,3.1,0.0],["Egypt, Arab Rep.","EGY","Middle East, North Africa, Afghanistan & Pakistan","LMC",73.6,"2023-09",95.8,21.3,4.4,7.5],["El Salvador","SLV","Latin America & Caribbean ","UMC",14.5,"2022-08",0.0,16.8,2.4,1.2],["Equatorial Guinea","GNQ","Sub-Saharan Africa ","UMC",7.8,"2022-06",9.4,null,null,0.8],["Estonia","EST","Europe & Central Asia","HIC",29.7,"2022-12",9.4,9.4,0.9,3.0],["Eswatini","SWZ","Sub-Saharan Africa ","LMC",17.0,"2023-02",24.8,18.6,2.6,2.2],["Ethiopia","ETH","Sub-Saharan Africa ","LIC",43.9,"2022-05",24.8,28.2,0.9,18.8],["Fiji","FJI","East Asia & Pacific","UMC",12.0,"2023-11",8.7,20.2,7.2,4.9],["Finland","FIN","Europe & Central Asia","HIC",16.3,"2023-02",9.4,7.2,1.4,1.2],["France","FRA","Europe & Central Asia","HIC",16.9,"2023-03",9.4,9.7,2.7,2.5],["French Polynesia","PYF","East Asia & Pacific","HIC",12.6,"2023-01",9.4,22.3,null,1.2],["Gabon","GAB","Sub-Saharan Africa ","UMC",8.9,"2022-11",9.4,16.9,null,3.1],["Gambia, The","GMB","Sub-Saharan Africa ","LIC",24.4,"2023-09",18.7,23.1,10.0,6.8],["Georgia","GEO","Europe & Central Asia","UMC",22.0,"2022-05",-18.4,12.9,3.8,8.2],["Germany","DEU","Europe & Central Asia","HIC",21.2,"2023-03",9.4,7.8,2.0,1.2],["Ghana","GHA","Sub-Saharan Africa ","LMC",60.9,"2023-01",89.8,17.4,3.9,7.5],["Greece","GRC","Europe & Central Asia","HIC",15.5,"2022-12",9.4,11.6,1.5,-0.1],["Grenada","GRD","Latin America & Caribbean ","UMC",9.8,"2023-03",0.0,24.0,5.7,0.4],["Guatemala","GTM","Latin America & Caribbean ","UMC",15.4,"2023-02",1.3,15.7,8.2,7.9],["Guinea","GIN","Sub-Saharan Africa ","LMC",18.9,"2023-04",null,null,4.3,11.4],["Guinea-Bissau","GNB","Sub-Saharan Africa ","LIC",13.7,"2023-05",9.4,null,null,1.0],["Haiti","HTI","Latin America & Caribbean ","LMC",53.1,"2022-10",58.1,null,5.8,22.2],["Honduras","HND","Latin America & Caribbean ","LMC",17.3,"2022-11",2.4,19.2,6.0,2.2],["Hong Kong SAR, China","HKG","East Asia & Pacific","HIC",7.5,"2022-03",0.7,3.7,6.5,9.7],["Hungary","HUN","Europe & Central Asia","HIC",47.8,"2022-12",16.5,5.8,3.0,5.1],["Iceland","ISL","Europe & Central Asia","HIC",12.5,"2023-04",8.6,11.3,7.7,3.8],["India","IND","South Asia","LMC",10.6,"2023-07",11.7,5.1,9.8,3.6],["Indonesia","IDN","East Asia & Pacific","UMC",9.3,"2022-07",6.5,11.6,6.8,1.5],["Iran, Islamic Rep.","IRN","Middle East, North Africa, Afghanistan & Pakistan","UMC",87.1,"2022-07",0.0,30.9,null,58.4],["Iraq","IRQ","Middle East, North Africa, Afghanistan & Pakistan","UMC",9.6,"2023-01",-9.5,12.9,14.5,0.0],["Ireland","IRL","Europe & Central Asia","HIC",13.1,"2023-04",9.4,8.6,0.2,-0.7],["Israel","ISR","Middle East, North Africa, Afghanistan & Pakistan","HIC",6.8,"2023-12",13.5,9.4,17.1,2.1],["Italy","ITA","Europe & Central Asia","HIC",13.6,"2022-11",9.4,9.7,3.9,0.8],["Jamaica","JAM","Latin America & Caribbean ","UMC",14.7,"2022-03",2.2,21.0,7.1,6.3],["Japan","JPN","East Asia & Pacific","HIC",8.9,"2023-09",28.0,9.5,16.1,0.2],["Jordan","JOR","Middle East, North Africa, Afghanistan & Pakistan","UMC",5.5,"2022-05",0.0,21.0,9.4,0.3],["Kazakhstan","KAZ","Europe & Central Asia","UMC",26.2,"2023-02",7.1,17.4,5.4,8.0],["Kenya","KEN","Sub-Saharan Africa ","LMC",15.5,"2022-10",27.6,16.0,4.4,8.2],["Kiribati","KIR","East Asia & Pacific","LMC",31.5,"2023-01",13.1,41.4,null,-1.6],["Korea, Rep.","KOR","East Asia & Pacific","HIC",7.9,"2022-08",14.1,6.2,7.5,0.1],["Kuwait","KWT","Middle East, North Africa, Afghanistan & Pakistan","HIC",9.1,"2022-04",1.8,16.6,11.6,1.1],["Kyrgyz Republic","KGZ","Europe & Central Asia","LMC",18.9,"2022-08",3.8,15.4,5.5,1.4],["Lao PDR","LAO","East Asia & Pacific","LMC",52.7,"2023-05",82.4,16.1,3.0,4.7],["Latvia","LVA","Europe & Central Asia","HIC",29.5,"2022-11",9.4,15.1,2.3,2.9],["Lebanon","LBN","Middle East, North Africa, Afghanistan & Pakistan","LMC",483.2,"2022-01",820.4,16.5,21.6,4.3],["Lesotho","LSO","Sub-Saharan Africa ","LMC",10.9,"2023-02",24.8,20.7,4.1,6.8],["Liberia","LBR","Sub-Saharan Africa ","LIC",26.9,"2023-12",5.3,26.4,4.5,29.6],["Libya","LBY","Middle East, North Africa, Afghanistan & Pakistan","UMC",5.5,"2022-03",6.6,null,36.8,-3.8],["Lithuania","LTU","Europe & Central Asia","HIC",35.6,"2022-11",9.4,11.3,1.2,2.9],["Luxembourg","LUX","Europe & Central Asia","HIC",13.3,"2023-03",9.4,12.1,0.1,1.4],["Macao SAR, China","MAC","East Asia & Pacific","HIC",2.9,"2023-10",0.7,11.1,10.6,3.8],["Madagascar","MDG","Sub-Saharan Africa ","LIC",15.5,"2023-03",15.7,21.5,5.5,4.8],["Malawi","MWI","Sub-Saharan Africa ","LIC",43.5,"2023-12",44.1,10.4,null,14.3],["Malaysia","MYS","East Asia & Pacific","UMC",7.3,"2022-11",10.1,8.9,5.2,1.7],["Maldives","MDV","South Asia","UMC",8.0,"2023-03",0.1,22.8,2.4,-0.7],["Mali","MLI","Sub-Saharan Africa ","LIC",20.1,"2022-08",9.4,16.8,null,-1.7],["Malta","MLT","Middle East, North Africa, Afghanistan & Pakistan","HIC",13.7,"2022-10",9.4,11.7,0.3,3.6],["Mauritania","MRT","Sub-Saharan Africa ","LMC",20.0,"2022-10",1.2,25.2,5.4,2.7],["Mauritius","MUS","Sub-Saharan Africa ","UMC",18.3,"2022-03",8.6,21.6,6.9,0.1],["Mexico","MEX","Latin America & Caribbean ","UMC",14.6,"2022-09",-12.4,6.4,4.1,4.4],["Moldova","MDA","Europe & Central Asia","UMC",39.4,"2022-08",2.7,13.4,5.5,7.8],["Mongolia","MNG","East Asia & Pacific","UMC",22.7,"2022-07",21.6,14.0,4.5,10.7],["Montenegro","MNE","Europe & Central Asia","UMC",30.2,"2022-11",9.4,23.6,6.0,3.1],["Morocco","MAR","Middle East, North Africa, Afghanistan & Pakistan","LMC",20.8,"2023-02",12.7,13.0,6.8,-1.2],["Mozambique","MOZ","Sub-Saharan Africa ","LIC",18.2,"2023-03",-2.4,20.2,4.1,3.3],["Namibia","NAM","Sub-Saharan Africa ","LMC",14.6,"2023-03",24.8,15.2,4.5,4.3],["Nepal","NPL","South Asia","LMC",9.6,"2023-09",11.8,21.0,6.7,5.7],["Netherlands","NLD","Europe & Central Asia","HIC",17.9,"2023-02",9.4,12.0,0.7,4.0],["New Caledonia","NCL","East Asia & Pacific","HIC",12.0,"2022-12",9.4,null,null,-2.8],["New Zealand","NZL","East Asia & Pacific","HIC",13.8,"2023-04",15.2,11.5,2.5,1.1],["Nicaragua","NIC","Latin America & Caribbean ","LMC",18.9,"2022-08",3.6,13.9,5.3,4.6],["Niger","NER","Sub-Saharan Africa ","LIC",12.6,"2023-09",9.4,36.2,null,-4.6],["Nigeria","NGA","Sub-Saharan Africa ","LMC",33.7,"2023-12",60.8,14.2,6.4,13.7],["North Macedonia","MKD","Europe & Central Asia","UMC",31.2,"2022-10",9.3,9.5,4.1,1.6],["Norway","NOR","Europe & Central Asia","HIC",13.4,"2023-06",23.0,10.4,5.6,1.1],["Oman","OMN","Middle East, North Africa, Afghanistan & Pakistan","HIC",5.5,"2022-06",0.0,16.6,5.3,1.4],["Pakistan","PAK","Middle East, North Africa, Afghanistan & Pakistan","LMC",48.7,"2023-05",72.1,12.9,3.4,10.6],["Panama","PAN","Latin America & Caribbean ","HIC",5.3,"2023-01",0.0,18.2,3.6,0.5],["Paraguay","PRY","Latin America & Caribbean ","UMC",19.8,"2022-04",7.6,7.6,7.3,1.2],["Peru","PER","Latin America & Caribbean ","UMC",17.0,"2023-02",-3.5,12.5,12.0,1.6],["Philippines","PHL","East Asia & Pacific","UMC",10.8,"2023-01",12.9,13.2,9.7,2.1],["Poland","POL","Europe & Central Asia","HIC",23.9,"2023-02",8.8,8.3,4.8,4.8],["Portugal","PRT","Europe & Central Asia","HIC",21.5,"2023-02",9.4,14.1,3.1,0.3],["Puerto Rico (US)","PRI","Latin America & Caribbean ","HIC",11.1,"2023-01",0.0,null,null,-0.1],["Qatar","QAT","Middle East, North Africa, Afghanistan & Pakistan","HIC",7.2,"2022-01",0.0,10.8,6.8,-0.1],["Romania","ROU","Europe & Central Asia","HIC",22.4,"2023-01",9.9,9.8,4.3,4.7],["Russian Federation","RUS","Europe & Central Asia","HIC",22.7,"2022-04",15.6,10.9,15.1,5.7],["Rwanda","RWA","Sub-Saharan Africa ","LIC",64.5,"2022-11",17.3,19.8,5.5,4.0],["Samoa","WSM","East Asia & Pacific","UMC",23.7,"2023-04",7.1,30.9,7.7,1.0],["San Marino","SMR","Europe & Central Asia","HIC",14.3,"2023-02",9.4,null,3.5,1.2],["Sao Tome and Principe","STP","Sub-Saharan Africa ","LMC",28.6,"2022-12",9.4,34.8,4.4,9.0],["Saudi Arabia","SAU","Middle East, North Africa, Afghanistan & Pakistan","HIC",4.4,"2022-06",0.0,15.1,25.1,2.1],["Senegal","SEN","Sub-Saharan Africa ","LMC",21.4,"2022-11",9.4,21.4,null,1.9],["Serbia","SRB","Europe & Central Asia","UMC",25.4,"2023-03",9.1,null,5.3,2.6],["Seychelles","SYC","Sub-Saharan Africa ","HIC",3.1,"2023-01",-17.2,19.5,4.4,-0.0],["Sierra Leone","SLE","Sub-Saharan Africa ","LIC",64.7,"2023-09",104.1,null,5.7,8.8],["Singapore","SGP","East Asia & Pacific","HIC",7.4,"2023-02",-0.1,3.9,5.9,1.1],["Slovak Republic","SVK","Europe & Central Asia","HIC",28.1,"2023-03",9.4,5.8,1.0,4.0],["Slovenia","SVN","Europe & Central Asia","HIC",19.3,"2023-01",9.4,6.4,0.5,1.6],["Solomon Islands","SLB","East Asia & Pacific","LMC",12.6,"2023-01",4.3,null,12.7,-0.4],["Somalia, Fed. Rep.","SOM","Sub-Saharan Africa ","LIC",17.5,"2022-07",null,null,null,6.1],["South Africa","ZAF","Sub-Saharan Africa ","UMC",14.0,"2023-03",24.8,7.2,5.6,3.5],["South Sudan","SSD","Sub-Saharan Africa ","LIC",11.4,"2023-01",203.7,null,0.9,109.4],["Spain","ESP","Europe & Central Asia","HIC",16.6,"2023-02",9.4,11.1,2.0,1.0],["Sri Lanka","LKA","South Asia","UMC",85.1,"2022-08",64.8,13.4,1.6,0.7],["St. Kitts and Nevis","KNA","Latin America & Caribbean ","HIC",12.1,"2022-06",0.0,null,8.9,1.9],["St. Lucia","LCA","Latin America & Caribbean ","UMC",10.2,"2023-04",0.0,null,5.3,2.2],["St. Vincent and the Grenadines","VCT","Latin America & Caribbean ","UMC",15.1,"2022-10",0.0,28.2,8.3,0.6],["Suriname","SUR","Latin America & Caribbean ","UMC",72.6,"2023-06",101.6,16.1,4.7,5.3],["Sweden","SWE","Europe & Central Asia","HIC",21.0,"2023-02",23.7,10.0,2.3,2.8],["Switzerland","CHE","Europe & Central Asia","HIC",6.5,"2023-02",-1.7,4.6,19.2,0.1],["Tajikistan","TJK","Europe & Central Asia","LMC",9.6,"2022-07",-4.1,22.8,6.7,11.0],["Tanzania","TZA","Sub-Saharan Africa ","LMC",9.9,"2023-01",3.7,8.5,null,2.9],["Thailand","THA","East Asia & Pacific","UMC",9.8,"2022-09",8.8,6.8,9.0,2.3],["Timor-Leste","TLS","East Asia & Pacific","LMC",12.4,"2023-12",0.0,32.7,8.8,1.1],["Togo","TGO","Sub-Saharan Africa ","LMC",22.3,"2022-04",9.4,16.3,null,-0.5],["Tonga","TON","East Asia & Pacific","UMC",13.9,"2023-12",4.4,35.7,13.9,1.8],["Trinidad and Tobago","TTO","Latin America & Caribbean ","HIC",17.3,"2023-01",-0.1,17.7,8.4,0.6],["Tunisia","TUN","Middle East, North Africa, Afghanistan & Pakistan","LMC",15.9,"2023-05",11.2,12.1,5.3,6.9],["Turkiye","TUR","Europe & Central Asia","UMC",102.5,"2022-11",168.2,6.4,4.4,20.2],["Uganda","UGA","Sub-Saharan Africa ","LIC",23.1,"2022-12",3.9,14.2,5.0,-0.2],["Ukraine","UKR","Europe & Central Asia","UMC",35.7,"2022-10",34.0,10.6,3.5,8.0],["United Arab Emirates","ARE","Middle East, North Africa, Afghanistan & Pakistan","HIC",9.2,"2022-07",0.0,5.4,null,-1.4],["United Kingdom","GBR","Europe & Central Asia","HIC",19.1,"2023-03",10.7,9.4,1.9,1.4],["United States","USA","North America","HIC",13.5,"2022-08",0.0,6.6,2.0,0.9],["Uruguay","URY","Latin America & Caribbean ","HIC",13.3,"2022-09",-10.9,14.1,9.0,8.7],["Uzbekistan","UZB","Europe & Central Asia","LMC",16.5,"2022-06",10.6,12.9,14.1,17.0],["Venezuela, RB","VEN","Latin America & Caribbean ","LMC",489.3,"2023-03",null,null,null,143491.6],["Viet Nam","VNM","East Asia & Pacific","UMC",6.1,"2023-01",2.7,8.3,3.7,4.1],["West Bank and Gaza","PSE","Middle East, North Africa, Afghanistan & Pakistan","LMC",24.7,"2023-12",null,31.7,1.0,3.3],["Zambia","ZMB","Sub-Saharan Africa ","LMC",16.9,"2022-01",1.0,9.0,3.5,10.4],["Zimbabwe","ZWE","Sub-Saharan Africa ","LMC",255.6,"2023-06",3862.8,14.4,1.1,324.2]],"episodes":{"2022":{"brent":[100.0,120.7,110.4,117.3,125.4,113.7,102.9,94.2,97.2,95.1,84.4,86.7,86.3,81.9,87.8,79.0,78.2,83.6,90.0],"gas_eu":[100.0,155.7,118.3,107.1,123.2,188.5,257.2,217.0,143.3,131.2,132.4,74.1,60.7,50.7,49.7,37.1,38.0,35.1,41.1],"urea":[100.0,117.2,124.3,95.1,92.7,80.8,79.5,91.1,85.5,79.1,69.8,59.6,48.0,42.1,42.1,44.2,38.6,45.0,51.8],"fert_idx":[100.0,116.8,133.1,117.8,114.6,108.9,104.0,105.4,98.7,91.5,84.5,79.2,74.3,71.6,70.7,69.1,62.7,66.0,71.4],"grains_idx":[100.0,114.5,118.8,121.9,113.9,104.5,99.9,106.9,113.0,108.6,103.8,105.7,105.0,99.8,102.9,98.8,97.0,94.5,90.4],"fpi":[100.0,113.1,112.1,112.0,109.9,99.9,97.9,96.9,96.5,96.0,93.9,92.7,92.2,90.3,90.6,87.9,86.8,87.8,86.0]},"2026":{"brent":[100.0,145.9,169.3,151.2,120.1,117.3,127.8,164.3],"gas_eu":[100.0,159.3,137.1,143.9,135.0,160.7,187.8,226.2],"urea":[100.0,153.7,181.5,163.2,96.0,84.7,82.6,86.3],"fert_idx":[100.0,126.2,143.9,137.7,107.7,103.0,101.0,101.4],"grains_idx":[100.0,101.0,103.2,108.1,105.4,109.8,114.5,120.2],"fpi":[100.0,102.5,104.4,104.4,103.7,104.9,106.8,108.4]}}};

  function tok(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function alpha(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function median(a) {
    var v = a.slice().sort(function (x, y) { return x - y; }), m = Math.floor(v.length / 2);
    return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
  }
  // Average ranks for ties, then Pearson on the ranks: Spearman's rho.
  function ranks(a) {
    var idx = a.map(function (v, i) { return i; }).sort(function (i, j) { return a[i] - a[j]; });
    var r = new Array(a.length), k = 0;
    while (k < idx.length) {
      var j = k;
      while (j + 1 < idx.length && a[idx[j + 1]] === a[idx[k]]) j++;
      for (var t = k; t <= j; t++) r[idx[t]] = (k + j) / 2;
      k = j + 1;
    }
    return r;
  }
  function spearman(x, y) {
    var rx = ranks(x), ry = ranks(y), n = x.length;
    var mx = rx.reduce(function (s, v) { return s + v; }, 0) / n, my = ry.reduce(function (s, v) { return s + v; }, 0) / n;
    var sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i++) { sxy += (rx[i] - mx) * (ry[i] - my); sxx += (rx[i] - mx) * (rx[i] - mx); syy += (ry[i] - my) * (ry[i] - my); }
    return sxy / Math.sqrt(sxx * syy);
  }
  function monthLabel(m) {
    var names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var p = m.split('-'); return names[+p[1] - 1] + ' ' + p[0];
  }
  function monthsFrom(m, origin) {
    var a = m.split('-'), b = origin.split('-');
    return (+a[0] - +b[0]) * 12 + (+a[1] - +b[1]);
  }
  function pct(v, d) { return (v > 0 ? '+' : '') + v.toFixed(d == null ? 0 : d) + '%'; }

  var C = DATA.countries.map(function (r) {
    return { name: r[0], iso: r[1], region: r[2], inc: r[3], peak: r[4], peakm: r[5], dep: r[6], food: r[7], res: r[8], base: r[9] };
  });

  // A vertical marker (or shaded band) on a category axis, drawn under the data.
  function markers(opts) {
    return {
      id: 'marks-' + Math.random().toString(36).slice(2, 7),
      beforeDatasetsDraw: function (chart) {
        var x = chart.scales.x, a = chart.chartArea, ctx = chart.ctx;
        ctx.save();
        (opts.bands || []).forEach(function (b) {
          var i0 = x.getPixelForValue(b.from), i1 = x.getPixelForValue(b.to);
          ctx.fillStyle = b.color;
          ctx.fillRect(i0, a.top, Math.max(1, i1 - i0), a.bottom - a.top);
          if (b.label) {
            ctx.fillStyle = b.ink; ctx.font = '600 10px ' + tok('--mono');
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText(b.label, i0 + 5, a.top + 5);
          }
        });
        (opts.lines || []).forEach(function (l) {
          var px = x.getPixelForValue(l.at);
          ctx.strokeStyle = l.color; ctx.lineWidth = 1.2; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.stroke();
          ctx.setLineDash([]);
          if (l.label) {
            ctx.fillStyle = l.color; ctx.font = '600 10px ' + tok('--mono');
            ctx.textAlign = l.align || 'left'; ctx.textBaseline = 'top';
            ctx.fillText(l.label, px + (l.align === 'right' ? -5 : 5), a.top + 4);
          }
        });
        ctx.restore();
      },
    };
  }

  HH.onReady(function () {
    if (typeof Chart === 'undefined') return;

    var axis = HH.axis, labels = HH.valueLabels;
    var S = [tok('--stage-1'), tok('--stage-2'), tok('--stage-3'), tok('--stage-4'), tok('--stage-5')];
    var INK = tok('--text'), MUTED = tok('--stage-muted'), ACCENT = tok('--accent');
    var CHAIN = [
      { key: 'gas_eu', label: 'Natural gas, Europe', color: S[0] },
      { key: 'fert_idx', label: 'Fertilizer index', color: S[1] },
      { key: 'grains_idx', label: 'Grains index', color: S[2] },
      { key: 'fpi', label: 'FAO Food Price Index', color: S[3] },
    ];

    /* --- 2. The cascade clock ----------------------------------------------- */

    var M = DATA.months;
    HH.chart('chart-chain', {
      type: 'line',
      data: {
        labels: M,
        datasets: CHAIN.map(function (c) {
          return { label: c.label, data: DATA.chain[c.key], borderColor: c.color, backgroundColor: c.color, borderWidth: 2.2, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 };
        }),
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 12, boxHeight: 3, font: { size: 11 } } },
          tooltip: { callbacks: { title: function (c) { return monthLabel(c[0].label); }, label: function (c) { return c.dataset.label + ': ' + Math.round(c.parsed.y) + ' (2019 = 100)'; } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: { maxRotation: 0, autoSkip: false, color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v, i) { return M[i].slice(5) === '01' ? M[i].slice(0, 4) : ''; } } }),
          y: Object.assign(axis({ title: '2019 average = 100 (log scale)' }), {
            type: 'logarithmic', min: 25, max: 2000,
            afterBuildTicks: function (sc) { sc.ticks = [25, 50, 100, 200, 500, 1000, 2000].map(function (v) { return { value: v }; }); },
            ticks: { color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v) { return [25, 50, 100, 200, 500, 1000, 2000].indexOf(v) > -1 ? v : ''; } },
          }),
        },
      },
      plugins: [markers({
        bands: [
          { from: '2022-02', to: '2023-02', color: alpha(S[0], 0.07), ink: S[0], label: 'Feb 2022 →' },
          { from: '2026-02', to: '2026-09', color: alpha(S[0], 0.07), ink: S[0], label: 'Feb 2026 →' },
        ],
      })],
    });

    var L = DATA.ladder;
    var global = L.filter(function (r) { return r.key !== 'dom'; });
    HH.chart('chart-height', {
      type: 'bar',
      data: {
        labels: global.map(function (r) { return r.label.replace(' price index', '').replace('Natural gas, Europe', 'Gas (Europe)').replace('FAO Food Price Index', 'World food (FAO)'); }),
        datasets: [{ data: global.map(function (r) { return r.rise; }), backgroundColor: S.slice(0, 4), barPercentage: 0.7 }],
      },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 56 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '+' + c.parsed.x.toLocaleString() + '% from the 2019 average (peak ' + monthLabel(global[c.dataIndex].peak) + ')'; } } } },
        scales: {
          x: Object.assign(axis({ title: 'Per cent rise (log scale)' }), { type: 'logarithmic', min: 10, max: 3000, afterBuildTicks: function (sc) { sc.ticks = [10, 30, 100, 300, 1000, 3000].map(function (v) { return { value: v }; }); }, ticks: { maxRotation: 0, color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v) { return v.toLocaleString() + '%'; } } }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return '+' + v.toLocaleString() + '%'; } })],
    });

    HH.chart('chart-length', {
      type: 'bar',
      data: {
        labels: L.map(function (r) { return r.key === 'dom' ? 'Households (median)' : r.label.replace(' price index', '').replace('Natural gas, Europe', 'Gas (Europe)').replace('FAO Food Price Index', 'World food (FAO)'); }),
        datasets: [{ data: L.map(function (r) { return r.dur; }), backgroundColor: S, barPercentage: 0.7 }],
      },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 40 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { var r = L[c.dataIndex]; return c.parsed.x + ' months, ' + monthLabel(r.start) + ' – ' + monthLabel(r.end); } } } },
        scales: {
          x: Object.assign(axis({ title: 'Months' }), { beginAtZero: true, max: 24 }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return v + ' mo'; } })],
    });

    /* --- 3. The domestic leg -------------------------------------------------- */

    var D = DATA.dom;
    var peakLine = { at: '2022-03', color: S[3], label: 'World food peak, Mar 2022' };
    HH.chart('chart-share', {
      type: 'line',
      data: {
        labels: D.months,
        datasets: [
          { label: 'Food inflation above 5%', data: D.gt5, borderColor: S[3], backgroundColor: alpha(S[3], 0.12), fill: true, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 },
          { label: 'Food inflation above 10%', data: D.gt10, borderColor: S[4], backgroundColor: alpha(S[4], 0.18), fill: true, borderWidth: 2.4, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 12, boxHeight: 3, font: { size: 11 } } },
          tooltip: { callbacks: { title: function (c) { return monthLabel(c[0].label) + ' · ' + D.n[c[0].dataIndex] + ' countries'; }, label: function (c) { return c.dataset.label + ': ' + c.parsed.y.toFixed(0) + '% of countries'; } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: { maxRotation: 0, autoSkip: false, color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v, i) { return D.months[i].slice(5) === '01' ? D.months[i].slice(0, 4) : ''; } } }),
          y: Object.assign(axis({ title: 'Per cent of countries' }), { min: 0, max: 100, ticks: { color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v) { return v + '%'; } } }),
        },
      },
      plugins: [markers({ lines: [peakLine] })],
    });

    HH.chart('chart-median', {
      type: 'line',
      data: {
        labels: D.months,
        datasets: [{ label: 'Median country', data: D.median, borderColor: S[4], backgroundColor: S[4], borderWidth: 2.4, pointRadius: 0, pointHoverRadius: 4, tension: 0.2 }],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { callbacks: { title: function (c) { return monthLabel(c[0].label); }, label: function (c) { return 'Median food inflation: ' + c.parsed.y.toFixed(1) + '%'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false }), { ticks: { maxRotation: 0, autoSkip: false, color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v, i) { return D.months[i].slice(5) === '01' ? "'" + D.months[i].slice(2, 4) : ''; } } }),
          y: Object.assign(axis({ title: 'Per cent, year on year' }), { min: 0, max: 15 }),
        },
      },
      plugins: [markers({ lines: [{ at: '2022-03', color: S[3] }, { at: '2023-02', color: S[4], label: 'Peak, Feb 2023', align: 'right' }] })],
    });

    var lagMap = {};
    DATA.lags.forEach(function (p) { lagMap[p[0]] = p[1]; });
    var lagX = [];
    for (var k = -14; k <= 33; k++) lagX.push(k);
    HH.chart('chart-lags', {
      type: 'bar',
      data: {
        labels: lagX.map(String),
        datasets: [{
          data: lagX.map(function (x) { return lagMap[x] || 0; }),
          backgroundColor: lagX.map(function (x) { return x <= 0 ? MUTED : S[4]; }),
          barPercentage: 1, categoryPercentage: 0.9,
        }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { title: function (c) { var x = +c[0].label; return x === 0 ? 'Same month as the world peak' : (x > 0 ? x + ' months after' : -x + ' months before') + ' the world peak'; }, label: function (c) { return c.parsed.y + ' countries'; } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false, title: 'Months from March 2022' }), { ticks: { maxRotation: 0, autoSkip: false, color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v, i) { return lagX[i] % 6 === 0 ? lagX[i] : ''; } } }),
          y: Object.assign(axis({ title: 'Countries' }), { beginAtZero: true, ticks: { stepSize: 5, color: tok('--text-muted'), font: { size: 10.5 } } }),
        },
      },
      plugins: [markers({ lines: [{ at: '9', color: INK, label: 'Median: 9 months' }] })],
    });

    /* --- 4. What amplifies ------------------------------------------------------- */

    var AMP = {
      dep: { label: 'Currency change vs US$, 2021→2023', short: 'currency change', get: function (c) { return c.dep; }, toX: function (v) { return 1 + v / 100; }, log: true, ticks: [0.8, 1, 1.5, 2, 3, 5, 10, 40], tick: function (r) { return pct((r - 1) * 100); }, fmt: function (v) { return pct(v, 1); } },
      food: { label: 'Food share of merchandise imports, 2021', short: 'food-import share', get: function (c) { return c.food; }, toX: function (v) { return v; }, log: false, fmt: function (v) { return v.toFixed(1) + '%'; } },
      res: { label: 'Reserves, months of imports, 2021', short: 'reserves cover', get: function (c) { return c.res; }, toX: function (v) { return Math.max(v, 0.1); }, log: true, ticks: [0.1, 0.3, 1, 3, 10, 30], tick: function (r) { return r; }, fmt: function (v) { return v.toFixed(1) + ' months'; } },
      base: { label: 'Food inflation before the shock, 2019', short: 'prior food inflation', get: function (c) { return c.base; }, toX: function (v) { return 1 + v / 100; }, log: true, ticks: [0.9, 1, 1.1, 1.2, 1.5, 2, 5, 20, 100], tick: function (r) { return pct((r - 1) * 100); }, fmt: function (v) { return pct(v, 1); } },
    };
    var INC = [
      { id: 'HIC', label: 'High income', color: S[3] },
      { id: 'UMC', label: 'Upper-middle income', color: S[2] },
      { id: 'LMC', label: 'Lower-middle income', color: S[1] },
      { id: 'LIC', label: 'Low income', color: S[0] },
    ];
    var ampKey = 'dep', selected = null;
    var ampSel = document.getElementById('amp-select');
    var ampSearch = document.getElementById('amp-search');
    var dl = document.getElementById('amp-countries');
    if (dl) dl.innerHTML = C.map(function (c) { return '<option value="' + c.name.replace(/"/g, '&quot;') + '"></option>'; }).join('');

    function pts(a, filter) {
      return C.filter(function (c) { return a.get(c) != null && filter(c); }).map(function (c) { return { x: a.toX(a.get(c)), y: c.peak, c: c }; });
    }
    function ampDatasets() {
      var a = AMP[ampKey];
      var ds = INC.map(function (g) {
        return { label: g.label, data: pts(a, function (c) { return c.inc === g.id; }), backgroundColor: alpha(g.color, 0.62), borderColor: g.color, borderWidth: 1, pointRadius: 4, pointHoverRadius: 6 };
      });
      ds.push({ label: 'Not classified', data: pts(a, function (c) { return ['HIC', 'UMC', 'LMC', 'LIC'].indexOf(c.inc) === -1; }), backgroundColor: alpha(MUTED, 0.9), borderColor: MUTED, borderWidth: 1, pointRadius: 4, pointHoverRadius: 6 });
      ds.push({ label: 'Selected', data: selected && a.get(selected) != null ? [{ x: a.toX(a.get(selected)), y: selected.peak, c: selected }] : [], backgroundColor: INK, borderColor: ACCENT, borderWidth: 3, pointRadius: 8, pointHoverRadius: 9, pointStyle: 'rectRot' });
      return ds;
    }
    function xScale() {
      var a = AMP[ampKey];
      var base = Object.assign(axis({ title: a.label + (a.log ? ' (log scale)' : '') }), {});
      if (a.log) {
        base.type = 'logarithmic';
        base.ticks = { color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v) { return a.ticks.some(function (t) { return Math.abs(t - v) < 1e-9; }) ? a.tick(v) : ''; } };
        base.afterBuildTicks = function (s) { s.ticks = a.ticks.filter(function (t) { return t >= s.min && t <= s.max; }).map(function (t) { return { value: t }; }); };
      } else {
        base.type = 'linear';
        base.min = 0;
        base.ticks = { color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v) { return v + '%'; } };
      }
      return base;
    }
    var nameLabel = {
      id: 'sel-name',
      afterDatasetsDraw: function (chart) {
        if (!selected) return;
        var ds = chart.data.datasets[chart.data.datasets.length - 1];
        var meta = chart.getDatasetMeta(chart.data.datasets.length - 1);
        if (!ds.data.length || !meta.data[0]) return;
        var p = meta.data[0], ctx = chart.ctx;
        ctx.save();
        ctx.font = '700 11.5px ' + tok('--sans'); ctx.fillStyle = INK;
        var right = p.x > chart.chartArea.right - 140;
        ctx.textAlign = right ? 'right' : 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(selected.name, p.x + (right ? -12 : 12), p.y);
        ctx.restore();
      },
    };
    var ampChart = HH.chart('chart-amp', {
      type: 'scatter',
      data: { datasets: ampDatasets() },
      options: {
        animation: false,
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 9, usePointStyle: true, font: { size: 11 }, filter: function (it) { return it.text !== 'Selected'; } } },
          tooltip: { callbacks: { label: function (c) { var r = c.raw.c; return r.name + ' — peak ' + r.peak.toFixed(1) + '%, ' + AMP[ampKey].short + ' ' + AMP[ampKey].fmt(AMP[ampKey].get(r)); } } },
        },
        onClick: function (e, els) {
          if (!els.length) return;
          var el = els[0], r = ampChart.data.datasets[el.datasetIndex].data[el.index].c;
          select(r);
        },
        scales: {
          x: xScale(),
          y: Object.assign(axis({ title: 'Peak food inflation, 2022–23 (log scale)' }), {
            type: 'logarithmic', min: 2, max: 600,
            afterBuildTicks: function (sc) { sc.ticks = [2, 5, 10, 20, 50, 100, 200, 500].map(function (v) { return { value: v }; }); },
            ticks: { color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v) { return [2, 5, 10, 20, 50, 100, 200, 500].indexOf(v) > -1 ? v + '%' : ''; } },
          }),
        },
      },
      plugins: [nameLabel],
    });

    function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
    function rhoFor(key) {
      var a = AMP[key], rows = C.filter(function (c) { return a.get(c) != null; });
      return { rho: spearman(rows.map(a.get), rows.map(function (c) { return c.peak; })), n: rows.length };
    }
    function updateStats() {
      var r = rhoFor(ampKey);
      setText('amp-rho', (r.rho < 0 ? '−' : '') + Math.abs(r.rho).toFixed(2));
      setText('amp-n', r.n);
      var s = Math.abs(r.rho);
      setText('amp-read', s >= 0.4 ? 'moderate association' : s >= 0.25 ? 'weak-to-moderate association' : 'weak association');
    }
    function card(c) {
      var el = document.getElementById('amp-card');
      if (!el) return;
      if (!c) { el.innerHTML = 'Select a country to see its values.'; return; }
      function v(x, f) { return x == null ? 'n/a' : f(x); }
      el.innerHTML = '<strong>' + c.name + '</strong> · ' + c.region + ' · peak food inflation <strong>' + c.peak.toFixed(1) + '%</strong> in ' + monthLabel(c.peakm)
        + '<div class="cc-grid">'
        + '<div><span>Currency vs US$, 2021→23</span>' + v(c.dep, function (x) { return pct(x, 1); }) + '</div>'
        + '<div><span>Food share of imports, 2021</span>' + v(c.food, function (x) { return x.toFixed(1) + '%'; }) + '</div>'
        + '<div><span>Reserves, 2021</span>' + v(c.res, function (x) { return x.toFixed(1) + ' months'; }) + '</div>'
        + '<div><span>Food inflation, 2019</span>' + v(c.base, function (x) { return pct(x, 1); }) + '</div>'
        + '</div>';
    }
    function redraw() {
      if (!ampChart) return;
      ampChart.data.datasets = ampDatasets();
      ampChart.options.scales.x = xScale();
      ampChart.update();
    }
    function select(c) {
      selected = c;
      if (ampSearch) ampSearch.value = c ? c.name : '';
      card(c);
      redraw();
    }
    if (ampSel) ampSel.addEventListener('change', function () { ampKey = ampSel.value; updateStats(); redraw(); });
    if (ampSearch) {
      ampSearch.addEventListener('change', function () {
        var q = ampSearch.value.trim().toLowerCase();
        var hit = C.filter(function (c) { return c.name.toLowerCase() === q; })[0] || C.filter(function (c) { return c.name.toLowerCase().indexOf(q) === 0; })[0];
        if (hit) select(hit);
      });
    }
    var reset = document.getElementById('amp-reset');
    if (reset) reset.addEventListener('click', function () { select(null); });
    updateStats();

    // Median peak by currency bucket.
    var B = [
      { label: 'Under 5%', lo: -Infinity, hi: 5 },
      { label: '5–25%', lo: 5, hi: 25 },
      { label: 'Over 25%', lo: 25, hi: Infinity },
    ].map(function (b) {
      var g = C.filter(function (c) { return c.dep != null && c.dep >= b.lo && c.dep < b.hi; }).map(function (c) { return c.peak; });
      return { label: b.label + ' (' + g.length + ')', v: Math.round(median(g) * 10) / 10 };
    });
    HH.chart('chart-buckets', {
      type: 'bar',
      data: { labels: B.map(function (b) { return b.label; }), datasets: [{ data: B.map(function (b) { return b.v; }), backgroundColor: [S[3], S[2], S[0]], barPercentage: 0.62 }] },
      options: {
        layout: { padding: { top: 20 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return 'Median peak food inflation: ' + c.parsed.y.toFixed(1) + '%'; } } } },
        scales: {
          x: Object.assign(axis({ grid: false, title: 'Currency depreciation vs US$, 2021→2023 (countries)' }), {}),
          y: Object.assign(axis({ title: 'Median peak, per cent' }), { beginAtZero: true, max: 60 }),
        },
      },
      plugins: [labels({ format: function (v) { return v.toFixed(1) + '%'; } })],
    });

    var RK = ['dep', 'base', 'food', 'res'];
    var RH = RK.map(function (k) { return Math.round(rhoFor(k).rho * 100) / 100; });
    HH.chart('chart-rho', {
      type: 'bar',
      data: {
        labels: ['Currency change', 'Prior food inflation', 'Food-import share', 'Reserves cover'],
        datasets: [{ data: RH, backgroundColor: RH.map(function (v, i) { return i === 0 ? S[0] : v < 0 ? S[3] : MUTED; }), barPercentage: 0.62 }],
      },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 44 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return 'Spearman ρ = ' + c.parsed.x.toFixed(2) + ' (n = ' + rhoFor(RK[c.dataIndex]).n + ')'; } } } },
        scales: {
          x: Object.assign(axis({ title: 'Rank correlation with peak food inflation' }), { min: -0.5, max: 0.6 }),
          y: axis({ grid: false }),
        },
      },
      plugins: [labels({ axis: 'x', format: function (v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(2); } })],
    });

    /* --- 5. The 2026 cascade ------------------------------------------------------- */

    var EP_LABEL = { brent: 'Brent crude oil', gas_eu: 'Natural gas, Europe', urea: 'Urea', fert_idx: 'Fertilizer price index', grains_idx: 'Grains price index', fpi: 'FAO Food Price Index' };
    var EP_COLOR = { brent: S[0], gas_eu: S[0], urea: S[1], fert_idx: S[1], grains_idx: S[2], fpi: S[3] };
    var epKey = 'urea';
    var steps = [];
    for (var n = 0; n <= 18; n++) steps.push(n);
    function epData() {
      var c = EP_COLOR[epKey];
      return [
        { label: '2022 (Feb 2022 = 100)', data: DATA.episodes['2022'][epKey], borderColor: MUTED, backgroundColor: MUTED, borderDash: [5, 4], borderWidth: 2.2, pointRadius: 2, pointHoverRadius: 5, tension: 0.2 },
        { label: '2026 (Feb 2026 = 100)', data: DATA.episodes['2026'][epKey], borderColor: c, backgroundColor: c, borderWidth: 3, pointRadius: 3, pointHoverRadius: 6, tension: 0.2 },
      ];
    }
    var epChart = HH.chart('chart-episodes', {
      type: 'line',
      data: { labels: steps.map(function (s) { return s === 0 ? 'Feb' : '+' + s; }), datasets: epData() },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 14, boxHeight: 3, font: { size: 11 } } },
          tooltip: { callbacks: { title: function (c) { var i = c[0].dataIndex; return i === 0 ? 'February (trigger month = 100)' : i + ' months after February'; }, label: function (c) { return c.dataset.label.slice(0, 4) + ': ' + c.parsed.y.toFixed(0) + ' (' + pct(c.parsed.y - 100) + ')'; } } },
        },
        scales: {
          x: Object.assign(axis({ grid: false, title: 'Months after February of each year' }), {}),
          y: Object.assign(axis({ title: 'February = 100' }), { suggestedMin: 60, suggestedMax: 140 }),
        },
      },
      plugins: [{
        id: 'base100',
        beforeDatasetsDraw: function (chart) {
          var y = chart.scales.y.getPixelForValue(100), a = chart.chartArea, ctx = chart.ctx;
          ctx.save(); ctx.strokeStyle = INK; ctx.globalAlpha = 0.35; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke(); ctx.restore();
        },
      }],
    });
    var segBtns = document.querySelectorAll('[data-ep]');
    Array.prototype.forEach.call(segBtns, function (btn) {
      btn.addEventListener('click', function () {
        epKey = btn.getAttribute('data-ep');
        Array.prototype.forEach.call(segBtns, function (b) { var on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
        setText('ep-title', EP_LABEL[epKey] + ': 2022 and 2026 episodes, months after the trigger');
        if (epChart) { epChart.data.datasets = epData(); epChart.update(); }
      });
    });

    /* --- 6. The cascade clock as a timeline --------------------------------------- */

    var ORIGIN = '2022-02';
    var W = L.map(function (r) {
      return {
        label: r.key === 'dom' ? 'Households (median food inflation)' : r.label,
        span: [monthsFrom(r.start, ORIGIN), monthsFrom(r.end, ORIGIN) + 1],
        peak: monthsFrom(r.peak, ORIGIN) + 0.5,
      };
    });
    HH.chart('chart-windows', {
      type: 'bar',
      data: {
        labels: W.map(function (w) { return w.label; }),
        datasets: [
          { label: 'Active (above half the peak rise)', data: W.map(function (w) { return w.span; }), backgroundColor: S.map(function (c) { return alpha(c, 0.78); }), borderSkipped: false, borderRadius: 4, barPercentage: 0.62 },
          { type: 'scatter', label: 'Peak', data: W.map(function (w, i) { return { x: w.peak, y: w.label }; }), backgroundColor: INK, borderColor: '#fff', borderWidth: 2, pointRadius: 6, pointHoverRadius: 7 },
        ],
      },
      options: {
        indexAxis: 'y',
        layout: { padding: { top: 18 } },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: { callbacks: { label: function (c) {
            var r = L[c.dataIndex];
            if (c.dataset.type === 'scatter') return 'Peak: ' + monthLabel(r.peak);
            return 'Active ' + monthLabel(r.start) + ' – ' + monthLabel(r.end) + ' (' + r.dur + ' months)';
          } } },
        },
        scales: {
          x: Object.assign(axis({ title: 'Months from February 2022 (trigger)' }), { min: -8, max: 20, ticks: { stepSize: 2, color: tok('--text-muted'), font: { size: 10.5 }, callback: function (v) { return v === 0 ? '0' : (v > 0 ? '+' + v : v); } } }),
          y: Object.assign(axis({ grid: false }), {}),
        },
      },
      plugins: [{
        id: 'now2026',
        afterDatasetsDraw: function (chart) {
          var x = chart.scales.x, a = chart.chartArea, ctx = chart.ctx;
          [[0, INK, 'Trigger'], [7, ACCENT, 'Sep 2026 = month 7']].forEach(function (m) {
            var px = x.getPixelForValue(m[0]);
            ctx.save(); ctx.strokeStyle = m[1]; ctx.lineWidth = 1.4; ctx.setLineDash(m[0] === 0 ? [2, 3] : [6, 4]);
            ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.stroke();
            ctx.setLineDash([]); ctx.fillStyle = m[1]; ctx.font = '600 10px ' + tok('--mono');
            ctx.textAlign = 'left'; ctx.textBaseline = m[0] === 0 ? 'bottom' : 'top';
            ctx.fillText(m[2], px + 5, m[0] === 0 ? a.bottom - 4 : a.top - 15);
            ctx.restore();
          });
        },
      }],
    });
  });
})();
