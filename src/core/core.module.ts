import { DB_CONFIG } from '@core/config/db.config';
import JWT_CONFIG from '@core/config/jwt.config';
import { LOGGER_CONFIG } from '@core/config/logger.config';
import { CustomLogger } from '@core/custom-logger.service';
import { JwtAuthGuard } from '@core/jwt-auth.guard';
import { LoggerMiddleware } from '@core/logger.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfigFactory } from './config/jwt.factory';
import { mikroOrmConfigFactory } from './config/mikro-orm.factory';
import { ApiKeyGuard } from './guards/api-key.guard';

const envFilePath = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [DB_CONFIG, JWT_CONFIG, LOGGER_CONFIG],
      isGlobal: true,
    }),
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
  providers: [JwtAuthGuard, JwtService, CustomLogger, ApiKeyGuard],
  exports: [CustomLogger, ApiKeyGuard],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
