/**
 * @file case_list表的基本操作
 * @author memoryza
 */
var mysql = require('../db/mysqlAPI');
module.exports = {
	query: function (gid, cb) {
		var sql = 'SELECT * FROM case_list WHERE gid = ' + gid + ';';
		return mysql.query(sql, cb);
	}	
};