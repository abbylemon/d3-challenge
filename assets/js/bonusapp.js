var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 150,
    bottom: 100,
    left: 80
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// initial parameters
var chosenXAxis = "age";
var chosenYAxis = "smokes";

// function for updating xaxis upon click of axis label
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([0.9 * d3.min(data, d => d[chosenXAxis]),
            1.1 * d3.max(data, d => d[chosenXAxis])])
        .range([0, width]);
    
    return xLinearScale;
}

// function for updating yaxis upon click of axis label
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([0.9 * d3.min(data, d => d[chosenYAxis]),
            1.1 * d3.max(data, d => d[chosenYAxis])])
        .range([height, 0]);
    
    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXaxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating yAxis var upon click on axis label
function renderYaxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderxCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

function renderyCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

function renderxLables(circleLabels, newXScale, chosenXAxis) {
    circleLabels.transition()
        .duration(1000)
        .attr("x", function(d) {
            return newXScale(d[chosenXAxis]);
        });

    return circleLabels;
}

function renderyLables(circleLabels, newYScale, chosenYAxis) {
    circleLabels.transition()
        .duration(1000)
        .attr("y", function(d) {
            return 1.01*newYScale(d[chosenYAxis]);
        });

    return circleLabels;
}


// function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//     var xlabel;
  
//     if (chosenXAxis === "age") {
//         xlabel = "Age (Median):";
//     }
//     else if (chosenXAxis === "poverty") {
//         xlabel = "Poverty (%)";
//     }
//     else {
//         xlabel = "Household Income (Median)";
//     }
  
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}`);
//       });
  
//     circlesGroup.call(toolTip);
  
//     circlesGroup.on("mouseover", function(data) {
//       toolTip.show(data);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
  
//     return circlesGroup;
//   }  

d3.csv("./assets/data/data.csv").then(function(stateStats, err) {
    if (err) throw err;
    // console.log(stateStats);
    // parse data
    stateStats.forEach(function (data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
    });

    // LinearScale function above csv import
    var xLinearScale = xScale(stateStats, chosenXAxis);
    var yLinearScale = yScale(stateStats, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateStats)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".7");

    // Create group for  3 x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age (Median)");

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("In Poverty (%)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (%)");

    // Create group for  3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var obeseLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("active", true)
        .text("Smokes (%)");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    var circleLabels = chartGroup.selectAll(null).data(stateStats).enter().append("text");

    circleLabels
        .attr("x", function(d) {
            return xLinearScale(d[chosenXAxis]);
        })
        .attr("y", function(d) {
            return 1.01*yLinearScale(d[chosenYAxis]);
        })
        .text(function(d) {
            return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of section
            var value = d3.select(this).attr("value");
            if (value != chosenXAxis) {
                chosenXAxis = value;
                console.log(chosenXAxis);

                // update xscale for new data
                xLinearScale = xScale(stateStats, chosenXAxis);
                // update xaxis with transition
                xAxis = renderXaxes(xLinearScale, xAxis);
                // update circles with new xvalues
                circlesGroup = renderxCircles(circlesGroup, xLinearScale, chosenXAxis);
                circleLabels = renderxLables(circleLabels, xLinearScale, chosenXAxis);
                // update tooltips with new info
                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // change classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "poverty") {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    
    ylabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of section
            var value = d3.select(this).attr("value");
            if (value != chosenYAxis) {
                chosenYAxis = value;
                console.log(chosenYAxis);

                // update xscale for new data
                yLinearScale = yScale(stateStats, chosenYAxis);
                // update xaxis with transition
                yAxis = renderYaxes(yLinearScale, yAxis);
                // update circles with new xvalues
                circlesGroup = renderyCircles(circlesGroup, yLinearScale, chosenYAxis);
                circleLabels = renderyLables(circleLabels, yLinearScale, chosenYAxis);
                // update tooltips with new info
                // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                // change classes to change bold text
                if (chosenYAxis === "smokes") {
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
