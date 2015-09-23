/**
  * @file 工具函数
  * @author wangjincai(jincai.wang@foxmail.com)
  */

define('util', function(require, exports, module) {
    var data = require('data');
    var cookie = require('cookie');
    var queryStringReg = /^.*\?/;
    var hashStringReg = /^#/;
    var ua = navigator.userAgent;
    exports.urlParse = function (querystr) {
        var arr = querystr.split('&'),
            obj = {},tmp;
        var decode = decodeURIComponent;
        for (var i = 0, _len = arr.length; i < _len; i++) {
            tmp = arr[i].split('=');
            if (tmp[0]) {
                obj[decode(tmp[0])] = decode(tmp[1]);
            }
        }
        return obj;
    };
    exports.urlParam = function (obj) {
        var arr = [];
        for (k in obj) {
            if (k && obj.hasOwnProperty(k)) {
                arr.push(k + '=' + obj[k]);
            }
        }
        return arr.join('&');
    };
    exports.getHashParam = function (qs) {
        var s = qs.replace(hashStringReg, '');
        var obj = {};
        var tmp;
        tmp = s.split('/');
        obj.data = exports.urlParse(tmp[1] || '');
        obj['act'] = tmp[0] || '';
        return obj;
    };
    exports.getQueryParam = function (qs) {
        return exports.urlParse(qs.replace(queryStringReg, ''));
    };
    // 获取url参数，type获取hash参数还是qs
    exports.getAppParam = function(type) {
        if (type === 'hash') {
            return exports.getHashParam(location.hash);
        } else {
            return exports.getQueryParam(location.search);
        }
    }
    exports.templateEngine = function (html, options) {
        var re = /<%(.+?)%>/g, 
            reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
            code = 'with(obj) { var r=[];\n', 
            cursor = 0, 
            result;
        var add = function(line, js) {
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        while(match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
        try { result = new Function('obj', code).apply(options, [options]); }
        catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
        return result;
    }
    exports.formatTen = function (num) {
        return num > 9 ? num : '0' + num;
    }
    exports.isType = function (type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        }
    }
    exports.iosUC = function () {
        var ios = ua.match(/(iphone|ipad)/i);
        var uc = ua.match(/UCBrowser/i);
        //ios uc跳转到顶部地址栏会遮住顶部，应用模式的情况下是变成了偶发
        if (ios && uc) {
            return true;
        }
        return false;
    }
    exports.getEventName =  function () {
        if (exports.isIos()) {
            return 'tap';
        }
        return 'click';
    }
    exports.isAndroid = function () {
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/i);
        if (android) {
            return true;
        }
    }
    exports.isIos = function () {
        if (new RegExp('\\b(?:iPhone|CPU|iPh) OS\\/? *([0-9._]*)', 'i').test(ua)) {
            return true;
        }
    }
    exports.isWeixin = function () {
        var isWeixin = ua.match(/micromessenger/i);
        if (isWeixin) {
            return true;
        }
        return false;
    }
    exports.guidGenerator = function () {
        var S4 = function () {
           return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
    exports.setCache = function(name, val, day) {
        if (data.supported) {
            data.set(name, val, day);
        } else {
            cookie.set(name, val, day);
        }
    }
    exports.getCache = function (name) {
        var rt;
        if (data.supported) {
            rt = data.get(name);
            if (rt) {
                console.log('lc' + rt);
                return rt;
            }
        }
        rt = cookie.get(name);
        if (rt) {
            console.log('cookie' + rt);
            return rt;
        }
        return rt;
    }
    // 获取当前浏览器环境SAP用的是pushState还是hash；返回值 pushState / hash
    exports.getRouteType = function() {
        var rt = exports.getCache('routeType');
        if (rt) {
            return rt;
        }
        rt = 'hash';
        var querysymbol = location.search || location.hash ? '&' : '?&';
        var params = util.getAppParam('pushState');

        // 防止带routetype的url分享出去以后产生重复的queryParam
        var url;
        if (params['routetest']) {
            params['routetest'] = exports.guidGenerator();
            url = location.origin + '?' + exports.urlParam(params);
        } else {
            url = location.href + querysymbol +'routetest=' + exports.guidGenerator(); 
        }
        if ('pushState' in window.history && typeof window.history.pushState == 'function') {
            try {
                window.history.pushState('', '', url);
                // fixed 部分支持pushState 的浏览器，虽然地址栏里的url变更了，但是location.href的地址依旧不变（bug)的问题
                // 或是用history.state进行修正
                var pattern = new RegExp(encodeURIComponent(url), 'i');
                if (encodeURIComponent(location.href).match(pattern)) {
                    rt = 'pushState';
                    exports.setCache('routeType', 'pushState', 365);
                } else {
                    exports.setCache('routeType', 'hash', 7);
                }
            } catch(e) {
                exports.setCache('routeType', 'hash', 7);
            }
        } else {
            exports.setCache('routeType', 'hash', 7);
        }
        return rt;
    }
});