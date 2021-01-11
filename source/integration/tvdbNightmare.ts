const Nightmare = require('nightmare');

//TODO import { sanitize } from 'sanitize-filename-ts';
import parser from './parser';
import { show, tvdbResponse } from '../interfaces/show';

import * as config from '../config/default.json';
import { nightmareConfig, nightmareError } from '../interfaces/nightmare-interfaces';

class tvdbnightmare extends parser {
	callbackClass?: parser;
	nightmare?: any;

	urlSearchQuery: string = "https://thetvdb.com/search?menu%5Btype%5D=TV&query=";

    constructor(debugMode?: boolean, nightmare?: typeof Nightmare, callbackClass?: parser) {
        super(debugMode, callbackClass);

        const tvdbkey = config.key.find((obj) => {
            return obj.name === "tvdb";
        }).value;

        this.nightmare = nightmare;
    }
    
    public async process(list: string[], getAll: boolean, old: string[], callback: () => void) {
        this.parse(list, getAll, old);

        if(this.titles.length > 0) {
            if(this.debugMode) {
                console.log('Parsing:');
                console.log(this.titles);
            }
            
            this.search(callback);
        } else if(this.debugMode) {
            console.log('No New Anime');
        }

        return false;
    }

    public async getTitle(title: string) {
		if(this.nightmare) {
			return this.nightmare
			.goto(this.urlSearchQuery + encodeURI(title))
			.wait('div#searchbox')
			.wait(1000)
			.evaluate(function() {
				var retval: tvdbResponse | undefined;
				if(document.getElementsByTagName("ol")[0]) {
					retval = {
						id: document.getElementsByClassName("mt-1")[0].getElementsByTagName("small")[0].innerText.split("#")[1],
						seriesName: document.getElementsByClassName("media-heading")[0].getElementsByTagName("a")[0].innerText
					};
                }
                console.log(retval);
				
				return retval;
			})
			.then(async (result: tvdbResponse | undefined) => {

				if(result) {
					if(this.debugMode) {
						console.log('Anime ID: ', result.id);
						console.log('Anime Name:', result.seriesName);
					}
				} else {
					if(this.debugMode) {
						console.log('Nothing Found');
						console.log('Cannot find it so putting in fake info');
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
						console.log('Nothing found?\n Error Response:');
						console.log(error.message);
						console.log('Cannot find it so putting in fake info');
					}
				}
                
                return undefined;
			});
		}
    }
}

export default tvdbnightmare;