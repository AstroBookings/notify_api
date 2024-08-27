import { TemplateEvent } from '../models/template-event.type';
import { NotificationEntity } from './notification.entity';
import { TemplateEntity } from './template.entity';

export class NotificationBuilder {
  constructor(private readonly eventName: TemplateEvent) {}

  build(template: TemplateEntity, data: any): NotificationEntity {
    const notification = new NotificationEntity();
    notification.subject = template.subject;
    notification.message = template.message;
    return notification;
  }
}
