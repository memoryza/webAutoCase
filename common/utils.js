/**
 * @file 工具类
 * @author memoryza(jincai.wang@foxmail.com)
 */
var fs = require('fs');
var utils = {
    /**
     * 获取时间
     * @return YYYY_MM_DD_HH_MM_SS_TTTT
     */
    getDateString: function () {
        var d = new Date();
        var dates = [];
        dates.push(d.getFullYear());
        dates.push(this.pad(d.getMonth() + 1));
        dates.push(this.pad(d.getDate()));
        dates.push(this.pad(d.getHours()));
        dates.push(this.pad(d.getMinutes()));
        dates.push(this.pad(d.getSeconds()));
        dates.push(this.ms(d.getUTCMilliseconds()));
        return dates.join('_');
    },
    /**
     * 补全 XX
     * @param {Integer} n 数值
     * @return {Integer} 返回值
     */
    pad: function (n) {
        return n > 9 ? n : '0' + n;
    },
    /**
     * 补全 XXXX
     * @param {Integer} n 数值
     * @return {Integer} 返回值
     */
    ms: function (n) {
        return n < 10 ? '00' + n : n < 1000 ? '0' + n : n;
    },
    /**
     * 获取文件名
     * @param {String} caseName 文件夹名称
     * @return {String} {Integer} 文件名
     */
    errorFileDir: function (caseName) {
        return 'result/error/' + caseName + '/' + this.getDateString() + '.png';
    },
    /**
     * @param {Function} conditionFunc 检测准备就绪条件
     * @param {Function} readyFunc 就绪执行函数
     * @param {Integer} timeout 超时时间
     */
    waitFor: function (conditionFunc, readyFunc, timeout) {
        timeout = timeout || 5000;
        var start = +new Date().getTime();
        var condition = false;
        var interval = setInterval(function () {
            if (!condition && (new Date() - start < timeout)) {
                condition = (typeof (conditionFunc) === 'string' ? eval(conditionFunc) : conditionFunc());
            } else {
                if (!condition) {
                    readyFunc({timeout: true});
                } else {
                    readyFunc({});
                }
                clearInterval(interval);
            }
        }, 250);
    },
    /**
     * 输出json数据
     * @param {JSON}  json 数据
     * @param {String} path 路径
     */
    writeJson: function (json, path) {
        path = path || 'result/res.json';
        try {
            fs.write(path, (typeof json === 'string' ? json : JSON.stringify(json)), 'w');
        } catch (e) {
            console.log(e);
        }
    },
    /**
     * 判断数据是否为某类型
     * @param {Object} obj 待判断的对象
     * @param {String} type 类型
     */
    isType: function (obj, type) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
    }
};
module.exports = utils;
