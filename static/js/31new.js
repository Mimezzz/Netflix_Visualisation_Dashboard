// google.charts.load('current', {
//     'packages':['geochart'],
//   });
//   google.charts.setOnLoadCallback(drawRegionsMap);

// var dataArray=[['Country','Production count']]
countrylist=[['Country','Production count']]
const netflixCountry = []
const counts = {};

var dataCountry=[
  ['Country','Production count']
]

d3.json('/netflixdata').then((data)=>{
    console.log(data);
    data.forEach((row)=>{
    
      let arrayCountry = row.country.split(',')
      console.log(arrayCountry);
        if (arrayCountry){
            for (i = 0; i < arrayCountry.length; i++) {
                netflixCountry.push(arrayCountry[i])
            }
          }
        arrayCountry=[];
      })  
    console.log(netflixCountry);
    const occurrences = netflixCountry.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    
    console.log(occurrences);
    countrycount=dataCountry.concat(Object.entries(occurrences));
    console.log(countrycount);

    google.charts.load('current', {
      'packages':['geochart'],
      'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'});
    google.charts.setOnLoadCallback(drawMapNetflix);

    function drawMapNetflix () {
      var data = google.visualization.arrayToDataTable(countrycount);

        var options = {
          colorAxis: {minValue: 0, maxValue : 479,colors: ['#F9D371', '#F47340','#EF2F88','#8843F2']},
          backgroundColor: '#121212'
        };


        var chart = new google.visualization.GeoChart(document.getElementById('plot2'));

        chart.draw(data, options);
    }
    

});




 
  
  // var dataArray = [['Year', 'Reading', 'Numeracy', 'Grammar/Punctuation', 'Writing', 'Spelling', 'Total Average']];
  
  // for (var n = 0; n < schoolTotAvg.length; n++) {
  //     dataArray.push([schoolYear[n], schoolReading[n], schoolNumeracy[n], schoolGramPunc[n], schoolWriting[n], schoolSpelling[n], schoolTotAvg[n]]);
  // }
  
  // var data = new google.visualization.arrayToDataTable(dataArray);
  
  // var options = {
  //   title: 'School Performance',
  //   curveType: 'function',
  //   legend: { position: 'bottom' }
  // };
  
  // var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
  
  // chart.draw(data, options);