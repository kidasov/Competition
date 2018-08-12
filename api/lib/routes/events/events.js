"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _db = require("../../db/db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();

router.get("/", async ctx => {
  // ctx.router available
  ctx.status = 200;
  ctx.body = await _db.Event.findAll();
});

router.post("/", async ctx => {
  const { name, location, description } = ctx.request.body;

  const event = await _db.Event.create({
    name,
    location,
    description
  });

  ctx.status = 201;
  ctx.body = {};
});

router.delete("/:id", async ctx => {
  const { id } = ctx.params;
  console.log("ctx params", id);
  const event = await _db.Event.findOne({
    where: { id }
  });

  await _db.Event.destroy({ where: { id: event.id } });
  ctx.status = 200;
  ctx.body = {};
});

exports.default = router;