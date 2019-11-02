import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import { createNewUser, updateUserPasswordById } from '../services/user';

const router = new Router();

router.post('/register', async (ctx) => {
  const { name, password } = ctx.request.body;
  const newuser = await createNewUser(name, password);
  if (newuser) {
    ctx.status = 201;
    const payload = { name, id: newuser.id };
    ctx.body = {
      success: true,
      name,
      id: newuser.id,
      token: jwt.sign(payload, 'vue-koa-demo', { expiresIn: '7d' }),
    };
  } else {
    ctx.status = 409;
    ctx.body = {
      success: false,
      info: '用户名不可用',
    };
  }
});

router.patch('/:id', async (ctx) => {
  const { id } = ctx.params;
  const { password, newPassword } = ctx.request.body;
  const theUser = await updateUserPasswordById(id, password, newPassword);
  if (theUser) {
    const payload = { name: theUser.userName, id };
    ctx.body = {
      success: true,
      token: jwt.sign(payload, 'vue-koa-demo', { expiresIn: '7d' }),
    };
  } else {
    ctx.status = 401;
    ctx.body = {
      success: false,
      info: '密码错误',
    };
  }
});

export default router;
