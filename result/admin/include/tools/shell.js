/**
 * @file 工具类，这个与utils唯一的不同是utils可以提供很多实用的业务相关的功能，而shell更偏向于命令行相关的配置和设定
 * @author memoryza
 */

var colors = require('colors');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    data: 'grey',
    help: 'cyan',
    success: 'blue',
    warn: 'yellow',
    debug: 'blue',
    info: 'green',
    error: 'red'
});
var log  = {
    error: function (text) {
        console.log(text.error);
    },
    warn: function (text) {
        console.log(text.warn);
    },
    info: function (text) {
        console.log(text.info);
    }
}
module.exports = {
    log: function (text, type) {
        type = type || 'error';
        log[type](text);
    }
}