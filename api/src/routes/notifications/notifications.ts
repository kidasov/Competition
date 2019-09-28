import Router from 'koa-router';
import Sequelize from 'sequelize';
import { Event, Notification, User } from '../../db/models';

const Op = Sequelize.Op;

const router = new Router();

router.get('/', async ctx => {
  const userId = await ctx.sessionUserId();

  ctx.status = 200;
  ctx.body = await Notification.findAll({
    where: {
      [Op.or]: [{ userId }],
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'sentByUser',
      },
      {
        model: Event,
      },
    ],
  });
});

export default router;
