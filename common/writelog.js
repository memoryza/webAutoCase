
/**
 * @file 向文件写入日志
 * @author memoryza
 */
var fs = require('fs');
var instance = null;
function WriteFile() {
    this.content = '';
    this.logFile = 'result/log/log.txt';
    this._start();
}
WriteFile.prototype = {
    _start: function (file) {
        this.content += '\n\n===' + this.getDate() + '===\n';
        this.logFile = file || this.logFile;
    },
    write: function (str) {
        if (typeof str === 'object') {
            str = JSON.stringify(str);
        }
        this.content += '\n' + str + '\n';
    },
    end: function () {
        this.content += '====END====\n';
        try {
            fs.appendFileSync(this.logFile, this.content);
        } catch (e) {
            console.log('WriteLog module write fail:' + e);
        }
    },
    getDate: function () {
        var d = new Date(),
            year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hour = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    }
};
module.exports = new WriteFile();
