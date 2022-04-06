import parser from './parser';
import { show, parserResponse } from '../interfaces/show';
import responseError from '../interfaces/response-error';

import * as config from '../config/default.json';
import { tvdbResponse } from '../interfaces/tvdb-interfaces';

const tvdb = require('node-tvdb');

/**
 * @deprecated Parser class that is set to use tvdb's official API. No longer maintained
 */
class tvdbParser extends parser {
    tvdbInstance: typeof tvdb = undefined;

    constructor(debugMode?: boolean, callbackClass?: parser) {
        super(debugMode, callbackClass);

        const tvdbkey = config.key.find((obj) => {
            return obj.name === "tvdb";
        }).value;

        this.tvdbInstance = new tvdb(tvdbkey);
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
                    return setTimeout(async () => await this.getTitle(title), 10000);
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