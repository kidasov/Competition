import Sequelize, { DataTypes } from 'sequelize';
import event from './models/event';
import user from './models/user';

export const sequelize = new Sequelize('competition', 'postgres', 'example', {
  host: 'localhost',
  dialect: 'postgres',
});

export const Event = event(sequelize, DataTypes);
export const User = user(sequelize, DataTypes);

sequelize.sync();
