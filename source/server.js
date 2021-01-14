var Nightmare = require('nightmare');
const savePath = require('./localInformation/savePath').path;
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
//Making this global because I'm too lazy to pass it along for thetvdbnightmaresearch
var GUI;


var loadAllAnime = function() {
	console.log('Scafolding nightmare LAA');
	console.log(previousAnimeLoaded);

	//Setting Values for Nightmare instance, since this run takes in all anime, it does not need to show it to the user for input
	GUI = Nightmare({
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
		.goto('https://subsplease.org/schedule/')
		.wait('#full-schedule-table')
		.wait('.all-schedule-show')
		.evaluate(function() {
			var showlist = document.getElementsByClassName('all-schedule-show');
			var showlisttext = [];
			for(var i = 0; showlist[i]; i++) {
				showlisttext.push(showlist[i].firstChild.innerText)
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
	GUI = Nightmare({
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
		.goto('https://www.erai-raws.info/schedule/')
		.wait('#main')
		.evaluate(function(loaded) {
			
			for(var i = 0; document.getElementsByClassName('cccccc')[i]; i++) {
				/* 
				if(loaded.find(function(element) 
				{
					//TLDR: If it finds it, skip to next
					var retVal = false;
					//If you click, it will open in new window to show preview
					document.getElementsByClassName('shows-wrapper')[0].getElementsByTagName('a')[i].target = "_blank";
					if(element == document.getElementsByClassName('shows-wrapper')[0].getElementsByTagName('a')[i].innerText) {
						//document.getElementsByClassName('shows-wrapper')[0].getElementsByTagName('a')[i].innerText =  ">Added:" + document.getElementsByClassName('shows-wrapper')[0].getElementsByTagName('a')[i].innerText
						document.getElementsByClassName('shows-wrapper')[0].getElementsByTagName('a')[i].style.textDecoration = "underline";
						retVal = true;
					}
					return retVal;
				})
				)
				{
					//console.log('OLD');
				}
				else {
					//If not in list do nothing
				}
				*/
				var tmp = document.createElement('input');
				tmp.type = 'checkbox';
				tmp.value = 'test';
				tmp.className = 'checkboxVal';
				document.getElementsByClassName('cccccc')[i].prepend(tmp)
			}
			  	var button = document.createElement('button');
				button.type="button";
				button.onclick = function() {
				document.getElementsByClassName('entry-title')[0].id = 'nextStep';
				}
				button.innerText = 'Press this button when selection complete';
				document.getElementsByClassName('entry-title')[0].append(button);
		}, previousAnimeLoaded)
		.wait('#nextStep')
		.evaluate(function() {
			//Below should only return what has a checkmark on it
			var showlist = document.getElementsByClassName('cccccc');
			var showlistChecked = document.getElementsByClassName('checkboxVal');
			var showlisttext = [];
			for(var i = 0; showlist[i]; i++) {
				if(showlistChecked[i].checked) {
					//showlisttext.push(showlist[i].innerText)
					showlisttext.push(showlist[i].nextElementSibling.innerText)
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
		tvDBNightmareSearch(newAnime);
	}
	else {
		console.log('No New Anime')
	}


}

var tvDBNightmareSearch = function(ijpnUrlList) {
	if(ijpnUrlList[0]) {
		GUI
		.viewport(800, 1000)
		.goto('https://thetvdb.com/search?menu%5Btype%5D=TV&query=' + encodeURI(ijpnUrlList[0]) )
		.wait('div#searchbox')
		.wait(1000)
		.evaluate(function() {
			var retval = [];
			if(document.getElementsByTagName("ol")[0]) {
				retval[0] = document.getElementsByClassName("mt-1")[0].getElementsByTagName("small")[0].innerText.split("#")[1];
				retval[1] = document.getElementsByClassName("media-heading")[0].getElementsByTagName("a")[0].innerText;
				return retval;
			}
			else return -1;
			
		})
		.then(function(list) {
			if(list != -1) {
				console.log('Anime ID:');
				console.log(list[0]);
				console.log('Anime Name:');
				console.log(list[1]);
				animeID.push(list[0]);
				animePathName.push( sanitize(list[1]))
				
				ijpnUrlList.shift();
				tvDBNightmareSearch(ijpnUrlList);
			}
			else {
				//We'd want to query MAL here but I'll save that for later
				console.log('Nothing Found');
				console.log('Cannot find it so putting in fake info');
				animeID.push('MISSING');
				animePathName.push(ijpnUrlList[0]);
				ijpnUrlList.shift();
				tvDBNightmareSearch(ijpnUrlList);
			}
		})
		.catch(function (error) {
			console.error('firstLogin failed due to: ', error);
		})
	}
	else {
		console.log('Packing');
		flexGetDataPacker();
		for(var i = 0; cloneNewAnime[i]; i++) {
			if(season[i] != '1') {
				previousAnimeLoaded.push(cloneNewAnime[i] + ' S' + season[i]);
			}
			else {
				previousAnimeLoaded.push(cloneNewAnime[i]);
			}
		}
		//Log.initOverrideV2('./', 'loaded.json')
		Log.writeLoaded(previousAnimeLoaded);
		//Log.data('', previousAnimeLoaded);
		//Log.fixData();
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
		Log.print("      - '" + cloneNewAnime[i] +"'");
		if(season[i] != '1') {
			Log.print(' S' + season[i]);
		}
		Log.print(':\n');
		Log.print('          set:\n');
        Log.print('            path:  ' + savePath + '' + animePathName[i] + '/Season ' + season[i]);
		Log.print('\n');
		if(parseInt(season[i]) >= 3) {
			Log.print('          season_packs: yes\n');
			Log.print('          tracking: no\n');
		}
		if(animeID[i] == 'MISSING') {
			Log.print('>-------------------------WARNING ABOVE--------------------<\n');
		}
	}
}

var myArgs = process.argv.slice(2);
//Parsing Arguments to see which version to run, needs to be down here to beat a race condition
function parseArgs(input) {
	previousAnimeLoaded = input;
	console.log(previousAnimeLoaded[0]);
	console.log('myArgs:' , myArgs);
	if(myArgs[0] == "check") {
		loadCheckedAnime();
	}
	else {
		loadAllAnime();
	}
	
}

Log.readLoaded(parseArgs);