import * as t from 'io-ts';
import * as Router from 'koa-router';
import * as Sequelize from 'sequelize';
import { Attendee, Event, User } from '../../db/models';
import { asEventId, PublishState } from '../../db/models/event';
import { asUploadId } from '../../db/models/upload';
import attendees from './attendees';

const Op = Sequelize.Op;

const router = new Router();
router.use(
  '/:eventId/attendees',
  attendees.routes(),
  attendees.allowedMethods(),
);

router.get('/', async ctx => {
  const sessionUserId = await ctx.sessionUserId();

  ctx.status = 200;
  ctx.body = await Event.findAll({
    where: {
      [Op.or]: [
        { state: PublishState.Published },
        { ownerUserId: sessionUserId },
      ],
    },
  });
});

const CreateEventRequest = t.type({
  name: t.string,
});

router.post('/', async ctx => {
  const { userId: sessionUserId } = await ctx.requireSession();
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
  const id = asEventId(ctx.paramNumber('id'));

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
  const id = asEventId(ctx.paramNumber('id'));

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

const PatchEventRequest = t.partial({
  name: t.string,
  state: t.union([
    t.literal(PublishState.Draft),
    t.literal(PublishState.Published),
  ]),
  coverMediaId: t.number,
});

router.patch('/:id', async ctx => {
  const { userId: sessionUserId } = await ctx.requireSession();
  const id = asEventId(ctx.paramNumber('id'));
  const { name, state, coverMediaId } = ctx.decode(PatchEventRequest);

  const event = await Event.findOne({ where: { id } });

  if (!event) {
    return ctx.throw(404);
  }

  if (sessionUserId !== event.ownerUserId) {
    return ctx.throw(403);
  }

  await Event.update(
    {
      name,
      state,
      coverMediaId: coverMediaId != null ? asUploadId(coverMediaId) : null,
    },
    { where: { id } },
  );

  const updatedEvent = await Event.findOne({ where: { id } });

  ctx.body = updatedEvent;
  ctx.status = 200;
});

export default router;
