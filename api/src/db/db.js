import Sequelize, { DataTypes } from 'sequelize';

export const sequelize = new Sequelize('competition', 'postgres', 'example', {
  host: 'localhost',
  dialect: 'postgres',
});
