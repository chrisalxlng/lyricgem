//API URLs:
const DEEZER_TRENDING_URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/1111143121";
const DEEZER_CHARTS_URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/3155776842";
const DEEZER_SEARCH_URL = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";
const DEEZER_TRACK_BY_ID_URL = "https://deezerdevs-deezer.p.rapidapi.com/track/";
const CANARADO_LYRICS_URL = "https://canarado-lyrics.p.rapidapi.com/lyrics/";

//
//-------------------------------------------------------------------------------------------
//
//GET SEARCH DATA

//Variables:
var searchResultElementsCreated = false;
var noSearchResultElementsCreated = false;

function getAPIData (api_url, count, type, preID) {
    fetch(api_url, {
	"method": "GET",
    "headers": 
        {
		    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
		    "x-rapidapi-key": "486af7d15cmsh8635265f7c2bdc9p1b2081jsnf5c14c14946b"
	    }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (object) {
        if (type == "search" && object.data.length == 0) { 
            removeSearchResultElements(count, preID);
            displayNoSearchResultsFound();
        } else {
            //if there are not enough elements to display, only display the provided elements
            if (type == "search" && object.data.length < count) {
                count = object.data.length;
            }
            if (type == "grid") {
                for (let index = 1; index < count + 1; index++) {
                    document.getElementById(preID + "-title-" + index).innerHTML = object.tracks.data[index-1].title;
                    document.getElementById(preID + "-artist-" + index).innerHTML = object.tracks.data[index-1].artist.name;
                    document.getElementById(preID + "-cover-" + index).src = object.tracks.data[index-1].album.cover_small;
                    document.getElementById(preID + "-search-result-element-" + index).href = "song.html?id=" + object.tracks.data[index-1].id;
                }
            }
            else if (type == "search") {
                for (let index = 1; index < count + 1; index++) {
                    document.getElementById(preID + "-title-" + index).innerHTML = object.data[index-1].title;
                    document.getElementById(preID + "-artist-" + index).innerHTML = object.data[index-1].artist.name;
                    document.getElementById(preID + "-cover-" + index).src = object.data[index-1].album.cover_small;
                    document.getElementById(preID + "-search-result-element-" + index).href = "song.html?id=" + object.data[index-1].id;
                }
            } 
            else if (type == "song") {
                document.getElementById("title").innerHTML = object.title_short;
                document.getElementById("artist").innerHTML = object.artist.name;
                document.getElementById("album").innerHTML = object.album.title;
                document.getElementById("release-year").innerHTML = object.album.release_date;
                document.getElementById("deezer-link").href = object.link;
                document.getElementById("cover").src = object.album.cover_medium;
                var playPauseButton = document.getElementById("song-preview");
                var song = new Audio(object.preview);
                playPauseButton.addEventListener("click", function() {
                    if (song.currentTime == 0) {
                        song.play();
                    } 
                    else if (song.currentTime < 29 && song.currentTime != 0) {
                        song.pause();
                        song.currentTime = 0;
                    } else {
                        song.currentTime = 0;
                        song.play();
                    }
                });
                //getLyrics(getLyricsURL(object.title_short, object.artist.name));
            } else {
    
            }
        }   
    }) 
    .catch(function (error) {
        console.error(error);
    });
}

function displayNoSearchResultsFound() {
    var pElement = document.createElement("p");
    pElement.classList.add("no-search-result-element");
    pElement.innerHTML = "Keine Suchergebnisse gefunden";
    document.getElementById("search-result-container").appendChild(pElement);
    noSearchResultElementsCreated = true;
}

function removeNoSearchResultElement() {
    document.querySelector(".no-search-result-element").remove();
    noSearchResultElementsCreated = false;
}

function getSearchData(api_url, count, preID) {
    getAPIData(api_url, count, "search", preID);
}

function getDeezerSearchURL(query) {
    return DEEZER_SEARCH_URL + query;
}

function displaySearchResults(element, count, preID) {
    var searchFieldValue = getDeezerSearchURL(element.value);
    if (searchFieldValue != DEEZER_SEARCH_URL) {
        getSearchData(searchFieldValue, count, preID);
    }  else {
        removeSearchResultElements(count, preID);
    } 
}

/*
creates following HTML for one element:
<a class="search-result-element">
    <img id=preID + "-cover-" + index class="search-result-cover">
    <div class="search-result-text-wrapper">
        <p id=preID + "-title-" + index class="search-result-title"></p>
        <p id=preID + "-artist-" + index class="search-result-artist"></p>
    </div>
</a>
*/
function createSearchResultElements(count, preID) {        
    for (let index = 1; index < count + 1; index++) {
        var anchorElement = document.createElement("a");
        anchorElement.classList.add("search-result-element");
        anchorElement.id = preID + "-search-result-element-" + index;
        document.getElementById("search-result-container").appendChild(anchorElement);

        var imageElement_cover = document.createElement("img");
        imageElement_cover.classList.add("search-result-cover");
        imageElement_cover.id = preID + "-cover-" + index;
        anchorElement.appendChild(imageElement_cover);

        var divElement_text_wrapper = document.createElement("div");
        divElement_text_wrapper.classList.add("search-result-text-wrapper");
        divElement_text_wrapper.id = preID + "-search-result-text-wrapper-" + index;
        anchorElement.appendChild(divElement_text_wrapper);

        var pElement_title = document.createElement("p");
        pElement_title.classList.add("search-result-title");
        pElement_title.id = preID + "-title-" + index;
        divElement_text_wrapper.appendChild(pElement_title);

        var pElement_artist = document.createElement("p");
        pElement_artist.classList.add("search-result-artist");
        pElement_artist.id = preID + "-artist-" + index;
        divElement_text_wrapper.appendChild(pElement_artist);
    }
    searchResultElementsCreated = true;
}

function removeSearchResultElements(count, preID) {
    for (let index = 1; index < count + 1; index++) {
        document.getElementById(preID + "-search-result-element-" + index).remove();
        searchResultElementsCreated = false;
    }
}

//call example in HTML: onkeyup="initSearchResultElements(this, 2, 'res')"
function initSearchResultElements(element, count, preID) {
    //Delaying the function execute
    if (this.timer) {
        window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(function() {    
        //Execute the function code here...
        if (searchResultElementsCreated) {
            removeSearchResultElements(count, preID);
        }
        if (noSearchResultElementsCreated) {
            removeNoSearchResultElement();
        }
        createSearchResultElements(count, preID);
        displaySearchResults(element, count, preID);
    }, 500); 
}

//
//-------------------------------------------------------------------------------------------
//
//GET GRID DATA
function getGridData(api_url, count, preID) {
    getAPIData(api_url, count, "grid", preID);
}

//
//-------------------------------------------------------------------------------------------
//
//GET SONG DATA
function getDeezerSongLink(id) {
    return DEEZER_TRACK_BY_ID_URL + id;
}

function getDeezerSongID(queryString) {
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id');
    return id;
}

window.onload = function() {
    if (window.location.href.indexOf('song.html') > -1) {
        var songID = getDeezerSongID(window.location.search);
        var url = getDeezerSongLink(songID);
        getAPIData(url, 0, "song", "");
    } 
  }

//
//-------------------------------------------------------------------------------------------
//
//GET SONG LYRICS
function getLyricsURL(title, artist) {
    return CANARADO_LYRICS_URL + title + " " + artist;
}

function getLyrics(url) {
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "canarado-lyrics.p.rapidapi.com",
            "x-rapidapi-key": "486af7d15cmsh8635265f7c2bdc9p1b2081jsnf5c14c14946b"
        }
    })
    .then(response => {
        return response.json();
    })
    .then(function (object) {
        if (object.status.code == 200) {
            var songLyrics = object.content[0].lyrics;
            document.getElementById("song-lyrics").innerHTML = "<pre>" + object.content[0].lyrics + "</pre>";
        } else {
            document.getElementById("song-lyrics").innerHTML = "Keinen Songtext gefunden.";
        }
    })
    .catch(err => {
        console.log(err);
    });
}









