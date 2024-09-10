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
    this.#logger.verbose('🚀  initialized');
  }

  @Get('ping')
  async ping(): Promise<string> {
    return 'pong';
  }

  /**
   * Save an event as an array of notifications for related users.
   * @param event - The event to save.
   * @returns The notifications that was created.
   */
  @Post()
  async saveNotifications(@Body() event: EventDto): Promise<Notification[]> {
    this.#logger.verbose(`🤖 Saving notification for event: ${event.name}`);
    return await this.notificationService.saveNotifications(event);
  }

  /**
   * Get all pending notifications, ordered by creation date (oldest first).
   * @returns An array of all pending notifications.
   */
  @Get('pending')
  async getPendingNotifications(): Promise<Notification[]> {
    this.#logger.verbose('🤖 Fetching all pending notifications');
    return await this.notificationService.getPendingNotifications();
  }

  /**
   * Get all pending notifications, ordered by creation date (oldest first).
   * @returns An array of all pending notifications.
   */
  @Get('user/pending')
  @UseGuards(JwtAuthGuard)
  async getUserPendingNotifications(@User('id') userId: string): Promise<Notification[]> {
    this.#logger.verbose(`🤖 Fetching and marking as read top 10 pending notifications for user: ${userId}`);
    return await this.notificationService.getUserPendingNotifications(userId);
  }

  @Post(':id/send')
  @HttpCode(200)
  async sendNotification(@Param('id') id: string): Promise<Notification> {
    this.#logger.verbose(`🤖 Sending notification with id: ${id}`);
    try {
      return this.notificationService.sendNotification(id);
    } catch (error) {
      this.#logger.debug(`👽 Error sending notification with id: ${id}`, error);
      throw error;
    }
  }
}
