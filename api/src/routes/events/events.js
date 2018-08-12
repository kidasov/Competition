import Router from "koa-router";
import { Event } from "../../db/db";

const router = new Router();

router.get("/", async ctx => {
  // ctx.router available
  ctx.status = 200;
  ctx.body = await Event.findAll();
});

router.post("/", async ctx => {
  const { name, location, description } = ctx.request.body;

  const event = await Event.create({
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
  const event = await Event.findOne({
    where: { id }
  });

  await Event.destroy({ where: { id: event.id } });
  ctx.status = 200;
  ctx.body = {};
});

export default router;
