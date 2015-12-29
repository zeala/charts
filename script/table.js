TableController = {};

TableController.tabulate = function(data, columns){
    var table = d3.select("#tableBodyContainer").append("table")
            .attr("height", "200px")
        /*.attr("style", "margin-left: 250px")*/;
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    //append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column){ return column.toUpperCase();});

    //create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    //create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row){
            return columns.map(function(column){
                return { column:column, value: row[column]};
            })
        })
        .enter()
        .append("td")
        .attr("class", function(d){ return d.column})
        .attr("style", "font-family: Courier")
        .attr("class", "tableCell")
        .html(function(d){ return d.value})
        .on("mouseover", function(d, i){
            console.log("i" + i);
            TableController.displayInfoOnHover(data, d, i)
        });

    return table;

};

TableController.displayInfoOnHover = function(data, cellData, index){

};