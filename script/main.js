/*var inter = setTimeout(function(){
    updateData();
}, 5000);*/

var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;
var formatTime = d3.time.format("%e %B");

var x = d3.time.scale().range([0, width]);
var y0 = d3.scale.linear().range([height, 0]);
var y1 = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
var yAxisLeft = d3.svg.axis().scale(y0).orient("left").ticks(5);
var yAxisRight = d3.svg.axis().scale(y1).orient("right").ticks(5);

var area = d3.svg.area()
    .x(function(d) { return x(d.date);})
    .y0(height)
    .y1(function(d){ return y0(d.close);});

var areaAbove = d3.svg.area()
    .x(function(d) { return x(d.date);})
    .y0(function(d){ return y0(d.close);})
    .y1(0);


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var valueline =
    d3.svg.line()
        .x(function(d){
            return x(d.date);})
        .y(function(d){ return y0(d.close);});

var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.date);})
    .y(function(d) { return y1(d.open);});





function make_x_axis(){
    return d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(30)
}

function make_y_axis(){
    return d3.svg.axis()
        .scale(y0)
        .orient("left")
        .ticks(10)
}

// get the data
d3.tsv("./data/data.tsv", function(error, data){
    data.forEach(function(d){
        d.date = parseDate(d.date);
        d.close = +d.close;
        d.open = +d.open;
        d.link = d.link;
    });

    //scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date;}));
    y0.domain([0, d3.max(data, function(d){ return Math.max(d.close)})]);
    y1.domain([0, d3.max(data, function(d){ return Math.max(d.open)})]);


    var y0Max = d3.max(data, function(d){ return Math.max(d.close)});
    var y1Max = d3.max(data, function(d){ return Math.max(d.open)});
    console.log("y0max : " + y0Max);
    console.log("y1max : " + y1Max);

    //line gradient
    svg.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y0(0))
        .attr("x2", 0).attr("y2", y0(1000))
        .selectAll("stop")
        .data([
            {offset: "0%", color: "red"},
            {offset: "40%", color: "red"},
            {offset: "40%", color: "navy"},
            {offset: "62%", color: "navy"},
            {offset: "62%", color: "teal"},
            {offset: "100%", color: "teal"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) {
            console.log("offset : " + d.offset);
            return d.offset; })
        .attr("stop-color", function(d) {
            console.log("color : " + d.color)
            return d.color; });


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

    //draw the fill
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);


    //fill above
    svg.append("path")
        .datum(data)
        .attr("class", "areaAbove")
        .attr("d", areaAbove);

    //main path
    svg.append("path") //add the valueline path
        .attr("class", "line1 line-with-gradient")
        .attr("d", valueline(data))
        .attr("id", "mainLine");

    svg.selectAll(".circle1")
        .data(data)
        .enter().append("circle")
        .style("fill", function(d){
            if (d.close <= 400) { return 'red'}
            else if (d.close >= 620) { return 'teal'}
            else { return 'navy'; }
        })
            .attr("class", "circle1")
            .attr("r", 5)

            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y0(d.close); })
            .on("mouseover", function(d) {
                console.log(d);
                console.log(d.link)
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(
                    '<a href="' + d.link +'" target="_blank">' +
                        formatTime(d.date) +
                    "</a>" +
                    "<br/>" + d.close)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });;



    //second path
    svg.append("path")
        .attr("class", "line2")
        .attr("id", "redLine")
        .style("stroke", "indianred")
        .style("stroke-dasharray", ("3, 3"))
        .attr("d", valueline2(data));


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

    //left vertical axis
    svg.append("g")
        .attr("class", "y axisL axis")
        .call(yAxisLeft);

    //right vertical axis
    svg.append("g")
        .attr("class", "y axisR axis")
        .attr("transform", "translate(" + width + " ,0)")
        .style("fill", "indianred")
        .call(yAxisRight);

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

function updateData(){
    d3.csv("data/data-alt.csv", function(error, data){
            data.forEach(function (d){
                d.date = parseDate(d.date);
                d.close = +d.close;
                d.open = +d.open
            });

            //Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date;}));
            y0.domain([0, d3.max(data, function(d){ return d.close;})]);
            y1.domain([0, d3.max(data, function(d) { return d.open;})])

        var y0Max = d3.max(data, function(d){ return d.close;});
        var y1Max = d3.max(data, function(d) { return d.open;})

        console.log("y0max " + y0Max);
        console.log(" y1Max : " + y1Max);
        console.log( svg.selectAll("circle1"))

        //select the section we want to apply the changes to
        //var svg = d3.select("body").transition();

        //var circles = svg.selectAll("circle");
        //make the changes
        svg.select(".line1")
            .transition()
            .duration(750)
            .ease("elastic")
            .attr("d", valueline(data));
        svg.select(".line2")
            .transition()
            .duration(750)
            .ease("elastic")
            .attr("d", valueline2(data));

        svg.selectAll(".circle1")
            .data(data)
            .transition()
            .duration(750)
            .ease("elastic")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y0(d.close); });


        svg.select(".x.axis")
            .transition()
            .duration(750)
            .call(xAxis);
        svg.select(".axisL")
            .call(yAxisLeft);
        svg.select(".axisR")
            .call(yAxisRight);

        //update the fill area
        svg.select(".areaAbove")
            .transition()
            .duration(500)
            .attr("d", areaAbove(data));

        svg.select(".area")
            .transition()
            .duration(500)
            .attr("d", area(data));
    });
}

