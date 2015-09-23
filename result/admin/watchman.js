/**
 * @file 主进程，作为进程的守护者
 * @author memoryza(jincai.wang@foxmail.com)
 **/

var cp = require('child_process');
var worker;

function spawn(server) {
    worker = cp.spawn('node', [server]);
    worker.on('exit', function (code) {
        if (code !== 0) {
            spawn(server);
        }
    });
}
spawn('app.js');
process.on('SIGTERM', function () {
    worker.kill();
    process.exit(0);
});

