import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '@shared/auth/auth.module';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './services/notification.entity';
import { NotificationService } from './services/notification.service';
import { TemplateEntity } from './services/template.entity';

@Module({
  imports: [MikroOrmModule.forFeature([NotificationEntity, TemplateEntity]), AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
