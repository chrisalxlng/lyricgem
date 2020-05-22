function getAPIData (api_url, count) {
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
        for (let index = 1; index < count + 1; index++) {
            document.getElementById("title-" + index).innerHTML = object.tracks.data[index-1].title;
            document.getElementById("artist-" + index).innerHTML = object.tracks.data[index-1].artist.name;
            document.getElementById("cover-" + index).src = object.tracks.data[index-1].album.cover_small;
        }
    }) 
    .catch(function (error) {
        console.error("fetch error");
        console.error(error);
    });
}

function getGridData(api_url, count) {
    getAPIData(api_url, count);
}

var deezerTrending_url = "https://deezerdevs-deezer.p.rapidapi.com/playlist/1111143121";
var deezerTrending_command = "object.tracks.data";

getGridData(deezerTrending_url, 4);
