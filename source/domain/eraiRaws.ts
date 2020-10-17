import nightmare from 'nightmare';
import domain from './domain';

import * as config from '../config/default.json';
import * as translation from '../resources/en.json';

class erairaws extends domain {
    constructor(getAll: boolean, debugMode?: boolean) {
        super();
        const domain = config.domain.find((obj) => {
            return obj.name === "EraiRaws";
        });

        if(domain)
            this.url = domain.url;
        
        if(getAll)
            this.getAll = true;
        
        if(debugMode)
            this.debugMode = true;
        
    }

    /**
     * render
     * nightmare: Nightmare     
     * */
    public render(nightmare: nightmare, callback?: any) {
        let showList: HTMLCollectionOf<Element> = undefined;
        const showListText: string[] = [];

        if(this.getAll) {
            return (nightmare
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
                    
                    var button = document.createElement('button');
                    button.type = "button";
                    button.onclick = function() {
                        document.getElementsByClassName('entry-title')[0].id = 'nextStep';
                    }
                    button.innerText = "Press this button when selection is complete";
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

    /**
     * getTitle
     */
    public getTitle() {
        
    }
}

export default erairaws;