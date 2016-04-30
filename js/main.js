var filesCount;
var spotifyToken = getHashParameterByName('access_token') ? getHashParameterByName('access_token') : false;
var authButtonSelector = "#start_spotify_auth";
var filesInputSelector = "#myfiles";
var authButton = document.querySelector(authButtonSelector);
var filesInput = document.querySelector(filesInputSelector);
var clientId = "12edf9bbb1de46f0b826971996220d88";
var searchQueryParams = {
	artist: 'artist:',
	title: 'track:',
	album: 'album:'
}
//don't replace dots and commas, theyre too commonly used
//search the 2nd time without bracket contents if nothings found, brackets might ruin the search
//ban 'original', 'mix', 'radio', 'edit'
//replace 'feat', 'original' and similar words from the whole query
$(document).ready(function() {
	if (spotifyToken) filesInput.style.display = "block";
	else authButton.style.display = "block";

	authButton.onclick=function () {
		spotifyAuth();
	}

	filesInput.onchange=function () {
		//console.log(this.id);
		audioFiles = pullAudioFiles(this);
		
		//var filesCount = 1;
		
		getFilesTags(audioFiles);
		
		var waitForTags = setInterval(function() {
			if (filesCount < 1) {
				clearInterval(waitForTags);
				filesToPlaylist(audioFiles);
				console.log(audioFiles);
			}
		}, 100);
	};

	function filesToPlaylist(audioFiles) 
	{
		addSearchStrings(audioFiles);
		console.log(audioFiles);
	}
});