import * as cors from '@koa/cors';
import { failure } from 'io-ts/lib/PathReporter';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import router from './routes/routes';
import { validateSession } from './services/auth';

const PORT = 3003;
const app = new Koa();

app.use(bodyParser());
app.use(cors());
app.use(async (ctx, next) => {
  ctx.decode = type =>
    type
      .decode(ctx.request.body)
      .getOrElseL(errors => ctx.throw(400, failure(errors).join('\n')));
  ctx.param = name => ctx.params[name];
  await next();
});
app.use(validateSession());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
