import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { TemplateEvent } from '../models/template-event.enum';
import { NotificationEntity } from './notification.entity';

/**
 * Entity mapper for the templates table
 */
@Entity({ tableName: 'templates' })
export class TemplateEntity {
  /**
   * The template id
   */
  @PrimaryKey()
  id!: string;

  /**
   * The template event name
   */
  @Property({ name: 'event_name', type: 'text' })
  eventName!: TemplateEvent;

  /**
   * The subject of the template
   */
  @Property()
  subject!: string;

  /**
   * The message of the template
   */
  @Property()
  message!: string;

  /**
   * The notifications associated with the template
   */
  @OneToMany(() => NotificationEntity, (notification) => notification.template)
  notifications?: NotificationEntity[];
}
