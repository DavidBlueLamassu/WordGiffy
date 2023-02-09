
function getUserInput(){
        $("#search-button").on("click", function(event){
            event.preventDefault();
            var userInput = $("#search-input").val();

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
              $.ajax(settings).then(function (response) {
                console.log(response)
                var definitionText = $('<p>');
                definitionText.attr("class", "definitionText");
                definitionText.text(response.results[0].definition);
                $('#definitionHeader').append(definitionText);

                var synonymText = $('<p>');
                synonymText.attr("class", "synonymText");
                synonymText.text(response.results[0].synonyms);
                $('#synonymHeader').append(synonymText);
              });
            
        });
}

getUserInput();