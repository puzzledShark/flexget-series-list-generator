"use strict";
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
var sanitize_filename_ts_1 = require("sanitize-filename-ts");
var config = require("../config/default.json");
var tvdb = require('node-tvdb');
var tvdbParser = /** @class */ (function () {
    function tvdbParser(debugMode, callbackClass) {
        this.debugMode = false;
        this.titles = [];
        this.tvdbInstance = undefined;
        var tvdbkey = config.key.find(function (obj) {
            return obj.name === "tvdb";
        }).value;
        if (debugMode) {
            this.debugMode = true;
        }
        this.tvdbInstance = new tvdb(tvdbkey);
        if (callbackClass)
            this.callbackClass = callbackClass;
    }
    tvdbParser.prototype.process = function (list, getAll, old, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.parse(list, getAll, old);
                if (this.titles.length > 0) {
                    if (this.debugMode) {
                        console.log('Parsing:');
                        console.log(this.titles);
                    }
                    this.search(callback);
                }
                else if (this.debugMode) {
                    console.log('No New Anime');
                }
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Basically parses the information for TVDB API
     */
    tvdbParser.prototype.parse = function (list, getAll, old) {
        var _this = this;
        console.log('this.titles');
        console.log(list);
        if (getAll === false) {
            console.log('Duplication Check');
            //Below does a comparison between old searches with the newest search so we only search for new animes
            for (var i = 0; list[i]; i++) {
                var match = old.find(function (element) {
                    if (element == list[i]) {
                        if (_this.debugMode)
                            console.log(element + "==" + list[i]);
                        return true;
                    }
                    return false;
                });
                if (match !== undefined) {
                    if (this.debugMode)
                        console.log('OLD');
                }
                else {
                    if (this.debugMode)
                        console.log('NEW Title: ' + list[i]);
                    this.titles.push({
                        name: list[i],
                        season: 1
                    });
                }
            }
        }
        else {
            this.titles = list.map(function (title) {
                return { name: title, season: 1 };
            });
        }
        if (this.debugMode) {
            console.log('New Entries:');
            console.log(this.titles);
        }
        // Season Identifier
        this.titles.forEach(function (title) {
            if (/S[0-9]/.test(title.name)) {
                title.name = title.name.substring(0, title.name.length - 3);
                title.season = Number.parseInt(title.name.substr(title.name.length - 1));
            }
        });
    };
    tvdbParser.prototype.search = function (callback) {
        var _this = this;
        if (this.debugMode) {
            console.log('Current queue:' + this.titles.length);
        }
        Promise.all(this.titles.map(function (title) {
            return _this.searchTitle(title);
        })).then(function () {
            callback();
        });
    };
    tvdbParser.prototype.searchTitle = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTitle(title.name)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            title.pathName = sanitize_filename_ts_1.sanitize(result.seriesName);
                            title.tvdbResponse = {
                                id: result.id,
                                seriesName: result.seriesName
                            };
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    tvdbParser.prototype.getTitle = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tvdbInstance.getSeriesByName(title)
                        .then(function (response) {
                        var result = response[0];
                        if (_this.debugMode) {
                            console.log('Anime ID: ', result.id);
                            console.log('Anime Name:', result.seriesName);
                        }
                        return result;
                    })
                        .catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.debugMode) {
                                        if (error.response.status === 404) {
                                            console.log('Nothing found?\n Error Response:');
                                            console.log(error);
                                            console.log('Cannot find it so putting in fake info');
                                        }
                                        else if (error.response.status === 504) {
                                            console.log("Response 504, so waiting 10 seconds and trying tvdb again");
                                            return [2 /*return*/, setTimeout(function () { return _this.getTitle(title); }, 10000)];
                                        }
                                        else {
                                            console.log('Stall');
                                            console.log(error.response);
                                            console.log(error.response.status);
                                            console.log(error.response.statusText);
                                        }
                                    }
                                    if (!(this.callbackClass !== undefined)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.callbackClass.getTitle(title)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2: return [2 /*return*/, undefined];
                            }
                        });
                    }); })];
            });
        });
    };
    return tvdbParser;
}());
exports.default = tvdbParser;
//# sourceMappingURL=tvdbParser.js.map