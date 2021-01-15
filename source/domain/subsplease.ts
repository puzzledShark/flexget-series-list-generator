import * as Nightmare from 'nightmare';
import domain from './domain';
import * as translation from '../resources/en.json';
import { nightmareConfig } from '../interfaces/nightmare-interfaces';

class subsplease extends domain {
    url = 'https://subsplease.org/schedule/';

    constructor(debugMode?: boolean) {
        super(debugMode);
    }

    public render(nightConfig: nightmareConfig) {
		const nightmare = new Nightmare(nightConfig);
        let showList: HTMLCollectionOf<Element> = undefined;

        return (nightmare
            .viewport(800, 1000)
            .goto(this.url)
            .wait('#full-schedule-table')
            .wait('.all-schedule-show')
            .evaluate(() => {
                const showListText: string[] = [];
                showList = document.getElementsByClassName('all-schedule-show');
        
                for(var i = 0; showList[i]; i++) {
                    showListText.push(showList[i].firstChild.textContent)
                }
                return showListText;
            })
            .end());
    }
}

export default subsplease;