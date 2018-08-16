require('babel-register');
import router from './routes/routes';
import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { validateSession } from './services/auth';

const PORT = 3003;
const app = new Koa();

app.use(bodyParser());
app.use(cors());
app.use(validateSession())
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});
