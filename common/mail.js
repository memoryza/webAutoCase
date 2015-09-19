/**
 * @file 发送邮件
 * @author memoryza
 */
var nodemailer = require('nodemailer');
var fs = require('fs');
var loger = require('./writelog');
function Mailer(config) {
    this.defaultParams = {
        from: 'webautocase@126.com',// 邮箱发送人地址
        to: 'webautocasereceive@126.com',// 邮箱接收人地址
        pass: 'test007',// 发送人密码
        useAuth: false,// 是否开启认证
        service:'126',// 邮箱服务，具体参见nodemailer-wellknown(https://github.com/andris9/nodemailer-wellknown)
        subject : '',
        content : ''
    };
    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            this.defaultParams[key] = config[key];
        }
    }
   
    var dp = this.defaultParams;
    this.transporter =  nodemailer.createTransport({
        service: dp.service,
        use_authentication: dp.useAuth,
        auth: {
            user: dp.from,
            pass: dp.pass
        }
    });
}

Mailer.prototype.getParams =  function() {
    var pattern = /^(?:[a-zA-Z\d]+[_\-\+\.]?)*[a-zA-Z\d]+@(?:([a-zA-Z\d]+\-?)*[a-zA-Z\d]+\.)+([a-zA-Z]{2,})+$/;
    var len = process.argv.length;
    var from, to, subject, toList;
    switch(len) {
        case 5:
            from = process.argv[2];
            to  = process.argv[3];
            subject = process.argv[4];
            if(from.match(pattern)) {
                this.defaultParams.from = from;
            }
            toList = to.split(',');
            toList = toList.filter(function(item) {
                if(item.match(pattern)) return item;
            });
            if(toList && toList.length) {
                this.defaultParams.to = toList.join(',');
            }
            if(subject) {
                this.defaultParams.subject = subject.substr(0, 124);
            }
            break;
        default:
            break;
    }
}

Mailer.prototype.send = function() {
    this.getParams();
    var mailOptions = {
        from    : this.defaultParams.from,
        to      : this.defaultParams.to, 
        subject : this.defaultParams.subject,
        html    : this.defaultParams.content
    };
    this.transporter.sendMail(mailOptions, function(error, info){
        if(error){
            loger.write('邮件发送失败');
            loger.write(error);
            loger.end();
            console.log('send fail, please read result/log/log.txt');
        }else{
            console.log('send ok!');
        }
    });
};

exports.sendMail = function (config) {
	(new Mailer(config)).send();
}


