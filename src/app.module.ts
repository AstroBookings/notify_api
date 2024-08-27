import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationModule } from './api/notification/notification.module';
import { NotificationEntity } from './api/notification/services/notification.entity';
import { TemplateEntity } from './api/notification/services/template.entity';
import { LoggerMiddleware } from './core/logger.middleware';
// Configuration for Postgres Database
const postgresConfig = {
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  dbName: 'operationsalfa',
  entities: [NotificationEntity, TemplateEntity],
  synchronize: false,
};

@Module({
  imports: [MikroOrmModule.forRoot(postgresConfig), NotificationModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
