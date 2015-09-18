/**
 * @file 程序主入口
 * @author memoryza(jincai.wang@foxmail.com)
 * @desc 读取case执行程序，并自动调用testcase，最后收集信息
 */
var startTime = +new Date();
var fs = require('fs');
var myUtil = require('./common/utils');
var cases = require('./casemain');
var appCase = require('./case/appCase');
// 统计输出case
var caseNum = 0;
var res = {
    success: 0,
    fail: 0,
    total: 0,
    caseInfo: []
};
var len = cases.length;
/**
 * case跑完的回调
 * @param {String} name case的名字
 * @param {Integer} total case总数
 * @param {Integer} success case成功数
 * @param {Integer} fail case失败数
 * @param {Object} info = {text:case错误信息存放, errorResource: 错误资源请求}
 */
var caseCallBack = function (name, total, success, fail, info) {
    res.success += success;
    res.fail += fail;
    res.total += total;
    res.caseInfo.push({name: name, success: success, fail: fail, total: total, info: info});
    caseNum++;
    if (caseNum === len) {
        console.log('耗时:' + (new Date() - startTime) + 'ms');
        if (res.fail) {
            var timestamp = myUtil.getDateString();
            myUtil.writeJson(res, timestamp);
            myUtil.sendWariningEmail(timestamp);
        }
        setTimeout(function() {
            process.exit();
        }, 1000);
    }
};

// 执行case
for (var i = 0; i < len; i++) {
    (function (j) {
        appCase.testCase(cases[j], caseCallBack);
    })(i);
}


