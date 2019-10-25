const Router = require('koa-router');
const user = require('../controllers/user.js');

const router = new Router();

router.post('/register', user.registerUser);

module.exports = router;
