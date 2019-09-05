function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  d3.json(`/metadata/${sample}`).then(function(response) {
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#metadata-list`

    var list = d3.select(".metadata-list");
    list.html("");
    Object.entries(response).forEach(([key, value]) => {
      if (key != "WFREQ") {
        list.append("li").text(`${key}: ${value}`);
      }
    });

    // BONUS: Build the Gauge Chart
    buildGauge(response.WFREQ);
  }); 
}

function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then(function(response) {

    // Build a Bubble Chart using the sample data
    
    // fill in a colors array
    var colors = [];
    for (var i = 0; i < response.otu_ids.length; i++) {
        if (response.otu_ids[i] < 1000) {
          colors[i] = 'rgb(65, 54, 255)';
        } 
        else if (response.otu_ids[i] < 2000) {
          colors[i] = 'rgb(255,164, 255)';
        } 
        else if (response.otu_ids[i] < 2500) { 
          colors[i] = 'rgb(75, 144, 14)';
        } else {
          colors[i] = 'rgb(25, 255, 75)';
        }
    }
    
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers', 
      marker: {
        color : colors,
        size : response.sample_values
      }
    };

    var layout1 = {xaxis: {
                     title: {
                       text: "OTU ID"
                     }
                  }
    };
    
    var data1 = [trace1];

    Plotly.newPlot("bubble", data1, layout1);
    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var trace2 = {
      type: "pie",
      labels: response.otu_ids.slice(0, 10),
      values: response.sample_values.slice(0, 10),
      hoverinfo: response.otu_labels.slice(0, 10)
    };
    
    var data2 = [trace2];
    var layout2 = {title: ""};

    Plotly.newPlot("pie", data2, layout2);
      

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
