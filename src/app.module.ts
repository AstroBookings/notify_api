import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware } from './core/logger.middleware';

// Configuration for Postgres Database
const postgresConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'OperationsDB',
  entities: [],
  synchronize: false,
};

@Module({
  imports: [MikroOrmModule.forRoot(postgresConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
