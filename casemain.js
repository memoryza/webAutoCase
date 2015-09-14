/**
 * @file 自动测试case
 * @author memoryza
 * @desc 以下为测试case
 */
module.exports = [{
	"name" : "个股pc页面case",
	"url" : "http://gupiao.baidu.com/stock/sh000001.html",
	"caseList": [
		"$('#main-chart-tab li').length === 5",
		"$('#d-chart').closest('.chart-wrapper').css('display') === 'block'",
		"$('#main-chart-tab li[data-tab-index=\"1\"]').click(),$('#f-chart').closest('.chart-wrapper').css('display') === 'block'",
		"$('#main-chart-tab li[data-tab-index=\"2\"]').click(),$('#daily-k-chart').closest('.chart-wrapper').css('display') === 'block'"
	]},
	{
	"name" : "股市通官网",
	"url" : "http://gupiao.baidu.com",
	"caseList": [
		"$('.erweima-icon').width() === 126 && $('.erweima-icon').height() === 126"
	]
}]