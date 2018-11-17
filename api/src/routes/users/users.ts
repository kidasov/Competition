import * as t from 'io-ts';
import Router from 'koa-router';
import { Op } from 'sequelize';
import { Attendee, Event, User } from '../../db/models';
import { PublishState } from '../../db/models/event';
import { asUserId } from '../../db/models/user';
import logger from '../../logger';
import {
  getTtwCurrentRating,
  InvalidTtwId,
} from '../../ttw-parser/player-points';

const router = new Router();

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.body = await User.findAll();
});

router.get('/:id', async ctx => {
  const sessionUserId = await ctx.sessionUserId();
  const id = asUserId(ctx.paramNumber('id'));

  const attributes =
    sessionUserId === id
      ? ['id', 'firstName', 'lastName', 'email', 'ttwId', 'rating']
      : ['id', 'firstName', 'lastName', 'ttwId', 'rating'];

  const user = await User.findOne({
    where: { id },
    attributes,
  });

  ctx.status = 200;
  ctx.body = user;
});

router.get('/:userId/events', async ctx => {
  const sessionUserId = await ctx.sessionUserId();
  const userId = asUserId(ctx.paramNumber('userId'));

  const events = await Attendee.findAll({
    where: { userId },
    include: [
      {
        model: Event,
        where: {
          [Op.or]: [
            { state: PublishState.Published },
            { ownerUserId: sessionUserId },
          ],
        },
      },
    ],
  }).map(attendee => {
    const { event, ...rest } = attendee.toJSON();
    return {
      ...event,
      attendee: rest,
    };
  });

  ctx.status = 200;
  ctx.body = events;
});

const CreateUserRequest = t.type({
  firstName: t.string,
  lastName: t.string,
  email: t.string,
});

router.post('/', async ctx => {
  const { firstName, lastName, email } = ctx.decode(CreateUserRequest);

  const user = await User.create({
    firstName,
    lastName,
    email,
  });

  ctx.status = 201;
  ctx.body = { user };
});

router.delete('/:id', async ctx => {
  const id = asUserId(ctx.paramNumber('id'));
  const user = await User.findOne({
    where: { id },
  });

  if (user) {
    await User.destroy({ where: { id: user.id } });
  }

  ctx.status = 200;
  ctx.body = {};
});

const PatchUserRequest = t.partial({
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  ttwId: t.string,
});

router.patch('/:id', async ctx => {
  const { userId: sessionUserId } = await ctx.requireSession();
  const id = asUserId(ctx.paramNumber('id'));
  const { firstName, lastName, email, ttwId } = ctx.decode(PatchUserRequest);

  const user = await User.findOne({
    where: { id },
  });

  if (!user) {
    return ctx.throw(404);
  }

  if (sessionUserId !== user.id) {
    return ctx.throw(403);
  }

  async function safeFetchRating() {
    if (ttwId != null) {
      try {
        return await getTtwCurrentRating(ttwId);
      } catch (e) {
        if (e instanceof InvalidTtwId) {
          return ctx.throw(400, e.message);
        } else {
          logger.error('failed to fetch ttw rating:', {
            error: e.toString(),
            message: e.message,
            ttwId,
          });
        }
      }
    }
    return null;
  }

  const rating = await safeFetchRating();

  await User.update(
    {
      firstName,
      lastName,
      email,
      ttwId,
      rating,
    },
    { where: { id: user.id } },
  );
  ctx.status = 200;
  ctx.body = {};
});

export default router;
