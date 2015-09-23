/**
 * @file 项目主页入口
 * @author memoryza(jincai.wang@foxmail.com)
 **/
var express = require('express');
var app = express();

var nimble =  require('nimble');
var monitor = require('../include/tools/monitorDB');
var WebSocketServer =require('ws').Server;
var wss = new WebSocketServer({server: app, port: 10000});
var timer;
function mockSI(clients) {
	timer = setTimeout(function () {
		monitor(function (status) {
			var len = clients.length;
	        for(var i = 0; i< len; i++) {
			    clients[i].send(JSON.stringify(status));
			}
			mockSI(clients);
		})
	}, 1e4);
}
wss.on('connection', function(ws) {
	if (timer) {
		clearTimeout(timer);
	}
	mockSI(wss.clients);
    ws.on('close', function(e) {
        console.log('现有终端连接数:' + wss.clients.length);
    })
});
app.get('/', function(req, res) {
	monitor(function (status) {
	    res.render('pc/index', status);
    });
});
app.get('/case_group', function(req, res) {
	var caseGroup = require('../include/middle/caseGroupMiddle');
	caseGroup.getGroups(function (data) {
		res.render('pc/case_group', {caseGroups: data});
	});
});
app.get('/case_list', function(req, res) {
	var gid = req.query.gid;
	var caseList = require('../include/middle/caseListMiddle');
	caseList.getCaseList(gid, function (data) {
		res.render('pc/case_list', {caseList: data});
	});
});
module.exports = app;
