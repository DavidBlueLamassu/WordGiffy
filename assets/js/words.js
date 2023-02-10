getUserInput();

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
    var rhymeText = $('<p>');
    rhymeText.attr("class", "rhymeText");
    rhymeResultArray = [];
    for (var j = 0; j < 5; j++){
      rhymeResultArray.push(response.rhymes.all[j]);
    }
    console.log(rhymeResultArray);
    rhymeText.text(rhymeResultArray);
    $('#rhymes').append(rhymeText);

    gifDisplay();
  }) 
}

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
  $.ajax(settings).then(function(response){
    console.log(response);
    var exampleText = $('<p>');
    exampleText.attr("class", "exampleText");
    exampleText.text(response.examples[0]);
    $('#exampleSentance').append(exampleText);
  })  
}
