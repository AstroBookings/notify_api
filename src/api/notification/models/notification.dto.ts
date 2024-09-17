import { NotificationStatus } from './notification-status.enum';

/**
 * The return Notification type
 * @property {string} id - The notification id
 * @property {string} userId - The user id
 * @property {string} subject - The subject
 * @property {string} message - The message
 * @property {NotificationStatus} status - The status
 */
export type NotificationDto = {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: NotificationStatus;
};
