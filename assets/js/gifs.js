var giphyAPIKey = "ti79DLvD2w1cHW3G9O89zDknxYwE2tsP";

gifDisplay();

function gifDisplay() {
  
    var gifSearch = "fool";
    var gifRhyme = "politician";
    
   
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=funny+" + gifSearch + "&limit=25&offset=0&rating=pg-13&lang=en";
    var queryRhymeURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=funny+" + gifRhyme + "&limit=25&offset=0&rating=pg-13&lang=en";
    
    
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