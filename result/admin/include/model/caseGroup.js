/**
 * @file case_group表的基本操作
 * @author memoryza
 */
var mysql = require('../db/mysqlAPI');
module.exports = {
	query: function (cb) {
		var sql = 'SELECT * FROM case_group;';
		return mysql.query(sql, cb);
	}	
};