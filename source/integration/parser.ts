import { sanitize } from "sanitize-filename-ts";
import { show, parserResponse } from "../interfaces/show";

class parser {
    debugMode: boolean = false;
    titles: show[] = [];
    callbackClass?: parser;
	concurrentNightmares: number;

    constructor(debugMode?: boolean, callbackClass?: parser, concurrentSearches: number = 5) {
        this.debugMode = debugMode;
        this.callbackClass = callbackClass;
		this.concurrentNightmares = concurrentSearches;
    }

    /**
     * Appends provided names into titles of type "show"
     * @param list 
     * List of all show titles to be parsed
     * @param old 
     * List previously parsed titles. If provided, will be used to exclude titles from the new list
     */
    parse(list: string[], old?: string[]) {
        if(old) {
            console.log('Duplication Check');

            if(old) {
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
                            domainName: list[i],
                            season: 1
                        });
                    }
                }
            }
        } else {
            this.titles = list.map((title) => {
                return { domainName: title, season: 1 };
            });
        }
        
        if(this.debugMode) {
            console.log('New Entries:');
            console.log(this.titles);
        }

        // TODO - Season identifier is best done within the specific domain
        // Season Identifier
        this.titles.forEach((title) => {
            if(/S[0-9]/.test(title.domainName)) {
                title.season = Number.parseInt(title.domainName.substr(title.domainName.length - 1));
                title.domainName = title.domainName.substring(0, title.domainName.length - 3);
            }
        });
        
    }

    /**
     * @override Converts the domain title into a consistent parser-based title. 
     * @param title 
     * Title to be converted
     * @returns A parserResponse object with id and title
     */
    async getTitle(title: string) {
        const result: parserResponse = {
            id: undefined,
            title
        };

        return result;
    }

    /**
     * Processes all titles.
     * @param list 
     * List of titles to process
     * @param old 
     * Old titles to exclude
     * @param callback 
     * Function to call once all searches are completed
     */
    async process(list: string[], old?: string[], callback?: () => void) {
        this.parse(list, old);

        if(this.titles.length > 0) {
            if(this.debugMode) {
                console.log('Parsing:');
                console.log(this.titles);
            }

            const requests = this.titles.map((title) => {
                return () => this.searchTitle(title);
            });

            while (requests.length) {
                await Promise.all(requests.splice(0, this.concurrentNightmares).map(f => f()) )
            }
            
            Promise.all(this.titles.map((title) => {
                return this.searchTitle(title);
            })).then(callback);
        } else if(this.debugMode) {
            console.log('No New Anime');
        }

        return false;
    }

    /**
     * Wrapper for the overriden getTitle. Updates the provided show object with the response
     * @param title 
     * Current title to process
     */
    private async searchTitle(title: show) {
        const result = await this.getTitle(title.domainName);
        
        if(result) {
            title.pathName = sanitize(result.title).replace("'", "").replace(":", "");
            title.response = {
                id: result.id,
                title: result.title
            };
        }
    }
}

export default parser;