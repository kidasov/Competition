import { Session } from '../db/db';

function validateSession() {
  return async (ctx, next) => {
    const id = ctx.headers.authorization;
    if (id == null) {
      return await next();
    }
    const session = await Session.findOne({
      where: { id },
    });
    if (session == null) {
      return ctx.throw(401, 'session expired');
    }
    ctx.session = session;
    await next();
  };
}

async function createSession(userId) {
  const id = generateSessionId(30);
  await Session.create({
    id,
    userId,
  });
  return id;
}

function generateSessionId(length) {
  const letters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const a = [];
  for (let i = 0; i < length; i++) {
    a.push(letters.charAt(Math.random() * letters.length));
  }
  return a.join('');
}

export { validateSession, createSession };
