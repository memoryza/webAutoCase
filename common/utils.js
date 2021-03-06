/**
 * @file 工具类
 * @author memoryza(jincai.wang@foxmail.com)
 */
var fs = require('fs');
var mailer = require('./mail');
var config = require('./config');
var loger = require('./writelog');
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
     * @param {String} timestamp YYYY_MM_DD_HH_mm_ss_xxx时间字符串
     */
    writeJson: function (json, timestamp, path) {
        timestamp = timestamp || '';
        path = path || 'result/res_' + timestamp + '.json';
        try {
            fs.writeFileSync(path, (typeof json === 'string' ? json : JSON.stringify(json)));
        } catch (e) {
            console.log('webautocase writeFile Error:' + e);
        }
    },
    /**
     * 判断数据是否为某类型
     * @param {Object} obj 待判断的对象
     * @param {String} type 类型
     */
    isType: function (obj, type) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
    },
    /**
     * 发送报警邮件
     * @timestamp
     **/
    sendWariningEmail: function (timestamp) {
        var mailConfig = config.mailer;
        mailConfig.content = '报警邮件连接地址 ' + config.warningSite + '?timestamp=' + timestamp;
        mailConfig.subject = 'XXX报警邮件';
        mailer.sendMail(mailConfig);
    },
    /**
     * 一次写入日志（适用于一次对文本的读写
     * @param {String} 写入内容
     */
    writeOnce: function (content) {
        if (utils.isType(content, 'Object')) {
            content = JSON.stringify(content);
        }
        loger.write(content);
        loger.end();
    }
};
module.exports = utils;
