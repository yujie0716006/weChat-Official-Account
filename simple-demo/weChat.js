// 这个是服务器的代码
const express = require('express');
const sha1 = require('sha1');

// 创建app应用对象
const app = express();

const config = {
  token: 'yujie123',
  appId: 'wx73069b26dc23fc3b',
  appSeret: '401b4921c657b5a23782875f6e16ebb8'
}
// 验证服务器的有效性,app的中间件
app.use((req,res,next) => {
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

});
// 监听端口号
app.listen(8080,() => console.log('服务器启动成功~~~,lalala'));