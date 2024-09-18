import { AuthJwtGuard } from '@abs/auth/auth-jwt.guard';
import { AuthUser } from '@abs/auth/auth-user.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EventDto } from './models/event.dto';
import { NotificationDto } from './models/notification.dto';
import { NotificationService } from './services/notification.service';

/**
 * Notification controller for sending notifications
 * @requires NotificationService for logic and database access
 */
@Controller('api/notification')
export class NotificationController {
  readonly #logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {
    this.#logger.verbose('🚀  initialized');
  }

  /**
   * Ping the notification controller to check if it's alive.
   *
   * 📦 Returns 'pong' if the controller is alive.
   */
  @Get('ping')
  async ping(): Promise<string> {
    this.#logger.verbose('🤖 Ping');
    return 'pong';
  }

  /**
   * Save an event as an array of notifications for related users.
   *
   * 📦 Returns the notifications that was created.
   */
  @Post()
  async saveNotifications(@Body() event: EventDto): Promise<NotificationDto[]> {
    this.#logger.verbose(`🤖 Saving notification for event: ${event.name}`);
    try {
      return await this.notificationService.saveNotifications(event);
    } catch (error) {
      this.#logger.debug(`👽 Error saving notification for event: ${event.name}`);
      throw new HttpException(error, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  /**
   * Get all pending notifications, ordered by creation date (oldest first).
   *
   * 📦 Returns an array of all pending notifications.
   */
  @Get('pending')
  async getPendingNotifications(): Promise<NotificationDto[]> {
    this.#logger.verbose('🤖 Fetching all pending notifications');
    return await this.notificationService.getPendingNotifications();
  }

  /**
   * Get user pending notifications, ordered by creation date (oldest first).
   *
   * 👮 Requires authentication.
   *
   * 📦 Returns an array of all pending notifications.
   */
  @Get('user/pending')
  @UseGuards(AuthJwtGuard)
  async getUserPendingNotifications(@AuthUser('id') userId: string): Promise<NotificationDto[]> {
    this.#logger.verbose(`🤖 Fetching and marking as read top 10 pending notifications for user: ${userId}`);
    return await this.notificationService.getUserPendingNotifications(userId);
  }

  /**
   * Send a notification by its id.
   *
   * 📦 Returns the notification that was sent.
   */
  @Post(':id/send')
  @HttpCode(200)
  async sendNotification(@Param('id') id: string): Promise<NotificationDto> {
    this.#logger.verbose(`🤖 Sending notification with id: ${id}`);
    try {
      return this.notificationService.sendNotification(id);
    } catch (error) {
      this.#logger.debug(`👽 Error sending notification with id: ${id}`, error);
      throw error;
    }
  }
}
