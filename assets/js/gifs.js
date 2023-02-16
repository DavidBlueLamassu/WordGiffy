//API key for: "https://api.giphy.com"
var giphyAPIKey = "ti79DLvD2w1cHW3G9O89zDknxYwE2tsP";

//A function to search for gifs on "giphy.com" using search terms and rhyming terms
//derived either from user input into the Word Giffy search form, or from buttons storing terms from 
//past searches.
function gifDisplay() {

  //Clears the results of previous searches
  $("#gif-image").children().remove();
  $("#gif-text").children().remove();
  $("#gif-rhyme").children().remove();
  $("#gif-text-rhyme").children().remove();
  
  //These variables access an array of words which rhyme with the search term held in "localStorage" from 
  //the Words API search
  var localRhyme = localStorage.getItem("rhymingWords");
  var rhymeArray = JSON.parse(localRhyme);
  
  //Accesses the search term retained in "localStorage" either from the search form or from a button click
  var gifSearch = localStorage.getItem("wordSearch");
  
  //This variable retains a value to indicate whether the search commenced from the search form or from a button click.
  //If the search began from the form the value will be "on"; if from a button the value will be "off". This is to prevent
  //new buttons being produced whenever a button is clicked. Conditional code for storing new search terms 
  //to make buttons will not run when the value of this variable is "off". Whenever a search begins with a button
  //click the value of this variable will be turned to "off".
  var buttonSwitch = localStorage.getItem("buttonSwitch");
  
  //These variables select a random rhyming word from the "rhymeArray" to be used as a search term.
  var rhymeRandom = Math.floor(Math.random() * rhymeArray.length);
  var gifRhyme = rhymeArray[rhymeRandom].Rhyme;
  
  //URLs are constructed to search for gifs using the search term the user selected and a word that rhymes with it. 
  //The number of gifs to be acquired is limited to 5.
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=" + gifSearch + "&limit=5&offset=0&rating=g&lang=en";
  var queryRhymeURL = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyAPIKey + "&q=" + gifRhyme + "&limit=5&offset=0&rating=g&lang=en";
  
  //This code pushes new search terms and rhymes into the "searchArray" and the "rhymingArray" and 
  //then saves the arrays into "localStorage". It is run with a conditional to prevent empty form clicks 
  //being stored in the arrays and to prevent search terms from button clicks being retained (thereby
  //duplicating buttons with terms from previous searches). The value of "buttonSwitch" is set to "off"
  //whenever a search is begun by button click. It also prevents terms from being stored when Words API
  //does not have a corresponding rhyme for the search word. This is indicated when "gifRhyme" === "noRhyme000".
  if (gifSearch !=="" && buttonSwitch !== "off" && gifRhyme !== "noRhyme000") {
    searchArray.push(gifSearch);
    rhymingArray.push(gifRhyme);
    
    //This conditional prevents more than five pairs of search terms and rhymes being stored at any one time, 
    //thereby preventing the page from being cluttered with buttons.
    if (searchArray.length > 5) {
      searchArray.shift();
      rhymingArray.shift();
    }
    
    //Search terms and rhymes are saved into "localStorage"; upon retrieval buttons corresponding to these
    //words will be made using a "for" loop.
    localStorage.setItem("pastWordSearch", JSON.stringify(searchArray));
    localStorage.setItem("oldeRhyme", JSON.stringify(rhymingArray));
    
    //New terms having been added to "localStorage", a function is called to make new buttons
    makeButtons();
    
    } else {
      
      //If the current value of "buttonSwitch" === "off" this switches it to "on" and retains this value 
      //in "localStorage". This will allow new buttons to be produced should the next search come from the 
      //form. The value will be turned to "off" again if the next search comes from a button click.
      buttonSwitch = "on";
      localStorage.setItem("buttonSwitch", buttonSwitch);
    }

    //Prevents the function running any further should the search have begun with an entry into an empty form.
    if (gifSearch === "") {
          return;
    } else {
      
      //Uses the ajax() method to retrieve a gif, corresponding to the search term, from Giphy API.
      $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          
          //Holds the URLs for up to 5 gifs.
          var gifData = response.data;
          
          //If no gifs are available for this term, a message is printed to indicate this.
          if (gifData.length === 0) {
            var gifNo = $("<p>");
            gifNo.text("Sorry. No gifs match that search term.");
            $("#gif-text").text(gifSearch);
            $("#gif-text").append(gifNo);
            gifNo.css("color", "black");
            return;
          }

          //If gifs are available, one is selected at random and printed.
          var gifRandom = Math.floor(Math.random() * gifData.length);
          var gifImage = response.data[gifRandom].images.downsized_large.url;
          var gifDisplay = $("<img>");
          gifDisplay.attr("src", gifImage);
          gifDisplay.css("height", "300px");
          $("#gif-image").append(gifDisplay);
          $("#gif-text").text(gifSearch)
    })

    //Uses the ajax() method to retrieve a gif, corresponding to the rhyming word for the search term, from Giphy API.
    $.ajax({
          url: queryRhymeURL,
          method: "GET"
        }).then(function(response) {
          
          //Holds the URLs for up to 5 gifs.
          var gifData = response.data;

          //If no gifs are available for this term, or a rhyme was unavailable for search
          //a message is printed to indicate this.
          if (gifRhyme == "noRhyme000") {
            var gifNo = $("<p>");
            gifNo.text("Sorry. There are no rhymes matching the search term. No buttons can be made for this search.");
            $("#gif-text-rhyme").empty();
            $("#gif-text-rhyme").append(gifNo);
            gifNo.css("color", "black");
            return;
          } else if (gifData.length === 0) {
            var gifNo = $("<p>");
            gifNo.text("Sorry. No gifs match that search term.");
            $("#gif-text-rhyme").text(gifRhyme);
            $("#gif-text-rhyme").append(gifNo);
            gifNo.css("color", "black");
            return;
          } 

          //If gifs are available, one is selected at random and printed.
          var gifRandom = Math.floor(Math.random() * gifData.length);
          var gifImage = response.data[gifRandom].images.downsized_large.url;
          var gifDisplay = $("<img>");
          gifDisplay.attr("src", gifImage);
          gifDisplay.css("height", "300px");
          $("#gif-rhyme").append(gifDisplay);
          $("#gif-text-rhyme").text(gifRhyme);
    })
}}
