const Router = require('koa-router');
const jwt = require('koa-jwt');

const user = require('./user.js');
const auth = require('./auth.js');
const api = require('./api.js');
const graphqlMiddleware = require('./graphql.js');

const router = new Router();

router.use('/user', user.routes(), user.allowedMethods());
router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/api', jwt({ secret: 'vue-koa-demo' }), api.routes(), api.allowedMethods());
router.get('/graphql', graphqlMiddleware);
router.post('/graphql', graphqlMiddleware);

module.exports = router;
