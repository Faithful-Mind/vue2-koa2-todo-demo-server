const Koa = require('koa');
const json = require('koa-json');
const logger = require('koa-logger');

const router = require('./routes');

const app = new Koa();

app.use(require('koa-bodyparser')());

app.use(json());
app.use(logger());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
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

module.exports = app;
