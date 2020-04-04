

var Nightmare = require('nightmare');
const TVDB = require('node-tvdb');
const tvdbkey = require('./localInformation/tvdbkey').key;
const savePath = require('./localInformation/savePath').path;
const tvdb = new TVDB(tvdbkey);
var sanitize = require("sanitize-filename");


var Log = require('./log.js');



// Useless?
var cleanAnimeList = [];
//Honestly.... this is barely useful but I'm too lazy to fix it
var animeID = [];
//Useless?... nvm LOL i use recursion later on, so thats why this was a global, this holds the santized name I use for windows path
var animePathName = [];
//An array of all the new anime titles we're parsing
var newAnime = [];
//Same as above, but we do a shift() later on which empties newAnime so we have a full copy of it here to use later
var cloneNewAnime = [];
//Matched length with newAnime/cloneNewAnime, honestly just a really lazy implementation
var season = [];


//Tracks titles that have been loaded previously
var previousAnimeLoaded;


var loadAllAnime = function() {
	console.log('Scafolding nightmare LAA');
	previousAnimeLoaded = require('../loaded.json')
	console.log(previousAnimeLoaded);

	//Setting Values for Nightmare instance, since this run takes in all anime, it does not need to show it to the user for input
	var GUI = Nightmare({
		show: false,
		typeInterval: 20,
		alwaysOnTop: false,
		title: 'CXP Toolkit',
		x: 100,
		y: 10,
		icon: './Utility/icon.png',
		autoHideMenuBar: true
	})
	GUI
		.viewport(800, 1000)
		.goto('https://horriblesubs.info/current-season/')
		.wait('#main')
		.evaluate(function() {
			var showlist = document.getElementsByClassName('shows-wrapper')[0].getElementsByTagName('a');
			var showlisttext = [];
			for(var i = 0; showlist[i]; i++) {
				showlisttext.push(showlist[i].innerText)
			}
			return showlisttext;
		})
		.then(function(list) {
			console.log(list);
			parseLoadedAnime(list);
		})
		.catch(function (error) {
			console.error('firstLogin failed due to: ', error);
		})
}

var loadCheckedAnime = function() {
	console.log('Scafolding nightmare');
	var GUI = Nightmare({
		show: true,
		typeInterval: 20,
		alwaysOnTop: false,
		title: 'CXP Toolkit',
		x: 100,
		y: 10,
		icon: './Utility/icon.png',
		autoHideMenuBar: true,
		waitTimeout: 120000
	})
	GUI
		.viewport(800, 1000)
		.goto('https://horriblesubs.info/current-season/')
		.wait('#main')
		.evaluate(function() {
			for(var i = 0; document.getElementsByClassName('ind-show')[i]; i++) {
				var tmp = document.createElement('input');
				tmp.type = 'checkbox';
				tmp.value = 'test';
				tmp.className = 'checkboxVal';
				document.getElementsByClassName('ind-show')[i].firstElementChild.prepend(tmp)
			  }
			  var button = document.createElement('button');
			button.type="button";
				button.onclick = function() {
				document.getElementsByClassName('entry-title')[0].id = 'nextStep';
				}
				button.innerText = 'Press this button when selection complete';
				document.getElementsByClassName('entry-title')[0].append(button);
		})
		.wait('#nextStep')
		.evaluate(function() {
			//Below should only return what has a checkmark on it
			var showlist = document.getElementsByClassName('shows-wrapper')[0].getElementsByTagName('a');
			var showlistChecked = document.getElementsByClassName('checkboxVal');
			var showlisttext = [];
			for(var i = 0; showlist[i]; i++) {
				if(showlistChecked[i].checked) {
					showlisttext.push(showlist[i].innerText)
				}
			}
			return showlisttext;
		})
		.then(function(list) {
			parseLoadedAnime(list);
		})
		.catch(function (error) {
			console.error('firstLogin failed due to: ', error);
		})
}


