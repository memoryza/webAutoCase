var fs = require('fs');
console.log(1)
fs.changeWorkingDirectory(phantom.libraryPath);

var har = require('common/createHAR'),
	myUtils = require('../common/utils'),
	assert = require('../lib/assert'),
	config = require('config');
var address = config.baseUrl;
console.log(address.toString())
var caseResArr = ['[caseName] index'];

phantom.injectJs("../lib/jasmine.js");
phantom.injectJs("../lib/jasmine-console.js");
phantom.injectJs("../lib/chai.js");

var isCompelte =  false;

var totalCase = 0, successCase =0 , failCase = 0;
var response = har.initHAR(address, function(data) {
	caseResArr.push('[loadTime]' + data.loadTime);
	// var datxa = data.page.evaluate(function () {
 //        return document.querySelector('._callMe').innerHTML;
 //    });
	if(data.errcode == 0) {
		successCase++;
	} else {
		failCase++;		
	}
});



caseResArr.push(
  	'[totalCase] ' + totalCase,
  	'[successCase] ' + successCase,
    '[failCase] ' + failCase
);

var page = require('webpage').create();
var server =  config.baseUrl + '/app/';
page.open(server, function(status) {
	page.render(myUtils.errorFileDir('index'));
})

exports.caseResArr = caseResArr;

