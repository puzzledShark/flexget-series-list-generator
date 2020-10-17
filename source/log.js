var fs = require('fs');
var util = require('util');

var filePath;

function init(filepath) {
	filePath = filepath;
}

function initBasic(filepath) {
	var date = new Date;
	var formattedTodayDateFile =  date.toDateString() + ' ' +  date.getHours() + 'h' + date.getMinutes() + 'm';
	filePath = filepath + formattedTodayDateFile + '.txt';
}

function initBasicV2(filepath, filename) {
	if (!fs.existsSync(filepath)){
		fs.mkdirSync(filepath);
	}
	var date = new Date;
	var formattedTodayDateFile = date.toDateString() + ' ' +  date.getHours() + 'h' + date.getMinutes() + 'm';
	filePath = filepath + '/' + filename + formattedTodayDateFile + '.txt';
}

function initOverride(filepath) {
	filePath = filepath;
	fs.writeFileSync(filePath, '', 'utf-8');
	//fs.writeFile(filePath, '', 'utf-8');
}
function initOverrideV2(filepath, filename) {
	if (!fs.existsSync(filepath)){
		fs.mkdirSync(filepath);
	}
	filePath = filepath + '/' + filename;
	fs.writeFileSync(filePath, '', 'utf-8');
	//fs.writeFile(filePath, '', 'utf-8');
}

function statement(input, spacing) {
	fs.appendFileSync(filePath, input , 'utf-8');
	fs.appendFileSync(filePath, '\n' , 'utf-8');
	if(spacing) {
		fs.appendFileSync(filePath, '\n' , 'utf-8');
	}
}

function print(input) {
	//SocketsManager.consolelog(input);
	var tmp = input.substring(0,input.length);
	console.log(tmp);
	fs.appendFileSync(filePath, input , 'utf-8');
}

function dataObject(title, input, spacing) {
	fs.appendFileSync(filePath, title , 'utf-8');
	fs.appendFileSync(filePath, '\n' , 'utf-8');
	fs.appendFileSync(filePath, util.inspect(input, {maxArrayLength: Infinity}) , 'utf-8');
	//fs.appendFileSync(filePath, util.inspect(input) , 'utf-8');
	fs.appendFileSync(filePath, '\n' , 'utf-8');
	if(spacing) {
		fs.appendFileSync(filePath, '\n' , 'utf-8');
	}
}

function readLoaded(callback) {
	fs.readFile('./loaded.json', 'utf-8', (err, data) => {
		if(err) {
			throw err;
		}
		console.log(JSON.parse(data.toString()))
		callback(JSON.parse(data.toString()))
	})
}

function writeLoaded(input) {
	input = JSON.stringify(input);
	fs.writeFileSync('./loaded.json', input, (err) => {
		if (err) {
			throw err;
		}
	})
}

//Depreciated
function fixDataObject() {
	fs.readFile('./loaded.json', 'utf8', function (err,data) {
		if (err) {
		  return console.log(err);
		}
		//var result = data.replace(/'/g, '"');
		var result = JSON.stringify(data);
		/*
		fs.writeFile('./loaded.json', result, 'utf8', function (err) {
		   if (err) return console.log(err);
		});
		*/
		fs.writeFile('./loaded.json', result, (err) => {
			if (err) {
				throw err;
			}
		})
	  });
}


exports.init = init;
exports.statement = statement;
exports.initOverride = initOverride;
exports.initOverrideV2 = initOverrideV2;
exports.print = print;
exports.data = dataObject;
exports.fixData = fixDataObject;
exports.initBasic = initBasic;
exports.initBasicV2 = initBasicV2;
exports.readLoaded = readLoaded;
exports.writeLoaded = writeLoaded;