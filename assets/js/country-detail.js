console.log('country-detail.js loaded');

var country, wikiData, currentData, svgVote,
  svgSeats;

var detailWidth = $('.country-detail')
  .width() - 10;
var barHeight = 300;

function setCountry(d) {
  country = {
    name: d.properties.NAME
  };
  console.log('Country is set to:', country.name);
  filterData()
  calculateTotals()
  drawTotals()
  $('.country-name')
    .text(country.name)
  $('#seatsToGet')
    .text(country.seatsToGet)
  $('#totalPercentage')
    .text(country.totalPercentage + '%')
  $('#totalVotesNum')
    .text(country.totalVotes)
  $('#totalSeatsNum')
    .text(country.totalSeats)

  $('#numParties')
    .text(currentData.length)
  $('.detail-explanation')
    .show()
}


function filterData(d) {
  currentData = wikiData.filter(d => d.country === country.name)
  console.log(currentData);
}

function calculateTotals() {
  country.totalVotes = d3.sum(currentData, (d) => {
    return parseInt(d.Votes);
  });

  country.totalPercentage = Math.round(d3.sum(currentData, (d) => {
    return parseFloat(d.fraction_votes)
  }), 4);

  country.votesToGet = parseInt(country.totalVotes / (country.totalPercentage / 100))

  country.totalSeats = d3.sum(currentData, (d) => {
    return parseInt(d.seats)
  });

  country.seatsToGet = currentData.length > 0 ? currentData[0].total : 0;
  console.log('country', country);
}


function drawTotals() {
  if (svgSeats) {
    svgSeats.remove()
  }

  if (svgVote) {
    svgVote.remove()
  }

  if (currentData.length === 0) {
    $('#noData')
      .show()
    return;
  } else {
    $('#noData')
      .hide()
  }


  var barWidth = 0.5 * detailWidth,
    margin = {
      top: 20,
      right: 0,
      bottom: 180,
      left: 70
    },
    w = barWidth - margin.left - margin.right,
    h = barHeight - margin.top - margin.bottom;

  // votes
  svgVote = d3.select('#totalVotes')
    .append('svg')
    .attr('width', barWidth)
    .attr('height', barHeight)

  var gVote = svgVote.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // seats
  svgSeats = d3.select('#totalSeats')
    .append('svg')
    .attr('width', barWidth)
    .attr('height', barHeight)

  var gSeats = svgSeats.append("g")
    .attr("transform", "translate(" + (margin.left - 20) + "," + margin.top + ")");

  // scales
  var x = d3.scaleBand()
    .rangeRound([0, w])
    .padding(0.1),
    y = d3.scaleLinear()
    .rangeRound([h, 0]);

  // draw bars
  function createBar(metric, g, total) {
    // set domain
    x.domain(currentData.map(function (d) {
      return d.Party;
    }));
    y.domain([0, total]);
    console.log('data', currentData);

    // x axis
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-90)")

    // y axis
    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y)
        .ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

    // bars
    g.selectAll(".bar")
      .data(currentData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.Party);
      })
      .attr("y", function (d) {
        return y(parseInt(d[metric]));
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return h - y(parseInt(d[metric]));
      });

    // totle
    g.append("text")
      .attr("x", (w / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .text(metric);

  }

  createBar('seats', gSeats, country.seatsToGet)
  createBar('Votes', gVote, country.votesToGet)

  // console.log('total votes', totalVotes, 'votes to get', votesToGet, 'total %', totalPercentage, parseFloat(totalVotes / votesToGet), 'total seats', totalSeats)

}

d3.csv('../../data/wikitable.csv', (err, data) => {
  if (err) {
    console.error(err);
  }

  wikiData = data;

})
