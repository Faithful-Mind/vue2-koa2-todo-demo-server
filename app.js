const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');
const logger = require('koa-logger');
const jwt = require('koa-jwt');

const auth = require('./routes/auth.js');
const api = require('./routes/api.js');

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

koa.use('/auth', auth.routes()); // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
koa.use('/api', jwt({ secret: 'vue-koa-demo' }), api.routes()); // 所有走/api/打头的请求都需要经过jwt中间件的验证。secret密钥必须跟我们当初签发的secret一致


app.use(koa.routes()); // 将路由规则挂载到Koa上。

app.listen(8889, () => {
  console.log('Koa is listening in 8889');
});

module.exports = app;
