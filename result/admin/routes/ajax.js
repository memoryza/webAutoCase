/**
 * @file 专门负责ajax请求处理
 * @author wangjincai(wangjincai@foxmail.com)
 **/

var express = require('express');
var router = express.Router();
var qs = require('querystring');
// var indexMiddle = require('../include/middle/index');
router.get('/', function(req, res) {
	var params = req.query;
	var act = params.act;
	
});

function addCase(params) {

}

module.exports = router;