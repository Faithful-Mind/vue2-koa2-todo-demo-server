const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    if (!await bcrypt.compare(data.password, userInfo.password)) { // 验证密码是否正确
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
      const token = jwt.sign(userToken, secret, { expiresIn: '7 days' }); // 签发token
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

async function registerUser(ctx) {
  const { name, password } = ctx.request.body;
  const newuser = await user.createUser({ name, password });
  if (newuser) {
    ctx.status = 201;
    ctx.body = {
      success: true,
      name,
      id: newuser.id,
      token: jwt.sign(
        { name, id: newuser.id },
        'vue-koa-demo',
        { expiresIn: '7 days' },
      ),
    };
  } else {
    ctx.status = 409;
    ctx.body = {
      success: false,
      info: '用户名不可用',
    };
  }
}

module.exports = {
  getUserInfo, // 把获取用户信息的方法暴露出去
  postUserAuth,
  registerUser,
};
