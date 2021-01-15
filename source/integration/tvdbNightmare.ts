const Nightmare = require('nightmare');

import parser from './parser';
import { parserResponse } from '../interfaces/show';

import { nightmareConfig, nightmareError } from '../interfaces/nightmare-interfaces';

class tvdbnightmare extends parser {
	callbackClass?: parser;
	nightmareConfig?: nightmareConfig;
	concurrentNightmares: number;

	url: string = "https://thetvdb.com/search?menu%5Btype%5D=TV&query=";

    constructor(debugMode?: boolean, nightConfig?: nightmareConfig, callbackClass?: parser, concurrentSearches: number = 5) {
        super(debugMode, callbackClass);
	
		this.nightmareConfig = nightConfig;
    }
    
    public async getTitle(title: string) {
		if(this.nightmareConfig) {
			const nightmare = Nightmare(this.nightmareConfig);
			const searchurl = this.url + encodeURI(title);

			return nightmare
			.viewport(800, 1000)
			.goto(searchurl)
			.wait('div#searchbox')
			.wait(1000)
			.evaluate(function() {
				if(document.getElementsByTagName("ol")[0]) {
					return {
						id: document.getElementsByClassName("mt-1")[0].getElementsByTagName("small")[0].innerText.split("#")[1],
						title: document.getElementsByClassName("media-heading")[0].getElementsByTagName("a")[0].innerText
					};
                }
				return undefined;
			})
			.end()
			.then(async (result?: parserResponse) => {

				if(result) {
					if(this.debugMode) {
						console.log('[#' + result.id + ']	' + result.title);
					}
				} else {
					if(this.debugMode) {
						console.log('[#------]	' + title);
					}

					// Fallback Search (MAL?)
					if(this.callbackClass !== undefined)
						return await this.callbackClass.getTitle(title);
				}
	
				return result;
			})
			.catch((error: nightmareError) => { 
				if(this.debugMode) {
					if(error) {
						if(this.debugMode) {
							console.log('[#ERROR]	' + title + error.message);
							console.log('Attempted URL: ' + searchurl);
						}
					}
				}
                
                return undefined;
			});
		}
		
		return undefined;
    }
}

export default tvdbnightmare;