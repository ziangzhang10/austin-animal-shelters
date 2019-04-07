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

  var APILink = "https://data.austintexas.gov/resource/csid-srda.json";
  var geojson;
  // Grab data with d3
  d3.json(APILink, function(data) {
    geojson = L.zipcodelayer(data, {
    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.name + ", " + feature.properties.zipcode);
    }
  }).addTo(myMap);
  });
  
  



// An array of AnimalPoints and their locations
var AnimalPoints = {
  "type": "FeatureCollection",
  "features": [
  {
  "type": "Feature",
  "properties": {
  "animal": "Other",
  "message": "Foo",
  "iconSize": [20, 20]
  },
  "geometry": {
  "type": "Point",
  "coordinates": [
    30.381768,-97.708333
  ]
  }
  },
  {
  "type": "Feature",
  "properties": {
  "animal": "Cat",
  "message": "Bar",
  "iconSize": [60, 60]
  },
  "geometry": {
  "type": "Point",
  "coordinates": [
    30.227005,-97.860104
  ]
  }
  },
  {
  "type": "Feature",
  "properties": {
  "animal": "Dog",
  "message": "Baz",
  "iconSize": [40, 40]
  },
  "geometry": {
  "type": "Point",
  "coordinates": [
  30.291660,-97.775008
  ]
  }
  },
  {
    "type": "Feature",
    "properties": {
    "animal": "Bird",
    "message": "Foo",
    "iconSize": [20, 20]
    },
    "geometry": {
    "type": "Point",
    "coordinates": [
      30.381768,-97.708333
    ]
    }
    }
  ]
  };

  // An array which will be used to store created animalss
  var animals = [];

for (var i = 0; i < AnimalPoints.length; i++) {
  // loop through the AnimalPoints array, create a new marker, push it to the animalss array
  animals.push(
    L.marker(AnimalPoints[i].coordinates).bindPopup("<h1>" + AnimalPoints[i].animal + "</h1>")
  );
}

// Add all the animals to a new layer group.
// Now we can handle them as one group instead of referencing each individually
var animal = L.layerGroup(animals);



//Create overlay object to hold our overlay layer
  var overlayMaps = {
    animals: animal
  };


// Create our map, 
// Create a map object
  var myMap = L.map("map", {
    center: [30.287113,-97.750832],
    zoom: 11,
    layers: [streetmap,darkmap, lightmap,satellite,outdoors, animal]
  });

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
 collapsed: false
}).addTo(myMap);
