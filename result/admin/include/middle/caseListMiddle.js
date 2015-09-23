/**
 * @file获取case分组的列表
 * @author memoryza
 * @desc todo加入caceh
 */

var model = require('../model/caseList');

module.exports = {
	// 获取某一个组的case列表
	getCaseList: function (gid, cb) {
		return model.query(gid, cb);
	}
}

