var fs = require('fs');
fs.changeWorkingDirectory(phantom.libraryPath);

var $ = require('jquery');
var har = require('../common/createHAR');
var nimble = require('nimble');
var myUtils = require('../common/utils');
var assert = require('../lib/assert');
var config = require('../config');

var name = ['[caseName] 官网'];
var totalCase = 2, successCase = 0, failCase = 0;
var info = {};

// phantom.injectJs("../lib/jasmine.js");
// phantom.injectJs("../lib/chai.js");

exports.testCase = function (cb) {
    var server =  config.baseUrl;
    var funcData;
    nimble.series([
	    function (callback) {
	        har.initHAR(server, function (data) {
	            funcData = data;
	            nimble.parallel([
	            	function() {
	            		data.errcode === 0 ? successCase++ : failCase++;
	            	}, function () {
	            		var QRCode = data.errcode === 0 ? data.page.evaluate(function () {
	            			return $('.erweima-icon').width() === 126 && $('.erweima-icon').height() === 126;
	            		}) : false;
			            QRCode ? successCase++ : failCase++;
	            	}
	            ])
	            callback();
	        });
	    },
	    function () {
	        if(funcData.errcode === 0) {
	            cb(name, totalCase, successCase, failCase, {text: funcData.msg});
	        } else {
	            var fn = myUtils.errorFileDir('index');
	            myUtils.waitFor(function () {
	                setTimeout(function () {
	                    return true;
	                }, 2500);
	                return false;
	            }, function () {
	                funcData.page.render(fn);
	                funcData.page.close();
	                cb(name, totalCase, successCase, failCase, {text: funcData.msg, image: fn.substr(fn.indexOf('/'))});
	            });
	        }
	}]);
};

