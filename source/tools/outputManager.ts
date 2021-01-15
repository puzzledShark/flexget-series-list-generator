import * as fs from 'fs';
import * as path from 'path';
import { profile } from '../interfaces/profile-interface';
import { show } from '../interfaces/show';

const utf8 = 'utf-8';

class outputManager {
    profile: profile;

    /**
     * Initializes the class
     * @param userProfile 
     * Profile used for save paths 
     */
    constructor(userProfile?: profile) {
        this.profile = userProfile;

        this.loadProfile();

        const folderStr = path.dirname(this.profile.appConfig.fileNameOutput);
        if (!fs.existsSync(folderStr)) {
            fs.mkdirSync(folderStr, { recursive: true });
        }

        fs.writeFileSync(this.profile.appConfig.fileNameOutput, '', utf8);
    }

    /** Makes adjustments based on the user's machine (windows/linux) */
    private loadProfile() {
        if(!this.profile.flexgetSavePath.endsWith('/'))
            this.profile.flexgetSavePath += '/';
    }

    public getAsFlexget(show: show) {
        if(show.response) {
            const fullTitle = show.domainName + (show.season != 1 ? ' S' + show.season : "") + "'";

            let returnString = "";
            returnString += this.profile.flexgetTab + "- '" + fullTitle + ":\n";
            returnString += this.profile.flexgetTab + "    set:\n";
            returnString += this.profile.flexgetTab + "      path:  '" + this.profile.flexgetSavePath + show.pathName + '/Season ' + show.season + "'\n";
            
            this.print(returnString);
        }
    }

    /** @todo */
    public print(input: string) {
        const tmp = input.substring(0,input.length);
        console.log(tmp);
        fs.appendFileSync(this.profile.appConfig.fileNameOutput, input);
    }

    /** @todo */
    public loadOldOutput(callback: (JSONObject: show[]) => void) {
        fs.readFile(this.profile.appConfig.oldOutput, utf8, (err, data) => {
            if(err) {
                throw err;
            }
            console.log(JSON.parse(data.toString()))
            callback(JSON.parse(data.toString()))
        })
    }

    /** @todo */
    public saveOldOutput(input: object) {
        fs.writeFileSync(this.profile.appConfig.oldOutput, JSON.stringify(input));
    }
}

export default outputManager;