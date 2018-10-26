import * as t from 'io-ts';
import * as Router from 'koa-router';
import { Attendee, Event } from '../../db/models';
import { AttendeeRole, AttendeeStatus } from '../../db/models/attendee';

const router = new Router();

const RegisterRequest = t.type({
  role: t.union([
    t.literal(AttendeeRole.Participant),
    t.literal(AttendeeRole.Watcher),
    t.literal(AttendeeRole.Judge),
    t.literal(AttendeeRole.Owner),
  ]),
});

router.post('/register', async ctx => {
  const { userId } = ctx.requireSession();
  const eventId = +ctx.param('eventId');
  const { role } = ctx.decode(RegisterRequest);

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
    status: AttendeeStatus.JoinRequest,
  });

  ctx.status = 201;
  ctx.body = { attendee };
});

const AcceptRequest = t.partial({
  role: t.union([
    t.literal(AttendeeRole.Participant),
    t.literal(AttendeeRole.Watcher),
    t.literal(AttendeeRole.Judge),
    t.literal(AttendeeRole.Owner),
  ]),
});

router.put('/:userId/accept', async ctx => {
  const { userId: sessionUserId } = ctx.requireSession();
  const eventId = +ctx.param('eventId');
  const userId = +ctx.param('userId');
  const { role } = ctx.decode(AcceptRequest);

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
    { status: AttendeeStatus.Approved, role },
    { where: { userId, eventId } },
  );
  ctx.status = 200;
  ctx.body = {};
});

router.delete('/:userId', async ctx => {
  const { userId: sessionUserId } = ctx.requireSession();
  const eventId = +ctx.param('eventId');
  const userId = +ctx.param('userId');

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
