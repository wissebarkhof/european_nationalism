console.log('country-detail.js loaded');

var country, wikiData, currentData;

var detailWidth = $('.county-detail')
  .width();
var pieHeight = 100;

function setCountry(d) {
  country = d.properties.NAME;
  console.log('Country is set to:', country);
  $('#country')
    .text(country)
  filterData()
  drawTotals()
}


function filterData(d) {
  currentData = wikiData.filter(d => d.country === country)
  console.log(currentData);
}

function drawTotals() {
  var totalVotes = d3.sum(currentData, (d) => {
    return parseInt(d.Votes);
  });
  var totalPercentage = d3.sum(currentData, (d) => {
    return parseFloat(d.fraction_votes)
  });
  var totalSeats = d3.sum(currentData, (d) => {
    return parseInt(d.seats)
  });

  var pieWidth = 0.5 * detailWidth,
    radius = Math.min(pieWidth, pieHeight) / 2;

  // votes
  var svgVote = d3.select('#totalVotes')
    .append('svg')
    .attr('width', 0.5 * detailWidth)
    .attr('height', pieHeight)

  var gVote = svgVote.append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

  // seats
  var svgSeats = d3.select('#totalSeats')
    .append('svg')
    .attr('width', 0.5 * detailWidth)
    .attr('height', pieHeight)

  var gSeats = svgSeats.append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

  console.log('total votes', totalVotes, 'total %', totalPercentage, 'total seats', totalSeats)

}

d3.csv('../../data/wikitable.csv', (err, data) => {
  if (err) {
    console.error(err);
  }

  wikiData = data;

})
