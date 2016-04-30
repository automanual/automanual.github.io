var filesCount;
var audioFilesTags;
var spotifyToken = getHashParameterByName('access_token') ? getHashParameterByName('access_token') : false;
var authButtonSelector = "#start_spotify_auth";
var filesInputSelector = "#myfiles";
var authButton = document.querySelector(authButtonSelector);
var filesInput = document.querySelector(filesInputSelector);
var clientId = "12edf9bbb1de46f0b826971996220d88";

if (spotifyToken) filesInput.style.display = "block";
else authButton.style.display = "block";

authButton.onclick=function () {
	spotifyAuth();
}

filesInput.onchange=function () {
	//console.log(this.id);
	audioFiles = pullAudioFiles(this);
	
	//var filesCount = 1;
	
	getFilesTagsArray(audioFiles, filesCount);
	
	var waitForTags = setInterval(function() {
		if (filesCount < 1) {
			clearInterval(waitForFunction);
			tagsToPlaylist(audioFilesTags);
			console.log(audioFilesTags);
		}
	}, 100);

	console.log(audioFiles, audioFilesTags);
};

function tagsToPlaylist(audioFilesTags) 
{
	
}