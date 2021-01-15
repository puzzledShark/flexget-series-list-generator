import erairaws from './domain/eraiRaws';
import * as config from './config/default.json';
import * as translation from './resources/en.json';
import tvdbnightmare from './integration/tvdbnightmare';
import { nightmareConfig } from './interfaces/nightmare-interfaces';
import outputManager from './tools/outputManager';
import { profile } from './interfaces/profile-interface';
import { show } from './interfaces/show';
import domain from './domain/domain';
import subsplease from './domain/subsplease';

const debugMode = true;
const activeProfile: profile = config.profiles[0];
const nightConfig: nightmareConfig = {
	show: false,
	typeInterval: 20,
	x: 100,
	y: 10
};

let commonOutput: outputManager = undefined;
let domainGroup: domain = undefined;
let myArgs = process.argv.slice(2);

const parseArgs = () => {
	console.log(translation.startText);

	commonOutput = new outputManager(activeProfile);
	commonOutput.loadOldOutput((input: show[]) => {
		let oldData = input;

		if(myArgs.findIndex((param) => param === "missingonly") >= 0) {
			const missingOnly = oldData
				.filter((i) => i.response === undefined)
				.map((i) => i.domainName);
			processTitle(missingOnly);
		}
		else {
			if(myArgs.findIndex((param) => param === "erairaws") >= 0) {
				domainGroup = new erairaws(debugMode);
			} else if (myArgs.findIndex((param) => param === "subsplease") >= 0) {
				domainGroup = new subsplease(debugMode);
			}

			if(domainGroup) {
				domainGroup.render(nightConfig)
					.then((list: string[]) => {
						processTitle(list, oldData.map((i) => i.domainName));
					})
					.catch((error: string) => {
						console.error('Domain render failed due to: ', error);
					});
			}
		}
	});
}

const processTitle = async (list: string[], old?: string[]) => {
	if(debugMode)
		console.log("Render Callback: ", list);
		
	const commonParser = new tvdbnightmare(debugMode, nightConfig, undefined, activeProfile.concurrentSearches);
	commonParser.process(list, old, () => {
		if(debugMode)
			console.log('Packing...');	

		commonOutput.saveOldOutput(commonParser.titles);
		commonParser.titles.forEach(show => {
			commonOutput.getAsFlexget(show);
		});

		if(debugMode)
			console.log('Execution is complete');
	});
}
/**
 * Commands:
 * missingonly - loads old data and excludes shows that found an associated tvdb
 */
parseArgs();