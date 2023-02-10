var giphyAPIKey = "ti79DLvD2w1cHW3G9O89zDknxYwE2tsP";

function gifDisplay() {

  $("#gif-image").children().remove();
  $("#gif-text").children().remove();
  $("#gif-rhyme").children().remove();
  $("#gif-text-rhyme").children().remove();
  
    var gifSearch = $("#search-input").val();
    var localRhyme = localStorage.getItem("rhymingWords");
    var rhymeArray = JSON.parse(localRhyme);
    console.log(rhymeArray);
    var rhymeRandom = Math.floor(Math.random() * rhymeArray.length);
    var gifRhyme = rhymeArray[rhymeRandom].Rhyme;
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=funny+" + gifSearch + "&limit=5&offset=0&rating=g&lang=en";
    var queryRhymeURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=funny+" + gifRhyme + "&limit=5&offset=0&rating=g&lang=en";
    
    
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
