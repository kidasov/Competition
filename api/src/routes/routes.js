import Router from 'koa-router';
import events from './events/events';
import users from './users/users';
import { createSession } from '../services/auth';

const router = new Router();
router.use('/events', events.routes(), events.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

// TODO remove when sign in will work
router.get('/sessions', async ctx => {
  const { id, userId } = ctx.session || {};
  ctx.body = { id, userId };
  console.log(ctx.session)
});
router.post('/sessions', async ctx => {
  const sessionId = await createSession(1);
  ctx.body = { sessionId };
});

export default router;
