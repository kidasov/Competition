import Router from 'koa-router';
import { Event, Attendee, User } from '../../db/models';
import attendees from './attendees';

const router = new Router();
router.use(
  '/:eventId/attendees',
  attendees.routes(),
  attendees.allowedMethods(),
);

router.get('/', async ctx => {
  // ctx.router available
  ctx.status = 200;
  ctx.body = await Event.findAll();
});

router.post('/', async ctx => {
  const { userId } = ctx.requireSession();
  const { name, location, description } = ctx.request.body;

  const event = await Event.create({
    name,
    location,
    description,
    ownerUserId: userId,
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
  const { name } = ctx.request.body;

  const event = await Event.findOne({ where: { id } });

  if (!event) {
    return ctx.throw(404);
  }

  if (userId !== event.ownerUserId) {
    return ctx.throw(403);
  }

  await Event.update({ name }, { where: { id } });

  const updatedEvent = await Event.findOne({ where: { id } });

  ctx.body = updatedEvent;
  ctx.status = 200;
});

export default router;
