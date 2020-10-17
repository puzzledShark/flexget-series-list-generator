"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Nightmare = require('nightmare');
var Log = require('./log.js');
var eraiRaws_1 = require("./domain/eraiRaws");
var tvdbParser_1 = require("./integration/tvdbParser");
var config = require("./config/default.json");
//Honestly.... this is barely useful but I'm too lazy to fix it
var animeID = [];
//Useless?... nvm LOL i use recursion later on, so thats why this was a global, this holds the santized name I use for windows path
var animePathName = [];
//Same as above, but we do a shift() later on which empties newAnime so we have a full copy of it here to use later
var cloneNewAnime = [];
//Matched length with newAnime/cloneNewAnime, honestly just a really lazy implementation
var season = [];
//Tracks titles that have been loaded previously
var previousAnimeLoaded;
var parser = undefined;
var nightmareConfig = {
    show: false,
    typeInterval: 20,
    x: 100,
    y: 10
};
function loadAllAnime() {
    var _this = this;
    console.log("Started Flexget Generator");
    var domainGroup = new eraiRaws_1.default(true);
    parser = new tvdbParser_1.default(true);
    //Setting Values for Nightmare instance, since this run takes in all anime, it does not need to show it to the user for input
    var nightmareInstance = Nightmare(nightmareConfig);
    nightmareInstance = nightmareInstance.viewport(800, 1000);
    domainGroup.render(nightmareInstance, previousAnimeLoaded)
        .then(function (list) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Render Callback", list);
            parser.process(list, true, previousAnimeLoaded, pack);
            return [2 /*return*/];
        });
    }); })
        .catch(function (error) {
        console.error('firstLogin failed due to: ', error);
    });
}
function pack() {
    console.log('Packing...');
    flexGetDataPacker();
    console.log(parser.titles);
    Log.writeLoaded(parser.titles);
    console.log('Execution is complete');
}
var loadCheckedAnime = function () {
    console.log("Started Flexget Generator");
    var nightmareInstance = Nightmare(__assign(__assign({}, nightmareConfig), { waitTimeout: 120000 }));
    nightmareInstance = nightmareInstance.viewport(800, 1000);
    var parser = new tvdbParser_1.default(true);
    var domainGroup = new eraiRaws_1.default(false);
    domainGroup.render(nightmareInstance, previousAnimeLoaded)
        .then(function (list) {
        console.log(list);
        parser.process(list, true, previousAnimeLoaded, function () {
            console.log('Packing...');
            flexGetDataPacker();
            for (var i = 0; cloneNewAnime[i]; i++) {
                if (season[i] != '1') {
                    previousAnimeLoaded.push(cloneNewAnime[i] + ' S' + season[i]);
                }
                else {
                    previousAnimeLoaded.push(cloneNewAnime[i]);
                }
            }
            //Log.initOverrideV2('./', 'loaded.json')
            Log.writeLoaded(previousAnimeLoaded);
            //Log.data('', previousAnimeLoaded);
            //Log.fixData();
            console.log('Execution is complete');
        });
    })
        .catch(function (error) {
        console.error('firstLogin failed due to: ', error);
    });
};
function flexGetDataPacker() {
    var savePath = config.savePath;
    console.log('            path:  ' + savePath + '/Season ');
    console.log('dataPacker');
    console.log(cloneNewAnime);
    Log.initOverrideV2('./', 'ForFlexGet.txt');
    for (var i = 0; cloneNewAnime[i]; i++) {
        if (animeID[i] == 'MISSING') {
            Log.print('>-------------------------WARNING BELOW--------------------<\n');
        }
        Log.print("      - '" + cloneNewAnime[i] + "'");
        if (season[i] != '1') {
            Log.print(' S' + season[i]);
        }
        Log.print(':\n');
        Log.print('          set:\n');
        Log.print('            path:  ' + savePath + '' + animePathName[i] + '/Season ' + season[i]);
        Log.print('\n');
        if (parseInt(season[i]) >= 3) {
            Log.print('          season_packs: yes\n');
            Log.print('          tracking: no\n');
        }
        if (animeID[i] == 'MISSING') {
            Log.print('>-------------------------WARNING ABOVE--------------------<\n');
        }
    }
}
var myArgs = process.argv.slice(2);
//Parsing Arguments to see which version to run, needs to be down here to beat a race condition
function parseArgs(input) {
    previousAnimeLoaded = input;
    if (myArgs[0] === "check") {
        loadCheckedAnime();
    }
    else {
        loadAllAnime();
    }
}
Log.readLoaded(parseArgs);
//# sourceMappingURL=server.js.map