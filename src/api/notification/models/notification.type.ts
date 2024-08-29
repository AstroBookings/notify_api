import { NotificationStatus } from './notification-status.type';

export type Notification = {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: NotificationStatus;
};
