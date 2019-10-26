const bcrypt = require('bcrypt');

const db = require('../config/db.js');

const userModel = '../schema/user.js'; // 引入user的表结构
const TodolistDb = db.Todolist; // 引入数据库

const User = TodolistDb.import(userModel); // 用sequelize的import方法引入表结构，实例化了User。

async function getUserById(id) {
  const userInfo = await User.findOne({
    where: {
      id,
    },
  });

  return userInfo; // 返回数据
}

async function getUserByName(name) {
  const userInfo = await User.findOne({
    where: {
      user_name: name,
    },
  });

  return userInfo;
}

async function createUser(userInfo) {
  const { name, password } = userInfo;
  const isDuplicated = await getUserByName(name);
  if (!isDuplicated) {
    const pswdBcrypted = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      user_name: name,
      password: pswdBcrypted,
    });
    return newUser;
  }
  return undefined;
}

async function updateUserPasswordById({ id, password, newPassword }) {
  const user = await getUserById(id);

  if (await bcrypt.compare(password, user.password)) {
    const rows = await user.update(
      { password: await bcrypt.hash(newPassword, 10) },
      { where: { id } },
    );
    return rows;
  }
  return undefined;
}

module.exports = {
  getUserById, // 导出getUserById的方法，将会在controller里调用
  getUserByName,
  createUser,
  updateUserPasswordById,
};
