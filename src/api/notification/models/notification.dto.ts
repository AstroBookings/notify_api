import { NotificationStatus } from './notification-status.enum';

/**
 * The return Notification type
 */
export class NotificationDto {
  /**
   * The notification id
   * @example 'notif_1'
   */
  id: string;
  /**
   * The user id
   * @example 'usr_a1'
   */
  userId: string;
  /**
   * The subject
   * @example 'Welcome to the platform'
   */
  subject: string;
  /**
   * The message
   * @example 'Hello, you have a new message'
   */
  message: string;
  /**
   * The status. Could be pending, read, sent or failed
   * @example 'pending'
   */
  status: NotificationStatus;
}
