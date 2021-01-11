import Nightmare from "nightmare";
import { sanitize } from "sanitize-filename-ts";
import { show, tvdbResponse } from "../interfaces/show";

class parser {
    debugMode: boolean = false;
    titles: show[] = [];
    callbackClass?: parser;

    constructor(debugMode?: boolean, callbackClass?: parser) {
        this.debugMode = debugMode;
        this.callbackClass = callbackClass;
    }

    //** Appends provided names into titles of type "show"  */
    parse(list: string[], getAll: boolean, old: string[]) {
        if(getAll === false) {
            console.log('Duplication Check');

            // Below does a comparison between old searches with the newest search so we only search for new animes
            for(var i = 0; list[i]; i++) {
                const match = old.find((element) => { 
                    if(element == list[i]) {
                        if(this.debugMode)
                            console.log("Found: " + element + "==" + list[i]);

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

    async getTitle(title: string) {
        const result: tvdbResponse = {
            id: undefined,
            seriesName: title
        };

        return result;
    }

    async process(list: string[], getAll: boolean, old: string[], callback: () => void) {
        throw "Not Implemented";

        return false;
    }    
    
    search(callback: () => void) {
        if(this.debugMode) {
            console.log('Current queue:' + this.titles.length);
        }

        Promise.all(this.titles.map((title) => {
            return this.searchTitle(title);
        })).then(() => {
            callback();
        });
    }

    async searchTitle(title) {
        const result = await this.getTitle(title.name);
        
        if(result) {
            title.pathName = sanitize(result.seriesName);
            title.tvdbResponse = {
                id: result.id,
                seriesName: result.seriesName
            };
        }
    }
}

export default parser;