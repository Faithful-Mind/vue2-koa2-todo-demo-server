import Router from 'koa-router';
import user from './user';
import todolist from './todolist';

const router = new Router();

router.use('/user', user.routes(), user.allowedMethods());
router.use('/user/:userId', todolist.routes(), todolist.allowedMethods());

export default router;
