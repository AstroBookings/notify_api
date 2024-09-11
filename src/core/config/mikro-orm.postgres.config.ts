import { NotificationEntity } from '@api/notification/services/notification.entity';
import { TemplateEntity } from '@api/notification/services/template.entity';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

/**
 * Configuration for Postgres Database
 */
export const POSTGRES_CONFIG: MikroOrmModuleSyncOptions = {
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  dbName: 'operationsalfa',
  entities: [NotificationEntity, TemplateEntity],
  debug: false,
};
