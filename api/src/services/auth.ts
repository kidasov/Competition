import { none, Option, some } from 'fp-ts/lib/Option';
import { Context } from 'koa';
import { Session } from '../db/models';
import { asSessionId, SessionId, SessionInstance } from '../db/models/session';
import { UserId } from '../db/models/user';

async function getRequestSession(
  ctx: Context,
): Promise<Option<SessionInstance>> {
  const id = ctx.headers.authorization;
  if (id == null) {
    return none;
  }
  const session = await Session.findOne({
    where: { id },
  });
  if (session == null) {
    return ctx.throw(401, 'session expired');
  }
  return some(session);
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
  return asSessionId(a.join(''));
}

export { getRequestSession, createSession };
