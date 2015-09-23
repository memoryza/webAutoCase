/**
  * @file 数据接口
  * @introduce 存储策略说明，暂无
  * @author wangjincai(jincai.wang@foxmail.com)
**/
;define('data', function(require, exports, module) {
  var cache = require('cache');
  // 是否关闭缓存
  exports.cacheableFlag = true;
  /**
  * key cacheID, val响应值， ttl 以秒为单位
  **/
  exports.set = function (key, val, ttl) {
    if (exports.cacheableFlag) {
        // 默认cache存活时间
        ttl = ttl || 86400;
        var endts = (+ new Date()) + ttl * 1e3;
        cache.set(key, {ttl: endts, data: val});
    }
  };
  exports.get = function (key, defaultVal) {
    if (exports.cacheableFlag) {
        var data = cache.get(key);
        var curTime = + new Date();
        if (data) {
          if (data.ttl && curTime > data.ttl) {
              cache.remove(key);
              return false;
          }
          return data.data;
        }
    }
    return false;
  };
  exports.remove = cache.remove;
  exports.clear = cache.clear;
  exports.some = cache.some;
  exports.getItems = cache.getItems;
  // 清理过期数据
  exports.clearExpireData = function () {
    var keys = cache.getAllkeys();
    if(keys && keys.length) {
        for (var i = 0, _len = keys.length; i < _len; i++) {
            exports.get(keys[i]);
        }
    }
  };
  exports.disableCache = function () {
   exports.cacheableFlag = false;
  };
  exports.supported = cache.supported;
  exports.clearExpireData();

});
