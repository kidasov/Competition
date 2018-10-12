import Router from 'koa-router';
import { User } from '../../db/models';

const router = new Router();

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.body = await User.findAll();
});

router.get('/:id', async ctx => {
  const { id } = ctx.params;
  const user = User.findOne({
    where: { id },
  });

  ctx.status = 200;
  ctx.body = { user };
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
  const { id } = ctx.params;

  const { firstName, lastName, email } = ctx.request.body;

  const user = await User.findOne({
    where: { id },
  });

  await User.update(
    {
      firstName,
      lastName,
      email,
    },
    { where: { id: user.id } },
  );
  ctx.status = 200;
  ctx.body = {};
});

export default router;
