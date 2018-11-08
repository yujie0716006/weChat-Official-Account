// 微信验证的中间件，逻辑一般都写在这里
const sha1 = require('sha1');
const config = require('../config');
module.exports = () => {
  // 这个就是调用微信服务器的请求与相应
  return (req,res,next) => {
    // req.query是服务器提交的参数
    const {signature,echostr,timestamp,nonce} = req.query;   // 对象的解构赋值
    const {token} = config;
    const strSha1 = sha1([token,timestamp,nonce].sort().join(''));
  // 微信服务器会向开发者服务器发送两种请求方式：1.GET请求：用来验证消息是否来源于微信服务器；2.POST请求，微信服务器会将用户发送的数据以POST请求的方式转发到开发者服务器上面。req.method可以知道是什么请求
    if(req.method === 'GET'){    // 验证是否是微信服务器
      if(strSha1 === signature){
        res.send(echostr);
      }else{
        res.end('error,不是微信服务器')
      }
    }else if(req.method === 'POST'){
    //  无论是GET还是POST请求，首先都是要验证消息是否来源于微信服务器上面的
      if(strSha1 !== signature){
        res.end('error,不是微信服务器');
        return
      }
      // 表示微信中的测试接口，向开发者服务器发送请求成功了，开发者服务器要回应相应
      console.log('req.query',req.query);
      res.send('');
    }
  }
}