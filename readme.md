#简介

2015-09-23记：之前没有了解过这个领域，昨天有关注过其他公司放出来的前端监控工具，功能很强大很完善，所以我想了想一个人指定没人家团队的专业和能力，所以这个小模块就该做叫从零开始搭建一个自动化测试项目吧，作为知识和技术的一点点积累。

###使用方法
  
1、下载webAutoCase切换到跟目录执行
  
     npm install  && npm install phantomjs -g

2、执行命令
   
    node main.js
 
3、查看产出结果

   首先需要配置本地的服务器指向根目录xxx.xxx/result目录
   
   访问：xxx.xxx
   
   例子截图效果如下：
   <img src="./tmp/snap1.png">
  
4、配置监控报警

  common/config.js 中包含报警邮件配置（发送方需开启SMTP服务，具体支持邮件服务情况请参见nodemailer-wellkown）、报警展现域名等配置
   
   
   
###内容介绍

1、这是什么？

答：这是一个网页测试工具。

2、可以做什么？

答：监控网页是否包含异常报警、也可以监控接口节点吐出数据情况。

3、如何写自己的testcase

答：跟目录下包含casemain.js包含自带的case，写法就是在控制台如何写找元素，如何验证，在这里就怎么写。支持jQuery。

###结构说明

--Case是整个应用的case处理的地方，主要就是将写好的case进行并行处理
  
--Common公用模块存放处，包含createHAR（网络请求状态处理）、utils工具类、writelog写日志

--config(未启用)原来准备关于phantomjs模拟浏览器相关配置和写日志配置的文件

--result输出结果包含index.php查看日志、res_YYYY_MM_DD_HH_mm_ss_xxx.json日志json方式记录、error记录错误截图，规则是error/case名称/YYYY_MM_DD_HH_mm_ss_xxx.png

--tmp用于网站readme说明的配图

--casemain.js是case的配置文件

--main.js 程序的主入口

--package.json 项目配置文件

--readme 项目md文件


####一次case执行流程说明

    node main.js ==>main读取casemain中的case列表 ==>根据case的数量循环调用case/appCase ==> appCase调用Common下的createHAR进行爬去数据并返回 ==> appCase内部分析返回状态及执行case==>包含错误则发送邮件


-----------------
更新说明：

  日期：2015-09-16
  
  1、列出case中请求失败的url地址

  2、增加对无case的处理
  
  日期：2015-09-18
  
  1、将phantomjs运行更改为nodejs运行

  2、增加发送报警邮件
  
  3、增加时时错误日志记录