#简介


###使用方法
  
1、下载webAutoCase切换到跟目录执行
  
     npm install 

2、执行命令
   
    phantomjs main.js
 
3、产看产出结果

   首先需要配置本地的服务器指向根目录xxx.xxx/result目录
   
   访问：xxx.xxx
   
   例子截图效果如下：
   <img src="./tmp/snap1.png">
   
   
   
###内容介绍

1、这是什么？

答：这是一个基于phantomjs的网页测试工具。

2、可以做什么？

答：呵呵我的直观想法是用脚本定期去抓去网页，监控网页是否包含异常报警什么的，当然也可以监控接口节点吐出数据情况。

3、如何写自己的testcase

答：跟目录下包含casemain.js包含两个自带的case，写法就是在控制台如何写找元素，如何验证，在这里就怎么写。支持jQuery。