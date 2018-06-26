var communityData,
  currentCom = 1,
  currentComData, totalNodes, totalParties, totalMovements, totalInactive,
  inactive = '#ddd',
  movement = 'red',
  party = 'green';

function filterComData() {
  currentComData = communityData.filter(d => parseInt(d.community) === parseInt(currentCom));
  totalNodes = currentComData.length
  totalParties = currentComData.filter(d => d.label === 'party')
    .length
  totalMovements = currentComData.filter(d => d.label === 'movement')
    .length
  totalInactive = currentComData.filter(d => d.active === 'Yes')
    .length
}


function fillTable() {
  console.log('filling table for', currentCom);
  // column names
  var columns = ['name', 'country', 'label']
  // clear table
  $("#com-table tr")
    .remove();
  // fill table
  var table = $('#com-table')
  $.each(currentComData, function (rowIndex, r) {
    var row = $("<tr/>");
    $.each(columns, function (colIndex, c) {
      row.append($("<td/>")
        .text(r[c]));
    });
    if (r.active === 'No') {
      console.log('active');
      row.css('background-color', inactive);
      console.log('row', row);
    }
    if (r.label === 'movement') {
      row.css('color', movement);
    }
    if (r.label === 'party') {
      row.css('color', party);
    }
    table.append(row);
  });
  $('#totalNodes')
    .text(totalNodes)
  $('#totalMovements')
    .text(totalMovements)
  $('#totalParties')
    .text(totalParties)
  $('#totalInactive')
    .text(totalInactive)
}


$('#communitySelect')
  .on('change', function () {
    currentCom = parseInt(this.value);
    filterComData()
    fillTable()
  })

d3.csv('data/party_movements_communities.csv', (err, data) => {
  if (err) {
    console.error('Error loading community data', err);
  }
  communityData = data;
  filterComData()
  fillTable()
});
