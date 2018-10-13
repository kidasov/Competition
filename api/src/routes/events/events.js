import Router from 'koa-router';
import { Event, Attendee, User } from '../../db/models';
import attendees from './attendees';
import { DRAFT, PUBLISHED } from '../../db/models/event';
import { sequelize } from '../../db/db';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const router = new Router();
router.use(
  '/:eventId/attendees',
  attendees.routes(),
  attendees.allowedMethods(),
);

router.get('/', async ctx => {
  const { userId } = ctx.session || {};

  ctx.status = 200;
  ctx.body = await Event.findAll({
    where: { [Op.or]: [{ state: PUBLISHED }, { ownerUserId: userId }] },
  });
});

router.post('/', async ctx => {
  const { userId } = ctx.requireSession();
  const { name } = ctx.request.body;

  const event = await Event.create({
    name,
    ownerUserId: userId,
    state: DRAFT,
  });

  ctx.status = 201;
  ctx.body = event;
});

router.delete('/:id', async ctx => {
  const { id } = ctx.params;
  const event = await Event.findOne({
    where: { id },
  });

  await Event.destroy({ where: { id: event.id } });
  ctx.status = 200;
  ctx.body = {};
});

router.get('/:id', async ctx => {
  const { id } = ctx.params;
  const event = await Event.findOne({
    where: { id },
  });

  if (!event) {
    return ctx.throw(404);
  }

  event.attendees = await Attendee.findAll({
    where: { eventId: id },
    order: [['joinedAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });

  ctx.body = event;
  ctx.status = 200;
});

router.patch('/:id', async ctx => {
  const { userId } = ctx.requireSession();
  const { id } = ctx.params;
  const { name, state } = ctx.request.body;

  const event = await Event.findOne({ where: { id } });

  if (!event) {
    return ctx.throw(404);
  }

  if (userId !== event.ownerUserId) {
    return ctx.throw(403);
  }

  await Event.update({ name, state }, { where: { id } });

  const updatedEvent = await Event.findOne({ where: { id } });

  ctx.body = updatedEvent;
  ctx.status = 200;
});

export default router;
