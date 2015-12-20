var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;

var dataNodes;
var svg;
var source;

createNodes = function(svg, dataNodes, source){
    this.dataNodes = dataNodes;
    this.svg = svg;
    this.source = source;
    var node = svg.selectAll("g.node")
        .data(dataNodes, function(d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + source.x0 + "," + source.y0 + ")"; })
        .attr("draggable", true)
        .call(d3.behavior.drag()
            .origin(function(d) { return d;})
            .on("dragstart", function() {
                duration = 0;
                this.parentNode.appendChild(this);
                d3.event.sourceEvent.stopPropagation();})
            .on("drag", dragmove))
            .on("dragend", dragend)
        .on("click", clickHandler);
    nodeEnter.append("circle")
        .attr("r", 10)
        .style("fill", function(d){
            return d._children ? "lightsteelblue" : "#fff";
        })


    ;
    nodeEnter.append("text")
        .attr("y", function(d) {
            return d.children || d._children ? -18 : 18; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);


    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff"; });
    nodeUpdate.select("text")
        .style("fill-opacity", 1);


    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.x +
            "," + source.y + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);
    nodeExit.select("text")
        .style("fill-opacity", 1e-6);


    // links
    var links = tree.links(dataNodes);
    var link = createLinks(svg, links, dataNodes, source);

    // Stash the old positions for transition.
    dataNodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });


    return node;
};


function dragend(d){
    var element = d3.select(this);
    console.log("drag end called");
    console.log(d)
}

function drop(d){
    console.log("drop called");

}

function dragmove(d) {

    d3.select(this).attr("transform",
        "translate(" + (d.x = d3.event.x  ) + "," + (d.y = d3.event.y)  + ")");

    // links
    var links = tree.links(dataNodes);
    var link = createLinks(svg, links, dataNodes, source);
}


function clickHandler(d){

    duration = 750;
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    console.log(d)
    update(d);
}


