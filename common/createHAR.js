/**要想知道什么是xhr(http://www.softwareishard.com/blog/har-12-spec/)
*例子（http://www.softwareishard.com/blog/har-viewer/）
*/
var Pconfig = require('../config');
var MyUtils = require('./utils');
var fs = require('fs');

fs.changeWorkingDirectory(phantom.libraryPath);

if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function pad(n) { return n < 10 ? '0' + n : n; }
        function ms(n) { return n < 10 ? '00'+ n : n < 100 ? '0' + n : n }
        return this.getFullYear() + '-' +
            pad(this.getMonth() + 1) + '-' +
            pad(this.getDate()) + 'T' +
            pad(this.getHours()) + ':' +
            pad(this.getMinutes()) + ':' +
            pad(this.getSeconds()) + '.' +
            ms(this.getMilliseconds()) + 'Z';
    }
}

function createHAR(address, title, startTime, resources) {
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
            startedDateTime: request.time.toISOString(),
            time: endReply.time - request.time,
            request: {
                method: request.method,
                url: request.url,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: request.headers,
                queryString: [],
                headersSize: -1,
                bodySize: -1
            },
            response: {
                status: endReply.status,
                statusText: endReply.statusText,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: endReply.headers,
                redirectURL: "",
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
                name: "PhantomJS",
                version: phantom.version.major + '.' + phantom.version.minor +
                    '.' + phantom.version.patch
            },
            pages: [{
                startedDateTime: startTime.toISOString(),
                id: address,
                title: title,
                pageTimings: {
                    onLoad: page.endTime - page.startTime
                }
            }],
            entries: entries
        }
    };
}
var page = require('webpage').create();

page.resources = [];

page.onLoadStarted = function () {
    page.startTime = new Date();
};

page.onResourceRequested = function (req) {
    page.resources[req.id] = {
        request: req,
        startReply: null,
        endReply: null
    };
};

page.onResourceReceived = function (res) {
    if (res.stage === 'start') {
        page.resources[res.id].startReply = res;
    }
    if (res.stage === 'end') {
        page.resources[res.id].endReply = res;
    }
};


function initHAR(address, callback, type, data) {
    if(typeof callback !=  'function') {
        type = callback;
        data = type;
    }
    var startTime = Date.now();
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
            page.endTime = new Date();
            var loadTime = Date.now() - startTime;
            if (status !== 'success') {
                typeof callback == 'function' 
                    ? (page.render(filename),callback({errcode: '-1', msg: 'FAIL to load the address', page: page, loadTime: loadTime}))
                    : console.log('case error:FAIL to load the address');

            } else {
                page.title = page.evaluate(function () {
                    return document.title;
                });
                
                har = createHAR(address, page.title, page.startTime, page.resources);
                if(har.log.entries.length == 1 && Pconfig.errcodeList.indexOf(har.log.entries[0].response.status) >= 0) {
                    
                    typeof callback == 'function' 
                        ? (page.render(filename), callback({errcode: har.log.entries[0].response.status , msg: 'load error', loadTime: loadTime, page: page}))
                        : console.log('case error');
                } else {
                    typeof callback == 'function' 
                        ? callback({errcode: 0, msg: 'success', loadTime: loadTime,page: page, har: har})
                        : console.log('case success');
                }
            }
            page.close();
        });
    // }
}

var filename = MyUtils.myUtils.errorFileDir('index');

exports.initHAR = initHAR;
exports.setCaseName = function(caseName) {
    filename = myUtils.myUtils.errorFileDir(caseName);
}
