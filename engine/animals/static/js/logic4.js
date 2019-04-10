//var APILink = "https://data.austintexas.gov/resource/csid-srda.json";
//var geojson = new L.GeoJSON.AJAX("Zipcodes.geojson");     
//var geojson;
//geojson.addTo(map);


var Zipcodes = new L.LayerGroup(); 
var AustinParks = new L.LayerGroup();
var AustinOffLeash = new L.LayerGroup();
//GITHUB RAW that's the way!
urlzipcodes = "https://raw.githubusercontent.com/veyEskelson/maptest/master/js/Zipcodes.geojson";
// for the faultlines
//fetch("tectonicplates-master/GeoJSON/PB2002_boundaries.json")
//  .then(function(data){
d3.json(urlzipcodes, function(data){
   console.log(typeof(data));
   L.geoJson(data, {
     // Style each feature (in this case a region)
     style: function(feature) {
       return {
         color: "yellow",

         fillOpacity: 0.5,
         weight: 1.5
     }
   }
   }).addTo(Zipcodes);
 });

urlparks ="https://raw.githubusercontent.com/veyEskelson/maptest/master/data/City%20of%20Austin%20Parks.geojson";

 d3.json(urlparks, function(data){
    console.log(typeof(data));
    L.geoJson(data, {
      // Style each feature (in this case a region)
      style: function(feature) {
        return {
          color: "green",
 
          fillOpacity: 0.5,
          weight: 1.5
      }
    }
    }).addTo(AustinParks);
  });

urloffleash ="https://raw.githubusercontent.com/veyEskelson/maptest/master/data/Off-%20Leash%20Areas.geojson";

d3.json(urloffleash, function(data){
    console.log(typeof(data));
    L.geoJson(data, {
      // Style each feature (in this case a region)
      style: function(feature) {
        return {
          color: "Red",
 
          fillOpacity: 0.5,
          weight: 1.5
      }
    }
    }).addTo(AustinOffLeash);
  });
  // Grab data with d3
 // d3.json(geojson, function(data) {
  //  createFeatures(data.features);
  //});

// function createFeatures(zipcodeData) {
//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function popupBinder(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//     layer.bindPopup(feature.properties.name + ", " + feature.properties.zipcode));
//   }
//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var zipcodes = L.geoJSON(zipcodeData, {
//     "onEachFeature": popupBinder
//   });
 
//     // Sending our earthquakes layer to the createMap function
//     createMap(zipcodes);

// }
  














//function createMap(zipcodes) {
// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
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

// Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street map": streetmap,
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite": satellite,
    "Outdoors": outdoors
  };

//Create overlay object to hold our overlay layer
var overlayMaps = {
  zipcodes: Zipcodes,
  Parks: AustinParks,
  'Off-Leash Areas' : AustinOffLeash
};

// Create our map, 
// Create a map object
var myMap = L.map("map", {
  center: [30.287113,-97.750832],
  zoom: 11,
  layers: [streetmap,darkmap, lightmap,satellite,outdoors, Zipcodes, AustinParks, AustinOffLeash]
});


// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
 }).addTo(myMap);

//}








