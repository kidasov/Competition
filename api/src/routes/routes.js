import * as Router from 'koa-router';
import events from './events/events';
import users from './users/users';
import auth from './auth/auth';

const router = new Router();
router.use('/events', events.routes(), events.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/auth', auth.routes(), auth.allowedMethods());

export default router;
