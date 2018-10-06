import Sequelize, { DataTypes } from 'sequelize';
import event from './models/event';
import user from './models/user';
import session from './models/session';

export const sequelize = new Sequelize('competition', 'postgres', 'example', {
  host: 'localhost',
  dialect: 'postgres',
});

export const Event = event(sequelize, DataTypes);
export const User = user(sequelize, DataTypes);
export const Session = session(sequelize, DataTypes);

sequelize.sync({ force: false });
