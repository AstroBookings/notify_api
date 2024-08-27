import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [SharedModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationServicesModule {}
