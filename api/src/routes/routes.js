import Router from 'koa-router';
import events from './events/events';
import users from './users/users';

const router = new Router();
router.use('/events', events.routes(), events.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

export default router;
