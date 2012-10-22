function drawChart()  {
    var sam = [
        { label: 'amicable', pct: [20, 27, 53], cap:"of those that do, few will respond in kind" },
        { label: 'responsive', pct: [0, 47, 53], cap:"less than half will take action" },
        { label: 'received', pct: [0, 0, 100], cap:"for all that have received and understood" }],

    si = 2,

    data = sam[si];

    var labels = ['amicable', 'responsive', 'received'];

    var w = 420,                       // width and height, natch
    h = 420,
    r = Math.min(w, h) / 2,        // arc radius
    dur = 750,                     // duration, in milliseconds
    color = d3.scale.category10(),
    donut = d3.layout.pie().sort(null),
    arc = d3.svg.arc().innerRadius(0).outerRadius(175);


// ---------------------------------------------------------------------
    d3.select("#cap").text(data.cap);

    var svg = d3.select("#dist").append("svg:svg")
        .attr("width", w).attr("height", h)
        .on("click", function() {
            if (si == 0) {
                si = 2;
            } else {
                si -= 1;
            }
            updateChart(si);
        });

    var arc_grp = svg.append("svg:g")
        .attr("class", "arcGrp")
        .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

    var label_group = svg.append("svg:g")
        .attr("class", "lblGroup")
        .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

    // DRAW ARC PATHS
    var arcs = arc_grp.selectAll("path")
        .data(donut(data.pct));
    arcs.enter().append("svg:path")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("fill-opacity", 0.5)
        .attr("fill", function(d, i) {return color(i);})
        .attr("d", arc)
        .each(function(d) {this._current = d});

    // DRAW SLICE LABELS
    var sliceLabel = label_group.selectAll("text")
        .data(donut(data.pct));

    function reLabel() {
        sliceLabel.remove();

        sliceLabel.enter().append("svg:text")
            .attr("class", "arcLabel")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .text(function(d, i) { if (data.pct[i] > 0) { return labels[i]; } });
    };

    // --------- "PAY NO ATTENTION TO THE MAN BEHIND THE CURTAIN" ---------

    // Store the currently-displayed angles in this._current.
    // Then, interpolate from this._current to the new angles.
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }

    // update chart
    function updateChart(idx) {
        data = sam[idx]
        //data = eval(model); // which model?

        arcs.data(donut(data.pct)); // recompute angles, rebind data
        arcs.transition().ease("elastic").duration(dur).attrTween("d", arcTween);

        reLabel();

        sliceLabel.data(donut(data.pct));
        sliceLabel.transition().ease("elastic").duration(dur)
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")"; })
            .style("fill-opacity", function(d) {return d.value==0 ? 1e-6 : 1;});

        d3.select("#cap").text(data.cap);
    }

    var w1 = 960,
    h1 = 500;
    
    var svg1 = d3.select("#prim").append("svg:svg")
        .attr("width", w1)
        .attr("height", h1);
    
    svg1.append("svg:circle")
        .attr("cx", 590)
        .attr("cy", 340)
        .attr("r", 160)
        .style("fill", "steelblue")
        .style("fill-opacity", ".5");

    svg1.append("svg:g")
        .attr("transform", "translate(590, 340)")
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("class", "chartLabel")
        .attr("text-anchor", "middle")
        .text("stability");    

    svg1.append("svg:circle")
        .attr("cx", 475)
        .attr("cy", 160)
        .attr("r", 160)
        .style("fill", "limegreen")
        .style("fill-opacity", ".5");
    
    svg1.append("svg:g")
        .attr("transform", "translate(475, 160)")
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("class", "chartLabel")
        .attr("text-anchor", "middle")
        .text("quality");    

    svg1.append("svg:circle")
        .attr("cx", 360)
        .attr("cy", 340)
        .attr("r", 160)
        .style("fill", "maroon")
        .style("fill-opacity", ".5");
    
    svg1.append("svg:g")
        .attr("transform", "translate(360, 340)")
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("class", "chartLabel")
        .attr("text-anchor", "middle")
        .text("change");    

}
