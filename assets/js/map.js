var w = $(".map")
  .width(),
  h = 700,
  geo = {
    type: 'FeatureCollection'
  },
  colors = ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
  metric = 'seats',
  path, paths, countries, dataset;

console.log('map.js loaded');

// helper to get correct value from data set
var getColorValue = function (d) {

}

// threshold scale
var thresholdScale = d3.scaleThreshold()
  .range(colors);

// initialize svg
var svg = d3.select('.map')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

// load geojson data
d3.json('data/europe_small.geojson', function (err, data) {
  if (err) {
    console.error(err);
  }

  // remove isreal (illegal state -> free palestine)
  geo.features = data.features.filter((d) => d.properties.FIPS !== 'IS');

  console.log(geo);
  // scale and center
  var center = d3.geoCentroid(geo)
  var scale = 500;
  var offset = [0.6 * w, 0.6 * h];
  var projection = d3.geoMercator()
    .center(center)
    .translate(offset)
    .scale([scale]);

  // set projection
  path = d3.geoPath()
    .projection(projection)

  d3.csv('data/wikitable.csv', (err, data) => {
    if (err) {
      console.error(err);
    }

    dataset = data;

  })

  drawMap()

});


function drawMap() {

  // remove elements if exist
  if (paths) {
    paths.remove();
  }

  if (countries) {
    countries.remove();
  }

  //Bind data and create one path per GeoJSON feature
  paths = svg.selectAll("path")
    .data(geo.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr('class', 'country')
    .style("fill", function (d) {
      return colors[5];
      // return thresholdScale(getColorValue(d));
    })
    .on('mouseover', function (d, i) {
      var currentState = this;
      d3.select(this)
        .style('fill-opacity', 1)
        .style("cursor", "pointer");
    })
    .on('mouseout', function (d, i) {
      d3.select(this)
        .style('fill-opacity', 0.8)
        .style("cursor", "default");
    })
    .on('click', clickCountry);

  // Add names to the districts
  countries = svg.selectAll('text country-names')
    .data(geo.features)
    .enter()
    .append("text")
    .attr('class', 'district-names')
    .text(function (d) {
      return d.properties.ISO2;
    })
    .attr("x", function (d) {
      return path.centroid(d)[0];
    })
    .attr("y", function (d) {
      return path.centroid(d)[1];
    })
    .attr("text-anchor", "middle")
    .attr('font-size', '8pt')
    .attr('fill', '#2F4F4F')
}

function clickCountry(d) {
  setCountry(d);
}
