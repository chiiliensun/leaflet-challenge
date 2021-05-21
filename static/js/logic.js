// Step 1

// step up query to earthquake url
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl).function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place 
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
const earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
});

const mags = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: (feature, latlng) => {
    return new L.Circle(latlng, {
      radius: feature.properties.mag*25000,
      fillColor: "red",
      stroke: false
    });
  }
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes, mags);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// step up the mapbox and leaflet layers

// light map
const lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// dark map
const darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

 // outdoor map
 const darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
   tileSize: 512,
   maxZoom: 18,
   zoomOffset: -1,
   id: "mapbox/outdoors-v11",
   accessToken: API_KEY
 });


















/* NOTE FOR STEP 2
/  You can use the javascript Promise.all function to make two d3.json calls,
/  and your then function will not run until all data has been retreived.
/
/ ----------------------------------------
/  Promise.all(
/    [
/        d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"),
/        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
/    ]
/  ).then( ([data,platedata]) => {
/
/        console.log("earthquakes", data)
/        console.log("tectonic plates", platedata)
/
/    }).catch(e => console.warn(e));
/
/ ----------------------------------------*/
