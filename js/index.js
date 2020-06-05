//API URLs:
const DEEZER_TRENDING_URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/1111143121";
const DEEZER_CHARTS_URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/3155776842";
const DEEZER_NEWHITS_URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/65490170";
const DEEZER_SEARCH_URL = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";
const DEEZER_TRACK_BY_ID_URL = "https://deezerdevs-deezer.p.rapidapi.com/track/";
const CANARADO_LYRICS_URL = "https://canarado-lyrics.p.rapidapi.com/lyrics/";

//-------------------------------------------------------------------------------------------
//GET SEARCH DATA

//Variables:
var searchResultElementsCreated = false;
var noSearchResultElementsCreated = false;
var publicCount = 0;
var publicPreID = "";
var previousSearchFieldValue = "";
var focus = 0;
var previousFocus = 0;

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
                    var title = checkForStringLength(object.tracks.data[index-1].title, 15, 35);
                    var artist = checkForStringLength(object.tracks.data[index-1].artist.name, 15, 15);
                    document.getElementById(preID + "-title-" + index).innerHTML = title;
                    document.getElementById(preID + "-artist-" + index).innerHTML = artist;
                    document.getElementById(preID + "-cover-" + index).src = object.tracks.data[index-1].album.cover_medium;
                    document.getElementById(preID + "-search-result-element-" + index).href = "song.html?id=" + object.tracks.data[index-1].id;
                }
            }
            else if (type == "search") {
                for (let index = 1; index < count + 1; index++) {
                    var title = checkForStringLength(object.data[index-1].title, 25, 60);
                    var artist = checkForStringLength(object.data[index-1].artist.name, 25, 60);
                    document.getElementById(preID + "-title-" + index).innerHTML = title;
                    document.getElementById(preID + "-artist-" + index).innerHTML = artist;
                    document.getElementById(preID + "-cover-" + index).src = object.data[index-1].album.cover_small;
                    document.getElementById(preID + "-search-result-element-" + index).href = "song.html?id=" + object.data[index-1].id;
                }
            } 
            else if (type == "search-results") {
                for (let index = 1; index < count + 1; index++) {
                    var title = checkForStringLength(object.data[index-1].title, 15, 35);
                    var artist = checkForStringLength(object.data[index-1].artist.name, 13, 13);
                    document.getElementById("res-title-" + index).innerHTML = title;
                    document.getElementById("res-artist-" + index).innerHTML = artist;
                    document.getElementById("res-cover-" + index).src = object.data[index-1].album.cover_medium;
                    document.getElementById("res-grid-element-" + index).href = "song.html?id=" + object.data[index-1].id;
                }
            }
            else if (type == "song") {
                var title = checkForStringLength(object.title_short, 15, 60);
                var artist = checkForStringLength(object.artist.name, 20, 60);
                var album = checkForStringLength(object.album.title, 20, 25);
                document.getElementById("title").innerHTML = title;
                document.getElementById("artist").innerHTML = artist;
                document.getElementById("album").innerHTML = '"' + album + '"';
                document.getElementById("release-year").innerHTML = "(" + object.album.release_date.substring(0, 4) + ")";
                document.getElementById("deezer-link").href = object.link;
                document.getElementById("cover").src = object.album.cover_big;
                document.querySelector(".song-info-section").style.backgroundImage = "url('" + object.artist.picture_xl + "')";
                document.querySelector("title").innerHTML = title + ", " + artist + " - lyricgem";
                var playPauseButton = document.getElementById("song-preview");
                var song = new Audio(object.preview);
                playPauseButton.addEventListener("click", function() {
                    if (song.currentTime == 0) {
                        song.play();
                        document.querySelector(".fas.fa-stop").classList.remove("hide");
                        document.querySelector(".fas.fa-play").style.animationName = "button-flip-out";
                        document.querySelector(".fas.fa-stop").style.animationName = "button-flip-in";
                        document.querySelector(".fas.fa-play").classList.add("hide");
                    } else {
                        song.pause();
                        song.currentTime = 0;
                        document.querySelector(".fas.fa-play").classList.remove("hide");
                        document.querySelector(".fas.fa-stop").style.animationName = "button-flip-out";
                        document.querySelector(".fas.fa-play").style.animationName = "button-flip-in";
                        document.querySelector(".fas.fa-stop").classList.add("hide");
                    }
                });
                song.onended = function () {
                    song.currentTime = 0;
                    document.querySelector(".fas.fa-play").classList.remove("hide");
                    document.querySelector(".fas.fa-stop").style.animationName = "button-flip-out";
                    document.querySelector(".fas.fa-play").style.animationName = "button-flip-in";
                    document.querySelector(".fas.fa-stop").classList.add("hide");
                };
                getLyrics(getLyricsURL(object.title_short, object.artist.name));
            } else {}
        }   
    }) 
    .catch(function (error) {
        console.error(error);
    });
}

