createNodes = function(svg, dataNodes, source){
    var node = svg.selectAll("g.node")
        .data(dataNodes, function(d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + source.x0 + "," + source.y0 + ")"; })
        .on("click", function (d){

            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            console.log(d)
            update(d);
        });
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
}