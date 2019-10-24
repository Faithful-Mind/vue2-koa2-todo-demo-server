const { Sequelize } = require('sequelize'); // 引入sequelize

const Todolist = new Sequelize('mysql://root:root123@localhost/molunerfinn_vue-koa-todolist', {
  define: {
    timestamps: false, // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  },
});

module.exports = {
  Todolist, // 将Todolist暴露出接口方便Model调用
};
