// 文件的入口JS
// 这个是服务器的代码
const express = require('express');
const auth = require('./weChat/auth');
// 创建app应用对象
const app = express();
// 验证服务器的有效性,app的中间件
app.use(auth());
// 监听端口号
app.listen(8080,() => console.log('服务器启动成功~~~,lalala'));