import * as cors from '@koa/cors';
import { failure } from 'io-ts/lib/PathReporter';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import logger from './logger';
import router from './routes/routes';
import { getRequestSession } from './services/auth';

const PORT = 3003;
const app = new Koa();

app.context.decode = function(type) {
  const ctx = this as Koa.Context;
  return type
    .decode(ctx.request.body)
    .getOrElseL(errors =>
      ctx.throw(400, JSON.stringify({ messages: failure(errors) })),
    );
};

app.context.paramString = function(name) {
  const ctx = this as Koa.Context;
  const value = ctx.params[name];
  if (!value) {
    this.throw(400, `param ${name} is missing`);
  }
  return ctx.params[name];
};

app.context.paramNumber = function(name) {
  const rawValue = this.paramString(name);
  const value = +rawValue;
  if (Number.isNaN(value)) {
    this.throw(
      400,
      `param ${name} is expected to be a number, but got: '${rawValue}'`,
    );
  }
  return value;
};

app.context.session = async function() {
  const ctx = this as Koa.Context;
  return await getRequestSession(ctx);
};

app.context.requireSession = async function() {
  return (await this.session()).getOrElseL(() =>
    this.throw(401, 'session required'),
  );
};

app.context.sessionUserId = async function() {
  return (await this.session()).map(s => s.userId).toNullable();
};

app.use(async (ctx, next) => {
  const requestTime = new Date().getTime();
  try {
    await next();
    const durationMillis = new Date().getTime() - requestTime;
    const { method, path, status, message } = ctx;
    logger.info(
      `${method} ${path}: ${status} ${message} in ${durationMillis} ms`,
      { method, path, status, message, durationMillis },
    );
  } catch (e) {
    const durationMillis = new Date().getTime() - requestTime;
    const { method, path } = ctx;
    const status = e.status || 500;
    const message = e.message;
    logger.error(
      `${method} ${path}: ${status} ${message} in ${durationMillis} ms`,
      { method, path, status, message, durationMillis },
    );
    throw e;
  }
});
app.use(bodyParser());
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  logger.info(`The app is listening on port ${PORT}`);
});
