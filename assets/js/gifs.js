var giphyAPIKey = "ti79DLvD2w1cHW3G9O89zDknxYwE2tsP";
// var searchArray = [];
// var rhymingArray = [];

function gifDisplay() {

  $("#gif-image").children().remove();
  $("#gif-text").children().remove();
  $("#gif-rhyme").children().remove();
  $("#gif-text-rhyme").children().remove();
  
    var gifSearch = $("#search-input").val();
    var localRhyme = localStorage.getItem("rhymingWords");
    var rhymeArray = JSON.parse(localRhyme);
    //console.log(rhymeArray);
    var rhymeRandom = Math.floor(Math.random() * rhymeArray.length);
    var gifRhyme = rhymeArray[rhymeRandom].Rhyme;
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=funny+" + gifSearch + "&limit=5&offset=0&rating=g&lang=en";
    var queryRhymeURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=funny+" + gifRhyme + "&limit=5&offset=0&rating=g&lang=en";
    
    console.log("A rhyming word: " + gifRhyme);
    console.log("Rhyming Array: " + rhymingArray);
    if (gifSearch !=="") {
      searchArray.push(gifSearch);
      rhymingArray.push(gifRhyme);
      console.log("Rhyming Array 2: " + rhymingArray);
      localStorage.setItem("pastWordSearch", JSON.stringify(searchArray));
      localStorage.setItem("oldeRhyme", JSON.stringify(rhymingArray));
      makeButtons();
    } else {
      return;
    }

    if (gifSearch === "") {
          return;
    } else {
      
      $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
        
          console.log(response);
          
          
          var gitData = response.data;
          var gifRandom = Math.floor(Math.random() * gitData.length);
          var gifImage = response.data[gifRandom].images.downsized_large.url;
          console.log(gitData);
          console.log(gifImage);
          var gifDisplay = $("<img>");
          gifDisplay.attr("src", gifImage);
          gifDisplay.css("height", "300px");
          $("#gif-image").append(gifDisplay);
          $("#gif-text").text(gifSearch)
    })

    $.ajax({
          url: queryRhymeURL,
          method: "GET"
        }).then(function(response) {
        
          console.log(response);
          var gitData = response.data;
          var gifRandom = Math.floor(Math.random() * gitData.length);
          var gifImage = response.data[gifRandom].images.downsized_large.url;
          console.log(gifImage);
          var gifDisplay = $("<img>");
          gifDisplay.attr("src", gifImage);
          gifDisplay.css("height", "300px");
          $("#gif-rhyme").append(gifDisplay);
          $("#gif-text-rhyme").text(gifRhyme);
         
    })
}}

  // function makeButtons() {
  
  //   var pastWordSearch = JSON.parse(localStorage.getItem("pastWordSearch"));
  //   var pastRhymes = JSON.parse(localStorage.getItem("oldeRhyme"));
    
  //   $("#history").empty();
    
  //   if (pastWordSearch !== null) {
  //     searchArray = pastWordSearch;
  //   }

  //   if (pastRhymes !== null) {
  //     rhymingArray = pastRhymes;
  //   }
  
  //   console.log("rhymingArray" + rhymingArray);

  //   for (var i = 0; i < searchArray.length; i++) {
  //     var buttonMakerSearch = $("<button>");
  //     var buttonMakerRhyme = $("<button>");
  //     buttonMakerSearch.text(searchArray[i]);
  //     buttonMakerRhyme.text(rhymingArray[i]);
  //     buttonMakerSearch.attr("word-name", searchArray[i]);
  //     buttonMakerRhyme.attr("word-name", rhymingArray[i]);
  //     buttonMakerSearch.addClass("word-button");
  //     buttonMakerRhyme.addClass("word-button");
  //     buttonMakerSearch.css({"background-color": "rgb(215, 208, 208)", "border": "none", "margin-top": "5px", "margin-bottom": "5px", 
  //     "height": "30px", "width": "295px", "border-radius": "5px"})
  //     buttonMakerRhyme.css({"background-color": "rgb(215, 208, 208)", "border": "none", "margin-top": "5px", "margin-bottom": "5px", 
  //     "height": "30px", "width": "295px", "border-radius": "5px"})
  //     $("#history").prepend(buttonMakerRhyme);
  //     $("#history").prepend(buttonMakerSearch);
  //   }
  // }
