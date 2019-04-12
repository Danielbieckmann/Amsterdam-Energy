// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  doubleClickZoom: false 
}).setView([52.36, 4.9], 10);

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'danielbieckmann'
});

//LAYER ONE STARTS HERE

// Initialze source data
var OrgSource = new carto.source.Dataset('energy_organizations');

// Create style for the data
var OrgStyle = new carto.style.CartoCSS
(`
 #layer {
  marker-width: 11.5;
  marker-fill: #008004;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #000000;
  marker-line-opacity: 1;
}
`);

// Add style to the data
var OrgLayer = new carto.layer.Layer(OrgSource, OrgStyle, {
  featureClickColumns: ['name', 'description', 'logo']
});

OrgLayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h6>' + '<div> Organization:' + '</h6>' + '<h4>' + event.data['name'] + '</h4>';
  content += '<h3>' + event.data['name'] + ' '  + event.data['description'] + '</div>' + '</h3>';
  
  // If you're not sure what data is available, log it out:
  console.log(event.data);
  
  var popup = L.popup();
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

client.addLayer(OrgLayer);
client.getLeafletLayer().addTo(map);

 // Make SQL to get the summary data you want
var countSql = 'SELECT COUNT(*) FROM energy_organizations';

// Request the data from Carto using fetch.
// You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
fetch('https://danielbieckmann.carto.com/api/v2/sql/?q=' + countSql)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // All of the data returned is in the response variable
    console.log(data);

    // The sum is in the first row's sum variable
    var count = data.rows[0].count;

    // Get the sidebar container element
    var sidebarContainer = document.querySelector('.sidebar-feature-content');

    // Add the text including the sum to the sidebar
    sidebarContainer.innerHTML = '<div>There are ' + count + ' initiatives currently active in the Amsterdam Energy Collective. Learn more by clicking on the points on the map! </div>';
  });



function handleCheckboxChange() {
  // First we find every checkbox and store them in separate variables
  var NorthCheckbox = document.querySelector('.North-checkbox');
  var EastCheckbox = document.querySelector('.East-checkbox');
  var SouthCheckbox = document.querySelector('.South-checkbox');
  var WestCheckbox = document.querySelector('.West-checkbox');
  var NewWestCheckbox = document.querySelector('.New-West-checkbox');
  var CenterCheckbox = document.querySelector('.Center-checkbox');
  var SouthEastCheckbox = document.querySelector('.South-East-checkbox');
  var WestpoortCheckbox = document.querySelector('.Westpoort-checkbox');
 
  
  // Logging out to make sure we get the checkboxes correctly
  //console.log('adult:', adultCheckbox.checked);
  //console.log('juvenile:', juvenileCheckbox.checked);
  //console.log('neonate:', neonateCheckbox.checked);
  
  // Create an array of all of the values corresponding to checked boxes.
  // If a checkbox is checked, add that filter value to our array.
  var lifeStages = [];
  if (NorthCheckbox.checked) {
    // For each of these we are adding single quotes around the strings,
    // this is because in the SQL query we want it to look like:
    //
    //   WHERE life_stage IN ('Adult', 'Juvenile')
    //
    lifeStages.push("'North'");
  }
  if (EastCheckbox.checked) {
    lifeStages.push("'East'");
  }
  if (SouthCheckbox.checked) {
    lifeStages.push("'South'");
  }
  if (WestCheckbox.checked) {
    lifeStages.push("'West'");
  }
  if (NewWestCheckbox.checked) {
    lifeStages.push("'New-West'");
  }
  if (CenterCheckbox.checked) {
    lifeStages.push("'Center'");
  }
  if (SouthEastCheckbox.checked) {
    lifeStages.push("'South-East'");
  }
  if (WestpoortCheckbox.checked) {
    lifeStages.push("'Westpoort'");
  }
  
  // If there are any values to filter on, do an SQL IN condition on those values,
  // otherwise select all features
  if (lifeStages.length) {
    var sql = "SELECT * FROM energy_organizations WHERE Neighborhood IN (" + lifeStages.join(',') + ")";
    console.log(sql);
    OrgSource.setQuery(sql);
  }
  else {
    OrgSource.setQuery("SELECT * FROM energy_organizations");
  }
}


/*
 * Listen for changes on any checkbox
 */
var NorthCheckbox = document.querySelector('.North-checkbox');
NorthCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var EastCheckbox = document.querySelector('.East-checkbox');
EastCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var SouthCheckbox = document.querySelector('.South-checkbox');
SouthCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var WestCheckbox = document.querySelector('.West-checkbox');
WestCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var NewWestCheckbox = document.querySelector('.New-West-checkbox');
NewWestCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var CenterCheckbox = document.querySelector('.Center-checkbox');
CenterCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var SouthEastCheckbox = document.querySelector('.South-East-checkbox');
SouthEastCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var WestpoortCheckbox = document.querySelector('.Westpoort-checkbox');
WestpoortCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
  