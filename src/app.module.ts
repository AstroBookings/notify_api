import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationModule } from './api/notification/notification.module';
import { NotificationEntity } from './api/notification/services/notification.entity';
import { LoggerMiddleware } from './core/logger.middleware';

// Configuration for Postgres Database
const postgresConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'OperationsDB',
  entities: [NotificationEntity],
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
