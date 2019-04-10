
map_url = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
map_attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>"
// Adding satellite tile layer to the map

function addTileLayer (map_url, map_attribution, map_id) {
    tileLayer = L.tileLayer(map_url, {
        attribution: map_attribution, 
        maxZoom: 18,
        id: map_id,
        accessToken: API_KEY
    })
    return tileLayer;
}
// Create all the base maps
satellite = addTileLayer(map_url, map_attribution, "mapbox.satellite");
light = addTileLayer(map_url, map_attribution, "mapbox.light");
streets = addTileLayer(map_url, map_attribution, "mapbox.streets");

// Creating map object
var myMap = L.map("map", {
  center: [48.8, 2.4],
  zoom: 2,
  layers: [satellite, light, streets]
});
// List of base maps for map control
var baseMaps = { "Satellite" : satellite, "Light" : light, "StreetMap": streets };
var overlayMaps = {};


// Get the earthquake data
// Data is already in JSON directly at a web page
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Grab the data with d3
d3.json(url, function(response) {
  features = response.features;

  // Create the markers, which will be cirles with tooltip popups on click

  // Create an empty array to hold the markers
  var markers = [];

  // Loop through data to construct the markers and add them to array
  for (var i = 0; i < features.length; i++) {
    // Set the data location property to a variable
    var location = features[i].geometry;

    // Check for location property
    if (location) {
      // Add a new marker to the cluster group and bind a pop-up
      info = features[i].properties.place + " Magnitude " + String(features[i].properties.mag);
      circle = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        radius : Math.pow(features[i].properties.mag, 2) / 2,
        color : "black", 
        fillColor : "blue",
        fillOpacity : Math.pow(features[i].properties.mag, 2) / 100
      })
      .bindPopup(info);
      markers.push(circle);
    };
  };
  // Make the earthquakes overlay map
  earthquakes = L.layerGroup(markers);
  overlayMaps.Earthquakes = earthquakes;
  // Set the earthquakes active by default
  earthquakes.addTo(myMap);


    // Get the tectonic plate polygon data
    url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
    d3.json(url, function(response) {
        features = response.features;
        var plates = [];                            // Empty plates array
        for (var i=0; i < features.length; i++) {
            polygon = features[i].geometry;
            if (polygon) {
                plate = L.geoJSON(polygon);
                plates.push(plate);
            }
        };
        tec_plates = L.layerGroup(plates);
        overlayMaps.TectonicPlates = tec_plates;
        // L.geoJSON(plates).addTo(myMap);
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    });
});






