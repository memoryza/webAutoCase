/**
 * @file 自动测试case
 * @author memoryza
 * @desc 以下为测试case
 */
module.exports = [
	{
		"name" : "个股pc页面case",
		"url" : "http://gupiao.baidu.com/stock/sh000001.html",
		"caseList": [
			"$('#main-chart-tab li').length !== 5",
			"$('#d-chart').closest('.chart-wrapper').css('display') === 'block'",
			"$('#main-chart-tab li[data-tab-index=\"1\"]').click(),$('#f-chart').closest('.chart-wrapper').css('display') === 'block'",
			"$('#main-chart-tab li[data-tab-index=\"2\"]').click(),$('#daily-k-chart').closest('.chart-wrapper').css('display') === 'block'"
		]
	},
	{
		"name" : "股市通官网",
		"url" : "http://gupiao.baidu.com",
		"caseList": [
			"$('.erweima-icon').width() === 126 && $('.erweima-icon').height() === 126"
		]
	},
	{
		"name": "分析错误资源引用",
		"url": "http://gupiao.baidu.com/app/?act=funds&code=sh000001",
		
	},
	{
		"name": "监控阿拉丁接口Case",
		"url": "http://gupiao.baidu.com/ui/gushitong?from=iphone&os_ver=7.0&cuid=xxx&vv=100&uid=84a3b512-de39-444e-eaa7-908ca4b6b1f8&format=json&queryURL=aladingbar",
		"caseList": [
			"console.log(document.body.innerText);"
		]
	}
]