import Router from 'koa-router';
import { getRepository } from 'typeorm';
import { TodoList } from '../entities/TodoList';

const router = new Router();

router.get('/todolist', async (ctx) => {
  const { userId } = ctx.params;
  const result = await getRepository(TodoList).find(
    { select: ['id', 'content', 'status'], where: { userId } },
  );
  ctx.body = result;
});

router.post('/todolist', async (ctx) => {
  const { userId } = ctx.params;
  const { content, status } = ctx.request.body;
  if (await getRepository(TodoList).save({ userId, content, status })) {
    ctx.status = 201;
    ctx.body = {
      success: true,
    };
  }
});

router.delete('/todolist/:id', async (ctx) => {
  const { id, userId } = ctx.params;
  if ((await getRepository(TodoList).delete({ id, userId })).affected) {
    ctx.body = {
      success: true,
    };
  }
});

router.put('/todolist/:id', async (ctx) => {
  const { id, userId } = ctx.params;
  const { content, status } = ctx.request.body;
  const todo = await getRepository(TodoList).findOne({ id, userId });
  if (todo) {
    await getRepository(TodoList).save({ ...todo, content, status });
    ctx.body = {
      success: true,
    };
  }
});

export default router;
