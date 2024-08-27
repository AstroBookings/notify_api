import { Body, Controller, Logger, Post } from '@nestjs/common';
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

  /**
   * Sends an event notification for related users.
   * @param event - The event to send.
   * @returns The notification that was sent.
   */
  @Post()
  async sendNotification(@Body() event: EventDto): Promise<Notification> {
    this.#logger.log(`🤖 Sending notification for event: ${event.name}`);
    return await this.notificationService.saveNotification(event);
  }
}
