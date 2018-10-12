import Router from 'koa-router';
import { Attendee, Event } from '../../db/models';
import { JOIN_REQUEST } from '../../db/models/attendee';

const router = new Router();

router.post('/register', async ctx => {
  const { userId } = ctx.requireSession();

  const { eventId } = ctx.params;
  const { role } = ctx.request.body;

  const event = await Event.findOne({
    where: { id: eventId },
  });

  if (!event) {
    return ctx.throw(404);
  }
  const attendee = await Attendee.create({
    eventId,
    userId,
    role,
    status: JOIN_REQUEST,
  });

  ctx.status = 201;
  ctx.body = { attendee };
});

router.put('/:userId/accept', async ctx => {
  const { userId: sessionUserId } = ctx.requireSession();
  const { eventId, userId } = ctx.params;
  const { role } = ctx.request.body;

  const event = await Event.findOne({
    where: { id: eventId },
  });

  if (!event) {
    return ctx.throw(404);
  }

  if (event.ownerUserId !== sessionUserId) {
    return ctx.throw(403);
  }

  await Attendee.update(
    { status: 'approved', role },
    { where: { userId, eventId } },
  );
  ctx.status = 200;
  ctx.body = {};
});

router.delete('/:userId', async ctx => {
  const { userId: sessionUserId } = ctx.requireSession();
  const { eventId, userId } = ctx.params;
  const event = await Event.findOne({
    where: { id: eventId },
  });

  if (!event) {
    return ctx.throw(404);
  }

  if (event.ownerUserId !== sessionUserId && +userId !== sessionUserId) {
    return ctx.throw(403);
  }

  await Attendee.destroy({ where: { userId, eventId } });
  ctx.status = 200;
  ctx.body = {};
});

export default router;
