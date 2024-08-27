import { Body, Controller, Post } from '@nestjs/common';
import { EventDto } from './models/event.dto';
import { Notification } from './models/notification.type';
import { NotificationService } from './services/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendNotification(@Body() event: EventDto): Promise<Notification> {
    return await this.notificationService.sendNotification(event);
  }
}
