import * as Nightmare from 'nightmare';
import domain from './domain';
import * as translation from '../resources/en.json';
import { nightmareConfig } from '../interfaces/nightmare-interfaces';

class erairaws extends domain {
    url = "https://www.erai-raws.info/schedule/";

    constructor(debugMode?: boolean) {
        super(debugMode);
    }

    public render(nightConfig: nightmareConfig) {
		const nightmare = new Nightmare(nightConfig);
        let showList: HTMLCollectionOf<Element> = undefined;
        const showListText: string[] = [];

        return (nightmare
            .viewport(800, 1000)
            .goto(this.url)
            .wait('#main')
            .evaluate(() => {
                showList = document.getElementsByClassName('cccccc');
                var showListText: string[] = [];
        
                for(var i = 0; showList[i]; i++) {
                    showListText.push(showList[i].nextElementSibling.textContent.replace(/[\n\r]+|[\s]{2,}/g, ''));
                }
                return showListText;
            })
            .end());
    }
}

export default erairaws;