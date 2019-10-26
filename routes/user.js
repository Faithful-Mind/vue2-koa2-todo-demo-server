const Router = require('koa-router');
const user = require('../controllers/user.js');

const router = new Router();

router.post('/register', user.registerUser);
router.patch('/:id', user.patchUserPassword);

module.exports = router;