function checkForStringLength(string, singleStringLength, totalStringLength) {
    //check for length of single strings so they're not longer than 25 characters
    var splitString = string.split(" ");
    string = "";
    for (let index = 0; index < splitString.length; index++) {
        if (splitString[index].length > singleStringLength+1) splitString[index] = splitString[index].substring(0,singleStringLength) + "...";
    }
    for (let index = 0; index < splitString.length; index++) {
        if (index != splitString.length-1) string += splitString[index] + " ";
        else string += splitString[index];
    }

    //check for length of the whole string so it is not longer than 60 characters in total
    if (string.length > totalStringLength+1) string = string.substring(0,totalStringLength) + "...";
    //if there is a space at the end of the string, remove it
    if (string[totalStringLength-1] == " ") string = string.substring(0,totalStringLength-1) + "...";

    return string;
}

function displayNoSearchResultsFound() {
    var pElement = document.createElement("p");
    pElement.classList.add("no-search-result-element");
    pElement.innerHTML = "Keine Suchergebnisse gefunden.";
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

function displaySearchResults(element, preID) {
    var searchFieldValue = getDeezerSearchURL(element.value);
    if (searchFieldValue != DEEZER_SEARCH_URL) {
        getSearchData(searchFieldValue, publicCount, preID);
    }  else {
        removeSearchResultElements(publicCount, preID);
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
function createSearchResultElements(preID) {        
    for (let index = 1; index < publicCount + 1; index++) {
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

function checkForAvailableResultCount(maxCount, element, preID) {
    var searchFieldValue = getDeezerSearchURL(element.value);

    if (element.value != "") {
        fetch(searchFieldValue, {
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
            var availableCount = object.data.length;
            if (availableCount < maxCount) {
                callbackAvailableCount(availableCount, element, preID);
            } else {
                callbackAvailableCount(maxCount, element, preID);
            } 
        })
        .catch(function (error) {
            console.error(error);
        }); 
    } else {
        callbackAvailableCount(maxCount, element, preID);
    }
}

function callbackAvailableCount(newCount, element, preID) {
    publicCount = newCount;
    createSearchResultElements(preID);
    displaySearchResults(element, preID);
    publicPreID = preID;
}

function checkForAutocomplete(event, preID) {
    previousFocus = focus;
    //if key == "Down"
    if (event.keyCode == 40) {
        if (focus < publicCount) focus++;

        //if focus is at the bottom and there are no more songs coming up, jump back to the top
        else if ((focus >= publicCount) && (publicCount > 0)) {
            document.querySelector("#" + preID + "-search-result-element-" + (focus)).classList.remove("search-result-active");
            focus = 1;
            document.querySelector(".search-result-container").scrollTo(0, 0);
        }     
    }
    //if key == "Up"
    else if (event.keyCode == 38) {
        focus--;
    } 
    //if key == "Enter"
    else if (event.keyCode == 13 && focus > 0) {
        document.querySelector("#" + preID + "-search-result-element-" + (focus)).click();
    } else {}

    //remove previous focus
    if (focus > 0) {
        if (focus > 1 && event.keyCode == 40) {
            document.querySelector("#" + preID + "-search-result-element-" + (focus-1)).classList.remove("search-result-active");
            document.querySelector(".search-result-container").scrollBy(0, 60);
        }
        else if (focus > 0 && event.keyCode == 38) {
            document.querySelector("#" + preID + "-search-result-element-" + (focus+1)).classList.remove("search-result-active");
            document.querySelector(".search-result-container").scrollBy(0, -60);
        }
        document.querySelector("#" + preID + "-search-result-element-" + focus).classList.add("search-result-active");
    } 
    else if (focus < 0) focus = 0;
    else if ((previousFocus == 1) && (focus == 0)) document.querySelector("#" + preID + "-search-result-element-1").classList.remove("search-result-active");
    
}

//prevent cursor from jumping when using arrow up and down keys
document.onkeydown = function(event) {
    if (event.keyCode == 38 || event.keyCode == 40) {
        event.preventDefault();
    }
};

//call example in HTML: onkeyup="initSearchResultElements(this, 2, 'res')"
function initSearchResultElements(element, maxCount, preID, event) {
    if (element.value != previousSearchFieldValue) {
        document.querySelector("#js-searchbar-icon-anchor").href = "search-results.html?q=" + document.querySelector("#searchbar-nav").value;
        //Delaying the function execute
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        this.timer = window.setTimeout(function() {    
            //Execute the function code here...
            if (searchResultElementsCreated) {
                removeSearchResultElements(publicCount, preID);
            }
            if (noSearchResultElementsCreated) {
                removeNoSearchResultElement();
            }
            previousSearchFieldValue = element.value;
            focus = 0;
            checkForAvailableResultCount(maxCount, element, preID);            
        }, 500); 
    } else {
        checkForAutocomplete(event, preID);
    }  
}

//-------------------------------------------------------------------------------------------
//GET GRID DATA
function getGridData(api_url, count, preID) {
    getAPIData(api_url, count, "grid", preID);
}


//-------------------------------------------------------------------------------------------
//GET SONG DATA
function getDeezerSongLink(id) {
    return DEEZER_TRACK_BY_ID_URL + id;
}

function getDeezerSongID(queryString) {
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id');
    return id;
}

//-------------------------------------------------------------------------------------------
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
            document.getElementById("song-lyrics").innerHTML = "<pre>" + object.content[0].lyrics + "</pre>";
        } else {
            document.getElementById("song-lyrics").innerHTML = "Keinen Songtext gefunden.";
        }
        document.querySelector(".loading-wrapper").style.display = "none";
    })
    .catch(err => {
        console.log(err);
    });
}

//-------------------------------------------------------------------------------------------
//OPEN SEARCH VIEW MOBILE

function scrollToCloseSearchView() {
    closeSearchView();
    document.getElementById("exitSearchViewElement").remove();
}

function openSearchView() {
    document.querySelector(".logo").style.display = "none";
    document.querySelector(".logo").style.animationName = "end-opacity";
    document.querySelector("#js-search").style.display = "none";
    document.querySelector("#js-search").style.animationName = "end-opacity";
    document.querySelector("#js-close").style.display = "block";
    document.querySelector("#js-close").style.animationName = "start-opacity";
    document.querySelector(".searchbar").classList.remove("hide");
    document.querySelector(".searchbar").style.animationName = "start-opacity";
    document.querySelector("#js-searchbar-icon").style.display = "block";
    document.querySelector("#js-searchbar-icon").style.animationName = "start-opacity";
    document.querySelector(".search-result-container").classList.remove("hide");
    document.querySelector(".searchbar").select();
    document.querySelector("#body").classList.add("stop-scrolling");
    document.querySelector(".search-result-container").style.animationName = "open-search-view";

    var exitSearchViewElement = document.createElement("div");
    exitSearchViewElement.id = "exitSearchViewElement";
    exitSearchViewElement.style.zIndex = "10";
    exitSearchViewElement.style.width = "100vw";
    exitSearchViewElement.style.height = "500vh";
    exitSearchViewElement.style.position = "absolute";
    exitSearchViewElement.style.top = "0";
    document.getElementById("body").appendChild(exitSearchViewElement);
}

function closeSearchView() {
    document.querySelector(".search-result-container").style.animationName = "close-search-view";
    document.querySelector(".logo").style.animationName = "start-opacity";
    document.querySelector("#js-close").style.animationName = "end-opacity";
    document.querySelector("#js-searchbar-icon").style.animationName = "end-opacity";
    document.querySelector("#js-search").style.animationName = "start-opacity";
    document.querySelector(".searchbar").value = "";
    document.querySelector(".searchbar").style.animationName = "end-opacity";
    document.querySelector("#body").classList.remove("stop-scrolling");
    document.getElementById("exitSearchViewElement").remove();
    if (searchResultElementsCreated) {
        removeSearchResultElements(publicCount, publicPreID);
    }
    if (noSearchResultElementsCreated) {
        removeNoSearchResultElement();
    }

    if (this.timer) {
        window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(function() {    
        document.querySelector(".searchbar").classList.add("hide");
        document.querySelector(".search-result-container").classList.add("hide");
        document.querySelector(".logo").style.display = "block";
        document.querySelector("#js-close").style.display = "none";
        document.querySelector("#js-searchbar-icon").style.display = "none";
        document.querySelector("#js-search").style.display = "block";
    }, 100);
}

//-------------------------------------------------------------------------------------------
//SEARCH RESULTS PAGE

function getQuery() {
    var urlParams = new URLSearchParams(window.location.search);
    var q = urlParams.get('q');
    return q;
}

/*
<a class="song-grid-element shadow" id="charts-search-result-element-1">
    <img id="res-cover-1">
    <p id="charts-title-1" class="grid-title"></p>
    <p id="charts-artist-1" class="grid-artist"></p>
</a>
*/
function createResultCards(count) {
    for (let index = 1; index < count+1; index++) {
        var anchorElement = document.createElement("a");
        anchorElement.classList.add("song-grid-element");
        anchorElement.classList.add("shadow");
        anchorElement.id = "res-grid-element-" + index;
        document.getElementById("res-grid").appendChild(anchorElement);

        var imageElement_cover = document.createElement("img");
        imageElement_cover.id = "res-cover-" + index;
        anchorElement.appendChild(imageElement_cover);

        var titleElement = document.createElement("p");
        titleElement.id = "res-title-" + index;
        titleElement.classList.add("grid-title");
        anchorElement.appendChild(titleElement);
        
        var artistElement = document.createElement("p");
        artistElement.id = "res-artist-" + index;
        artistElement.classList.add("grid-artist");
        anchorElement.appendChild(artistElement);
    }
}

//-------------------------------------------------------------------------------------------
//WINDOW.ONLOAD

window.onload = function() {
    if (window.location.href.indexOf('song.html') > -1) {
        var songID = getDeezerSongID(window.location.search);
        var url = getDeezerSongLink(songID);
        getAPIData(url, 0, "song", "");
    } 
    else if (window.location.href.indexOf('index.html') > -1) {
        getGridData(DEEZER_CHARTS_URL, 20,"charts");
        getGridData(DEEZER_TRENDING_URL, 20,"trending");
        getGridData(DEEZER_NEWHITS_URL, 20,"newhits");
    }
    else if (window.location.href.indexOf('search-results.html') > -1) {
        var resultCount = 0;
        var queryText = getQuery();
        var resURL = DEEZER_SEARCH_URL + queryText;
        document.querySelector("#results-header").innerHTML = 'Suchergebnisse für "' + queryText + '"';

        fetch(resURL, {
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
           resultCount = object.data.length;
           createResultCards(resultCount);
           getAPIData(resURL, resultCount, "search-results", "");
        })
        .catch(function (error) {
            console.error(error);
        });
    }
}

document.getElementById("js-search").addEventListener("click", openSearchView);
document.getElementById("js-close").addEventListener("click", closeSearchView);
