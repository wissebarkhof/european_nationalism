console.log('network.js loaded');

var netWidth = $('.network')
  .width(),
  marginNet = {
    top: 200,
    bottom: 200,
    left: 200,
    right: 200,
  },
  netHeight = 1000,
  radius = 10,
  netMetrics = {
    color: 'country',
    size: 'uniform',
  },
  netData, svgNet;

function setMetric(type, value) {
  netMetrics[type] = value;
}

$('#sizeMetric')
  .on('change', function () {
    netMetrics['size'] = this.value;
    drawNetwork()
  })

$('#colorMetric')
  .on('change', function () {
    netMetrics['color'] = this.value;
    drawNetwork()
  })


function drawNetwork() {
  if (svgNet) {
    svgNet.remove();
  }
  var w = netWidth - marginNet.left - marginNet.right
  var h = netHeight - marginNet.top - marginNet.bottom
  svgNet = d3.select(".network")
    .append('svg')
    .attr("width", w)
    .attr("height", h);

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

  var link = svgNet.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(netData.links)
    .enter()
    .append("line")
    .attr('fill', 'black')
    .attr("stroke-width", 1);

  var node = svgNet.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(netData.nodes)
    .enter()
    .append("circle")
    .attr("r", d => netMetrics.size === 'uniform' ? 10 : netMetrics.size === 'all_betweenness' ? Math.sqrt(d[netMetrics.size]) : d[netMetrics.size])
    .attr("fill", function (d) {
      return color(d[netMetrics.color]);
    })
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

  node.append("title")
    .text(function (d) {
      return d.name;
    });

  simulation
    .nodes(netData.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(netData.links);

  function ticked() {
    node.attr("cx", function (d) {
        return d.x = Math.max(radius, Math.min(w - radius, d.x));
      })
      .attr("cy", function (d) {
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

function generateTooltip(d) {
  var basicInfo = `<strong>${d.name}</strong></br>
          <span>${d.country}</span></br>
          <i>${d.label === 'Party' ? 'Nationalist Party' : 'Fascist Movement'}</i>`;
  var links = findConnected(d);
  var movements = links.filter(d => d.label === 'Movement')
  var parties = links.filter(d => d.label === 'Party')
  var connectedParties = parties.map(d => ` - ${d.name} (${d.country}) <i>${d.label === 'Party' ? 'Nationalist Party' : 'Fascist Movement'}</i>`)
    .join('</br>')
  var connectedMovements = movements.map(d => ` - ${d.name} (${d.country}) <i>${d.label === 'Party' ? 'Nationalist Party' : 'Fascist Movement'}</i>`)
    .join('</br>')
  return basicInfo + '<span class="connected-to">Links to nationalist parties:</span>' +
    connectedParties + '<span class="connected-to">Links to fascist movements:</span>' + connectedMovements;
}

function findConnected(node) {
  var links = netData.links.filter(d => d.source.id === node.id)
  return links.map(d => d.target);
}

d3.json('data/party_movement_graph.json', (err, data) => {
  if (err) {
    console.error(err);
  }

  netData = data;
  drawNetwork()
})
