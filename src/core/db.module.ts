import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';

const dbConfig = registerAs('mikroORM', () => ({
  driver: PostgreSqlDriver,
  autoLoadEntities: true,
  debug: false,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dbName: process.env.DB_DB_NAME || 'operationsalfa',
}));

/**
 * Module that provides the database connection to the application.
 * @description It uses MikroORM to connect to a PostgreSQL database.
 */
@Module({
  imports: [ConfigModule.forFeature(dbConfig), MikroOrmModule.forRootAsync(dbConfig.asProvider())],
})
export class DbModule {}
