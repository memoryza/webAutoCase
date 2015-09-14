/**
 * @file 个股PC版本监控Case
 * @author memoryza(jincai.wang@foxmail.com)
 */

var fs = require('fs');
fs.changeWorkingDirectory(phantom.libraryPath);

var $ = require('jquery');
var har = require('../common/createHAR');
var nimble = require('nimble');
var myUtils = require('../common/utils');
// var assert = require('../lib/assert');

/**
 * 测试case情况
 * @param {Object} info {name: case名称, url: 网址, caseList: case列表的数组}
 * @param cb 回调信息
 */
exports.testCase = function (info, cb) {
	var caseInfo = info;
	if (typeof caseInfo.caseList === 'string') {
		caseInfo.caseList = [caseInfo.caseList];
	} else if(Object.prototype.toString.call(caseInfo.caseList) !== "[object Array]") {
		 caseInfo.caseList = [];
	}
	function snap(page, cb) {
		var fn = myUtils.errorFileDir('index');
	    myUtils.waitFor(function () {
	        setTimeout(function () {
	            return true;
	        }, 2500);
	        return false;
	    }, function () {
	        page.render(fn);
	        page.close();
	        info.image = fn.substr(fn.indexOf('/'));
	        cb(name, totalCase, successCase, failCase, info);
	    });
	}
	var name = ['[caseName] 个股PC版本监控Case'];
	var totalCase = 0, successCase = 0, failCase = 0;
	var info = {
		text: []
	};
	var funcData;
	var parallel = [];
	var totalCase = caseInfo.caseList.length;

	for (var i = 0; i < totalCase; i++) {
		(function (j){
			parallel.push(function() {
				var ret = funcData.page.evaluate('function () {' + 
					'return eval('+ caseInfo.caseList[j] +');}');
				if (ret) {
					successCase++;
				} else {
					info.text.push(encodeURIComponent(caseInfo.caseList[j] + '失败'));
					failCase++;
				}
			})
		})(i);
	}
	if (caseInfo.url && caseInfo.caseList.length) {
		nimble.series([
		    function (callback) {
		        har.initHAR(caseInfo.url, function (data) {
		            funcData = data;
		            if (data.errcode === 0) {
		            	nimble.parallel(parallel);
		            } else {
		            	info.text.push('网络请求失败');
		            	failCase = totalCase;
		            }
		            callback();
		        });
		    },
		    function () {
		    	info.text.push(funcData.msg);
		        if(funcData.errcode === 0) {
		            if (failCase) {
		            	snap(funcData.page, cb);
		            } else {
		            	cb(caseInfo.name, totalCase, successCase, failCase, info);
		            }
		        } else {
		           snap(funcData.page, cb);
		        }
			}
		]);
	}
   
};

