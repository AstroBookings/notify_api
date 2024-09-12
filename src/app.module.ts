import { AdminModule } from '@api/admin/admin.module';
import { NotificationModule } from '@api/notification/notification.module';
import { CoreModule } from '@core/core.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule, NotificationModule, AdminModule],
})
export class AppModule {}
