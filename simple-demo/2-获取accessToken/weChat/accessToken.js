// 获取access_token
const rp = require('request-promise-native');
const {readFile, writeFile} = require('fs');
const {appId,appSecret} = require('../config');
// 创建class类，并在其中定义一些函数，这些函数就可以用在创建类的实例上面的属性
class Wechat {
  constructor(age) {
// 设置属性的地方
  }

//  获取access_token
  getAccessToken () {
  return new Promise((resolve, reject) => {
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
      // 后台发送请求
      rp({method: 'GET', url, json: true})
        .then(res => {
          // 设置access_token的过期时间
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
          console.log('getAccessToken2222222', res);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }
  
// 保存access_token
  saveAccessToken (accessToken) {
    accessToken = JSON.stringify(accessToken);
    return new Promise((resolve,reject) => {
      writeFile('./accessToken.txt',accessToken,err => {
        if (!err) {
        resolve();
        }else{
          reject('saveAccessToken方法出错'+err);
        }
      })
    })
  }

//  读取access_token
  readAccessToken () {
    return new Promise((resolve,reject) => {
      readFile('./accessToken.txt',(err,data) => {
        if(!err){
          console.log('文件读取成功');
          data = JSON.parse(data);
          resolve(data);
        }else{
          reject('readAccessToken方法出现问题'+err);
        }
      })
    })
  }

//  判断凭据是否过期
  isValAccessToken(data){
    if(!data && !data.access_token && !data.expires_in){
      return false;
    }
    return data.expires_in > Date.now()
  }

  fetchAccessToken () {
    // this 的指向为 Wechat这个对象
    console.log('this',this);
    //优化操作,优化不去执行读取文件操作
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      //说明this有凭据和过期时间，并且凭据未过期
      return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in});
    }

    return this.readAccessToken()
      .then(async res => {
        console.log('res',res);
        //判断凭据是否过期(isValidAccessToken)
        if (this.isValidAccessToken(res)) {
          //没有过期，直接使用
          return Promise.resolve(res);
        } else {
          //重新发送请求获取凭据
          const data = await this.getAccessToken();
          //保存下来
          await this.saveAccessToken(data);
          //将请求回来的凭据返回出去
          return Promise.resolve(data);
        }
      })
      .catch(async err => {
        console.log("错误",err);
        //重新发送请求获取凭据
        const data = await this.getAccessToken();
        console.log('data',data);
        //保存下来
        await this.saveAccessToken(data);
        //将请求回来的凭据返回出去
        return Promise.resolve(data);
      })
      .then(res => {
        //将其请求回来的凭据和过期时间挂载到this上
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        //指定fetchAccessToken方法返回值
        return Promise.resolve(res);
      })
  }


}
// 模拟测试
const w = new Wechat();
// 读取access_token麻烦方法
/*new Promise((resolve) => {
  console.log('首先会执行里面的内容么？');
  // 首先在本地文件读取access_token，本地是否存在这个值
  w.readAccessToken()
    .then(res => {
    //  表示本地存在这个值，判断这个值是否过期了
      if(w.isValAccessToken(res)){
        console.log('去读txt文件的内容',res);
        resolve(res);
      }else{
      //  表示值过期了，需要重新发送请求，并将其保存下来
        w.getAccessToken()
          .then(res => {
            w.saveAccessToken(res)
              .then(res => {
                resolve(res);
              })
          })
      }
    })
    .catch(err => {
      console.log('read错误',err);
    // 表示本地没有这个值，要保存这个值
      w.getAccessToken()
        .then(res => {
          console.log('读取',res);
          w.saveAccessToken(res)
            .then(res => {
              resolve(res);
            })
        })
    })
})
  .then(res => {
    console.log('最后的调用',res);
  });*/
// 获取值的简便方法，将其中的内容封装成一个函数，循环调用次函数
w.fetchAccessToken();



