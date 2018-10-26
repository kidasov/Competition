import * as t from 'io-ts';
import * as Router from 'koa-router';
import * as scrypt from 'scrypt';
import { User } from '../../db/models';
import { createSession } from '../../services/auth';

const router = new Router();

const SignUpRequest = t.type({
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  password: t.string,
});

router.post('/signup', async ctx => {
  const { firstName, lastName, email, password } = ctx.decode(SignUpRequest);
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

const SignInRequest = t.type({
  email: t.string,
  password: t.string,
});

router.post('/signin', async ctx => {
  const { email, password } = ctx.decode(SignInRequest);

  const user = await User.findOne({
    where: { email },
  });

  const hash = user && user.password && new Buffer(user.password, 'base64');

  const verified = hash && (await scrypt.verifyKdf(hash, password));

  if (!user || !verified) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid email or password' };
    return;
  }

  const sessionKey = await createSession(user.id);

  ctx.status = 201;
  ctx.body = { sessionKey, userId: user.id };
});

export default router;
