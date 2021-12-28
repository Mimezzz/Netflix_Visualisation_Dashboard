// gloabal view
// const database=JSON.parse(data)

const netflixMovies = []
const numberOfMovies = [
  ['Netflix', netflixMovies]
]

const dataCountry = [
  ['Plays', 'Number of shows/movies']
]
const netflixCountry = []
let netflixCountryCount = {}


const dataGenre = []
const netflixGenre = []
let netflixGenreCount = {}


d3.json('/map').then((data)=>{
  data.forEach((row)=>{
    //   if(row.netflix) {
    //     netflixMovies.push(row.netflix)
    //   }
  
      if(row.netflix) {
        let arrayCountry = row.country.split(',')
        countryFunction(netflixCountry, arrayCountry)
      }
  
      if(row.netflix) {
        let arrayGenre = row.genres.split(',')
        genreFunction(netflixGenre, arrayGenre)
      
      }
    });
  
    countStats(netflixCountryCount, netflixCountry)
  
    netflixCountryCount = dataCountry.concat(Object.entries(netflixCountryCount))
  
    countStats(netflixGenreCount, netflixGenre)
  
    netflixGenreCount = dataGenre.concat(Object.entries(netflixGenreCount))
  
    addColors(netflixGenreCount, '#5465FF')
  
    showStats()
    console.log(netflixGenreCount);
    console.log(netflixCountryCount);
  });

const countryFunction = (variable, arrayCountry) => {
  if(arrayCountry == '') return // Pour pas avoir des pays vides
  for (let i = 0; i < arrayCountry.length; i++) {
    variable.push(arrayCountry[i])
  }
}

const genreFunction = (variable, arrayGenre) => {
  if(arrayGenre == '') return // Pour pas avoir des genres vides
  for (let i = 0; i < arrayGenre.length; i++) {
    variable.push(arrayGenre[i])
  }
}

const countStats = (countObject, arrayCountry) => {
  arrayCountry.forEach(function(x) { countObject[x] = (countObject[x] || 0)+1; })
}

const addColors = (array, color) => {
  for (let i = 1; i < array.length; i++) {
    array[i].push(color)
  }
}



const showStats = () => {
  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(drawChartMovies);
  function drawChartMovies() {
    var data = google.visualization.arrayToDataTable([
      ["streaming platform", "Number of platform", { role: "style" } ],
     
    ]);
  }
  google.charts.load('current', {
    'packages':['geochart']});
  google.charts.setOnLoadCallback(drawRegionsMapNetflix);

  function drawRegionsMapNetflix() {
    var data = google.visualization.arrayToDataTable(netflixCountryCount);

    var options = {
      colorAxis: {colors: ['#BFD7FF', '#9BB1FF', '#788BFF', '#5465FF']}
    };

    var chart = new google.visualization.GeoChart(document.getElementById('plot2'));

    chart.draw(data, options);
  }
  
  google.charts.load('current', {
    'packages':['geochart'],
    // Note: you will need to get a mapsApiKey for your project.
    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
    'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
  });
  
  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(drawChartGenreNetflix);
  function drawChartGenreNetflix() {
    var data = google.visualization.arrayToDataTable(netflixGenreCount);

    var view = new google.visualization.DataView(data);
  }
}

