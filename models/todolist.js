const db = require('../config/db.js');

const todoModel = '../schema/list.js'; // 引入todolist的表结构
const TodolistDb = db.Todolist; // 引入数据库

const Todolist = TodolistDb.import(todoModel);

async function getTodolistById(id) { // 获取某个用户的全部todolist
  const todolist = await Todolist.findAll({ // 查找全部的todolist
    where: {
      user_id: id,
    },
    attributes: ['id', 'content', 'status'], // 只需返回这三个字段的结果即可
  });

  return todolist; // 返回数据
}

async function createTodolist(data) { // 给某个用户创建一条todolist
  return Todolist.create({
    user_id: data.id, // 用户的id，用来确定给哪个用户创建
    content: data.content,
    status: data.status,
  });
}

async function removeTodolist(id, user_id) {
  await Todolist.destroy({
    where: {
      id,
      user_id,
    },
  });
  return true;
}

/**
 *
 * @param {number} id Todo ID
 * @param {number} user_id User ID
 * @param {{content: string; status: boolean}} data Todo data
 */
async function updateTodolist(id, user_id, data) {
  const { content, status } = data;
  const [affectedRows] = await Todolist.update(
    { content, status },
    {
      where: {
        id,
        user_id,
      },
    },
  );
  return !!affectedRows;
}

module.exports = {
  getTodolistById,
  createTodolist,
  removeTodolist,
  updateTodolist,
};
