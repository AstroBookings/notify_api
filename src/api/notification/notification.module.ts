import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationServicesModule } from './services/notification-services.module';

@Module({
  imports: [NotificationServicesModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
