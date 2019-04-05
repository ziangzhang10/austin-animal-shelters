// magnitude to visuals of circle
var dict = {

};

// function for color of bubbles and legend
function getColor(d) {
  return d > 5  ? '#E31A1C' :
         d > 4  ? '#FC4E2A' :
         d > 3   ? '#FD8D3C' :
         d > 2   ? '#FEB24C' :
         d > 1   ? '#FED976' :
                    '#FFEDA0';
}

////////////////////////////////////////////////////////////////////////////////////////
// END PRELIMINARY
// BEGIN BASE MAP LAYERS
////////////////////////////////////////////////////////////////////////////////////////

// Define variables for our tile layers
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// Only one base layer can be shown at a time
var baseMaps = {
  "Light Map": light,
  "Dark Map": dark,
  "Satellite": satellite,
  "Outdoors": outdoors
};

////////////////////////////////////////////////////////////////////////////////////////
// END BASE MAP LAYERS
// BEGIN OVERLAY LAYERS
////////////////////////////////////////////////////////////////////////////////////////

// Overlays that may be toggled on or off
var earthquakes = new L.LayerGroup();
var faultlines = new L.LayerGroup();

var overlayMaps = {
  "Earthquakes": earthquakes,
  "Fault Lines": faultlines
};

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url, function(response)
{
  console.log(response.features.length);
  for (var i = 0; i < response.features.length; i++) 
  {
    //magnitude
    var mag = response.features[i].properties.mag;
    var circlesize = mag*mag; // give it some more contrast
    var circlecolor = getColor(mag);

    //coordinates
    var lat = response.features[i].geometry.coordinates[0];
    var lon = response.features[i].geometry.coordinates[1];
    // other not-so-useful attributes
    var title = response.features[i].properties.title;
    //console.log(title);

    // Create new marker
    var newMarker = L.circleMarker([lat, lon],{
      radius: circlesize,
      weight: 1,
      color: "steelblue",
      fillColor: circlecolor
    });
    // add the new marker to the layer
    newMarker.addTo(earthquakes);
    newMarker.bindPopup(title);
  } 
});

////////////////////////////////////////////////////////////////////////////////////////
// END OVERLAY LAYERS
// BEGIN CREATING MAP
////////////////////////////////////////////////////////////////////////////////////////

// Create map object and set default layers
var myMap = L.map("map-id", {
  center: [29.76, -95.36],
  zoom: 3,
  layers: [light, earthquakes]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

////////////////////////////////////////////////////////////////////////////////////////
// END CREATING MAP
// BEGIN ADDING FAULT LINES
////////////////////////////////////////////////////////////////////////////////////////

// Neither reading from github url nor from local works.
// From github url: Access to XMLHttpRequest at 'https://github.com/fraxen/tectonicplates/tree/master/GeoJSON/PB2002_boundaries.json' from origin 'http://localhost:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
// From local: ERROR: Invalid GeoJson format
// AND from what I found, there's not easy fix for either of the above
// And I didn't see much instructions on how to do it, at all
// Maybe you don't really expect any of us to actually do it, do you?


// url2 = "https://github.com/fraxen/tectonicplates/tree/master/GeoJSON/PB2002_boundaries.json";
// // for the faultlines
// //fetch("tectonicplates-master/GeoJSON/PB2002_boundaries.json")
// //  .then(function(data){
// d3.json(url2, function(data){
//     console.log(typeof(data));
//     L.geoJson(data, {
//       // Style each feature (in this case a neighborhood)
//       style: function(feature) {
//         return {
//           color: "white",
//           // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
//           fillColor: chooseColor(feature.properties.borough),
//           fillOpacity: 0.5,
//           weight: 1.5
//       }
//     }
//     }).addTo(myMap);
//   });



////////////////////////////////////////////////////////////////////////////////////////
// END CREATING MAP
// BEGIN ADDING LEGEND
////////////////////////////////////////////////////////////////////////////////////////

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
// NEED TO CHANGE CSS AS WELL, ALAS..

legend.addTo(myMap);