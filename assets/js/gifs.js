var giphyAPIKey = "ti79DLvD2w1cHW3G9O89zDknxYwE2tsP";
// var searchArray = [];
// var rhymingArray = [];

function gifDisplay() {

  $("#gif-image").children().remove();
  $("#gif-text").children().remove();
  $("#gif-rhyme").children().remove();
  $("#gif-text-rhyme").children().remove();
  
    var gifSearch = localStorage.getItem("wordSearch");
    var localRhyme = localStorage.getItem("rhymingWords");
    var buttonSwitch = localStorage.getItem("buttonSwitch");
    var rhymeArray = JSON.parse(localRhyme);
    //console.log(rhymeArray);
    var rhymeRandom = Math.floor(Math.random() * rhymeArray.length);
    var gifRhyme = rhymeArray[rhymeRandom].Rhyme;
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=" + gifSearch + "&limit=5&offset=0&rating=g&lang=en";
    var queryRhymeURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=" + gifRhyme + "&limit=5&offset=0&rating=g&lang=en";
    
    console.log("A rhyming word: " + gifRhyme);
    console.log("Rhyming Array: " + rhymingArray);
    if (gifSearch !=="" && buttonSwitch !== "off") {
      searchArray.push(gifSearch);
      rhymingArray.push(gifRhyme);
      console.log("Rhyming Array 2: " + rhymingArray);
      localStorage.setItem("pastWordSearch", JSON.stringify(searchArray));
      localStorage.setItem("oldeRhyme", JSON.stringify(rhymingArray));
      makeButtons();
    } else {
      buttonSwitch = "on";
      localStorage.setItem("buttonSwitch", buttonSwitch);
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


// $(document).on("click", ".word-button", function () {
//   var wordButton = $(this).attr("word-name");
//   localStorage.setItem("wordSearch", wordButton);
//   console.log(wordButton);
//   wordSearch();
// })