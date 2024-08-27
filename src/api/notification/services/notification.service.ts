import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { IdService } from 'src/shared/id.service';
import { EventDto } from '../models/event.dto';
import { Notification } from '../models/notification.type';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationService {
  readonly #logger = new Logger(NotificationService.name);
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: EntityRepository<NotificationEntity>,
    private readonly idService: IdService,
  ) {
    this.#logger.debug('🚀  initialized');
  }

  /**
   * Sends a notification based on the provided event.
   * @param event - The event data for the notification.
   * @returns A promise that resolves to the sent notification.
   */
  async sendNotification(event: EventDto): Promise<Notification> {
    // Implement the notification sending logic here
    const notification = new NotificationEntity();
    notification.id = this.idService.generateId();
    notification.recipientEmail = 'placeholder';
    notification.subject = 'placeholder';
    notification.message = 'Notification to be sent';
    // For now, return a placeholder notification
    return {
      id: 'placeholder',
      recipient_email: 'placeholder',
      subject: 'placeholder',
      message: 'Notification to be sent',
    };
    // To Do:
    // - notification factory based on event.name
    // - returns a specific notification builder based on the event
    // - read template from database based on event.name
    // - read data from database with event.data id (could be a complex task)
    // - build notification subject and message with template and data (should be generic)
    // - save notification entity to database
    // - return notification
    // involved patterns: factory, builder, template method
  }
}
