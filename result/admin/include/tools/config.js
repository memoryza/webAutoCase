/**
 * @file 程序配置文件存放处
 * @author memoryza
 */
var config = {
    errcodeList: [404, 500, 502],// 错误code类型
    baseUrl: 'http://gupiao.baidu.com/',// 监控页面跟域名(暂未使用)
    mailer: {
        //  发邮件需要开启SMTP服务
        from: 'webautocase@126.com',// 邮箱发送人地址
        to: 'webautocasereceive@126.com,wangjincai@baidu.com',// 邮箱接收人地址
        pass: 'test007',// 发送人密码
        useAuth: false,// 是否开启认证
        service: '126'// 邮箱服务，具体参见nodemailer-wellknown(https://github.com/andris9/nodemailer-wellknown)
    },
    // 配置mysql连接
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webmonitor',
        port: '3306'
    },
    warningSite: 'http://xxx.com'// 报警url预览地址地址
};
module.exports = config;