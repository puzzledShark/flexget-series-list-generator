import * as Nightmare from 'nightmare';
import domain from './domain';

import * as translation from '../resources/en.json';
import { nightmareConfig } from '../interfaces/nightmare-interfaces';

class erairaws extends domain {
    url = "https://www.erai-raws.info/schedule/";

    constructor(getAll?: boolean, debugMode?: boolean) {
        super(getAll, debugMode);
    }

    public render(nightConfig: nightmareConfig) {
        if(!this.getAll)
            nightConfig.show = true;

		const nightmare = new Nightmare(nightConfig);
        let showList: HTMLCollectionOf<Element> = undefined;
        const showListText: string[] = [];

        if(this.getAll) {
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
                }));
        } else {
            return (nightmare
                .viewport(800, 1000)
                .goto(this.url)
                .wait('#main')
                .evaluate(() => {
                    showList = document.getElementsByClassName('cccccc');

                    const tmp = document.createElement('input');
                    tmp.type = 'checkbox';
                    tmp.value = 'test';
                    tmp.className = "checkboxVal";

                    for(var i = 0; showList[i] !== undefined; i++) {
                        document.getElementsByClassName('cccccc')[i].prepend(tmp);
                    }
                    
                    const button = document.createElement('button');
                    button.type = "button";
                    button.onclick = function() {
                        document.getElementsByClassName('entry-title')[0].id = 'nextStep';
                    }
                    button.innerText = translation.buttonSelectionText;
                    document.getElementsByClassName('entry-title')[0].append(button);
                })
                .wait('#nextStep')
                .evaluate(() => {
                    showList = document.getElementsByClassName('cccccc');
                    const showListChecked = document.getElementsByClassName("checkboxVal");

                    for(var i = 0; showList[i]; i++) {
                        if(showListChecked[i]["checked"] === true) {
                            showListText.push(showList[i].nextElementSibling.textContent.replace(/[\n\r]+|[\s]{2,}/g, ''));
                        }
                    }
                    return showListText;
                }));
        }
    }
}

export default erairaws;