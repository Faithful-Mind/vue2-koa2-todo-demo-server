const jwt = require('jsonwebtoken');

const user = require('../models/user.js');

async function getUserInfo(ctx) {
  const { id } = ctx.params; // 获取url里传过来的参数里的id
  const result = await user.getUserById(id);
  ctx.body = result; // 将请求的结果放到response的body里返回
}

async function postUserAuth(ctx) {
  const data = ctx.request.body; // post过来的数据存在request.body里
  const userInfo = await user.getUserByName(data.name);

  if (userInfo != null) { // 如果查无此用户会返回null
    if (userInfo.password !== data.password) {
      ctx.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: '密码错误！',
      };
    } else { // 如果密码正确
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id,
      };
      const secret = 'vue-koa-demo'; // 指定密钥，这是之后用来判断token合法性的标志
      const token = jwt.sign(userToken, secret); // 签发token
      ctx.body = {
        success: true,
        token, // 返回token
      };
    }
  } else {
    ctx.body = {
      success: false,
      info: '用户不存在！', // 如果用户不存在返回用户不存在
    };
  }
}

module.exports = {
  getUserInfo, // 把获取用户信息的方法暴露出去
  postUserAuth,
};
