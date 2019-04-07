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
mapboxgl.accessToken = 'pk.eyJ1IjoidmV5ZXNrZWxzb24iLCJhIjoiY2p0c3d5a3kwMDB2azQzbG1oNXBsbDYxaCJ9.-iQxJ52lXON6XgOr3ntkSQ';
var bounds = [
[-162.982873, -79.182412,], // Southwest coordinates
[172.984188, 60.888888]  // Northeast coordinates
];
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',

center: [-40.286038, 18.966224],
maxBounds: bounds // Sets bounds as max
});




 
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');
 
function switchLayer(layer) {
var layerId = layer.target.id;
map.setStyle('mapbox://styles/mapbox/' + layerId);
}
 
for (var i = 0; i < inputs.length; i++) {
inputs[i].onclick = switchLayer;
}



// Overlays that may be toggled on or off
var earthquakes = new L.LayerGroup();
var faultlines = new L.LayerGroup();

var overlayMaps = {
  "Earthquakes": earthquakes
};

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(response)
{
  console.log(response.features.length);
  for (var i = 0; i < response.features.length; i++) 
  {
    //magnitude
    var mag = response.features[i].properties.mag;
    var circlesize = mag*mag; 
    var circlecolor = getColor(mag);

    //coordinates
    var lat = response.features[i].geometry.coordinates[0];
    var lon = response.features[i].geometry.coordinates[1];
    // other not-so-useful attributes
    var title = response.features[i].properties.title;

    // marker
    var newMarker = L.circleMarker([lat, lon],{
      radius: circlesize,
      weight: 1,
      color: "yellow",
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
var myMap = L.map("map", {
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

// GITHUB RAW that's the way!
url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// for the faultlines
//fetch("tectonicplates-master/GeoJSON/PB2002_boundaries.json")
//  .then(function(data){
d3.json(url2, function(data){
    console.log(typeof(data));
    L.geoJson(data, {
      // Style each feature (in this case a region)
      style: function(feature) {
        return {
          color: "white",

          fillOpacity: 0.5,
          weight: 1.5
      }
    }
    }).addTo(faultlines);
  });



////////////////////////////////////////////////////////////////////////////////////////
// END CREATING MAP
// BEGIN ADDING LEGEND
////////////////////////////////////////////////////////////////////////////////////////

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored circle for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);