import nightmare from 'nightmare';
import config from '../config/default.json';


class domain {
    url: string = "";
    debugMode: boolean = false;
    getAll: boolean = false;

    public render(nightmare: nightmare) {
        throw new Error("Not Implemented");

        return nightmare;
    }
}

export default domain;