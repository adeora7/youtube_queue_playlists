'use strict';
const fs = require('fs');
const path = require('path');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const dir = './';
const allFilesFolder = './Playlists/';
const masterFileName = 'master.json';
const masterFilePath = path.join(dir, masterFileName);
const master = fs.readFileSync(masterFilePath, 'utf-8');
let allFiles =[];
let fileContent = {};
fs.readdir(allFilesFolder, (err, files) => {
	files.forEach(file => {
		let fileContentCurrent = fs.readFileSync(allFilesFolder + file, 'utf-8');
		try{
			fileContentCurrent = JSON.parse(fileContentCurrent);
			//fileContent = fileContent+fileContentCurrent;
		}
		catch(e)
		{
			console.log(file+' could not be parsed.', e);
		}
		for(var playlistName in fileContentCurrent)
		{
			if(fileContentCurrent.hasOwnProperty(playlistName))
			{
				fileContent[playlistName] = fileContentCurrent[playlistName];
				//fileContent = fileContentCurrent;
				fileContentCurrent[playlistName].forEach(function(video){
					verifyVideo(video);
				});
			}
		}
	});
});

function verifyVideo(video){
	var url = video.url;
	var s = url.split("/watch?v=");
	var first = "https://www.googleapis.com/youtube/v3/videos?id=";
	var second = "&key=AIzaSyDNwkpSo1Jyb6Yo3LDyHH1xm7Syfe2NWQg&part=snippet";
	var new_url = first + s[1] + second;

	var x = new XMLHttpRequest();
	x.open('get', new_url, true);
	x.responseType = 'json';
	x.onreadystatechange = function() {
		if (x.readyState == 4 && x.status == 200) {
			var the_name = x.responseText;
			the_name = JSON.parse(the_name);
			the_name = the_name.items[0].snippet.title;
			video.name = the_name;
			fs.writeFile(masterFilePath, JSON.stringify(fileContent, null, "\t")); 
		}
	};
	x.send();
};

