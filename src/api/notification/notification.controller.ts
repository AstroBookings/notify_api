import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { EventDto } from './models/event.dto';
import { Notification } from './models/notification.type';
import { NotificationService } from './services/notification.service';

/**
 * Notification controller
 * @description Endpoints for sending notifications
 * @requires NotificationService for logic and database access
 */
@Controller('notification')
export class NotificationController {
  readonly #logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {
    this.#logger.debug('🚀  initialized');
  }

  @Get('test')
  async test(): Promise<string> {
    return 'Hello World!';
  }

  /**
   * Save an event as an array of notifications for related users.
   * @param event - The event to save.
   * @returns The notifications that was created.
   */
  @Post()
  async sendNotification(@Body() event: EventDto): Promise<Notification[]> {
    this.#logger.log(`🤖 Sending notification for event: ${event.name}`);
    return await this.notificationService.saveNotifications(event);
  }
}
