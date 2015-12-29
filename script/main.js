$(function() {
    $( "#panelContainer" ).sortable({
        handle: ".panel-heading"
    });
    $( '#updateRuntimeBtn').on('click', function(){
        isUpdatingAtRuntime = !isUpdatingAtRuntime;
        $(this).prop('value', (isUpdatingAtRuntime ? "stop updates" : " start updates"));
        //clearInterval(updateInteval)
        if (isUpdatingAtRuntime){
            updateInteval = setInterval(updateDataRuntime, 800);

        }else{
            clearInterval(updateInteval);
            duration = 500;
        }
    })
});
var updateInteval;
var isUpdatingAtRuntime = false;
var duration = 500;
var durationElastic = 500;
var radius = 2;

var margin = {top: 30, right: 40, bottom: 60, left: 50},
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

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


var div = d3.select("#graphContainer").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("#graphContainer")
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

var tableData;

// get the data
d3.tsv("./data/data.tsv", function(error, data){
    tableData = data;
    data.forEach(function(d, i){
        d.date = parseDate(d.date);
        d.dateFormatted = moment(d.date).format('DD/MMM/YYYY');
        d.close = +d.close;
        d.open = +d.open;
        d.url = d.link;
        d.diff = Math.round((d.close - d.open) * 100) / 100;
        d.rowIndex = i;
    });

    //scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date;}));
    y0.domain([0, d3.max(data, function(d){ return Math.max(d.close)})]);
    y1.domain([0, d3.max(data, function(d){ return Math.max(d.open)})]);


    var y0Max = d3.max(data, function(d){ return Math.max(d.close)});
    var y1Max = d3.max(data, function(d){ return Math.max(d.open)});
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
            else if (d.close >= 600) { return 'teal'}
            else { return 'navy'; }
        })
            .attr("class", "circle1")
            .attr("r", radius)

            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y0(d.close); })
            .on("mouseover", function(d) {
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
        .attr("id", "leftAxis")
        .call(yAxisLeft);

    //right vertical axis
    svg.append("g")
        .attr("class", "y axisR axis")
        .attr("id", "rightAxis")
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

    svg.append("text")
        .attr("x", 0)
        .attr("y", height + margin.top + 10)
        .attr("class", "legend")
        .attr("fill", "indianred")
        .on("click", function(){
            var active = redLine.active ? false : true;
            var newOpacity = active ? 0 : 1;
            d3.select("#redLine").style("opacity", newOpacity);
            d3.select("#rightAxis").style("opacity", newOpacity);
// Update whether or not the elements are active
            redLine.active = active;
        })
        .text("Toggle Open Values")

    TableController.tabulate(data, ["dateFormatted", "close", "open", "diff", "url"])
});

function updateDataRuntime(){

        updateTableData();

        //Scale the range of the data
        x.domain(d3.extent(tableData, function(d) { return d.date;}));
        y0.domain([0, d3.max(tableData, function(d){ return d.close;})]);
        y1.domain([0, d3.max(tableData, function(d) { return d.open;})])

        var y0Max = d3.max(tableData, function(d){ return d.close;});
        var y1Max = d3.max(tableData, function(d) { return d.open;})


        //var circles = svg.selectAll("circle");
        //make the changes
        svg.select(".line1")
            .transition()
            .duration(duration)
            .ease("elastic")
            .attr("d", valueline(tableData));
        svg.select(".line2")
            .transition()
            .duration(durationElastic)
            .ease("elastic")
            .attr("d", valueline2(tableData));

        svg.selectAll(".circle1")
            .data(tableData)
            .style("fill", function(d){
                if (d.close <= 400) { return 'red'}
                else if (d.close >= 600) { return 'teal'}
                else { return 'navy'; }})
            .transition()
            .duration(duration)
            .ease("elastic")
            .attr("r", radius)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y0(d.close); });


        svg.select(".x.axis")
            .transition()
            .duration(durationElastic)
            .call(xAxis);
        svg.select(".axisL")
            .call(yAxisLeft);
        svg.select(".axisR")
            .call(yAxisRight);

        //update the fill area
        svg.select(".areaAbove")
            .transition()
            .duration(duration)
            .attr("d", areaAbove(tableData));

        svg.select(".area")
            .transition()
            .duration(duration)
            .attr("d", area(tableData));
    //});
}




function updateTableData(){
    duration = 0;//400;
    durationElastic = 500;
    var lastItem = tableData[0];
    var lastItemDate = new Date(lastItem.date);
    var newItemDate = lastItemDate.setDate(lastItemDate.getDate() + 1);
    var firstitem = tableData.pop();
    firstitem.date = new Date(newItemDate);
    firstitem.dateFormatted = moment(firstitem.date).format('DD/MMM/YYYY');
    tableData.unshift(firstitem);
    TableController.tableData = tableData;
    TableController.updateData();
}