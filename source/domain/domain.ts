import nightmare from 'nightmare';
import config from '../config/default.json';


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
     * @param nightmare 
     */
    render(nightmare: nightmare) {
        return nightmare;
    }
}

export default domain;