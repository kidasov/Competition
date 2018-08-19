'use strict';

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _cors = require('@koa/cors');

var _cors2 = _interopRequireDefault(_cors);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _auth = require('./services/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');


const PORT = 3003;
const app = new _koa2.default();

app.use((0, _koaBodyparser2.default)());
app.use((0, _cors2.default)());
app.use((0, _auth.validateSession)());
app.use(_routes2.default.routes());
app.use(_routes2.default.allowedMethods());

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}`);
});