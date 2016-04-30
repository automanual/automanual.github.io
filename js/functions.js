function pullAudioFiles(fileInput){ 
    //fileInput = document.querySelector("#myfiles");
    var files = fileInput.files;
	var supportedFiles = {};
	
    var fl=files.length;
    var i=0;

    while ( i < fl) {
        var file = files[i];
		var fileSupported = isAudioFile(file);
		var md5;
		if (fileSupported) {
			fileNameMd5 = parent.md5(file.name);
			supportedFiles[fileNameMd5] = file;
		}
        i++;
    }
	setObjLength(supportedFiles);
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

function setObjLength(obj) {
	Object.defineProperty(obj, "length", {
		enumerable: false,
		writable: true
	});
	obj.length = Object.keys(obj).length;
}

function getFilesTags(files)
{
	filesCount = files.length;
	for (var key in files) {
		if (!files.hasOwnProperty(key)) {
			//The current property is not a direct property of p
			continue;
		}
		var fileTags = jsmediatags.read(files[key], {
			onError: function(errorObj) {
				var fileNumber = this.valueOf(); //the binded var 'key'
				files[fileNumber].tags = false;
				console.error(errorObj);
				filesCount--;
			}.bind(key),
			onSuccess: function(tagObj) {
				var fileNumber = this.valueOf(); //the binded var 'key'
				files[fileNumber].tags = tagObj.tags;
				filesCount--;
			}.bind(key)
		});
	}
}

function addSearchStrings(files)
{
	filesCount = files.length;
	for (var key in files) {
		if (!files.hasOwnProperty(key)) {
			//The current property is not a direct property of p
			continue;
		}
		var file = files[key];
		if ( !file.tags || (file.tags.title == undefined == file.tags.artist) ) {
			//use the filename
			file.searchString = cleanFilename(removeExtension(file.name));
		} else {
			//use the tags
			file.searchString = '';
			if (file.tags.title && file.tags.artist) {
				file.searchString = file.tags.artist + ' ' + file.tags.title;
				file.searchString = cleanFilename(file.searchString);
			} else {
				file.searchString = 
					removeExtension(file.name) 
					+' '
					+ (file.tags.artist) ? file.tags.artist : '' 
					+' '
					+ (file.tags.title) ? file.tags.title : '';
				file.searchString = cleanFilename(file.searchString);
				
			}
		}
	}
}

function removeExtension(fileName)
{
	return fileName.replace(getFilenameExt(fileName), '');
}

function getParenthesesStrings(str)
{
	var regExp = /\(([^)]+)\)/;  //regular parentheses ()
	var matches = regExp.exec(str);
	return matches;
}

function getBracketsStrings(str)
{
	var regExp = /\[([^\]]+)\]/; //brackets []
	var matches = regExp.exec(str);
	return matches;
}

function replaceXWithFirstWord(customRegexpFunction, fileName)
{
	var surroundedString;
	var replaceWith = '';
	var surroundedStringWords = [];
	var bannedQueryWords = ['feat', 'feat.', 'feat:', 'featuring', 'featuring:'];
	while (surroundedString = customRegexpFunction(fileName)) {  //check every parentheses string
		surroundedStringWords = surroundedString[1].split(' ');
		for (i=0;i<surroundedStringWords.length;i++) {
			if ($.inArray(surroundedStringWords[i], bannedQueryWords) < 0) {
				replaceWith = surroundedStringWords[i];
				break;
			}
		}
		fileName = fileName.replace(surroundedString[0], replaceWith);
	}
	return fileName;
}

function replaceParenthesesWithFirstWord(fileName)
{
	fileName = replaceXWithFirstWord(getParenthesesStrings, fileName);
	fileName = replaceXWithFirstWord(getBracketsStrings, fileName);
	return fileName;
}

function cleanFilename(fileName)
{
	//get first word from inside parentheses
	fileName = replaceParenthesesWithFirstWord(fileName);
	
	//replace special symbols with spaces
	fileName = fileName.replace(/[&\/\\#,+\-()$~%.'":*?<>{}]/g,' ');

	//clean beginning of string - get rid of non-letters until the first letter is found
	fileName = startStringWithLetter(fileName);
	
	return fileName;
}

function startStringWithLetter(str)
{
	while (str && !isLetter(str[0])) {
		str = str.substring(1);
	}
	return str;
}

function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
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

function getFilenameExt(filename)
{
	return filename.substr(filename.lastIndexOf('.')+1)
}

function spotifyAuth() 
{
	var url = "https://accounts.spotify.com/authorize";
	var currentUrl = window.location.href.replace(window.location.search, '');
	var currentUrl = currentUrl.replace(window.location.hash, '');
	var params = {
		client_id: clientId,
		response_type: "token",
		redirect_uri: currentUrl
	}
	url += '?' + $.param(params);
	window.open(url, '_self');
}