/**
 * @file获取case分组的列表
 * @author memoryza
 * @desc todo加入caceh
 */

var model = require('../model/caseGroup');

module.exports = {
	// 获取分组数据
	getGroups: function (cb) {
		return model.query(cb);
	}
}

