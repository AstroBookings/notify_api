import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { TemplateEvent } from '../models/template-event.type';
import { NotificationEntity } from './notification.entity';

@Entity({ tableName: 'templates' })
export class TemplateEntity {
  @PrimaryKey()
  id!: string;

  @Property({ name: 'event_name', type: 'text' })
  eventName!: TemplateEvent;

  @Property()
  subject!: string;

  @Property()
  message!: string;

  @OneToMany(() => NotificationEntity, (notification) => notification.template)
  notifications!: NotificationEntity[];
}

export type TemplateEntityData = Omit<TemplateEntity, 'id'>;
