/**
 * @file mysql 数据库操作
 * @author memoryza
 */
var mysql = require('mysql');
var domain = require('domain');
var config = require('../config');
var shell = require('../tools/shell');
 var d = domain.create();
d.on('error', function (err) {
    if (err) {
        shell.log(__filename + ':' + err, 'error');
    }
});
var connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port
});
module.exports = {
    query: function (sql, cb) {
        d.run(function () {
            connection.query(sql, function (err, results) {
                if (err) {
                    cb([]);
                    throw err;
                }
                console.log(123)
                cb(results);
            });
        })
    }
}
