function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(response) {
      meta = d3.select("#sample-metadata");
      meta.html("");
      //console.log(response);
      Object.entries(response).forEach(([key, value]) => meta.append("p").text(`${key}: ${value}`));

      // BONUS: Build the Gauge Chart
      buildGauge(response.WFREQ);
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    //console.log(response);
    // assemble data for bubble plot
    trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };
    data1 = [trace1]; // to self: MUST USE TRACE OR THERE'S NO PLOT!!!
    //console.log(data1);
    // @TODO: Build a Bubble Chart using the sample data
    var layout = {
      xAxis: {title:'OTU ID'},
      showlegend: false,
      height: 600,
      width: 1200
    };
    Plotly.newPlot("bubble", data1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // IS THIS A JOKE???
    // I see no simple way of grabing the top 10 sample_values,
    // WHILE also getting their respective otu_ids and labels
    // Maybe there is one but slice() alone won't cut it!
    // It's like saying - task: drive to Austin in 1 hour (HINT: you will need to get in the car)
    // response_sorted = {
    //   otu_ids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   sample_values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   otu_labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // }
    // for (i = 0; i < response.sample_values.length; i++) {
    //   current_id = response.otu_ids[i];
    //   current_value = response.sample_values[i];
    //   current_label = response.otu_labels[i];

    //   // newcomers: compare with the first 10 terms
    //   for (j = 0; j < 10; j++) {
    //     // if it's bigger than the current term
    //     if (current_value > response_sorted.sample_values[j]) {
    //       response_sorted.sample_values[j] = current_value;
    //       response_sorted.otu_ids[j] = current_id;
    //       response_sorted.otu_labels[j] = current_label;
    //       break;
    //     }
    //     // if not, try the next term
    //     else {
    //       continue;
    //     }
    //   }
    // } // I think this works but too slow
    //console.log(response_sorted);

    // Never mind, I see that it's supposed to be done in python now
    // but still, it would be helpful to mention it in the instructions
    
    trace2 = {
      labels: response.otu_ids.slice(0, 10),
      values: response.sample_values.slice(0, 10),
      text: response.otu_labels.slice(0,10),
      //textinfo: "pct",
      type: "pie"
    };
    //console.log(trace2.text)
    data2 = [trace2];
    var layout = {
      height: 400,
      width: 500
    };
    Plotly.newPlot("pie", data2, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample);

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
  