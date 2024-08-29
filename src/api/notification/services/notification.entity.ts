import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { NotificationStatus } from '../models/notification-status.type';
import { TemplateEntity } from './template.entity';

/**
 * Notification entity
 * @description Entity for read/write on notifications table
 */
@Entity({ tableName: 'notifications' })
export class NotificationEntity {
  /**
   * Primary key
   */
  @PrimaryKey()
  id!: string;

  /**
   * User ID associated with the notification
   */
  @Property({ fieldName: 'user_id' })
  userId!: string;

  /**
   * Notification subject
   */
  @Property()
  subject!: string;

  /**
   * Notification message content
   */
  @Property({ type: 'text' })
  message!: string;

  /**
   * Notification data
   */
  @Property({ type: 'json' })
  data: any;

  /**
   * Timestamp of the notification
   */
  @Property({ fieldName: 'created_at' })
  createdAt!: Date;

  /**
   * Timestamp of the last update
   */
  @Property({ fieldName: 'updated_at' })
  updatedAt: Date | null = null;

  /**
   * Status of the notification
   */
  @Property({ type: 'text' })
  status!: NotificationStatus;

  /**
   * Template Entity associated with the notification
   */
  @ManyToOne(() => TemplateEntity)
  template!: TemplateEntity;
}

/**
 * Notification entity data type
 * @description Type definition for the Notification entity
 */
export type NotificationEntityData = Omit<NotificationEntity, 'id'>;
