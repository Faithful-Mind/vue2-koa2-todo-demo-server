import Router from 'koa-router';
import jwt from 'koa-jwt';

import auth from './auth';
import api from './api';
import graphqlMiddleware from './graphql';

const router = new Router();

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/api', jwt({ secret: 'vue-koa-demo', key: 'jwtdata' }), api.routes(), api.allowedMethods());
router.get('/graphql', graphqlMiddleware);
router.post('/graphql', graphqlMiddleware);

export default router;
