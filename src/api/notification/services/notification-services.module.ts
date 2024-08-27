import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../../shared/shared.module';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { TemplateEntity } from './template.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([NotificationEntity, TemplateEntity]),
    SharedModule,
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationServicesModule {}
