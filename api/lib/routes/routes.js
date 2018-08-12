'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _events = require('./events/events');

var _events2 = _interopRequireDefault(_events);

var _users = require('./users/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();
router.use('/events', _events2.default.routes(), _events2.default.allowedMethods());
router.use('/users', _users2.default.routes(), _users2.default.allowedMethods());

exports.default = router;