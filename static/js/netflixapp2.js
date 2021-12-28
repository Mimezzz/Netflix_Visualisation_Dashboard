
d3.json("/netflixdata").then(function(data){
    console.log(data);
    //    console.log(data[10].netflix_rating);
    // First separate the data by type, create one array to hold movie type data and another array for tv show type data
    var netflix_movie = [];
    var netflix_tvShow = [];
    for (var i=0; i<data.length; i++) {
        if (data[i].type === "Movie") {
            netflix_movie.push(data[i])
        }
        else {
            netflix_tvShow.push(data[i])
        }
    };
    // use underscore JS to count how many movies at different years
    let movieCountByYear = _.countBy(netflix_movie, function(data) { 
        return data.release_year;
    });
    // Create two empty array to hold values
    var movieYear = [];
    var movieCount = [];
    // Push year into year array and counts of movie into count array
    Object.entries(movieCountByYear).forEach(([key, value]) => {
        movieYear.push(key);
        movieCount.push(value);
    });
    // use underscore JS to count how many tv show at different years
    let tvshowCountByYear = _.countBy(netflix_tvShow, function(data) { 
        return data.release_year;
        });
        // Create two empty array to hold values
        var tvshowYear = [];
        var tvshowCount = [];
        // Push year into year array and counts of tv show into count array
        Object.entries(tvshowCountByYear).forEach(([key, value]) => {
            tvshowYear.push(key);
            tvshowCount.push(value);
        });
        // Trace data for movie line chart
        var traceMovie = {
            x: movieYear,
            y: movieCount,
            name: "Movies",
            type: "scatter"
        };
        // Trace data for tv show line chart
        var traceTVshow = {
            x: tvshowYear,
            y: tvshowCount,
            name: "TV shows",
            type: "scatter"
        };
        // put trace in data
        var dataPlotOne = [traceMovie, traceTVshow];
        // layout for the graph
        var layout = {
            title: "Counts of Movies/ TV shows released by different years on Netflix",
            xaxis: {title: "Release year", gridcolor: "grey"},
            yaxis: {title: "Counts for the year", gridcolor: "grey"},
            font: {color: "white"},
            colorway: ["#9EDEC6", "#FFAEBC"],
            plot_bgcolor:"#FFF2",
            bordercolor:"white",
            paper_bgcolor:"#000000"
        };
        // Plot the visualization with plotly
        Plotly.newPlot("chart2", dataPlotOne, layout);



        let netflixYear = _.countBy(data, function(data) { 
            return data.release_year;
        });
        // Create year list to hold all years
        var yearList = [];
        Object.entries(netflixYear).forEach(([key, value]) => {
            yearList.push(key);
        });
        var yearListInNumber = yearList.map(function(item) {return parseInt(item)} )
        console.log(yearListInNumber);
       
        // Create a dictionary to store data and use year as the key
        yearDict = {};
        for (var i = 0; i < data.length; i++) {
            var key = data[i].release_year
            if (!yearDict[key]){
                yearDict[key] = [];    
            }
            yearDict[key].push(data[i]);      
        };
        console.log(yearDict)


        // Add select year slider to html
        var input = d3.select("form").append("input");
        console.log(Math.min(...yearListInNumber));
        input.attr('type','range')
            .attr('min', Math.min(...yearListInNumber).toString())
            .attr('max', Math.max(...yearListInNumber).toString())
            .attr('value', '1992')
            .attr('step', 1)
            .attr('id', 'year')
            .attr('oninput', 'selected_year.value = year.value')
            .classed("styled-slider", true)
            .style('background', 'red');
        var output = d3.select("form").append("output");
        output.attr('name','selected_year')
            .attr('id', 'selected_year')
            .style('color', 'white');
    

        var svgwidth = document.getElementById('chartForBar')
            .clientWidth;
        var svgheight = 750;
        
        var margin = {
            top: 10,
            bottom: 100,
            left: 100,
            right: 20
        }

        var svg = d3.select('#chartForBar')
            .append('svg')
            .attr('width', svgwidth)
            .attr('height', svgheight)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');


        chartwidth = svgwidth - margin.left - margin.right;
        chartheight = svgheight - margin.top - 3*margin.bottom;

        var x_scale = d3.scaleBand()
            .rangeRound([0, chartwidth])
            .padding(0.1);

        var y_scale = d3.scaleLinear()
            .range([chartheight, 0]);

        var colour_scale = d3.scaleQuantile()
            .range(["#fadadd", "#f7bfbe", "#f6adc6", "#ff878d", "#cb4154", "#cf1020", "#fa0000", "#c70000", "#850000"]);

        var y_axis = d3.axisLeft(y_scale);
        var x_axis = d3.axisBottom(x_scale);

        
        svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + chartheight + ')');
        
        svg.append('g')
            .attr('class', 'y axis');

        var axisLabelX = -50;
        var axisLabelY = chartheight / 2;
        svg.append('g')
            .attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Count of Top 10 Movies/ TV Shows Genre At Selected Release Year')
            .style('fill', 'white');

        // Create a function to change chart with selected year
        function draw(year) {
            var resultData = yearDict[year] || [];
            console.log(resultData);
            // Get the count of different classification of the movies/ tv shows of that release year
            let classificationCount = _.countBy(resultData, function(data) {
                return data.listed_in;
            });
            console.log(classificationCount);
            // Sort the results in order 
            var items = Object.keys(classificationCount).map(function(key) {
                return [key, classificationCount[key]];
            });
            // Sort the array based on the second element
            items.sort(function(first, second) {
            return second[1] - first[1];
            });
            // Create a new array with only the first 10 items
            topTen = items.slice(0, 10);
            console.log(topTen);
            // one second transition time
            var t = d3.transition()
            .duration(1000);
            // set xscale
            var classification = topTen.map(d => d[0]);
            x_scale.domain(classification);

            var max_value = d3.max(topTen, d => +d[1]);
            y_scale.domain([0, max_value]);
            colour_scale.domain([0, max_value]);

            // Clear current graph before draw new graph
            d3.selectAll(".bar").remove();

            var bars = svg.selectAll('.chartForBar')
                .data(topTen)
                

            var new_bars = bars
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('width', x_scale.bandwidth())
                .attr('height', 0)
                .attr('x', function(d) {
                    return x_scale(d[0]);
                })
                .attr('y', chartheight)
           
            new_bars.merge(bars)
                .transition(t)
                .attr('y', function(d) {
                    return y_scale(+d[1]);
                })
                .attr('height', function(d) {
                    return chartheight - y_scale(+d[1])
                })
                .attr('fill', function(d) {
                    return colour_scale(+d[1]);
                })
            
            svg.select('.x.axis')
                .transition(t)
                .call(x_axis)
                .selectAll("line")
                .style("stroke", "white");
            svg.select('.x.axis')
                .transition(t)
                .call(x_axis)
                .selectAll("path")
                .style("stroke", "white");
            svg.select('.x.axis')
                .transition(t)
                .call(x_axis)
                .selectAll("text")
                .attr("transform", "translate(-10,10)rotate(-45)")
                .style("text-anchor", "end")
                .style("font-size", "13")
                .style("fill", "white");
            // svg.select('.x.axis')
            //     .call(x_axis)
            //     .select()
            //     .text('Movies/ TV shows Genre')
        
            svg.select('.y.axis')
                .transition(t)
                .call(y_axis)
                .selectAll("path")
                .style("stroke", "white");
            svg.select('.y.axis')
                .transition(t)    
                .call(y_axis)
                .selectAll("line")
                .style("stroke", "white");
            svg.select('.y.axis')
                .transition(t)
                .call(y_axis)
                .selectAll("text")
                .style("text-anchor", "end")
                .style("font-size", "13")
                .style("fill", "white");
            // console.log(bars);

            var toolTip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 50])
                .html(function(d) {
                    return (`Genre: ${d[0]}<br>Counts: ${d[1]}`);
                })
                .style("background", "rgba(255, 255, 255, 0.8)")
                .style("padding", "6px")
                .style("font-size", "12px")
                .style("line-height","1")
                .style("line-height","1.5em")
                .style("text-align","center")
                .style("border-radiusn","4px");
            new_bars.call(toolTip);
            new_bars.on("mouseover", function(data) {
                toolTip.show(data, this);
                })
                // onmouseout event
                .on("mouseout", function(data, index) {
                toolTip.hide(data);
                });


        }


        var slider = d3.select('#year');
        slider.on('change', function() {
            draw(this.value);
        });
        
        // // Create a function to use year as parameter and return data for that year
        // function dataForYear (year) {
        //     var result = [];
        //     for (var i=0; i<data.length; i++) {
        //         if (data[i].netflix_release_year.toString() === year) {
        //             result.push(data[i]);
        //         }
        //     };
        //     // console.log(result);
        //     return result;
        // }

        draw(1992);

        
});


