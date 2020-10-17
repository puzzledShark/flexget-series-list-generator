"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var domain_1 = require("./domain");
var config = require("../config/default.json");
var erairaws = /** @class */ (function (_super) {
    __extends(erairaws, _super);
    function erairaws(getAll, debugMode) {
        var _this = _super.call(this) || this;
        var domain = config.domain.find(function (obj) {
            return obj.name === "EraiRaws";
        });
        if (domain)
            _this.url = domain.url;
        if (getAll)
            _this.getAll = true;
        if (debugMode)
            _this.debugMode = true;
        return _this;
    }
    /**
     * render
     * nightmare: Nightmare
     * */
    erairaws.prototype.render = function (nightmare, callback) {
        var showList = undefined;
        var showListText = [];
        if (this.getAll) {
            return (nightmare
                .goto(this.url)
                .wait('#main')
                .evaluate(function () {
                showList = document.getElementsByClassName('cccccc');
                var showListText = [];
                for (var i = 0; showList[i]; i++) {
                    showListText.push(showList[i].nextElementSibling.textContent.replace(/[\n\r]+|[\s]{2,}/g, ''));
                }
                return showListText;
            }));
        }
        else {
            return (nightmare
                .goto(this.url)
                .wait('#main')
                .evaluate(function () {
                showList = document.getElementsByClassName('cccccc');
                var tmp = document.createElement('input');
                tmp.type = 'checkbox';
                tmp.value = 'test';
                tmp.className = "checkboxVal";
                for (var i = 0; showList[i] !== undefined; i++) {
                    document.getElementsByClassName('cccccc')[i].prepend(tmp);
                }
                var button = document.createElement('button');
                button.type = "button";
                button.onclick = function () {
                    document.getElementsByClassName('entry-title')[0].id = 'nextStep';
                };
                button.innerText = "Press this button when selection is complete";
                document.getElementsByClassName('entry-title')[0].append(button);
            })
                .wait('#nextStep')
                .evaluate(function () {
                showList = document.getElementsByClassName('cccccc');
                var showListChecked = document.getElementsByClassName("checkboxVal");
                for (var i = 0; showList[i]; i++) {
                    if (showListChecked[i]["checked"] === true) {
                        showListText.push(showList[i].nextElementSibling.textContent.replace(/[\n\r]+|[\s]{2,}/g, ''));
                    }
                }
                return showListText;
            }));
        }
    };
    /**
     * getTitle
     */
    erairaws.prototype.getTitle = function () {
    };
    return erairaws;
}(domain_1.default));
exports.default = erairaws;
//# sourceMappingURL=eraiRaws.js.map