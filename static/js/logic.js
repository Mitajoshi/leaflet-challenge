let myMap;

// Storing the API endpoint as queryUrl.
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// Mapping all quakes in the past week
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Performing a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  // console.log("features", data.features);
//   console.log("Geometry", data.features[0].geometry.coordinates[2]);//.geometry);
  
  // Passing the features to a createFeatures() function:
  createFeatures(data.features);

});

// Function to create the features of the map visual based on preset conditions
function createFeatures(earthquakeData) {
  // Save the earthquake data in a variable.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 2, // Adjusting the radius based on the magnitude
        fillColor: getColor(feature.geometry.coordinates[2]), // Adjusting color based on the depth
      //   color: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      const timestamp = feature.properties.time;
      const datetime = TimestampToDatetime(timestamp);
            
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</br></h4><hr><p>Time: ${datetime}</p><hr><p>Location: ${feature.properties.place}</p>`);
      
    }
  })
  
  // Pass the earthquake data to a createMap() function.
  createMap(earthquakes);
};
  
// Function to convert timestamp to Date Time format
function TimestampToDatetime(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  };
  return date.toLocaleString('en-US', options);
}

// Function to set the color of the circular maker based on the depth of the quake
function getColor(depth){
  // console.log("depth", depth);
  if (depth > 90){return "red"}
  else if (depth > 70 && depth < 90){return "orange"}
  else if (depth > 50 && depth < 70){return "blue"}
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

// Create a legend control
const legend = L.control({ position: 'bottomright' });

// Function to create a color legend for the map
function createLegend() {
  // Define legend content based on earthquake magnitudes
  const legendContent = `
    <div class="legend">
      <h4>Earthquake Depth Color Indicator</h4>
      <ul>
        <li><span style="background-color: #fee08b"></span>RED - Extremely Deep</li>
        <li><span style="background-color: #fdb863"></span>ORANGE - Very Deep</li>
        <li><span style="background-color: #e08214"></span>BLUE - Deep</li>
        <li><span style="background-color: #b35806"></span>CYAN - Shallow</li>
        <li><span style="background-color: #8c510a"></span>YELLOW - Very Shallow</li>
        <li><span style="background-color: #543005"></span>LIGHTGREEN - Surface</li>
        <li><span style="background-color: #543005"></span>WHITE - Others</li>
      </ul>
    </div>
  `;

  return legendContent;
}
  
// Set the onAdd method
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = createLegend();
  return div;
};

// Add the legend control to the map
legend.addTo(myMap);


}



// legend.onAdd = function (myMap) {

//   const div = L.DomUtil.create('div', 'info legend');
  // labels = ['<strong>Categories in Depth of Quake</strong>'],
  // categories = ['Extremely Deep','Very Deep','Deep','Shallow', 'Very Shallow', 'Surface'];
  
  // for (var i = 0; i < categories.length; i++) {
  
  //         div.innerHTML += 
  //         labels.push(
  //             '<i class="circle" style="background:' + legendColor(categories[i]) + '"></i> ' +
  //         (categories[i] ? categories[i] : '+'));
  
  //     }
  //     div.innerHTML = labels.join('<br>');
  // return div;
  // };




// ++++++++++++++++++++++++++++++++++++++++ Legend from Chat +++++++++++++++++++++++++

// 'Extremely Deep'  ? "red" :
//          d === 'Very Deep'  ? "orange" :
//          d === 'Deep' ? "blue" :
//          d === 'Shallow' ? "cyan" :
//          d === 'Very Shallow' ? "yellow" :
//          d === 'Surface' ? "lightgreen" :
//                            "white"; 
// Function to generate legend HTML









  
// %%%%%%%%%%%%%%%%%%%%%%%%%%%% LEGEND CODE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//     function style(feature) {
//     return {
//         weight: 1.5,
//         opacity: 1,
//         fillOpacity: 1,
//         radius: 6,
//         fillColor: getColor(feature.properties.TypeOfIssue),
//         color: "grey"

//     };
// }

  // if (depth > 90){return "red"}
  // else if (depth > 70 && depth < 90){return "orange"}
  // else if (depth > 50 && depth < 70){return "blue"}
  // else if (depth > 30 && depth < 50){return "cyan"}
  // else if (depth > 10 && depth < 30){return "yellow"}
  // else if (depth > -10 && depth < 10){return "lightgreen"}

// function legendColor(d) {
//   return d === 'Extremely Deep'  ? "red" :
//          d === 'Very Deep'  ? "orange" :
//          d === 'Deep' ? "blue" :
//          d === 'Shallow' ? "cyan" :
//          d === 'Very Shallow' ? "yellow" :
//          d === 'Surface' ? "lightgreen" :
//                            "white"; 
                      
//   };

// var legend = L.control({position: 'left'});
// legend.onAdd = function (myMap) {

// var div = L.DomUtil.create('div', 'info legend');
// labels = ['<strong>Categories in Depth of Quake</strong>'],
// categories = ['Extremely Deep','Very Deep','Deep','Shallow', 'Very Shallow', 'Surface'];

// for (var i = 0; i < categories.length; i++) {

//         div.innerHTML += 
//         labels.push(
//             '<i class="circle" style="background:' + legendColor(categories[i]) + '"></i> ' +
//         (categories[i] ? categories[i] : '+'));

//     }
//     div.innerHTML = labels.join('<br>');
// return div;
// };
// legend.addTo(myMap);
  
// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.

// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.

// Hint: The depth of the earth can be found as the third coordinate for each earthquake.

// Include popups that provide additional information about the earthquake when its associated marker is clicked.

// Create a legend that will provide context for your map data.