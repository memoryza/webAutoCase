/**
 * @file 发送请求统一处理错误
 * @author memoryza(jincai.wang@foxmail.com)
 **/
define('request', function(require, exports, module){
	var $ = require('zepto');
	exports.req = function(param, cb, errcb, neterrcb) {
		neterrcb = neterrcb || errcb;
		var startTime = +new Date();
		$.ajax({
            url: '/ajax',
            type: 'GET',
            datatype: 'json',
            data: param,
            timeout: 5000,
            success: function (data) {
            	if (data.errNo === 0) {
            		cb && cb(data);
            	} else {
            		errcb && errcb();
            	}
            },
            error: function (e) {
                var errType = arguments[1] || 'timeout';
                if ((errType === 'timeout') || (errType=='abort' && ((new Date().getTime() - startTime) < 100 ))) {
                    // 请求超时或是请求被取消
                    neterrcb  && neterrcb();
                } else {
                	// 网络错误
                	neterrcb && neterrcb();
                }
            }
        });
	}
});