import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  db: process.env.MONGOURL,
};

export const appConfig = {
  env: process.env.NODE_ENV,
  host: process.env.HOST || 'http://127.0.0.1',
  path: '/v1',
  basePath: '/api',
  port: process.env.PORT,
  basePort: 3000,
  root: path.join(__dirname, '../../../'),
};

