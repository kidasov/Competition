import * as t from 'io-ts';
import Router from 'koa-router';
import Sequelize from 'sequelize';
import { Event, Notification, User } from '../../db/models';
import { NotificationType } from '../../db/models/notification';
import { IoEventId, IoUserId } from '../../io-types';

const Op = Sequelize.Op;

const router = new Router();

router.get('/unread', async ctx => {
  const userId = await ctx.sessionUserId();

  const notificationsCount = await Notification.count(
    // @ts-ignore
    { where: { userId, read: false } },
  );

  ctx.status = 200;
  ctx.body = { unread: notificationsCount };
});

router.get('/', async ctx => {
  const userId = await ctx.sessionUserId();

  ctx.status = 200;
  ctx.body = await Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'sentByUser',
      },
      {
        model: Event,
      },
    ],
  });
});

router.delete('/all', async ctx => {
  const { userId } = await ctx.requireSession();

  await Notification.destroy({
    where: { userId },
  });

  ctx.status = 200;
  ctx.body = {};
});

router.delete('/:id', async ctx => {
  const { userId } = await ctx.requireSession();
  const id = ctx.paramNumber('id');

  const deleted = await Notification.destroy({ where: { id, userId } });

  if (!deleted) {
    return ctx.throw(404);
  }

  ctx.status = 200;
  ctx.body = {};
});

const CreateNotificationRequest = t.type({
  eventId: IoEventId,
  userId: IoUserId,
  type: t.union([t.literal(NotificationType.RejectInvitation)]),
});

router.post('/', async ctx => {
  const { userId: sentBy } = await ctx.requireSession();
  const { eventId, userId, type } = ctx.decode(CreateNotificationRequest);

  const notification = await Notification.create({
    sentBy,
    eventId,
    userId,
    type,
  });

  ctx.status = 200;
  ctx.body = { notification };
});

router.post('/read', async ctx => {
  const userId = await ctx.sessionUserId();

  await Notification.update(
    { read: true },
    // @ts-ignore
    { where: { userId, read: false } },
  );

  ctx.status = 200;
  ctx.body = {};
});

export default router;
