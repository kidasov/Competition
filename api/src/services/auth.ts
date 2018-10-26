import { Middleware } from 'koa';
import { Session } from '../db/models';
import { SessionId } from '../db/models/session';
import { UserId } from '../db/models/user';

function validateSession(): Middleware {
  return async (ctx, next) => {
    ctx.requireSession = () => {
      if (!ctx.session) {
        return ctx.throw(401, 'session required');
      }
      return ctx.session;
    };
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

async function createSession(userId: UserId): Promise<SessionId> {
  const id = generateSessionId(30);
  await Session.create({
    id,
    userId,
  });
  return id;
}

function generateSessionId(length: number): SessionId {
  const letters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const a = [];
  for (let i = 0; i < length; i++) {
    a.push(letters.charAt(Math.random() * letters.length));
  }
  return a.join('');
}

export { validateSession, createSession };
