d3.csv("./fulldata.csv").then(function(data) {
    console.log(data[0].zipcode);
    




  });






// // Trace1 for the Greek Data
// var trace1 = {
//   x: data.map(row => row.pair),
//   y: data.map(row => row.greekSearchResults),
//   text: data.map(row => row.greekName),
//   name: "Greek",
//   type: "bar"
// };

// // Trace 2 for the Roman Data
// var trace2 = {
//   x: data.map(row => row.pair),
//   y: data.map(row => row.romanSearchResults),
//   text: data.map(row => row.romanName),
//   name: "Roman",
//   type: "bar"
// };

// // Combining both traces
// var data = [trace1, trace2];

// // Apply the group barmode to the layout and auto-size margins to prevent labels from overflowing
// var layout = {
//   title: "Greek vs Roman gods search results",
//   barmode: "group",
//   xaxis:{
//     automargin: true
//   }
// };

// // Render the plot to the div tag with id "plot"
// Plotly.newPlot("plot", data, layout);
