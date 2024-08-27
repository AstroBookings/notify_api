import { TemplateEvent } from '../models/template-event.type';
import { NotificationBuilder } from './notification.builder';

export class NotificationFactory {
  createBuilder(eventName: TemplateEvent): NotificationBuilder {
    return new NotificationBuilder(eventName);
  }
}
