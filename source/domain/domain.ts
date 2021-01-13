import { nightmareConfig } from '../interfaces/nightmare-interfaces';


class domain {
    url: string = "";
    debugMode: boolean = false;
    getAll: boolean = false;

    constructor(getAll?: boolean, debugMode?: boolean) {
        this.getAll = getAll;
        this.debugMode = debugMode;
    }

    /**
     * 
     * @param nightConfig 
     */
    render(nightConfig: nightmareConfig) {
        return undefined;
    }
}

export default domain;