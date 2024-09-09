import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './services/notification.entity';
import { NotificationService } from './services/notification.service';
import { TemplateEntity } from './services/template.entity';

@Module({
  imports: [MikroOrmModule.forFeature([NotificationEntity, TemplateEntity]), SharedModule, JwtModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
