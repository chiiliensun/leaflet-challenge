
// Step 1

// step up query to earthquake url
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl).then(data => {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// function for determining color given points
function depthColor(depth) {
  switch (true) {
    case depth < 10: return "purple";
    case depth < 30: return "blue";
    case depth < 50:  return "green";
    case depth < 70: return "yellow";
    case depth < 90: return "orange";
    case depth > 90: return "red";
  };
}


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + feature.properties.mag + "</h3><hr><p>" + feature.geometry.coordinates[2] +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // const earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature,
  // });
  const earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return new L.Circle(latlng, {
        radius: feature.properties.mag * 50000,
        fillColor: depthColor(feature.geometry.coordinates[2]),
        stroke: true,
        fillOpacity: 0.50

      });
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// step up the mapbox and leaflet layers
function createMap(earthquakes) {

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

   // streetLayer map
  const streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 18,
     zoomOffset: -1,
     id: "mapbox/streets-v11",
     accessToken: API_KEY
   });

   // Define a baseMaps object to hold our base layers
   const baseMaps = {
     "Light Map": lightMap,
     "Dark Map": darkMap,
     "Street Map": streetMap
   };

   // Create overlay object to hold our overlay layer
   const overlayMaps = {
     Earthquakes: earthquakes,
   };

   // Create our map, giving it the streetmap and earthquakes layers to display on load
   const myMap = L.map("map", {
     center: [
       37.09, -95.71
     ],
     zoom: 3,
     layers: [streetMap, earthquakes]
   });

   // Create a layer control
   // Pass in our baseMaps and overlayMaps
   // Add the layer control to the map
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(myMap);


  // Set up the legend
  const legend = L.control({ position: "bottomleft", fillColor : "White" });
  legend.onAdd = function() {
    const div = L.DomUtil.create("div", "info legend");
    const limits = ["<10","11-30","31-50","51-70","71-90", ">90"];
    const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
    const labels = [];

    div.innerHTML = `<h3>Depth</h3>`;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">" + limits[index] + "</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

}

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
