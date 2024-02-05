import { Notification } from '../../../notifications/notifications.model';

interface INotificationsResponseParamsData {
  page: number;
  amountOfPages: number;
  amountOfUnviewed: number;
  amountOfNotifications: number;
}
interface INotificationsResponseData {
  notifications: Notification[];
  params: INotificationsResponseParamsData;
}
export interface INotificationsResponse {
  status: number;
  data: INotificationsResponseData;
}

interface ILastNotificationResponseData {
  notification: Notification | null;
  params: {
    totalAmountOfPages: number;
    amountOfUnviewed: number;
  };
}

export interface ILastNotificationResponse {
  status: number;
  data: ILastNotificationResponseData;
}
