import * as t from 'io-ts';
import * as Router from 'koa-router';
import fetch from 'node-fetch';
import * as querystring from 'querystring';
import * as scrypt from 'scrypt';
import { User } from '../../db/models';
import logger from '../../logger';
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

  logger.info(
    `New sign up with password: ${firstName} ${lastName} <${email}>`,
    { userId: user.id },
  );

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

  const { firstName, lastName } = user;
  logger.info(
    `New sign in with password: ${firstName} ${lastName} <${email}>`,
    { userId: user.id },
  );

  const sessionKey = await createSession(user.id);

  ctx.status = 201;
  ctx.body = { sessionKey, userId: user.id };
});

const VkSignInRequest = t.type({
  redirect_uri: t.string,
  code: t.string,
});

router.post('/vk', async ctx => {
  const { redirect_uri, code } = ctx.decode(VkSignInRequest);

  const accessTokenParams = querystring.stringify({
    client_id: '6729877',
    client_secret: 'qHSNTvlvXp5eQ8E5C3fz',
    redirect_uri,
    code,
  });
  const accessTokenResponse = await fetch(
    `https://oauth.vk.com/access_token?${accessTokenParams}`,
  );
  const accessTokenJson = await accessTokenResponse.json();
  if (accessTokenResponse.status >= 400 || accessTokenJson.error) {
    ctx.status = 401;
    ctx.body = {
      error: 'unable to get access token',
      status: accessTokenResponse.status,
      response: accessTokenJson,
    };
    return;
  }

  const { access_token, user_id: userId, email } = accessTokenJson;
  const vkId = `${userId}`;

  const profileInfoParams = querystring.stringify({
    fields: 'first_name,last_name',
    access_token,
    v: '5.87',
  });
  const profileInfoResponse = await fetch(
    `https://api.vk.com/method/users.get?${profileInfoParams}`,
  );
  const profileInfoJson = await profileInfoResponse.json();
  if (profileInfoResponse.status >= 400 || profileInfoJson.error) {
    ctx.status = 401;
    ctx.body = {
      error: 'unable to get profile info',
      status: profileInfoResponse.status,
      response: profileInfoJson,
    };
    return;
  }

  const {
    response: [{ first_name: firstName, last_name: lastName }],
  } = profileInfoJson;

  async function getOrCreateVkUser() {
    const existingUser = await User.findOne({
      where: { vkId },
    });
    if (existingUser != null) {
      return existingUser;
    }
    return await User.create({
      firstName,
      lastName,
      email,
      vkId,
    });
  }

  const user = await getOrCreateVkUser();
  const sessionKey = await createSession(user.id);

  ctx.status = 201;
  ctx.body = { sessionKey, userId: user.id };
});

export default router;
