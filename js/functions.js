function pullAudioFiles(fileInput){ 
    //fileInput = document.querySelector("#myfiles");
    var files = fileInput.files;
	var supportedFiles = [];
	
    var fl=files.length;
    var i=0;

    while ( i < fl) {
        var file = files[i];
		var fileSupported = isAudioFile(file);
		if (fileSupported) {
			supportedFiles.push(file);
		}
        i++;
    }    
	console.log('supportedFiles:', supportedFiles);
	return supportedFiles;
}

function isAudioFile(file)
{
	//make sure file object has needed properties
	if (typeof file == 'undefined' || typeof file.name == 'undefined' || typeof file.type == 'undefined') return false;
	var fileExt = getFilenameExt(file.name);
	var supportedFileTypes = {
		mp3: ['audio/mpeg', 'audio/x-mpeg', 'audio/mp3', 'audio/x-mp3', 'audio/mpeg3', 'audio/x-mpeg3', 'audio/mpg', 'audio/x-mpg', 'audio/x-mpegaudio'], 
		mp4: ['audio/mp4']
	};
	//check if file extension supported
	if (supportedFileTypes[fileExt] == undefined) return false;
	var fileType = file.type;
	//lastly, check if file type supported and return result
	return supportedFileTypes[fileExt].find(checkIfStrMatches, fileType) != undefined;
}

function checkIfStrMatches(str) {
	return str == this.valueOf();
}

function getFilenameExt(filename)
{
	return filename.substr(filename.lastIndexOf('.')+1)
}

function getFilesTagsArray(files)
{
	audioFilesTags = [];
	filesCount = files.length;
	for (i=0; i<filesCount; i++) {
		var fileTags = jsmediatags.read(files[i], {
			onError: function(errorObj) {
				filesCount--;
				console.error(errorObj);
			}, 
			onSuccess: function(tags) {
				filesCount--;
				audioFilesTags.push(tags);
			}  
		});
	}
}

function getHashParameterByName(name)
{
    var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getQueryParameterByName(name)
{
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function spotifyAuth() 
{
	var url = "https://accounts.spotify.com/authorize";
	var currentUrl = window.location.href.replace(window.location.search, '');
	var currentUrl = window.location.href.replace(window.location.hash, '');
	var params = {
		client_id: clientId,
		response_type: "token",
		redirect_uri: currentUrl
	}
	url += '?' + $.param(params);
	window.open(url);
}