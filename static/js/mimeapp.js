//select data to be used for wordcloud
var filterbutton1=d3.select('#btn30');
var filterbutton2=d3.select('#btn50');
var filterbutton3=d3.select('#btn100');
var filepath=''

function keywordsdata30(){
  // d3.select("svg").remove();
  console.log('1');
  filepath='/top30';
  // console.log(filepath);
  createwordcloud()
  
};

function keywordsdata50(){
  // d3.select("svg").remove();
  console.log('2');
  filepath='/top50';
  // console.log(filepath);
  createwordcloud()
};

function keywordsdata100(){
  // d3.select("svg").remove();
  console.log('3');
  filepath='/top100';
  // console.log(filepath);
  createwordcloud()
};

var description_list=[];
var newlist=[];
var movie_title=[];
var new_movie_title=[];
var random_movie=[];
var links=[];


function scrapemovie(keyword){
  d3.json('/netflixdata').then((data)=>{
    data.forEach((row)=>{
      description_list.push(row.description)
      movie_title.push(row.title)
      return description_list, movie_title;
    });
    console.log(data);
    // console.log(description_list);
    console.log(movie_title);

  for (i=0;i<description_list.length;i++){
      newlist.push(description_list[i].split(" "))
      // console.log(newlist)
      // console.log(keyword);
      // var contains = (newlist[0].indexOf(keyword) > -1);
      // console.log(contains);
      // console.log(typeof keyword);

      //   // if (newlist.includes(keyword.toString())) {
      //   //   console.log(description_list[i])
      //   // }
    
      if(jQuery.inArray(keyword, newlist[0]) !== -1){
        console.log(description_list[i]);
        new_movie_title.push(movie_title[i]);
      }
      // else {
      //   console.log('not found');
      // }
      newlist=[];}
  console.log(new_movie_title);
  for (i=0;i<5;i++){
    random_movie.push(new_movie_title[Math.floor(Math.random() * new_movie_title.length)])
  };
  console.log(random_movie);
  rendermovieposter(random_movie);
  random_movie=[];
  // return random_movie
  });
  
};


function rendermovieposter(movielist){
  api_key='a6afdca6';
  $('#image').html('');
  
  for (i=0;i<5;i++){
    title=movielist[i].replace(/\s/g,"+");
    console.log(title);
    url=`http://www.omdbapi.com/?apikey=${api_key}&t=${title}`;
    d3.json(url).then((data)=>{
      console.log(data.Poster);
      $(document).ready(function() {
        // select('.image').innerH
        $(`<img src='${data.Poster}'>`).appendTo('#image');
    });
      // d3.select('.image')
      // .append(`<div class="col-md-4 text-center"><img id='img${[i]}' src=${data.poster}></div>`)
      // links.push(data.Poster);})}; 
   
  });
  };
};

function createwordcloud(){
  d3.json(filepath).then((data)=>{
    console.log(data);
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 1000 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;


  var display = d3.select('.display')
  .append("h1")
  .attr("font-family", "Lucida Console, Courier, monospace")
  .attr('font-size','40px')
  .attr('font-color','white')
  .attr("text-anchor", "start")
  .attr("alignment-baseline", "hanging")
  .attr("x", 10)
  .attr("y", 10);
  
  $('#wordcloudchart').empty();
  var svg = d3.select("#wordcloudchart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  colors=['#519259','#F0BB62','#95D1CC','#FFAFAF']

  
  function draw(words) {
      svg
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function(d) { return ((d.size)* 1) + "px"; })
      .style("fill", colors[Math.floor(Math.random() * colors.length)])
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function(d) {
          return "translate(" + [d.x-10, d.y] + ")rotate(" + d.rotate + ")";
              })
      .text(function(d) { return d.text; })
      .on("click", function(d) {
          var e = d3.select(this);
          display.text(`selected keyword="${e.text()}"`);
      e.classed("word-selected", !e.classed("word-selected"));
          keyword=d.text;
          console.log(d.text);
          scrapemovie(keyword);
      })
      // .on('mouseover',function(d){
      //     d3.select(this)
      //     .classed("word-hovered", true)
      //     .transition(`mouseover-${d.text}`).duration(300).ease(d3.easeLinear)
      //     .attr("font-size", d.size + 2)
      //     .attr("font-weight", "bold");
      //       })
      // .on('mouseout',function(d){
      //     d3.select(this)
      //     .classed("word-hovered", false)
      //     .interrupt(`mouseover-${d.text}`)
      //     .attr("font-size", d.size);
      // })

      };


      var layout = d3.layout.cloud()
      .size([width, height])
      .words(data.map(function(d) { return {text: d['word'], size:d['value']/5}; }))
      .padding(5)        //space between words
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .fontSize(function(d) { return d.size; })      // font size of words
      .on("end", draw)
  

    layout.start();
    })
  
};

filterbutton1.on('click',keywordsdata30);
filterbutton2.on('click',keywordsdata50);
filterbutton3.on('click',keywordsdata100);














// function countWords(arr) {
//     //Edge case: an empty array
//       if (arr.length === 0) {
//         return {};
//       } 
//       var output = {};
//       arr.forEach((row)=> {
//         var strArr = row.split(" ")
//         // console.log(strArr)
//         //A second loop
//         for (var i=0; i < strArr.length; i++) {
//             var word = strArr[i];
//             // console.log(word)
//             if (output[word] === undefined) {
//             output[word] = 1;
//             } 
//             else {
//             output[word] += 1;
//             }
//         };
//         ;
//         });
//         console.log(output);
//         return output};

        

// d3.csv('assets/data/netflix.csv').then((data)=>{
//     console.log(data);
//     var description_list=[];
//     data.forEach((row) =>{
//         description_list.push(row.description);
//         return description_list;
//     });
//     console.log(description_list);
//     countWords(description_list);

    
// });



