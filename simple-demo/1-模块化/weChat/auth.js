// 微信验证的中间件
const sha1 = require('sha1');
const config = require('../config');
module.exports = () => {
  return (req,res,next) => {
    // req.query是服务器提交的参数
    console.log('从服务器接受的参数req.query',req.query);
    const {signature,echostr,timestamp,nonce} = req.query;   // 对象的解构赋值
    const {token} = config;
//  1，首先将timestamp,echostr,nonce按照字典序排序组合在一起，形成一个数组
    const arrSort = [echostr,timestamp,nonce].sort();
    console.log('arrSort',arrSort);
//  2,将数组中的所有参数拼接成一个字符串，并进行sha1加密
    const str = arrSort.join('');
    console.log('str',str);
    const strSha1 = sha1(str);
    console.log('strSha1',strSha1);
//  判断微信服务器发送过来的signature，和加密完后生活才能的一个signature进行对比
    if(strSha1 === signature){
      res.send(echostr);
    }else{
      res.send('error');
    }
  }
}