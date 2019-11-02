import Router from 'koa-router';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const router = new Router();

router.get('/user/:id', async (ctx) => {
  const { id } = ctx.params;
  const result = await getRepository(User).findOne(id);
  ctx.body = result;
});

router.post('/user', async (ctx) => {
  const { name: userName, password } = ctx.request.body;
  const userInfo = await getRepository(User).findOne({ userName });
  // 用户存在则验证密码是否正确
  if (userInfo && await bcrypt.compare(password, userInfo.password)) {
    const payload = {
      name: userInfo.userName,
      id: userInfo.id,
    };
    ctx.body = {
      success: true,
      token: jwt.sign(payload, 'vue-koa-demo', { expiresIn: '7d' }),
    };
  } else {
    ctx.status = 401;
    ctx.body = {
      success: false, // success标志位是方便前端判断返回是正确与否
      info: '用户名或密码错误！',
    };
  }
});

export default router;
