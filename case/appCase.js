/**
 * @file 个股PC版本监控Case
 * @author memoryza(jincai.wang@foxmail.com)
 * @desc 收集请求回来的har信息
 */
var fs = require('fs');
var $ = require('jquery');
var har = require('../common/createHAR');
var nimble = require('nimble');
var myUtils = require('../common/utils');
/**
 * 测试case情况
 * @param {Object} info {name: case名称, url: 网址, caseList: case列表的数组}
 * @param {Function} cb 回调信息
 * @return callback
 */
exports.testCase = function (info, cb) {
    var caseInfo = info;
    if (myUtils.isType(caseInfo.caseList, 'String')) {
        caseInfo.caseList = [caseInfo.caseList];
    } else if (!myUtils.isType(caseInfo.caseList, 'Array')) {
        caseInfo.caseList = [];
    }
    var successCase = 0, failCase = 0;
    var info = {
        text: [],// 存放错误信息
        errorResource: []// 存放资源错误列表
    };
    var funcData;// har返回的data存放处
    // 不包含case的执行一次请求
    if (!caseInfo.caseList.length) {
        if (caseInfo.url) {
            har.initHAR(caseInfo.url, function (data) {
                if (data.errcode !== 0) {
                    info.text.push('网络请求失败');
                }
                analyseResoures(data.har);
                return cb(caseInfo.name, 0, 0, 0, info);
            });
        } else {
            return cb(caseInfo.name, 0, 0, 0, info);
        }
    }
    // 存放并行执行的case
    var parallel = [];
    var totalCase = caseInfo.caseList.length;
    for (var i = 0; i < totalCase; i++) {
        (function (j) {
            parallel.push(function() {
                funcData.page.evaluate(function(selector) {
                    var flag;
                    try {
                       var anonymousFunc = new Function(selector);
                       flag = anonymousFunc();
                    } catch(e) {
                        flag = false;
                    }
                    return flag;
                }, function(result) {
                    if (result) {
                        successCase++;
                    } else {
                        info.text.push(encodeURIComponent(caseInfo.caseList[j] + '失败'));
                        failCase++;
                    }
                }, caseInfo.caseList[j]);
            });
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
                    // page.evaluate是异步的
                    setTimeout(function() {
                        analyseResoures(data.har);
                        callback();
                    }, 100);
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
                    if (funcData.errcode == -1) {
                        cb(caseInfo.name, totalCase, successCase, failCase, info);
                    } else {
                        snap(funcData.page, cb);
                    }
                }
                // funcData.phantom.exit();
            }
        ]);
    }
    /**
     * 截取屏幕图片
     * @param {webPageObject} page webpage的实例
     * @param {Function} cb 回调函数
     */
    function snap(page, cb) {
        var fn = myUtils.errorFileDir('index');
        myUtils.waitFor(function () {
            setTimeout(function () {
                return true;
            }, 1500);
            return false;
        }, function () {
            page.render(fn);
            page.close();
            info.image = fn.substr(fn.indexOf('/'));
            cb(caseInfo.name, totalCase, successCase, failCase, info);
        });
    }
    /**
     * 分析页面是否包含请求失败资源
     * @param {HAR} har： HTTP Archive Viewer
     */
    function analyseResoures(har) {
        if (har && har.log && myUtils.isType(har.log.entries, 'Array')) {
            var entries = har.log.entries;
            var len = entries.length;
            for (var i = 0; i < len; i++) {
                if (entries[i] && entries[i].response
                    && (entries[i].response.status === 404 || entries[i].response.status === 500)) {
                    info.errorResource.push({url: entries[i].request.url, status: entries[i].response.status});
                }
            }
        }
    }
};

