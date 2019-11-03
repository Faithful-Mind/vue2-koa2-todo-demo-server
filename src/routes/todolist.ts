import { IMiddleware } from 'koa-router';
import { TodoRepo } from '../entities/TodoList';

export const getTodolist: IMiddleware = async (ctx) => {
  const { userId } = ctx.params;
  const result = await TodoRepo().find(
    { select: ['id', 'content', 'status'], where: { userId } },
  );
  ctx.body = result;
};

export const postTodolist: IMiddleware = async (ctx) => {
  const { userId } = ctx.params;
  const { content, status } = ctx.request.body;
  if (await TodoRepo().save({ userId, content, status })) {
    ctx.status = 201;
    ctx.body = {
      success: true,
    };
  }
};

export const deleteTodo: IMiddleware = async (ctx) => {
  const { id, userId } = ctx.params;
  if ((await TodoRepo().delete({ id, userId })).affected) {
    ctx.body = {
      success: true,
    };
  }
};

export const updateTodo: IMiddleware = async (ctx) => {
  const { id, userId } = ctx.params;
  const { content, status } = ctx.request.body;
  const todo = await TodoRepo().findOne({ id, userId });
  if (todo) {
    await TodoRepo().save({ ...todo, content, status });
    ctx.body = {
      success: true,
    };
  }
};
