import { EventDto } from '@api/notification/models/event.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { generateId } from '@shared/utils/id.util';
import { NotificationDto } from '../models/notification.dto';
import { BuildNotifications } from './notification-builders/notification.builder';
import { NotificationsBuilderFactory } from './notification-builders/notifications-builder.factory';
import { NotificationEntity } from './notification.entity';
import { TemplateEntity } from './template.entity';

@Injectable()
export class NotificationService {
  readonly #logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: EntityRepository<NotificationEntity>,
    @InjectRepository(TemplateEntity)
    private readonly templateRepository: EntityRepository<TemplateEntity>,
    private readonly entityManager: EntityManager,
  ) {
    this.#logger.verbose('🚀  initialized');
  }

  /**
   * Saves a notification based on the provided event.
   * @param event - The event data for the notification.
   * @returns A promise that resolves to the saved notification.
   */
  async saveNotifications(event: EventDto): Promise<NotificationDto[]> {
    const notificationFactory = new NotificationsBuilderFactory();
    const notificationBuilder: BuildNotifications = notificationFactory.createNotificationsBuilder(
      event,
      this.templateRepository,
      this.entityManager,
    );
    const notifications: NotificationEntity[] = await notificationBuilder.build();
    await Promise.all(
      notifications.map(async (notification: NotificationEntity) => {
        notification.id = generateId();
        await this.notificationRepository.insert(notification);
      }),
    );
    return notifications.map((notification: NotificationEntity) => this.#mapToNotificationDto(notification));
  }

  /**
   * Retrieves all pending notifications, ordered by creation date (oldest first).
   * @returns A promise that resolves to an array of pending notifications.
   */
  async getPendingNotifications(): Promise<NotificationDto[]> {
    const pendingNotifications = await this.notificationRepository.find(
      { status: 'pending' },
      { orderBy: { createdAt: 'ASC' } },
    );
    return pendingNotifications.map(this.#mapToNotificationDto);
  }

  /**
   * Sends a notification with the given ID.
   * @param id - The ID of the notification to send.
   * @returns A promise that resolves to the sent notification.
   * @throws NotFoundException if the pending notification with the given ID is not found.
   * @description 📋 ToDo: Send mail, sms, etc.Save status when sent or failed
   */
  async sendNotification(id: string): Promise<NotificationDto> {
    const notification = await this.notificationRepository.findOne({ id, status: 'pending' });
    if (!notification) {
      this.#logger.debug(`👽 Pending notification with id ${id} not found`);
      throw new NotFoundException(`Pending notification with id ${id} not found`);
    }
    // 📋 ToDo: Send mail, sms, etc.Save status when sent or failed
    notification.status = 'sent';
    notification.updatedAt = new Date();
    const result = await this.notificationRepository.upsert(notification);
    await this.entityManager.flush();
    return this.#mapToNotificationDto(notification);
  }

  /**
   * Retrieves the pending notifications for a specific user.
   * @param userId - The ID of the user to retrieve pending notifications for.
   * @returns A promise that resolves to an array of pending notifications for the user.
   */
  async getUserPendingNotifications(userId: string): Promise<NotificationDto[]> {
    const pendingNotifications = await this.notificationRepository.find(
      { userId, status: 'pending' },
      { orderBy: { createdAt: 'ASC' }, limit: 10 },
    );
    await Promise.all(
      pendingNotifications.map(async (notification) => {
        notification.status = 'read';
        notification.updatedAt = new Date();
        await this.notificationRepository.upsert(notification);
      }),
    );
    await this.entityManager.flush();
    return pendingNotifications.map(this.#mapToNotificationDto);
  }

  #mapToNotificationDto(entity: NotificationEntity): NotificationDto {
    return {
      id: entity.id,
      userId: entity.userId,
      subject: entity.subject,
      message: entity.message,
      status: entity.status,
    };
  }
}
