function buildGauge(freqNum) {

    var data = [{domain: {x: [0, 1], y: [0, 1]}, value: freqNum, title: {text: "Scrubs per week"},
                type: "indicator", mode: "gauge+number"}];
  
    var layout = {width: 500, height: 500, margin: {t: 0, b: 0}};
  
    Plotly.newPlot("gauge", data, layout);
  }
