//API URLs:
const DEEZER_TRENDING_URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/1111143121";
const DEEZER_CHARTS_URL = "https://deezerdevs-deezer.p.rapidapi.com/playlist/3155776842";
const DEEZER_SEARCH_URL = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";

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
        if (type == "grid") {
            for (let index = 1; index < count + 1; index++) {
                document.getElementById(preID + "title-" + index).innerHTML = object.tracks.data[index-1].title;
                document.getElementById(preID + "artist-" + index).innerHTML = object.tracks.data[index-1].artist.name;
                document.getElementById(preID + "cover-" + index).src = object.tracks.data[index-1].album.cover_small;
            }
        }
        else if (type == "search") {
            for (let index = 1; index < count + 1; index++) {
                document.getElementById(preID + "title-" + index).innerHTML = object.data[index-1].title;
                document.getElementById(preID + "artist-" + index).innerHTML = object.data[index-1].artist.name;
                document.getElementById(preID + "cover-" + index).src = object.data[index-1].album.cover_small;
            }
        } else {

        }
        
    }) 
    .catch(function (error) {
        console.error(error);
    });
}

function getGridData(api_url, count, preID) {
    getAPIData(api_url, count, "grid", preID);
}

function getSearchData(api_url, count, preID) {
    getAPIData(api_url, count, "search", preID);
}

function getDeezerSearchURL(query) {
    return DEEZER_SEARCH_URL + query;
}

function removeSearchResults(count, preID) {
    for (let index = 1; index < count + 1; index++) {
        document.getElementById(preID + "title-" + index).innerHTML = "";
        document.getElementById(preID + "artist-" + index).innerHTML = "";
        document.getElementById(preID + "cover-" + index).src = "";
    }
}

function displaySearchResults(element, count, preID) {
    var searchFieldValue = getDeezerSearchURL(element.value);
    if (searchFieldValue != DEEZER_SEARCH_URL) {
        getSearchData(searchFieldValue, count, preID);
    }  else {
        removeSearchResults(count, preID);
    } 
}


