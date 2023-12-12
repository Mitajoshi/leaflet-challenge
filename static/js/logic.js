let myMap;

// Storing the API endpoint as queryUrl.
// Mapping all quakes in the past week
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Performing a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  // Passing the features to a createFeatures() function:
  createFeatures(data.features);
});

// Function to create the features of the map visual based on preset conditions
function createFeatures(earthquakeData) {
  // Saving the earthquake data in a variable.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 2, // Adjusting the radius based on the magnitude
        fillColor: getColor(feature.geometry.coordinates[2]), // Adjusting color based on the depth
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
    layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</br></h4><hr><p>Time: ${Date(feature.properties.time)}</p><hr><p>Location: ${feature.properties.place}</p>`);
    }
  })
  // Passing the earthquake data to a createMap() function.
  createMap(earthquakes);
};
  
// Function to set the color of the circular maker based on the depth of the quake
// Deeper the earthquake, darker should be the color
// The depth categories have been chosen after studying different maps for reference
function getColor(depth){
  if (depth > 90){return "black"}
  else if (depth > 70 && depth < 90){return "red"}
  else if (depth > 50 && depth < 70){return "orange"}
  else if (depth > 30 && depth < 50){return "cyan"}
  else if (depth > 10 && depth < 30){return "yellow"}
  else if (depth > -10 && depth < 10){return "lightgreen"}
};


function createMap(earthquakes) {
  // Creating the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Creating a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
  
  // Creating an overlays object.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Creating a new map.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [street, earthquakes],

  });

// Creating a layer control that contains the baseMaps and overlays.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Creating a legend control
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (myMap) {

    const div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories in Depth of Quake</strong>'],
    categories = ['Extremely Deep','Very Deep','Deep','Shallow', 'Very Shallow', 'Surface'];
    
    for (var i = 0; i < categories.length; i++) {
  
          div.innerHTML += 
          labels.push(
              '<i class="circle" style="background:' + legendColor(categories[i]) + '"></i> ' +
          (categories[i] ? categories[i] : '+'));
  
      }
      div.innerHTML = labels.join('<br>');
  return div;
  };

  function legendColor(d) {
      return d === 'Extremely Deep'  ? "black" :
              d === 'Very Deep'  ? "red" :
              d === 'Deep' ? "orange" :
              d === 'Shallow' ? "cyan" :
              d === 'Very Shallow' ? "yellow" :
              d === 'Surface' ? "lightgreen" :
                                "white"; 
                          
      };
      legend.addTo(myMap);
}