// @TODO: YOUR CODE HERE!

var svgWidth = 1000;
var svgHeight = 500;

var margin  = {
    top: 20,
    right: 40,
    bottom: 60,
    left:50
};

var width = svgWidth = margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.selec("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("./assets/data/data.csv").then(function (stateStats) {
    console.log(stateStats);

    // plot smokes vs age
    stateStats.forEach(function (data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    var xLinearScale = d3.scaleLinear()
        .domain(d3.extend(stateStats, d => d.age))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
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
        .attr("cx", (d,i) => xLinearScale(i))
        .attr("cy", d => yLinearScale(d))
        .attr("r", "5")
        .attr("fill", "blue");

    var toolTip = d3.select("body").append("div")
        .attr("class", "tooltip");

    circlesGroup.call(toolTip);

}).catch(function (e) {
    console.log(e);
});