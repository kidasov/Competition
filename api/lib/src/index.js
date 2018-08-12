'use strict';

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');


const app = new _koa2.default();

app.use(_routes2.default.routes());
app.use(_routes2.default.allowedMethods());

app.listen(3003);