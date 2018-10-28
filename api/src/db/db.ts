import { Pool } from 'pg';
import * as Sequelize from 'sequelize';

export const sequelize = new Sequelize('competition', 'postgres', 'example', {
  host: 'localhost',
  dialect: 'postgres',
});

export const pool = new Pool({
  user: 'postgres',
  password: 'example',
  host: 'localhost',
  database: 'competition',
});
