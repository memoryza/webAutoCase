/**
 * @file 组织请求详细状态
 * @desc 要想知道什么是har(http://www.softwareishard.com/blog/har-12-spec/)
 * @desc 例子（http://www.softwareishard.com/blog/har-viewer/）
 * @desc phantom-node https://github.com/sgentle/phantomjs-node/wiki
*/
var phantom = require('phantom');
var myUtils = require('./utils');
var errcodeList = [404, 500, 502];

if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        return this.getFullYear() + '-' +
            myUtils.pad(this.getMonth() + 1) + '-' +
            myUtils.pad(this.getDate()) + 'T' +
            myUtils.myUtilspad(this.getHours()) + ':' +
            myUtils.pad(this.getMinutes()) + ':' +
            myUtils.pad(this.getSeconds()) + '.' +
            myUtils.ms(this.getMilliseconds()) + 'Z';
    };
}
/**
 * 获取网络请求状态
 * @param {String} address 请求地址
 * @param {String} data 附加数据
 * @param {Function} callback 回调函数
 * @param {String} type 类型 post、get
 */
function initHAR(address, data, callback, type) {
    if (typeof data ==  'function') {
        type =  callback;
        callback = data;
    }
    return phantom.create(function(ph) {
        return ph.createPage(function(page) {
            var resources = [];
            var title, startTime = Date.now(), endTime, loadTime;
            function createHAR() {
                var entries = [];
                resources.forEach(function (resource) {
                    var request = resource.request,
                        startReply = resource.startReply,
                        endReply = resource.endReply;

                    if (!request || !startReply || !endReply) {
                        return;
                    }

                    // Exclude Data URI from HAR file because
                    // they aren't included in specification
                    if (request.url.match(/(^data:image\/.*)/i)) {
                        return;
                    }
                    entries.push({
                        startedDateTime: request.time,
                        time: endReply.time - request.time,
                        request: {
                            method: request.method,
                            url: request.url,
                            httpVersion: 'HTTP/1.1',
                            cookies: [],
                            headers: request.headers,
                            queryString: [],
                            headersSize: -1,
                            bodySize: -1
                        },
                        response: {
                            status: endReply.status,
                            statusText: endReply.statusText,
                            httpVersion: 'HTTP/1.1',
                            cookies: [],
                            headers: endReply.headers,
                            redirectURL: '',
                            headersSize: -1,
                            bodySize: startReply.bodySize,
                            content: {
                                size: startReply.bodySize,
                                mimeType: endReply.contentType
                            }
                        },
                        cache: {},
                        timings: {
                            blocked: 0,
                            dns: -1,
                            connect: -1,
                            send: 0,
                            wait: startReply.time - request.time,
                            receive: endReply.time - startReply.time,
                            ssl: -1
                        },
                        pageref: address
                    });
                });
                return {
                    log: {
                        version: '1.2',
                        creator: {
                            name: 'PhantomJS',
                            // version: phantom.version.major + '.' + phantom.version.minor +
                            //     '.' + phantom.version.patch
                        },
                        pages: [{
                            startedDateTime: startTime.toISOString(),
                            id: address,
                            title: title,
                            pageTimings: {
                                onLoad: endTime - startTime
                            }
                        }],
                        entries: entries
                    }
                };
            }
        
            page.set('onLoadStarted', function () {
                startTime = new Date();
            });
            page.set('onLoadFinished', function () {
                endTime = new Date();
            });
            page.set('onResourceRequested', function (req) {
                resources[req.id] = {
                    request: req,
                    startReply: null,
                    endReply: null
                };
            });

            page.set('onResourceReceived', function (res) {
                if (res.stage === 'start') {
                    resources[res.id].startReply = res;
                }
                if (res.stage === 'end') {
                    resources[res.id].endReply = res;
                }
            });

            
            // if(type == 'post') {
            //     data = data || '';
            //      page.open(address, 'post', data function (status) {
            //         var har;
            //         if (status !== 'success') {
            //             console.log('FAIL to load the address');
            //             phantom.exit(1);
            //         } else {
            //             page.endTime = new Date();
            //             page.title = page.evaluate(function () {
            //                 return document.title;
            //             });
            //             har = createHAR(address, page.title, page.startTime, page.resources);
            //             console.log(JSON.stringify(har, undefined, 4));
            //             phantom.exit();
            //         }
            //     });
            // } else {
                page.open(address, function (status) {
                    var har;
                    // endTime = new Date();
                    var loadTime = Date.now() - startTime;
                    if (status !== 'success') {
                        typeof callback === 'function'
                            ? callback({errcode: '-1', msg: 'FAIL to load the address', page: page, loadTime: loadTime, phantom: ph})
                            : console.log('case error:FAIL to load ' + address);
                    } else {
                        har = createHAR();
                        if (har.log.entries.length == 1 && errcodeList.indexOf(har.log.entries[0].response.status) >= 0) {
                            typeof callback == 'function'
                                ? callback({errcode: har.log.entries[0].response.status , msg: 'load error', loadTime: loadTime, page: page, phantom: ph})
                                : '';
                        } else {
                            typeof callback == 'function'
                                ? callback({errcode: 0, msg: 'success', loadTime: loadTime, page: page, har: har, phantom: ph})
                                : '';
                        }
                    }
                    // ph.exit();
                });
         // }
        });
    });
}

exports.initHAR = initHAR;
