import * as t from 'io-ts';
import Router from 'koa-router';
import Sequelize from 'sequelize';
import { Attendee, Event, User } from '../../db/models';
import { asEventId, EventProgressState, EventRegistationState, EventType, PublishState } from '../../db/models/event';
import { asUploadId } from '../../db/models/upload';
import { IsoDate } from '../../io-types';
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
  const { search } = ctx.request.query;

  let condition = null;

  if (search) {
    condition = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
      [Op.or]: [
        { state: PublishState.Published },
        { state: PublishState.Draft, ownerUserId: sessionUserId },
      ],
    };
  } else {
    condition = {
      [Op.or]: [
        { state: PublishState.Published },
        { state: PublishState.Draft, ownerUserId: sessionUserId },
      ],
    };
  }

  ctx.status = 200;
  // @ts-ignore
  ctx.body = await Event.findAll({
    where: condition,
    order: [['startsAt', 'DESC']],
    include: [
      'owner',
      User,
    ],
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
    type: EventType.Single,
    progressState: EventProgressState.Upcoming,
    registrationState: EventRegistationState.Closed,
  });

  ctx.status = 201;
  ctx.body = event;
});

router.delete('/:id', async ctx => {
  const { userId: sessionUserId } = await ctx.requireSession();
  const id = asEventId(ctx.paramNumber('id'));

  const event = await Event.findOne({
    where: { id },
  });

  if (!event) {
    return ctx.throw(404);
  }

  if (sessionUserId !== event.ownerUserId) {
    return ctx.throw(403);
  }

  await Event.update({state: PublishState.Archived}, { where: { id: event.id } });

  ctx.status = 200;
  ctx.body = {};
});

router.get('/:id', async ctx => {
  const id = asEventId(ctx.paramNumber('id'));

  // @ts-ignore
  const event = await Event.findOne({
    where: { id },
    include: ['owner', User],
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
        attributes: ['id', 'firstName', 'lastName', 'rating'],
      },
    ],
  });

  ctx.body = event;
  ctx.status = 200;
});

const PatchEventRequest = t.partial({
  name: t.string,
  description: t.string,
  state: t.union([
    t.literal(PublishState.Draft),
    t.literal(PublishState.Published),
  ]),
  coverMediaId: t.union([t.number, t.null]),
  startsAt: t.union([IsoDate, t.null]),
  endsAt: t.union([IsoDate, t.null]),
  endsRegAt: t.union([IsoDate, t.null]),
  type: t.union([t.literal(EventType.Single), t.literal(EventType.Pair)]),
  progressState: t.union([
    t.literal(EventProgressState.Upcoming),
    t.literal(EventProgressState.Ongoing),
    t.literal(EventProgressState.Finished),
  ]),
  registrationState: t.union([
    t.literal(EventRegistationState.Opened),
    t.literal(EventRegistationState.Closed),
  ])
});

router.patch('/:id', async ctx => {
  const { userId: sessionUserId } = await ctx.requireSession();
  const id = asEventId(ctx.paramNumber('id'));
  const {
    name,
    description,
    state,
    coverMediaId,
    startsAt,
    endsAt,
    endsRegAt,
    type,
    progressState,
    registrationState,
  } = ctx.decode(PatchEventRequest);

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
      description,
      state,
      coverMediaId:
        typeof coverMediaId === 'number'
          ? asUploadId(coverMediaId)
          : coverMediaId,
      startsAt,
      endsAt,
      endsRegAt,
      type,
      progressState,
      registrationState,
    },
    { where: { id } },
  );

  const updatedEvent = await Event.findOne({ where: { id } });

  ctx.body = updatedEvent;
  ctx.status = 200;
});

export default router;
