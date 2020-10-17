import { sanitize } from 'sanitize-filename-ts';
import parser from './parser';
import { show, tvdbResponse } from '../interfaces/show';
import responseError from '../interfaces/response-error';

import * as config from '../config/default.json';

const tvdb = require('node-tvdb');

class tvdbParser implements parser {
    debugMode: boolean = false;
    titles: show[] = [];
    tvdbInstance: typeof tvdb = undefined;
    callbackClass?: parser;

    constructor(debugMode?: boolean, callbackClass?: parser) {
        const tvdbkey = config.key.find((obj) => {
            return obj.name === "tvdb";
        }).value;

        if(debugMode) {
            this.debugMode = true;
        }
        this.tvdbInstance = new tvdb(tvdbkey);
        if(callbackClass)
            this.callbackClass = callbackClass;
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

    /**
     * Basically parses the information for TVDB API
     */
    public parse(list: string[], getAll: boolean, old: string[]) {
        console.log('this.titles');
        console.log(list);

        if(getAll === false) {
            console.log('Duplication Check');

            //Below does a comparison between old searches with the newest search so we only search for new animes
            for(var i = 0; list[i]; i++) {
                const match = old.find((element) => { 
                    if(element == list[i]) {
                        if(this.debugMode)
                            console.log(element + "==" + list[i]);

                        return true;
                    }
                    return false;
                });

                if(match !== undefined) {
                    if(this.debugMode)
                        console.log('OLD');
                } else {
                    if(this.debugMode)
                        console.log('NEW Title: ' + list[i]);

                    this.titles.push({
                        name: list[i],
                        season: 1
                    });
                }
            }
        } else {
            this.titles = list.map((title) => {
                return { name: title, season: 1 };
            });
        }
        
        if(this.debugMode) {
            console.log('New Entries:');
            console.log(this.titles);
        }

        // Season Identifier
        this.titles.forEach((title) => {
            if(/S[0-9]/.test(title.name)) {
                title.name = title.name.substring(0, title.name.length - 3);
                title.season = Number.parseInt(title.name.substr(title.name.length - 1));
            }
        });
        
    }

    public search(callback: () => void) {
        if(this.debugMode) {
            console.log('Current queue:' + this.titles.length);
        }

        Promise.all(this.titles.map((title) => {
            return this.searchTitle(title);
        })).then(() => {
            callback();
        });
    }

    private async searchTitle(title) {
        const result = await this.getTitle(title.name);
        
        if(result) {
            title.pathName = sanitize(result.seriesName);
            title.tvdbResponse = {
                id: result.id,
                seriesName: result.seriesName
            };
        }
    }

    public async getTitle(title: string) {
        return this.tvdbInstance.getSeriesByName(title)
        .then((response: tvdbResponse[]) => {
            const result: tvdbResponse = response[0];

            if(this.debugMode) {
                console.log('Anime ID: ', result.id);
                console.log('Anime Name:', result.seriesName);
            }

            return result;
        })
        .catch(async (error: responseError) => { 
            if(this.debugMode) {
                if(error.response.status === 404) {
                    console.log('Nothing found?\n Error Response:');
                    console.log(error);
                    console.log('Cannot find it so putting in fake info');
                } else if (error.response.status === 504) {
                    console.log("Response 504, so waiting 10 seconds and trying tvdb again");
                    return setTimeout(() => this.getTitle(title), 10000);
                } else {
                    console.log('Stall');
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.statusText);
                }
            }
            
            // Fallback Search (MAL?)
            if(this.callbackClass !== undefined) {
                return await this.callbackClass.getTitle(title);
            } else {
                return undefined;
            }
        });
    }
}

export default tvdbParser;