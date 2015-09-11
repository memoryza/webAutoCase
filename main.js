var fs = require('fs');
var caseList = [];
// 读取case列表
try {
    var scanDirectory = function (path) {
        if (fs.exists(path) && fs.isFile(path)) {
            var modIdex = path.lastIndexOf('.js');
            if(modIdex > 0) {
                caseList.push(require(path));
            }
        } else if (fs.isDirectory(path)) {
            fs.list(path).forEach(function (e) {
                if ( e !== "." && e !== ".." ) {    //< Avoid loops
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
    caseList.testCase(caseCallBack);
}
// 统计输出case
var caseNum = 0;
var caseInfo = {
    success: 0,
    fail: 0,
    total: 0,
    caseInfo: []
};
var caseCallBack = function (name, success, fail, total, info) {
    caseNum++;
    if (caseNum === len) {
        phantom.exit();
    } else {
        caseInfo.success += successNum;
        caseInfo.fail += fail;
        caseInfo.total += total;
        caseInfo.push({name: name, success: success, fail: fail, total: total, info: info});
    }
}

