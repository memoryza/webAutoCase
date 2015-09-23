/**
 * @file mysql 数据库操作
 * @author memoryza
 */
var mysql = require('mysql');
var domain = require('domain');
var config = require('./config');
var shell = require('./shell');

var connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
});
var d = domain.create();
d.on('error', function (err) {
    if (err) {
        shell.log(__filename + ':' + err, 'error');
    }
});
d.run(function () {
    connection.connect(function (err) {
        if (err) throw err;
    });
});

module.exports = {
    query: function (table, callback) {
        d.run(function () {
            connection.query('SELECT * FROM ', function (err, rows) {
                if (err) throw err;
                callback(rows);
            });
        });
    },
    ping: function (cb) {
        d.run(function () {
            connection.ping(function (err) {
                if (err) {
                   throw err;
                } else {
                    cb();
                }
            });
        });
    }
}
