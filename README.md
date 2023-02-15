# WordGiffy

## Description
The purpose of this project was to produce a webpage for busy writers in need of information about the words they use. The page accesses Words API to look up definitions, synonyms, rhymes and examples of usage for a search term entered by the user. It also accesses Giphy API to search for a gif related to the principal search term and searches for a gif of a randomly selected rhyming word out of the rhyming words provided by Words API. The rhymes will be particularly useful for users engaged in writing poetry. The structure of the page was built, primary, using components from bootstrap. These include a search form, cards, a jumbotron and a modal. CSS was used to format the webpage both from a specially dedicated CSS file and using jQuery/JavaScript. The formatting includes both a default display (prior to search) and a search display, where the results of the search are printed to the screen. Words API and Giphy API are accessed through the ajax() method. New searches are initiated by entering a word into a form. Former search terms and rhyming words, related to those terms, are retained in "localStorage" and used to generate buttons which can also be clicked to initiate searches. The total number of buttons, generated from past searches, is limited to ten, so as not to crowd the screen. A clear button activates a modal, which allows the user to remove all search results and buttons. The clear button/modal also removes all terms retained in "localStorage" and returns the display to its initial state.

## Installation
N/A

## Usage
To look up a word, enter it into the textbox and press "Search". A definition for the word, a synonym, a rhyme and an example of usage will be generated. In addition, two gifs will be displayed illustrating both the search term and a word that rhymes with it. Buttons will then be made using the search term and its rhyme, and these can be clicked to initiate a new search. So as not to clutter the screen, only five pairs of additional buttons will be displayed; older terms are erased. A clear button allows the user to remove both search findings and buttons using a modal.

## Credits
N/A

## License
N/A

## https://davidbluelamassu.github.io/WordGiffy/

![Screenshot of WordGiffy](../images/wordgiffy-screenshot.png)
