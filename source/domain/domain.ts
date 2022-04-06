import { nightmareConfig } from '../interfaces/nightmare-interfaces';


class domain {
    url: string = "";
    debugMode: boolean = false;

    constructor(debugMode?: boolean) {
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