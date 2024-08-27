import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IdService } from 'src/shared/id.service';
import { EventDto } from '../models/event.dto';
import { Notification } from '../models/notification.type';
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
    const template: TemplateEntity = await this.templateRepository.findOne({
      eventName: event.name,
    });
    if (!template) {
      throw new NotFoundException(
        `Template not found for event: ${event.name}`,
      );
    }

    const notificationBuilder = this.notificationFactory.createBuilder(
      event.name,
    );
    const notification: NotificationEntity = await notificationBuilder.build(
      template,
      event.data,
    );

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
