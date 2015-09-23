/**
 * @file 监控服务器状态
 * @author memoryza
 */
var mysql = require('./mysql');
var os = require('os');
module.exports = function (cb) {
     /**
     * 补全 XX
     * @param {Integer} n 数值
     * @return {Integer} 返回值
     */
    function pad(n) {
        return n > 9 ? n : '0' + n;
    }
    function getDate() {
        var d = new Date();
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' '
            + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    var address = os.getNetworkInterfaces();
    var info = {
        platform: os.platform(),
        osVersion: os.release(),
        osArch: os.arch(),
        osUser: os.hostname().split('.')[0],
        cpus: os.cpus().length,
        freemem: (os.freemem() / Math.pow(2, 20)).toFixed(1) + 'M',
        totalmem:  os.totalmem() / Math.pow(2, 20) + 'M',
        address: address['en0'][1]['address'],
        time: getDate()
    };
    mysql.ping(function () {
        info['mysqlping'] = 'ping通';
        cb(info);
    }, function () {
        info['mysqlping'] = 'ping不通';
        cb(info);
    });
};