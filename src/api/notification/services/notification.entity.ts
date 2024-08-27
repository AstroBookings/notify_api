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
   * Recipient's email address
   */
  @Property({ fieldName: 'recipient_email' })
  recipientEmail!: string;

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
   * Timestamp of the notification
   */
  @Property()
  timestamp!: Date;

  /**
   * Status of the notification
   */
  @Property({ type: 'text' })
  status!: NotificationStatus;

  @ManyToOne(() => TemplateEntity)
  template!: TemplateEntity;
}

/**
 * Notification entity data type
 * @description Type definition for the Notification entity
 */
export type NotificationEntityData = Omit<NotificationEntity, 'id'>;
