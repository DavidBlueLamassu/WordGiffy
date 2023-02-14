//Arrays used with "localStorage" to store and retrieve terms from previous searches

var searchArray = [];
var rhymingArray = [];

makeButtons();
getUserInput();
clearScreen();

//Event listener to activate buttons relating to previous searches

$(document).on("click", ".word-button", function () {
  
  //Retrieves index value for button; this is set using the makeButtons() function
  var wordButton = $(this).attr("word-name");
  
  //This variable works with a conditional to prevent searches begun using buttons from generating more buttons.
  //Search terms started using the search form will be pushed into "searchArray" (and associated rhyming words
  //will be pushed into "rhymingArray") and retained in "localStorage" from where they can be used to make buttons
  //for past searches. This process will not run when "buttonSwitch" === "off".
  var buttonSwitch = "off";

  //Saves the value of the button clicked to "localStorage"
  localStorage.setItem("wordSearch", wordButton);

  //Saves the value of "buttonSwitch" to "localStorage".
  localStorage.setItem("buttonSwitch", buttonSwitch);

  //Calls a function which will begin a word search in Words API.
  wordSearch();

})

//Function to get the user input
function getUserInput(){
  //Runs when user clicks search button and gets the value from the search bar
  $("#search-button").on("click", function(event){
    event.preventDefault();
    var userInput = $("#search-input").val();
    if (userInput !== ""){
      localStorage.setItem("wordSearch", userInput);
      wordSearch();
    }
  })}

function wordSearch() {
  var userInput = localStorage.getItem("wordSearch")
  //Removes current text in place
  $('#definition').children().remove();
  $('#synonyms').children().remove();
  $('#rhymes').children().remove();
  $('#exampleSentance').children().remove();
  $('#search-input').val("");
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
      //Checks to see if there is a array and if there is then it will run through the code, if not it will print a message and append it
      if (response.results.length != 0){
        //Generates a random number so that results aren't set
        var randomNumber = Math.floor(Math.random () * response.results.length);
        console.log(randomNumber)
        definitionText.text(response.results[randomNumber].definition);
        $('#definition').append(definitionText);
      }
      else{
        definitionText.text("Sorry, this hasn't returned a result");
        $('#definition').append(definitionText);  
      }

      var synonymText = $('<p>');
      synonymText.attr("class", "synonymText");
      //Checks to see if there is a array and if there is then it will run through the code, if not it will print a message and append it
      if (response.results[randomNumber].synonyms != undefined){
      synonymText.text(response.results[randomNumber].synonyms);
      $('#synonyms').append(synonymText);
      }
      else{
        synonymText.text("Sorry, this hasn't returned a result");
        $('#synonyms').append(synonymText);
      }
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
    //Checks to see if there is a array and if there is then it will run through the code, if not it will print a message and append it
    //Loops through the first 5 items in rhyming array and pushes it to new array
    if (response.rhymes.length != 0){
    for (var j = 0; j < 5; j++){
        rhymeResultArray.push(response.rhymes.all[j]);
      }
      //Sets the text and appends this array to the html document
      rhymeText.text(rhymeResultArray);
      $('#rhymes').append(rhymeText);
    }
    else{
      rhymeText.text("Sorry there are no rhymes for this word!");
      $('#rhymes').append(rhymeText);  
    }

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
    console.log(response)
    var exampleText = $('<p>');
    exampleText.attr("class", "exampleText");
    //Checks to see if there is a array and if there is then it will run through the code, if not it will print a message and append it
    if (response.examples.length != 0){
      exampleText.text(response.examples[0]);
      $('#exampleSentance').append(exampleText);
    }
    else{
      exampleText.text("Sorry, there are no examples for this word!");
      $('#exampleSentance').append(exampleText);
    }
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
    makeButtons();
  })
}

//A function to make buttons for words (and their rhymes) from past searches.
function makeButtons() {
  
  //These variables hold the values for old search terms and rhymes retained in "localStorage".
  var pastWordSearch = JSON.parse(localStorage.getItem("pastWordSearch"));
  var pastRhymes = JSON.parse(localStorage.getItem("oldeRhyme"));
  
  //Removes previously printed buttons to prevent duplication.
  $("#history").empty();
  
  //Conditionals that update the values of "searchArray" and "rhymingArray" once these 
  //have been retained in "localStorage".
  if (pastWordSearch !== null) {
    searchArray = pastWordSearch;
  }

  if (pastRhymes !== null) {
    rhymingArray = pastRhymes;
  }

  //A "for" loop to generate buttons from the values held in "searchArray" and "rhymingArray".
  for (var i = 0; i < searchArray.length; i++) {
    
    //Variables to creat new elements
    var buttonMakerSearch = $("<div>");
    var buttonMakerRhyme = $("<div>");
    var article = $("<article>");
    var textSearch = $("<p>");
    var textRhyme = $("<p>");
    
    //Text content for the buttons; one contains an old search term, the second contains a 
    //word which rhymes with that term (obtained from Words API).
    textSearch.text(searchArray[i]);
    textRhyme.text(rhymingArray[i]);

    //The buttons are indexed with the terms used for their text content. This indexing will
    //be used to begin a search through Words API once the button is clicked.
    buttonMakerSearch.attr("word-name", searchArray[i]);
    buttonMakerRhyme.attr("word-name", rhymingArray[i]);

    //The button class will be used as a target for the buttons' "eventListener".
    buttonMakerSearch.addClass("word-button");
    buttonMakerRhyme.addClass("word-button");

    //Formatting for the buttons, text and containers (each pair of buttons is contained within an article for ease of styling).
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
    
    article.append(buttonMakerSearch);
    article.append(buttonMakerRhyme);
    buttonMakerSearch.append(textSearch);
    buttonMakerRhyme.append(textRhyme);
    $("#history").prepend(article);

  }
  
  if (searchArray.length > 0) {
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
}