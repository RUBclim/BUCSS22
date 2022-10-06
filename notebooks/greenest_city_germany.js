/***
 * 
 * Greenest large cities in Germany?
 * Author: M.Demuzere
 * Date: 27/09/2022
 * 
 * Inspired by: https://interaktiv.morgenpost.de/gruenste-staedte-deutschlands/
 * 
***/

// Some arguments
var STARTDATE = '2017-01-01';
var ENDDATE = '2022-12-31';
var START_DOY = 152; // ~ June 1st
var END_DOY = 213; // ~ August 1st
var S2_CLOUD_PERC = 5;
var IMG_SCALE = 30; // 10 meter takes a lot of time to export
var POP_SIZE_THRES = 100000;
var NDVI_THRESHOLD = 0.45;


/**
* Function to mask clouds using the Sentinel-2 QA band
* @param {ee.Image} image Sentinel-2 image
* @return {ee.Image} cloud masked Sentinel-2 image
*/
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

// Get boundaries from Germany
var roi = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017")
          .filter(ee.Filter.eq("country_na", "Germany"));
Map.addLayer(roi, {}, "ROI", false);

// Function to derive NDVI
var get_ndvi = function(image){
  
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

// Obtain and filter the Sentinel-2 collection, add NDVI
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterDate(STARTDATE, ENDDATE)
                  .filter(ee.Filter.dayOfYear(START_DOY, END_DOY))
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',S2_CLOUD_PERC))
                  .filterBounds(roi)
                  .map(maskS2clouds)
                  .map(get_ndvi);

// Map the RGB median
var s2_rgb = s2.select(['B4', 'B3', 'B2']).median().clip(roi);
Map.addLayer(s2_rgb, {min:0.0, max:0.3}, 'RGB', false);

// Get pre-defined packages using Gena his tool.
var palettes = require('users/gena/packages:palettes');

// Map the number of images over the domain
var cb_ryg = palettes.colorbrewer.RdYlGn[9].reverse();
var visCount = {
  min: 0.0,
  max: 60,
  palette: cb_ryg,
  bands: ['B4']
};
Map.addLayer(s2.count(), visCount, "S2-count", false);

// Map the median NDVI, with custom black-to-green-colors
var ndvi_germany = s2.select(['NDVI']).median().clip(roi);
var cb_greens = [
  '101721' ,'282e36', '2f423d', '345744', '376d4b',
  '398552','399b58', '37b35e', '30cc64', '24e56a', '00ff70'
  ];
print(ndvi_germany);
Map.addLayer(ndvi_germany,{min:0.45, max:1, palette: cb_greens}, 'NDVI', false);


// Export the image to an Earth Engine asset. Takes ~1 hour  !!
var IMG_NAME = 'ndvi_germany'+'_'+IMG_SCALE.toString()+'m';

Export.image.toAsset({
  image: ndvi_germany.clip(roi),
  description: IMG_NAME,
  assetId: 'projects/ee-bucss-bot/assets/'+IMG_NAME,
  scale: IMG_SCALE,
  region: roi,
  maxPixels: 1e13
});


// // Read asset back into script
// var ndvi_germany = ee.Image('projects/ee-bucss-bot/assets/'+IMG_NAME);
// var cb_greens = [
//   '101721' ,'282e36', '2f423d', '345744', '376d4b',
//   '398552','399b58', '37b35e', '30cc64', '24e56a', '00ff70'
//   ];
// print(ndvi_germany)
// Map.addLayer(ndvi_germany,{min:0.45, max:1, palette: cb_greens}, 'NDVI', false);

// Set background map to dark, as done in Newspaper report
var style = require('users/gena/packages:style');
style.SetMapStyleDark();

// Prepare shapefile with cities' information: use GEE_prep_city_data.ipynb
// Upload the obtained shapefile (df_large_cities_100000.shp) into your asset folder

// Now, add the city boundaries?
var fc_cities = ee.FeatureCollection(
  "projects/ee-bucss-bot/assets/df_large_cities_"+POP_SIZE_THRES.toString()
  );
Map.addLayer(fc_cities,{}, 'FC_CITY', true);

var cities = fc_cities.style({color: 'FFFFFF', width: 3, fillColor: "FFFFFF00"});
Map.addLayer(cities, {}, 'CITIES', true);

// Do some heavy lifting
// Calculate the amount of greenness.
function get_green_fraction(img, threshold, feature, bandname, img_scale){
  
  var img_all = img.gt(-100); // Making sure to select all pixels, masked as 1
  var img_green = img.gte(threshold);

  // count all pixels in feature
  var allPix = img_all.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: feature.geometry(),
    scale: img_scale,
    bestEffort: true,
    maxPixels: 1e13,
  });

  // count all pixels with an NDVI value >= passed threshold
  var greenPix = img_green.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: feature.geometry(),
    scale: img_scale,
    bestEffort: true,
    maxPixels: 1e13,
  });

  var allPixSum = ee.Number(allPix.get(bandname));
  var greenPixSum = ee.Number(greenPix.get(bandname));

  var green_fraction = greenPixSum.divide(allPixSum).multiply(100); // in %
  
  // return green fraction in %
  return green_fraction;
}

// Apply this function to the whole collection
var fc_cities_ndvi = fc_cities.map(function(feature){
  return feature.set(
    'green_fraction', get_green_fraction(ndvi_germany, NDVI_THRESHOLD, feature, "NDVI", IMG_SCALE)
  );
});

// Let's have a look
print(fc_cities_ndvi);
Map.addLayer(fc_cities_ndvi, {}, 'CITIES-NDVI', true);

// And now export this to your drive
var TABLE_NAME = 'fc_cities_ndvi_' + POP_SIZE_THRES.toString();
Export.table.toDrive({
  collection: fc_cities_ndvi, 
  description: TABLE_NAME,
  folder: 'EE_OUTPUT',
  fileFormat: 'geojson'
});

// Once ready, analyse your results with GEE_plot_city_data.ipynb


