import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';

import router from './routes';

createConnection().then(async (connection) => {
  const app = new Koa();

  app.use(bodyParser());
  app.use(logger());

  app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = Date.now() - start.valueOf();
    console.log('%s %s - %s', ctx.method, ctx.url, ms); // 显示执行的时间
  });

  app.use(async (ctx, next) => { //  如果JWT验证失败，返回验证失败信息
    try {
      await next();
    } catch (err) {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          token: null,
          info: 'Protected resource, use Authorization header to get access',
        };
      } else {
        throw err;
      }
    }
  });

  app.on('error', (err) => {
    console.log('server error', err);
  });

  app.use(router.routes())
    .use(router.allowedMethods()); // 将路由规则挂载到Koa上。

  app.listen(8889, () => {
    console.log('Koa is listening in 8889');
  });
}).catch((error) => console.log(error));
