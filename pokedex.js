var margin = {top: 20, right: 10, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

  
var x = d3.scale.linear()
    .range([0, width])
    .domain([0,270]);

var y = d3.scale.linear()
    .range([height, 0])
    .domain([0,270]);

var color = d3.scale.ordinal()
  .domain(["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"])
  .range(['#A8A878','#C03028','#A890F0','#9467bd','#E0C068','#B8A038', '#A8B820', '#705898','#B8B8D0','#F08030','#6890F0','#78C850','#F8D030','#F85888',"#98D8D8",'#7038F8','#705848','#EE99AC','#F8D030']);

var axisNames = { 
                    hp: 'HP', 
                    attack: 'Attack', 
                    defense: 'Defense', 
                    special_attack: 'Special Attack',
                    special_defense: 'Special Defense',
                    speed: 'Speed' 
                };

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);


var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//loading file from data.csv
d3.csv("data/data.csv", function(error, data) {
  data.forEach(function(d) {
    d.hp = +d.hp;
    d.attack = +d.attack;
    d.defense = +d.defense;
    d.special_attack = +d.special_attack;
    d.special_defense = +d.special_defense;
    d.speed = +d.speed;
    d.pokeid = +d.pokeid;
  });

//create x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("HP");

//create y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Attack")

//plotting dots
 var circles = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .filter(function(d) {return d.pokeid < 495;})
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", function(d) { return x(d.hp); })
      .attr("cy", function(d) { return y(d.attack); })
      .style("fill", function(d) { return color(d.type_1); })
      .style("stroke", function(d) { if (d.type_2 == "" ) {return color(d.type_1)} else {return color(d.type_1)}; })
      .on("mouseover", function(d) {    //mouseover function, tooltip 
            div.transition()    
                .duration(200)    
                .style("opacity", .9);     
            div.html("<img src='/data/images/" + d.pokeid + ".png' style='width:90px;height:90px;'><br><a class='pname'>" + d.pokename + 
                      "</a><br><a style='color:" + color(d.type_1) + ";'>" + d.type_1 + "  </a><a style='color:" + color(d.type_2) + ";'>" + 
                      d.type_2 + "</a><p class='pdetails'>Attack: " + d.attack + "<br/>Defense: " + d.defense + "<br/>Special Attack: " + 
                      d.special_attack + "<br/>Special Defense: " + d.special_defense + "<br/>Speed: " + d.speed + "<br/>HP: " + d.hp + "</p> <div id='tipDiv'></div>")  
                .style("left", (d3.event.pageX - 60) + "px")   
                .style("top", (d3.event.pageY + 20) + "px");  
            d3.select(this)
                .transition().attr('r',9);
            var tipSVG = d3.select("#tipDiv")
                .append("svg")
                .attr("height","100%")
                .attr("width","100%");
              
            })          
      .on("mouseout", function(d) {  
            d3.select(this)
                .transition().attr('r',4); 
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });

//filter function
  d3.selectAll("[name=v]").on("change", function() {
      var selected = this.value;
      display = this.checked ? "inline" : "none";
  svg.selectAll(".dot")
      .filter(function(d) {return selected == d.type_1;})
      .attr("display", display);
  svg.selectAll(".dot")
      .filter(function(d) {return selected == d.type_2;})
      .attr("display", display);  
      });

//change X axis function
  d3.select("[name=xAX]").on("change", function(){
    xAxy = this.value;
    console.log(xAxy);
    //x.domain(d3.extent(data, function(d) { return d[xAxy]; })).nice();
    svg.select(".x.axis").transition().call(xAxis);
    svg.selectAll(".dot").transition().attr("cx", function(d) { 
        return x(d[xAxy]);
    });
    svg.selectAll(".x.axis").selectAll("text.label").text(axisNames[xAxy]);
  });

//change Y axis function
  d3.select("[name=yAX]").on("change", function(){
    yAxy = this.value;
    console.log(yAxy);
    //x.domain(d3.extent(data, function(d) { return d[xAxy]; })).nice();
    svg.select(".y.axis").transition().call(yAxis);
    svg.selectAll(".dot").transition().attr("cy", function(d) { 
        return y(d[yAxy]);
    });
    svg.selectAll(".y.axis").selectAll("text.label").text(axisNames[yAxy]);
  });

});

