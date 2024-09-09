import { NotificationStatus } from './notification-status.enum';

/**
 * The return Notification type
 * @description With UserId, subject, message and status
 */
export type Notification = {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: NotificationStatus;
};
