const Nightmare = require('nightmare');

import erairaws from './domain/eraiRaws';
import tvdbParser from './integration/tvdbParser';

import * as config from './config/default.json';
import tvdbnightmare from './integration/tvdbnightmare';
import parser from './integration/parser';
import { nightmareConfig } from './interfaces/nightmare-interfaces';
import outputManager from './tools/outputManager';
import { profile } from './interfaces/profile-interface';

let commonParser: parser = undefined;
let commonOutput: outputManager = undefined;

const activeProfile: profile = config.profiles[0];
const nightConfig: nightmareConfig = {
	show: false,
	typeInterval: 20,
	x: 100,
	y: 10
};

var myArgs = process.argv.slice(2);
function parseArgs() {
	const debugMode = true;
	console.log("Started Flexget Generator");

	commonOutput = new outputManager(activeProfile, undefined);
		
	commonOutput.LoadOldOutput((input: any) => {
		if(myArgs[0] !== "check")
			input = undefined;
		
		var domainGroup: erairaws = new erairaws(true, debugMode);

		let nightmareDomain = Nightmare(nightConfig);
		commonParser = new tvdbnightmare(debugMode, nightConfig);

		domainGroup.render(nightmareDomain)
			.then(async (list: string[]) => {
				if(debugMode)
					console.log("Render Callback: ", list);
					
				commonParser.process(list, input, () => {
					console.log('Packing...');					
					commonOutput.SaveOldOutput(commonParser.titles);
					commonParser.titles.forEach(show => {
						commonOutput.getAsFlexget(show);
					});
					console.log('Execution is complete');
				});
			})
			.catch((error: string) => {
				console.error('Domain render failed due to: ', error);
			});
	});
}

parseArgs();