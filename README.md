# leaflet-challenge
The goal was to create a world map visualization loaded with information reagrding the incidences of all earthquakes that have occured in the past week. 

The dataset referred to above, is provided in GeoJSON format by the USGS. It has been retrieved through the d3 library call and the features data has been utilized to create the visualization with certain pre-determined criteria listed below:

The radius is adjusted, based on the recorded magnitude of the earthquake.
The color of the circular maker is dependent on the depth of the quake - deeper the earthquake, darker is the color of the marker.
The depth categories have been chosen after studying different maps for reference.

The majority of the code was written in JavaScript to achieve the above outcomes (static/js/logic.js). 

The app is hosted at the following site:
https://mitajoshi.github.io/leaflet-challenge/


