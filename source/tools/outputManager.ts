import * as fs from 'fs';
import * as util from 'util';
import { profile } from '../interfaces/profile-interface';
import { show } from '../interfaces/show';

const currentDir = './';
const utf8 = 'utf-8';

class outputManager {
    profile: profile;
    filePath?: string;
    fileName?: string;

    /**
     * Initializes the class
     * @param userProfile 
     * Profile used.
     * @param filePath
     * Path used for flexget 
     * @param fileName 
     * Name 
     */
    constructor(userProfile?: profile, filePath?: string) {
        this.profile = userProfile;
        const fileName = userProfile.appConfig.fileNameOutput;

        if(filePath)
            this.filePath = filePath;
        else
            this.filePath = '.';

        this.loadProfile();

        if(fileName) {
            this.fileName = fileName;
        } else {
            const date = new Date();
            this.fileName = fileName + date.toDateString() + ' ' +  date.getHours() + 'h' + date.getMinutes() + 'm.txt';
        }

        if (this.filePath != currentDir && !fs.existsSync(this.filePath)) {
            fs.mkdirSync(this.filePath, { recursive: true });
        }

        fs.writeFileSync(this.filePath + this.fileName, '', utf8);

    }

    /** @todo Makes adjustments based on the user's machine (windows/linux) */
    private loadProfile() {
        if(!this.filePath.endsWith('/'))
           this.filePath += '/';

        if(!this.profile.flexgetSavePath.endsWith('/'))
            this.profile.flexgetSavePath += '/';
    }

    public getAsFlexget(show: show) {
        if(show.response) {
            const fullTitle = show.domainName + (show.season != 1 ? ' S' + show.season : "'");

            let returnString = "";
            returnString += "      - '" + fullTitle + ":\n";
            returnString += "          set:\n";
            returnString += "            path:  '" + this.profile.flexgetSavePath + show.response.title + '/Season ' + show.season + "'\n";
            
            this.print(returnString);
        }
    }

    /** @todo */
    public print(input: string) {
        const tmp = input.substring(0,input.length);
        console.log(tmp);
        fs.appendFileSync(this.filePath + this.fileName, input);
    }
    
    /** @todo */
    public dataObject(title: string, input: string, spacing: string) {
        fs.appendFileSync(this.filePath, title , utf8);
        fs.appendFileSync(this.filePath, '\n' , utf8);
        fs.appendFileSync(this.filePath, util.inspect(input, { maxArrayLength: Infinity }) , utf8);
        //fs.appendFileSync(filePath, util.inspect(input) , utf8);
        fs.appendFileSync(this.filePath, '\n' , utf8);
        if(spacing) {
            fs.appendFileSync(this.filePath, '\n' , utf8);
        }
    }


    /** @todo */
    public LoadOldOutput(callback) {
        fs.readFile(this.profile.appConfig.oldOutput, utf8, (err, data) => {
            if(err) {
                throw err;
            }
            console.log(JSON.parse(data.toString()))
            callback(JSON.parse(data.toString()))
        })
    }

    /** @todo */
    public SaveOldOutput(input: object) {
        fs.writeFileSync(this.profile.appConfig.oldOutput, JSON.stringify(input));
    }
}

export default outputManager;