//Basically parses the information for TVDB API
var parseLoadedAnime = function(list) {
	console.log('Anime Titles');
	console.log(list);

	if(myArgs[0] != "check") {
		console.log('Duplication Check')
		//Below does a comparison between old searches with the newest search so we only search for new animes
		for(var i = 0; list[i]; i++) {
			if(previousAnimeLoaded.find(function(element) 
				{ 
					//TLDR: If it finds it, skip to next
					var retVal = false;
					if(element == list[i]) {
						console.log(element + "==" + list[i]);
						retVal = true;
					}
					return retVal;
				})
			) 
			{
				//console.log('OLD');
			}
			else {
				//TLDR: Else add it to the list of new animes to parse
				console.log('NEW Title: ' + list[i]);
				newAnime.push(list[i])
			}
		}
	}
	else {
		console.log()
		newAnime = list;
	}
	
	console.log('New Entries:');
	console.log(newAnime);
	for(var i = 0; newAnime[i]; i++) {
		if(/S[0-9]/.test(newAnime[i])) {
			season.push(newAnime[i].substr(newAnime[i].length - 1))
			newAnime[i] = newAnime[i].substring(0, newAnime[i].length - 3)
		}
		else {
			season.push('1');
		}
	}
	if(newAnime.length > 0) {
		console.log('Parsing:');
		console.log(newAnime);
		for(var i = 0; newAnime[i]; i++) {
			cloneNewAnime.push(newAnime[i]);
		}
		tvDBsearch(newAnime);
	}
	else {
		console.log('No New Anime')
	}


}



var tvDBsearch = function(ijpnUrlList) {


	if(ijpnUrlList[0]) {
		console.log('\tCurrent Title:' + ijpnUrlList[0]);
		console.log('Current queue:' + ijpnUrlList.length);
        
        tvdb.getSeriesByName(ijpnUrlList[0])
        .then(response => { 
                console.log('Anime ID:');
                console.log(response[0]['id']);
                console.log('Anime Name:');
                console.log(response[0]['seriesName']);
                animeID.push(response[0]['id']);
				animePathName.push( sanitize(response[0]['seriesName']))
                ijpnUrlList.shift();
                tvDBsearch(ijpnUrlList);
        })
        .catch(error => { 
            //We'd want to query MAL here but I'll save that for later
			console.log('Nothing found?\n Error Response:');
			console.log(error);
			console.log('Cannot find it so putting in fake info');
            animeID.push('MISSING');
			animePathName.push(ijpnUrlList[0]);
            ijpnUrlList.shift();
            tvDBsearch(ijpnUrlList);
        });

    }
	else {
		console.log('Packing');
		flexGetDataPacker();
		if(myArgs[0] != "check") {
			for(var i = 0; cloneNewAnime[i]; i++) {
				if(season[i] != '1') {
					previousAnimeLoaded.push(cloneNewAnime[i] + ' S' + season[i]);
				}
				else {
					previousAnimeLoaded.push(cloneNewAnime[i]);
				}
			}
			Log.initOverrideV2('./', 'loaded.json')
			Log.data('', previousAnimeLoaded);
			Log.fixData();
		}
		console.log('Execution is complete');
	}
}

var flexGetDataPacker = function() {
	console.log('            path:  ' + savePath  + '/Season ');
    console.log('dataPacker');
    console.log(cloneNewAnime);
    Log.initOverrideV2('./', 'ForFlexGet.txt');
    for(var i = 0; cloneNewAnime[i]; i++) {
		if(animeID[i] == 'MISSING') {
			Log.print('>-------------------------WARNING BELOW--------------------<\n');
		}
		Log.print('      - ' + cloneNewAnime[i] + ':\n');
		Log.print('          set:\n');
        Log.print('            path:  ' + savePath + '' + animePathName[i] + '/Season ' + season[i]);
        Log.print('\n');
		if(animeID[i] == 'MISSING') {
			Log.print('>-------------------------WARNING ABOVE--------------------<\n');
		}
	}
}




//Parsing Arguments to see which version to run, needs to be down here to beat a race condition
var myArgs = process.argv.slice(2);
console.log('myArgs:' , myArgs);
//If tvdb returns the error, then don't continue on obviously.
tvdb.getSeriesByName('The Simpsons')
    .then(response => { 
		console.log("Normal Response");
		console.log(response); 
		if(myArgs[0] == "check") {
			loadCheckedAnime();
		}
		else {
			loadAllAnime();
		}})
    .catch(error => { 
		console.log("Error Response");
		console.log(error) });



 


