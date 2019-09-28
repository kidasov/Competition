import Router from 'koa-router';
import auth from './auth/auth';
import events from './events/events';
import notifications from './notifications/notifications';
import storage from './storage/storage';
import users from './users/users';

const router = new Router();
router.use('/events', events.routes(), events.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/storage', storage.routes(), storage.allowedMethods());
router.use('/notifications', notifications.routes(), notifications.allowedMethods());

export default router;
