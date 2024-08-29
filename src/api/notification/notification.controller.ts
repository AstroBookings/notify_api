import { Body, Controller, Get, HttpCode, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/jwt-auth.guard';
import { User } from '../../core/user.decorator';
import { EventDto } from './models/event.dto';
import { Notification } from './models/notification.type';
import { NotificationService } from './services/notification.service';

/**
 * Notification controller
 * @description Endpoints for sending notifications
 * @requires NotificationService for logic and database access
 */
@Controller('api/notification')
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
  async saveNotifications(@Body() event: EventDto): Promise<Notification[]> {
    this.#logger.log(`🤖 Saving notification for event: ${event.name}`);
    return await this.notificationService.saveNotifications(event);
  }

  /**
   * Get all pending notifications, ordered by creation date (oldest first).
   * @returns An array of all pending notifications.
   */
  @Get('pending')
  async getPendingNotifications(): Promise<Notification[]> {
    this.#logger.log('🤖 Fetching all pending notifications');
    return await this.notificationService.getPendingNotifications();
  }

  /**
   * Get all pending notifications, ordered by creation date (oldest first).
   * @returns An array of all pending notifications.
   */
  @Get('user/pending')
  @UseGuards(JwtAuthGuard)
  async getUserPendingNotifications(@User('id') userId: string): Promise<Notification[]> {
    this.#logger.log(`🤖 Fetching all pending notifications for user: ${userId}`);
    // Todo: filter for the user, and return only top 10 recent notifications
    return await this.notificationService.getPendingNotifications();
  }

  @Post(':id/send')
  @HttpCode(200)
  async sendNotification(@Param('id') id: string): Promise<Notification> {
    this.#logger.log(`🤖 Sending notification with id: ${id}`);
    return this.notificationService.sendNotification(id);
  }
}
