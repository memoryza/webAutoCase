/**
 * @file cookie操作
 * @author wangjincai(jincai.wang@foxmail.com)
 **/

;define('cookie', function(require, exports, module) {
	var Cookie = {
		set: function(name, value, day) {
			var expires = '';
			if (name && value) {
				if (day) {
					var date = +new Date();
					date.setTime(date + day * 8.64e7);
					expires = ";expires=" + date.toGMTString();
				}
				document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/;"
			}
		},
		get: function(name) {
			name += "=";
			var itemList = document.cookie.split(';');
			for(var i = 0; i < itemList.length; i++) {
				var c = itemList[i].trimLeft();
				if (c.indexOf(name) == 0) return decodeURIComponent(c.substring(name.length, c.length));
			}
			return '';
		}
	}
	module.exports = Cookie;
});