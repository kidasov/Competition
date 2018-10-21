import Router from 'koa-router';
import { User } from '../../db/models';
import { getTtwCurrentRating } from '../../ttw-parser/player-points';

const router = new Router();

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.body = await User.findAll();
});

router.get('/:id', async ctx => {
  const { userId } = ctx.session || {};
  const { id } = ctx.params;

  const attributes =
    userId === +id
      ? ['id', 'firstName', 'lastName', 'email', 'ttwId']
      : ['id', 'firstName', 'lastName', 'ttwId'];

  const user = await User.findOne({
    where: { id },
    attributes,
  });

  ctx.status = 200;
  ctx.body = user;
});

router.post('/', async ctx => {
  const { firstName, lastName, email } = ctx.request.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
  });

  ctx.status = 201;
  ctx.body = { user };
});

router.delete('/:id', async ctx => {
  const { id } = ctx.params;
  const user = await User.findOne({
    where: { id },
  });

  await User.destroy({ where: { id: user.id } });
  ctx.status = 200;
  ctx.body = {};
});

router.patch('/:id', async ctx => {
  const { userId } = ctx.requireSession();
  const { id } = ctx.params;

  const { firstName, lastName, email, ttwId } = ctx.request.body;

  const user = await User.findOne({
    where: { id },
  });

  if (!user) {
    return ctx.throw(404);
  }

  if (userId !== user.id) {
    return ctx.throw(403);
  }

  const rating = (() => {
    if (ttwId != null) {
      try {
        return getTtwCurrentRating(ttwId);
      } catch (e) {
        console.log('failed to fetch ttw rating:', e);
      }
    }
  })();

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
