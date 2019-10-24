const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');
const logger = require('koa-logger'); // 引入各种依赖

const app = new Koa();
const koa = new Router();

app.use(require('koa-bodyparser')());

app.use(json());
app.use(logger());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('%s %s - %s', ctx.method, ctx.url, ms); // 显示执行的时间
});

app.on('error', (err) => {
  console.log('server error', err);
});

app.listen(8889, () => {
  console.log('Koa is listening in 8889');
});

module.exports = app;
