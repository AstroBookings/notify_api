import { registerAs } from '@nestjs/config';

export type DbConfig = {
  type: string;
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
  debug: boolean;
};

export default registerAs(
  'db',
  (): DbConfig => ({
    type: process.env.DB_TYPE || 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dbName: process.env.DB_DB_NAME || 'operationsalfa',
    debug: false,
  }),
);
