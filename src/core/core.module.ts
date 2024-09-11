import DB_CONFIG from '@core/config/db.config';
import JWT_CONFIG from '@core/config/jwt.config';
import { JwtAuthGuard } from '@core/jwt-auth.guard';
import { LoggerMiddleware } from '@core/logger.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfigFactory } from './config/jwt.factory';
import { mikroOrmConfigFactory } from './config/mikro-orm.factory';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [DB_CONFIG, JWT_CONFIG] }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mikroOrmConfigFactory,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: jwtConfigFactory,
    }),
  ],
  providers: [JwtAuthGuard, JwtService],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
