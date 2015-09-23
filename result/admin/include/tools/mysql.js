/**
 * @file mysql 数据库操作
 * @author memoryza
 */
var mysql = require('mysql');
var domain = require('domain');
var config = require('../config');
var shell = require('./shell');
 var d = domain.create();
d.on('error', function (err) {
    if (err) {
        shell.log(__filename + ':' + err, 'error');
    }
});
module.exports = {
    ping: function (cb, errcb) {
        var connection = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database,
            port: config.mysql.port
        });
       
        d.run(function () {
            connection.connect(function (err) {
                if (err) throw err;
            });
        });
        d.run(function () {
            connection.ping(function (err) {
                if (err) {
                    errcb();
                   throw err;
                } else {
                    cb();
                }
            });
            connection.end();
        });
    }
}
