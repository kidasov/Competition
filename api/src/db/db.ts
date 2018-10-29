import { Pool, PoolClient } from 'pg';
import Sequelize from 'sequelize';

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

export async function runInTransaction<T>(
  block: (pg: PoolClient) => Promise<T>,
): Promise<T> {
  const pg = await pool.connect();
  try {
    await pg.query('begin');
    const result = await block(pg);
    await pg.query('commit');
    return result;
  } catch (e) {
    await pg.query('rollback');
    throw e;
  } finally {
    pg.release();
  }
}

export async function beginTransaction() {
  const client = await pool.connect();
  try {
    await client.query('begin');
    return {
      client,
      async commit() {
        try {
          await client.query('commit');
        } finally {
          client.release();
        }
      },
      async rollback() {
        try {
          await client.query('rollback');
        } finally {
          client.release();
        }
      },
    };
  } catch (e) {
    client.release();
    throw e;
  }
}
