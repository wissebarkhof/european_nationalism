var netDetWidth = 540,
  // $('.total-bar')
  //   .width(),
  netDetMetrics = {
    'size': 'uniform',
    'color': 'country',
  },
  first = true,
  svgNetDet, network

if (!network) {
  d3.json('data/party_movement_graph.json', (err, data) => {
    if (err) {
      console.error(err);
    }
    network = data;
  });
}

function calculateRadius(d, metricVar) {
  if (metricVar.size === 'uniform') {
    return 15
  }
  if (metricVar.size === 'all_betweenness') {
    return Math.max(Math.sqrt(d[metricVar.size]), 10)
  }
  return Math.max(d[metricVar.size], 10)
}

function setNetDetMetric(type, value) {
  netDetMetrics[type] = value;
}

$('#sizeNetDetMetric')
  .on('change', function () {
    netDetMetrics['size'] = this.value;
    createNetworkDetail()
  })

$('#colorNetDetMetric')
  .on('change', function () {
    netDetMetrics['color'] = this.value;
    createNetworkDetail()
  })

function drawConnections(nodes, links) {
  if (svgNetDet) {
    svgNetDet.remove();
  }
  var w = netDetWidth;
  var h = netDetWidth;

  svgNetDet = d3.select(".network-detail")
    .append('svg')
    .attr("width", w)
    .attr("height", h);

  // TODO: arrowheads on links
  // svgNetDet.append("svg:defs")
  //   .selectAll("marker")
  //   // .data(["end"]) // Different link/path types can be defined here
  //   // .enter()
  //   .append("svg:marker") // This section adds in the arrows
  //   .attr("id", 'arrowhead')
  //   .attr("viewBox", "0 -5 10 10")
  //   .attr("refX", 15)
  //   .attr("refY", -1.5)
  //   .attr("markerWidth", 6)
  //   .attr("markerHeight", 6)
  //   .attr("orient", "auto")
  //   .append("svg:path")
  //   .attr("d", "M0,-5L10,0L0,5");

  var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
      .id(function (d) {
        return d.id;
      }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(w / 2, h / 2));

  var node = svgNetDet.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", d => calculateRadius(d, netDetMetrics))
    .attr("fill", function (d) {
      return color(d[netDetMetrics.color]);
    })
    .attr('stroke', d => d.main ? 'red' : 'white')
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("mouseover", function (d) {
      div.transition()
        .duration(10)
        .style("opacity", .9);
      div.html(generateTooltip(d))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(10)
        .style("opacity", 0);
    });

  var link = svgNetDet.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr('fill', 'black')
    .attr("stroke-width", 1)
    .attr('marker-end', 'url(#arrowhead)');

  node.append("title")
    .text(function (d) {
      return d.name;
    });

  simulation
    .nodes(nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(links);

  function ticked() {
    node.attr("cx", function (d) {
        var radius = calculateRadius(d, netDetMetrics);
        return d.x = Math.max(radius, Math.min(w - radius, d.x));
      })
      .attr("cy", function (d) {
        var radius = calculateRadius(d, netDetMetrics);
        return d.y = Math.max(radius, Math.min(h - radius, d.y));
      });

    link.attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3)
      .restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

function createNetworkDetail() {

  // initialize links with data by running the similation once
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
      .id(function (d) {
        return d.id;
      }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(netDetWidth / 2, netDetWidth / 2));
  simulation
    .nodes(network.nodes)

  simulation.force("link")
    .links(network.links);

  // initialize nodes
  network.nodes = network.nodes.map(d => {
    d.main = false;
    return d;
  })
  // find nodes and links for current country data
  var titles = currentData.map(d => d.title)
  var nodes = network.nodes.filter(d => titles.indexOf(d.title) > -1)
  var links = network.links.filter(d => titles.indexOf(d.source.title) > -1);

  // mark 'main' nodes
  nodes = nodes.map(d => {
    d.main = true
    return d
  })

  // add target nodes + data
  for (var i = 0; i < links.length; i++) {
    if (nodes.indexOf(links[i].target) < 0) {
      nodes.push(links[i].target)
    }
  }

  // draw connections
  drawConnections(nodes, links);
}
