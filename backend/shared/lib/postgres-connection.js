import pg from 'pg'
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg

const ensureSslMode = (connectionString) => {
  if (!connectionString) return connectionString
  if (/sslmode=/i.test(connectionString)) return connectionString
  return connectionString.includes('?')
    ? `${connectionString}&sslmode=require`
    : `${connectionString}?sslmode=require`
}

const poolConfig = config.DATABASE_URL
  ? {
      connectionString: ensureSslMode(config.DATABASE_URL),
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      host: config.POSTGRES_HOST,
      user: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DATABASE,
      port: config.POSTGRES_PORT,
      ssl: {
        rejectUnauthorized: false,
      },
  }

const pool = new Pool(poolConfig)

export const query = async (q, params) => {
  const start = Date.now();

  try {
    const res = await pool.query(q, params);
    const duration = Date.now() - start;
    logger.info('Executed query', { q, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}