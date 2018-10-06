import Router from 'koa-router';
import scrypt from 'scrypt';
import { createSession } from '../../services/auth';
import { User } from '../../db/db';

const router = new Router();

router.post('/signup', async ctx => {
  const { firstName, lastName, email, password } = ctx.request.body;
  const searchedUser = await User.findOne({
    where: { email },
  });

  if (searchedUser) {
    ctx.status = 400;
    ctx.body = { error: 'You have dopplaganger bitch' };
    return;
  }

  const hashedPassword = (await scrypt.kdf(
    password,
    await scrypt.params(1),
  )).toString('base64');

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const sessionKey = await createSession(user.id);

  ctx.status = 201;
  ctx.body = { sessionKey, userId: user.id };
});

router.post('/signin', async ctx => {
  const { email, password } = ctx.request.body;

  const user = await User.findOne({
    where: { email },
  });

  const hash = user && new Buffer(user.password, 'base64');

  const verified = hash && (await scrypt.verifyKdf(hash, password));

  if (!verified) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid email or password' };
    return;
  }

  const sessionKey = await createSession(user.id);

  ctx.status = 201;
  ctx.body = { sessionKey, userId: user.id };
});

export default router;
