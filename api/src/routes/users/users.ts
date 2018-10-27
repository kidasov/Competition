import * as t from 'io-ts';
import * as Router from 'koa-router';
import { User } from '../../db/models';
import { asUserId } from '../../db/models/user';

const router = new Router();

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.body = await User.findAll();
});

router.get('/:id', async ctx => {
  const sessionUserId = (await ctx.session()).map(s => s.userId).toNullable();
  const id = asUserId(ctx.paramNumber('id'));

  const attributes =
    sessionUserId === id
      ? ['id', 'firstName', 'lastName', 'email', 'ttwId']
      : ['id', 'firstName', 'lastName', 'ttwId'];

  const user = await User.findOne({
    where: { id },
    attributes,
  });

  ctx.status = 200;
  ctx.body = user;
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

  await User.update(
    {
      firstName,
      lastName,
      email,
      ttwId,
    },
    { where: { id: user.id } },
  );
  ctx.status = 200;
  ctx.body = {};
});

export default router;
