getUserInput();
clearScreen();

//Function to get the user input
function getUserInput(){
  //Runs when user clicks search button and gets the value from the search bar
  $("#search-button").on("click", function(event){
    event.preventDefault();
    var userInput = $("#search-input").val();
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
  });
}

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
    $("#gif-text").children().remove();
    $("#gif-rhyme").children().remove();
    $("#gif-text-rhyme").children().remove();
  })
}