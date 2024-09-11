import { POSTGRES_CONFIG } from '@core/config/mikro-orm.postgres.config';
import { JwtAuthGuard } from '@core/jwt-auth.guard';
import { LoggerMiddleware } from '@core/logger.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forRoot(POSTGRES_CONFIG), JwtModule],
  providers: [JwtAuthGuard, JwtService],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
