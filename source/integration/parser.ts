import { tvdbResponse } from "../interfaces/show";

class parser {
    debugMode: boolean = false;

    constructor(debugMode?: boolean) {
        this.debugMode = debugMode;
    }
    
    parse(list: string[], getAll: boolean, old: string[]) {
        throw "Not Implemented";
    }

    async getTitle(title: string) {
        const result: tvdbResponse = {
            id: undefined,
            seriesName: title
        };

        return result;
    }
}

export default parser;