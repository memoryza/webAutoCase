/**
 * log模块
 * author: wangjincai(jincai.wang@foxmail.com)
 **/
;define('log', function(require, exports, module) {
  module.exports = {
    init:  function () {
      (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?e9ccec23e6f62fcc1a83ee4d3b42c506";
        var s = document.getElementsByTagName("script")[0]; 
        hm.async = 'true';
        s.parentNode.insertBefore(hm, s);
      })();
    },
    /**
     * category 统计分类， action 统计行为
    **/
    add: function (category, action, opt, optValue) {
        action = action || 'click';
        var list = ['_trackEvent', category, action];
        if (opt) {
          list.push(opt);
          optValue ? list.push(optValue) : null;
        }
        _hmt.push(list);
    },
     /**
     * index：是自定义变量所占用的位置。取值为从1到5。该项必选。
     * name：是自定义变量的名字。该项必选。
     * value：就是自定义变量的值。该项必选。
     * opt_scope：是自定义变量的作用范围
    **/
    addCustom: function (name, value, index, opt_socpe) {
      name = name || 'uv';
      index = index || 1;
      opt_socpe = opt_socpe || 1;
      if (value) {
        _hmt.push(['_setCustomVar', index, name, value, opt_socpe]);
      }
    }
  }
  module.exports.init();
});
