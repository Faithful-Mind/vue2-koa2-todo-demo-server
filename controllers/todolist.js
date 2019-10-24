const todolist = require('../models/todolist.js');

async function getTodolist(ctx) { // 获取某个用户的所有todolist
  const { id } = ctx.params; // 获取url里传过来的参数里的id
  const result = await todolist.getTodolistById(id); // 通过yield “同步”地返回查询结果
  ctx.body = result; // 将请求的结果放到response的body里返回
}

async function createTodolist(ctx) { // 给某个用户创建一条todolist
  const data = ctx.request.body; // post请求，数据是在request.body里的
  const result = await todolist.createTodolist(data);

  ctx.body = {
    success: true,
  };
}


module.exports = {
  getTodolist,
  createTodolist,
};
