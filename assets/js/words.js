var searchArray = [];
var rhymingArray = [];

makeButtons();
getUserInput();
clearScreen();

$(document).on("click", ".word-button", function () {
  var wordButton = $(this).attr("word-name");
  var buttonSwitch = "off";
  localStorage.setItem("wordSearch", wordButton);
  localStorage.setItem("buttonSwitch", buttonSwitch);
  console.log("wordButton: "+ wordButton);
  wordSearch();

})

//Function to get the user input
function getUserInput(){
  //Runs when user clicks search button and gets the value from the search bar
  $("#search-button").on("click", function(event){
    console.log("rhymingArray2: " + rhymingArray);
    event.preventDefault();
    var userInput = $("#search-input").val();
    localStorage.setItem("wordSearch", userInput);
    wordSearch();
    //makeButtons();
})}

  function wordSearch() {
    var userInput = localStorage.getItem("wordSearch")
    console.log("userInput: " + userInput);
    //Removes current text in place
    $('#definition').children().remove();
    $('#synonyms').children().remove();
    $('#rhymes').children().remove();
    $('#exampleSentance').children().remove();
    //Clears local storage so that it is only current rhymes that work
    localStorage.removeItem("rhymingWords");
    //Settins for API call
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://wordsapiv1.p.rapidapi.com/words/"+ userInput,
      "method": "GET",
      "headers": {
        "X-RapidAPI-Key": "995fce24e2msh73602efe9782e42p1eeb87jsnee72b111a680",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }
      };
      //Runs API call
      $.ajax(settings).then(function (response) {
        console.log(response)
        //Creates and appends a <p> tag for the definition and synonyms
        var definitionText = $('<p>');
        definitionText.attr("class", "definitionText");
        definitionText.text(response.results[0].definition);
        $('#definition').append(definitionText);

        var synonymText = $('<p>');
        synonymText.attr("class", "synonymText");
        synonymText.text(response.results[0].synonyms);
        $('#synonyms').append(synonymText);
      });
      //Runs the getRhymingWords function
      getRhymingWords(userInput);
      getExampleSentance(userInput);
  };


function getRhymingWords(userInput){
  //Settings for Ajax call
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://wordsapiv1.p.rapidapi.com/words/"+ userInput + "/rhymes",
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "995fce24e2msh73602efe9782e42p1eeb87jsnee72b111a680",
      "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
    }
  };
  //Ajax call
  $.ajax(settings).then(function(response){
    console.log(response)
    //Either gets the words from local storage or creates an array if this doesn't exist
    var rhymingWords = JSON.parse(window.localStorage.getItem('rhymingWords')) || [];
    //Loops through and creates an array which gets a random word that rhymes 10 times
    for (var i = 0; i < 10; i++){
      var randomArrayNumber = Math.floor(Math.random () * response.rhymes.all.length);
      //Stores the randomly selected rhyme in an object
      var newRhyme = {
        "Rhyme": response.rhymes.all[randomArrayNumber]
      }
      //Pushes this into the rhyming words array
      rhymingWords.push(newRhyme);
      //Sets this in local storage
      window.localStorage.setItem('rhymingWords', JSON.stringify(rhymingWords));
       
    }
    //Sets up the apended text for the rhyming words
    var rhymeText = $('<p>');
    rhymeText.attr("class", "rhymeText");
    //Creates an array to store rhymed words in it
    rhymeResultArray = [];
    //Loops through the first 5 items in rhyming array and pushes it to new array
    for (var j = 0; j < 5; j++){
      rhymeResultArray.push(response.rhymes.all[j]);
    }
    console.log(rhymeResultArray);
    //Sets the text and appends this array to the html document
    rhymeText.text(rhymeResultArray);
    $('#rhymes').append(rhymeText);

    //Runs gif display function so that it can use the rhyming words
    gifDisplay();
  }) 
}

//New function with new API call to get example sentances needed
function getExampleSentance(userInput){
  //Settings for Ajax call
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://wordsapiv1.p.rapidapi.com/words/"+ userInput + "/examples",
    "method": "GET",
    "headers": {
      "X-RapidAPI-Key": "995fce24e2msh73602efe9782e42p1eeb87jsnee72b111a680",
      "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
    }
  };
  //Appends the first example given in the array
  $.ajax(settings).then(function(response){
    console.log(response);
    var exampleText = $('<p>');
    exampleText.attr("class", "exampleText");
    exampleText.text(response.examples[0]);
    $('#exampleSentance').append(exampleText);
  })  
}

