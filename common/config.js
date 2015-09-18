var config = {
	errcodeList: [404, 500, 502],
	baseUrl: 'http://gupiao.baidu.com/',
	mailer: {
		//  发邮件需要开启SMTP服务
		from: 'webautocase@126.com',// 邮箱发送人地址
        to: 'webautocasereceive@126.com',// 邮箱接收人地址
        pass: 'test007',// 发送人密码
        useAuth: false,// 是否开启认证
        service:'126'// 邮箱服务，具体参见nodemailer-wellknown(https://github.com/andris9/nodemailer-wellknown)
	}
}
module.exports = config;