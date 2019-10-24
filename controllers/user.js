const user = require('../models/user.js');

async function getUserInfo(ctx) {
  const { id } = ctx.params; // 获取url里传过来的参数里的id
  const result = await user.getUserById(id);
  ctx.body = result; // 将请求的结果放到response的body里返回
}

module.exports = {
  getUserInfo, // 把获取用户信息的方法暴露出去
};
