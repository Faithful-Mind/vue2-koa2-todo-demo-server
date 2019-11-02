import Router from 'koa-router';
import jwt from 'koa-jwt';

import { authLogin } from './auth';
import { postRegister, patchPassword } from './user';
import {
  getTodolist, postTodolist, deleteTodo, updateTodo,
} from './todolist';
import graphqlMiddleware from './graphql';

const router = new Router();

const jwtMiddleware = jwt({ secret: 'vue-koa-demo', key: 'jwtdata' });
function jwtMatchParam(paramid = 'userId'): Router.IMiddleware {
  return (ctx, next) => (
    String(ctx.state.jwtdata.id) === ctx.params[paramid]
      ? next()
      : ctx.throw(401)
  );
}

router.post('/auth/user', authLogin);
router.post('/api/user/register', postRegister);

router.use(jwtMiddleware);

router.patch('/api/user/:id', jwtMatchParam('id'), patchPassword);

router.get('/api/user/:userId/todolist', jwtMatchParam(), getTodolist);
router.post('/api/user/:userId/todolist', jwtMatchParam(), postTodolist);
router.delete('/api/user/:userId/todolist/:id', jwtMatchParam(), deleteTodo);
router.put('/api/user/:userId/todolist/:id', jwtMatchParam(), updateTodo);

router.get('/graphql', graphqlMiddleware);
router.post('/graphql', graphqlMiddleware);

export default router;
