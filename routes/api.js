const Router = require('koa-router');
const todolist = require('../controllers/todolist.js');

const router = new Router();

router.get('/todolist/:id', todolist.getTodolist);
router.post('/todolist', todolist.createTodolist);

module.exports = router;
