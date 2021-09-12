function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((sampledata) => {
    // 3. Create a variable that holds the samples array. 
    var samples = sampledata.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = result.otu_ids;
    console.log(otuId);
    var otuLabel = result.otu_labels.slice(0,10);
    console.log(otuLabel);
    var sampleVal = result.sample_values.slice(0,10).reverse();
    console.log(sampleVal);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var otu_top = result.otu_ids.slice(0,10).reverse();
    console.log(otu_top)
    // Get otu ids in the desired format:
    var otu_id = otu_top.map(d => "OTU " + d);
    console.log(otu_id);
    // Get the top 10 otu labels
    var yticks = resultArray[0].otu_labels.slice(0,10);
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleVal,
      y: otu_id,
      text: yticks,
      marker: {
        color: sampleVal,
        colorscale: 'Blues',
        reversescale: true,
      },
      type:  "bar",
      orientation: "h"
    };
    var data = [trace];
    
    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "<b>Top 10 Bacteria Cultures Found<b>",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, layout);

    // 1. Create the trace for the bubble chart.
    var bubble_data = [{
      x: otuId,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: otuId,
        colorscale: 'Blues',
        reversescale: true,
      }
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample<b>",
      xaxis: {title: "OTU ID"},
      hovermode: 'closest'
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubble_data, bubbleLayout); 

    // Create the Gauge chart
    // Obtain the washing frequency as a float
    var metadata =  sampledata.metadata.filter(Objsample => Objsample.id == sample)[0];
    var w_freq = parseFloat(metadata.wfreq);
    console.log(w_freq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value:  w_freq,
      title: {"text": "<b>Belly Button Washing Frequency<b><br><span style='font-size:0.8em;color:gray'>Scrubs per Week</span>"},
      type: "indicator",
		  mode: "gauge+number",
      gauge: { axis: { range: [null, 10] },
      bar: {'color': "#000066"},
                   steps: [
                    { range: [0, 2], color: "#e6e6ff"},
                    { range: [2, 4], color: "#ccccff"},
                    { range: [4, 6], color: "#9999ff"},
                    { range: [6, 8], color: "#6666ff"},
                    { range: [8, 10], color: "#0000b3"},
                  ]}
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
      }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

