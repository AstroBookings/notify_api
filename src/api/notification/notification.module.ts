import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { NotificationServicesModule } from './services/notification-services.module';

@Module({
  imports: [NotificationServicesModule, JwtModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
