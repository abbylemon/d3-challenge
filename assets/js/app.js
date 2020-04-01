// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

var width = svgWidth = margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("./assets/data/data.csv").then(function(stateStats) {
    console.log(stateStats);

    // plot smokes vs age
    stateStats.forEach(function (data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
    });
    // console.log(stateStats.smokes);
    // console.log(stateStats.age);

    var xLinearScale = d3.scaleLinear()
        .domain([0, 1.1 * d3.max(stateStats, d => d.age)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateStats, d => d.age)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateStats)
        .enter()
        .append("circle")
        .attr("cx", (d) => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "5")
        .attr("fill", "blue");

    var toolTip = d3.tip()
        .attr("class", "tooltip");

    circlesGroup.call(toolTip);

    // chartGroup.append("text")

}).catch(function (e) {
    console.log(e);
});