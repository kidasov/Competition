'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _db = require('../../db/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.body = await _db.User.findAll();
});

router.get('/:id', async ctx => {
  const { id } = ctx.params;
  const user = _db.User.findOne({
    where: { id }
  });

  ctx.status = 200;
  ctx.body = { user };
});

router.post('/', async ctx => {
  const { firstName, lastName, email } = ctx.request.body;

  const user = await _db.User.create({
    firstName,
    lastName,
    email
  });

  ctx.status = 201;
  ctx.body = { user };
});

router.delete('/:id', async ctx => {
  const { id } = ctx.params;
  const user = await _db.User.findOne({
    where: { id }
  });

  await _db.User.destroy({ where: { id: user.id } });
  ctx.status = 200;
  ctx.body = {};
});

router.patch('/:id', async ctx => {
  const { id } = ctx.params;

  const { firstName, lastName, email } = ctx.request.body;
  console.log(ctx.request.body);

  const user = await _db.User.findOne({
    where: { id }
  });

  await _db.User.update({
    firstName,
    lastName,
    email
  }, { where: { id: user.id } });
  ctx.status = 200;
  ctx.body = {};
});

exports.default = router;