var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

console.log("x " + x);
console.log("y : " + y);

var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

var valueline =
    d3.svg.line()
        .x(function(d){ return x(d.date);})
        .y(function(d){ return y(d.close);});

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function make_x_axis(){
    return d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(30)
}

function make_y_axis(){
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)
}

// get the data
d3.tsv("./data/data.tsv", function(error, data){
    console.log("error : " + error);
    console.log(data);
    data.forEach(function(d){
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    //scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date;}));
    y.domain([0, d3.max(data, function(d){ return d.close})]);


    //draw the gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0, " + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
    );

    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
    );

    svg.append("path") //add the valueline path
        .attr("d", valueline(data));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);



    //adding x axis label:
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + margin.bottom)
        .style("text-anchor", "middle")
        .text("Date");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //adding the y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0- margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");

    //adding a title
    svg.append("text")
        .attr("x", width /2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Value vs Date Graph");


});

