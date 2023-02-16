//Arrays used with "localStorage" to store and retrieve terms from previous searches
var searchArray = [];
var rhymingArray = [];

//Sets the default display to a "background-image"; this is removed once there are search results to display.
$("#results").css("display", "none");
$("#start-image").css("display", "initial");

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
  
  //Search results are now displayed and the default "background-image" is removed.
  $("#results").css("display", "initial");
  $("#start-image").css("display", "none");
  
  //Removes current text in place
  $('#definition').children().remove();
  $('#synonyms').children().remove();
  $('#rhymes').children().remove();
  $('#exampleSentance').children().remove();
  $('#search-input').val("");
  $("#results-heading").empty()
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
      //Adds a heading for the search word. Creates and appends a <p> tag for the definition and synonyms
      var resultsHeading = $("<h2>");
      var definitionText = $('<p>');
      resultsHeading.text("Results for " + '"' + userInput + '"' + ":");
      $("#results-heading").append(resultsHeading);
      definitionText.attr("class", "definitionText");
      //Checks to see if there is a array and if there is then it will run through the code, if not it will print a message and append it
      if (response.results.length != 0){
        //Generates a random number so that results aren't set
        var randomNumber = Math.floor(Math.random () * response.results.length);
        //Gets the API response needed
        definitionTextString = response.results[randomNumber].definition;
        //Takes the first letter of array and puts it into uppercase
        definitionFirstLetter = definitionTextString.charAt(0);
        firstLetterCapital = definitionFirstLetter.toUpperCase();
        //Removes substring from the entire string
        remainingLetters = definitionTextString.slice(1);
        //Concatonates the string together and adds it as the text for the example sentance
        completeDefinitionSentence = firstLetterCapital + remainingLetters + ".";
        definitionText.text(completeDefinitionSentence);
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
        var synonyms = response.results[randomNumber].synonyms;
        synonymText.text(synonyms.join(", "));
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
    console.log(response);
    //Conditional code to check that rhymes have been found. If there are no rhymes and the relevant key or keys are 
    //absent the value of rhymeQuery will be undefined.
    var rhymeQuery = response.rhymes.all;
    console.log("rhymeQuery: " + rhymeQuery);
    
    if (rhymeQuery === undefined) {
      console.log(rhymeQuery);
      
      //Variable to create an element for a user message
      var rhymeText = $('<p>');
      
      //This variable contains and dummy value to be used when no rhymes are available. This is employed to prevent 
      //errors and to run the appropriate conditionals when there are no rhymes for a search term on Words API.
      var newRhyme = {Rhyme: "noRhyme000"};
      console.log(newRhyme);
      
      //An array to be saved into "localStorage" containing the rhyme; this will later be used by the 
      //gifDisplay() function.
      var rhymingWords = [];
      
      //The array saved to "localStorage"
      rhymingWords.push(newRhyme);
      localStorage.setItem('rhymingWords', JSON.stringify(rhymingWords));

      //A message sent to the user to indicate there are no rhymes
      rhymeText.attr("class", "rhymeText");
      rhymeText.text("Sorry there are no rhymes for this word! No buttons can be made for this search.");
      $('#rhymes').append(rhymeText); 
      
      //The function which searches for gifs of words and their rhymes is called.
      gifDisplay();
      return;
    } else {
    
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
       
    }}
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
      rhymeText.text(rhymeResultArray.join(", "));
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
    var exampleText = $('<p>');
    exampleText.attr("class", "exampleText");
    //Checks to see if there is a array and if there is then it will run through the code, if not it will print a message and append it
    if (response.examples.length != 0){
      //Gets the API response needed
      exampleTextString = response.examples[0];
      //Takes the first letter of array and puts it into uppercase
      exampleTextFirstLetter = exampleTextString.charAt(0);
      firstLetterCapital = exampleTextFirstLetter.toUpperCase();
      //Removes substring from the entire string
      remainingLetters = exampleTextString.slice(1);
      //Concatonates the strings together and adds it as the text for the example sentence
      completeExampleSentence = firstLetterCapital + remainingLetters + ".";
      exampleText.text(completeExampleSentence);
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

    //Removes all search boxes and buttons.
    $('#definition').children().remove();
    $('#synonyms').children().remove();
    $('#rhymes').children().remove();
    $('#exampleSentance').children().remove();
    $("#gif-image").children().remove();
    $("#gif-text").empty();
    $("#gif-rhyme").children().remove();
    $("#gif-text-rhyme").empty();
    $("#history").children().remove();
    
    //Clears "localStorage" of old search terms and rhymes
    var searchArray = [];
    var rhymingArray = [];
    localStorage.setItem("pastWordSearch", JSON.stringify(searchArray));
    localStorage.setItem("oldeRhyme", JSON.stringify(rhymingArray));
    
    //Resets the default "background-image" display until search results are available.
    $("#results").css("display", "none");
    $("#start-image").css("display", "initial");
    
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
    
    //Appends search button text to the search buttons and the search buttons to an article.
    article.append(buttonMakerSearch);
    article.append(buttonMakerRhyme);
    buttonMakerSearch.append(textSearch);
    buttonMakerRhyme.append(textRhyme);
    
    //Prepends an article to the "#history" element, so that the most recent search terms appear first.
    $("#history").prepend(article);

  }
  
//Code to make headers for the old search buttons; the conditional prevents these headers from being
//displayed until buttons have been made from old search terms.
if (searchArray.length > 0) {
  
  //Elements to display the headers.
  var headerSearch = $("<p>");
  var headerRhyme = $ ("<p>");
  var headerArticle = $("<article>");
  
  //Header text.
  headerSearch.text("Old Searches:");
  headerRhyme.text("Old Rhymes:")

  //Header elements containing text are placed inside an "article" for ease of formatting.
  headerArticle.append(headerSearch);
  headerArticle.append(headerRhyme);

  //The "article" is prepended to the "#history" element so that it appears above the search buttons.
  $("#history").prepend(headerArticle);

  //Formatting of the button header elements.
  headerArticle.css({"display": "flex", "flex-direction": "row"});
  headerSearch.css({"margin-left": "30px", "margin-bottom": "3px", "margin-top": "10px"});
  headerRhyme.css({"margin-left": "45px", "margin-bottom": "3px", "margin-top": "10px"})
  }
}