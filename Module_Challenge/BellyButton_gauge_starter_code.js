// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var sampledata = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number and holds the first sample in the array.
    var result_arr  =sampledata.filter(sampleObj => sampleObj.id == sample)[0];
    // 1. Create a variable that filters the metadata array for the object with the desired sample number and holds the first sample in the array.
    var metadata = data.metadata.filter(sampleObj => sampleObj.id = sample)[0];
    console.log(metadata);
    console.log(result_arr);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = result_arr.otu_ids;
    var otu_labels =  result_arr.otu_labels;
    var sampleVal =  result_arr.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var w_freq = parseFloat(metadata.wfreq);
    console.log(w_freq)
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value = w_freq,
      title: "'<h1>Belly Button Washing Frequency</h1>'\nScrubs per Week",
      type: "indicator",
		  mode: "gauge+number"
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 700, 
      height: 600, 
      margin: { t: 20, b: 40, l:100, r:100 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot();
  });
}
