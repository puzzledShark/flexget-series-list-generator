const Nightmare = require('nightmare');
const Log = require('./log.js');

import erairaws from './domain/eraiRaws';
import tvdbParser from './integration/tvdbParser';

import * as config from './config/default.json';

//Honestly.... this is barely useful but I'm too lazy to fix it
var animeID = [];
//Useless?... nvm LOL i use recursion later on, so thats why this was a global, this holds the santized name I use for windows path
var animePathName = [];
//Same as above, but we do a shift() later on which empties newAnime so we have a full copy of it here to use later
var cloneNewAnime = [];
//Matched length with newAnime/cloneNewAnime, honestly just a really lazy implementation
var season = [];
//Tracks titles that have been loaded previously
var previousAnimeLoaded;

let parser: tvdbParser = undefined;
const nightmareConfig = {
	show: false,
	typeInterval: 20,
	x: 100,
	y: 10
};

function loadAllAnime() {
	console.log("Started Flexget Generator");

	var domainGroup: erairaws = new erairaws(true);
	parser = new tvdbParser(true);

	//Setting Values for Nightmare instance, since this run takes in all anime, it does not need to show it to the user for input
	let nightmareInstance = Nightmare(nightmareConfig);
	nightmareInstance = nightmareInstance.viewport(800, 1000);

	domainGroup.render(nightmareInstance, previousAnimeLoaded)
		.then(async (list: string[]) => {
			console.log("Render Callback", list);
			parser.process(list, true, previousAnimeLoaded, pack);
		})
		.catch((error) => {
			console.error('firstLogin failed due to: ', error);
		});
}

function pack() {
	console.log('Packing...');
	flexGetDataPacker();
	console.log(parser.titles);

	Log.writeLoaded(parser.titles);
	console.log('Execution is complete');
}

var loadCheckedAnime = function() {
	console.log("Started Flexget Generator");

	let nightmareInstance = Nightmare({ ...nightmareConfig, waitTimeout: 120000 });
	nightmareInstance = nightmareInstance.viewport(800, 1000);
	const parser = new tvdbParser(true);

	var domainGroup: erairaws = new erairaws(false);
	domainGroup.render(nightmareInstance, previousAnimeLoaded)
		.then((list: string[]) => {
			console.log(list);
			parser.process(list, true, previousAnimeLoaded, 
				() => {
					console.log('Packing...');
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
				});
		})
		.catch((error) => {
			console.error('firstLogin failed due to: ', error);
		});
}

function flexGetDataPacker() {
	const savePath = config.savePath;

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
	if(myArgs[0] === "check") {
		loadCheckedAnime();
	}
	else {
		loadAllAnime();
	}
	
}

Log.readLoaded(parseArgs);