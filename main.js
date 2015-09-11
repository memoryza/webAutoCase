var fs = require('fs');
fs.changeWorkingDirectory(phantom.libraryPath);
var myUtil = require('./common/utils');

// 统计输出case
var caseNum = 0;
var res = {
    success: 0,
    fail: 0,
    total: 0,
    caseInfo: []
};
var caseCallBack = function (name, total, success, fail, info) {
    res.success += success;
    res.fail += fail;
    res.total += total;
    res.caseInfo.push({name: name, success: success, fail: fail, total: total, info: info});
    caseNum++;
    if (caseNum === len) {
        myUtil.writeJson(res);
        phantom.exit();
    }
}


var caseList = [];
// 读取case列表
try {
    var scanDirectory = function (path) {
        if (fs.exists(path) && fs.isFile(path)) {
            var modIdex = path.lastIndexOf('Case.js');
            if(modIdex > 0) {
                caseList.push(require(path));
            }
        } else if (fs.isDirectory(path)) {
            fs.list(path).forEach(function (e) {
                if ( e !== "." && e !== ".." ) {
                    scanDirectory(path + '/' + e);
                }
            });
        }
    };
    scanDirectory('./case');
} catch(e) {
    phantom.exit(1);
}
// 执行case
var len = caseList.length;
for (var i = 0; i < len; i++) {
    caseList[i].testCase(caseCallBack);
}