//Function to clear the screen
function clearScreen(){
  //When the clear button is pressed in modal it removes everything needed, removes everything the same as doing a new search
  $('#clearScreen').on("click", function(event){
    //Resets the search input field
    $("#search-input").val("");

    $('#definition').children().remove();
    $('#synonyms').children().remove();
    $('#rhymes').children().remove();
    $('#exampleSentance').children().remove();
    $("#gif-image").children().remove();
    $("#gif-text").empty();
    $("#gif-rhyme").children().remove();
    $("#gif-text-rhyme").empty();
    $("#history").children().remove();
    
    var searchArray = [];
    var rhymingArray = [];
    localStorage.setItem("pastWordSearch", JSON.stringify(searchArray));
    localStorage.setItem("oldeRhyme", JSON.stringify(rhymingArray));
    
    // localStorage.removeItem("pastWordSearch");
    // localStorage.removeItem("oldeRhyme");
    // var pastWordSearch = JSON.parse(localStorage.getItem("pastWordSearch"));
    // var pastRhymes = JSON.parse(localStorage.getItem("oldeRhyme"));
    // console.log("Past word search")
    // console.log(pastWordSearch);
    // console.log("Past rhyme search")
    // console.log(pastRhymes);
    makeButtons();
  })
}

function makeButtons() {
  
  var pastWordSearch = JSON.parse(localStorage.getItem("pastWordSearch"));
  var pastRhymes = JSON.parse(localStorage.getItem("oldeRhyme"));
  
  $("#history").empty();
  
  if (pastWordSearch !== null) {
    searchArray = pastWordSearch;
  }

  if (pastRhymes !== null) {
    rhymingArray = pastRhymes;
  }

  console.log("rhymingArray1: " + rhymingArray);

  for (var i = 0; i < searchArray.length; i++) {
    var buttonMakerSearch = $("<div>");
    var buttonMakerRhyme = $("<div>");
    var article = $("<article>");
    var textSearch = $("<p>");
    var textRhyme = $("<p>");
   

    textSearch.text(searchArray[i]);
    textRhyme.text(rhymingArray[i]);
    
    buttonMakerSearch.attr("word-name", searchArray[i]);
    buttonMakerRhyme.attr("word-name", rhymingArray[i]);
    buttonMakerSearch.addClass("word-button");
    buttonMakerRhyme.addClass("word-button");
    buttonMakerSearch.css({"background-color": "rgba(19, 19, 76, 0.432)", "border": "none", "margin-top": "5px", "margin-bottom": "5px", 
    "height": "80px", "width": "138px", "border-radius": "5px", "margin-left": "5px", "cursor": "pointer", "display": "flex",
    "align-items": "center", "justify-content": "center"})
    buttonMakerRhyme.css({"background-color": "rgba(102, 102, 119, 0.432)", "border": "none", "margin-top": "5px", "margin-bottom": "5px", 
    "height": "80px", "width": "138px", "border-radius": "5px", "margin-left": "5px", "cursor": "pointer", "display": "flex",
    "align-items": "center", "justify-content": "center"})
    $("#history").css({"display": "flex", "flex-direction": "column"})
    textSearch.css({"color": "white", "margin": "0", "text-align": "center"});
    textRhyme.css({"color": "white", "margin": "0", "text-align": "center"});
    article.css({"display": "flex", "flex-direction": "row"});
    article.prepend(buttonMakerRhyme);
    article.prepend(buttonMakerSearch);
    buttonMakerSearch.append(textSearch);
    buttonMakerRhyme.append(textRhyme);
    $("#history").prepend(article);

  }
  var headerSearch = $("<p>");
  var headerRhyme = $ ("<p>");
  var headerArticle = $("<article>");
  headerSearch.text("Old Searches:");
  headerRhyme.text("Old Rhymes:")
  headerArticle.append(headerSearch);
  headerArticle.append(headerRhyme);
  $("#history").prepend(headerArticle);
  headerArticle.css({"display": "flex", "flex-direction": "row"});
  headerSearch.css({"margin-left": "30px", "margin-bottom": "3px", "margin-top": "10px"});
  headerRhyme.css({"margin-left": "45px", "margin-bottom": "3px", "margin-top": "10px"})
}