import * as t from 'io-ts';
import * as Router from 'koa-router';
import * as Sequelize from 'sequelize';
import { Attendee, Event, User } from '../../db/models';
import { PublishState } from '../../db/models/event';
import attendees from './attendees';

const Op = Sequelize.Op;

const router = new Router();
router.use(
  '/:eventId/attendees',
  attendees.routes(),
  attendees.allowedMethods(),
);

router.get('/', async ctx => {
  const userId = ctx.session && ctx.session.userId;

  ctx.status = 200;
  ctx.body = await Event.findAll({
    where: {
      [Op.or]: [{ state: PublishState.Published }, { ownerUserId: userId }],
    },
  });
});

const CreateEventRequest = t.type({
  name: t.string,
});

router.post('/', async ctx => {
  const { userId: sessionUserId } = ctx.requireSession();

  const { name } = ctx.decode(CreateEventRequest);

  const event = await Event.create({
    name,
    ownerUserId: sessionUserId,
    state: PublishState.Draft,
  });

  ctx.status = 201;
  ctx.body = event;
});

router.delete('/:id', async ctx => {
  const id = +ctx.param('id');
  const event = await Event.findOne({
    where: { id },
  });

  if (event) {
    await Event.destroy({ where: { id: event.id } });
  }

  ctx.status = 200;
  ctx.body = {};
});

router.get('/:id', async ctx => {
  const id = +ctx.param('id');
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

const PatchEventRequest = t.type({
  name: t.string,
  state: t.union([
    t.literal(PublishState.Draft),
    t.literal(PublishState.Published),
  ]),
});

router.patch('/:id', async ctx => {
  const { userId: sessionUserId } = ctx.requireSession();
  const id = +ctx.param('id');
  const { name, state } = ctx.decode(PatchEventRequest);

  const event = await Event.findOne({ where: { id } });

  if (!event) {
    return ctx.throw(404);
  }

  if (sessionUserId !== event.ownerUserId) {
    return ctx.throw(403);
  }

  await Event.update({ name, state }, { where: { id } });

  const updatedEvent = await Event.findOne({ where: { id } });

  ctx.body = updatedEvent;
  ctx.status = 200;
});

export default router;
