
/**
 * @file 向文件写入日志
 * @author memoryza
 */
var fs = require('fs');
fs.changeWorkingDirectory(phantom.libraryPath);
var instance = null;
function WriteFile() {
    this.content = '';
    this.logFile = 'log/info.log';
    this._start();
}
WriteFile.prototype = {
    _start: function (file) {
        this.content += '\n\n===[log]' + this.getDate() + '===\n';
        this.logFile = file || this.logFile;
    },
    write: function (str) {
        this.content += '\n' + str + '\n';
    },
    end: function () {
        this.content += '====END====\n';
        try {
            fs.write(this.logFile, this.content, 'w+');
            fs.close();
        } catch (e) {
            console.log(e);
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
exports.getInstance = function () {
    if (!instance) {
        instance = new WriteFile();
    }
    return instance;
};
