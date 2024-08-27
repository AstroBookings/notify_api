import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { IdService } from 'src/shared/id.service';
import { EventDto } from '../models/event.dto';
import { Notification } from '../models/notification.type';
import { BuildNotifications } from './notification.builder';
import { NotificationEntity } from './notification.entity';
import { NotificationFactory } from './notification.factory';
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
    private readonly idService: IdService,
    private readonly notificationFactory: NotificationFactory,
  ) {
    this.#logger.debug('🚀  initialized');
  }

  /**
   * Saves a notification based on the provided event.
   * @param event - The event data for the notification.
   * @returns A promise that resolves to the saved notification.
   */
  async saveNotification(event: EventDto): Promise<Notification> {
    const notificationBuilder: BuildNotifications =
      this.notificationFactory.createBuilder(
        event,
        this.templateRepository,
        this.entityManager,
      );
    const notification: NotificationEntity = await notificationBuilder.build();
    await this.notificationRepository.insert(notification);
    return this.mapToNotification(notification);
  }

  private mapToNotification(entity: NotificationEntity): Notification {
    return {
      id: entity.id,
      recipientEmail: entity.recipientEmail,
      subject: entity.subject,
      message: entity.message,
    };
  }
}
