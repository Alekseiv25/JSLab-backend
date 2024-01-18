import * as messageGenerators from 'src/utils/generators/messageGenerators';
import * as Responses from 'src/types/responses/notifications';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SocketService } from 'src/socket/socket.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Notification } from './notifications.model';
import { IBasicResponse } from 'src/types/responses';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification) private notificationsRepository: typeof Notification,
    private socketService: SocketService,
  ) {}

  async getNotifications(
    userId: number,
    page: number = 1,
    notificationsPerPage: number = 15,
  ): Promise<Responses.INotificationsResponse> {
    const { notifications, amountOfNotifications, amountOfPages } =
      await this.findPaginatedNotifications(userId, page, notificationsPerPage);
    const amountOfUnviewed: number = await this.calcAmountOfUserUnreadNotifications(userId);

    const response: Responses.INotificationsResponse = {
      status: HttpStatus.OK,
      data: {
        notifications,
        params: { amountOfUnviewed, amountOfNotifications, amountOfPages, page },
      },
    };

    return response;
  }

  async getLastNotification(userId: number): Promise<Responses.ILastNotificationResponse> {
    const { count, rows: allNotifications } = await this.notificationsRepository.findAndCountAll({
      where: { userId },
      order: [['id', 'DESC']],
    });

    const totalAmountOfPages: number = Math.ceil(count / 15);
    const amountOfUnviewed: number = await this.calcAmountOfUserUnreadNotifications(userId);

    const response: Responses.ILastNotificationResponse = {
      status: HttpStatus.OK,
      data: {
        notification: allNotifications[0] || null,
        params: { totalAmountOfPages, amountOfUnviewed },
      },
    };
    return response;
  }

  async updateNotifications(
    userId: number,
    notificationId: 'all' | number,
  ): Promise<IBasicResponse> {
    if (notificationId === 'all') {
      await this.markAllNotificationsAsViewed(userId);
    } else {
      await this.markNotificationAsViewed(notificationId);
    }

    await this.sendNotificationBySocket(userId);

    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: messageGenerators.makeSuccessUpdatingMessage(),
    };
    return response;
  }

  async createNotificationForUser(createDto: CreateNotificationDto): Promise<Notification> {
    const newNotification: Notification = await this.notificationsRepository.create(createDto);
    await this.sendNotificationBySocket(createDto.userId);
    return newNotification;
  }

  async createNotificationsAboutRemovedOrAddedAssign(
    variant: 'Removed' | 'Added',
    userId: number,
    stationNames: string[],
  ): Promise<void> {
    const stationNamesString: string = stationNames.join(', ');

    const createNotificationDto: CreateNotificationDto = {
      userId: userId,
      title: `${variant === 'Removed' ? 'Removed' : 'Added'} assignments`,
      message: `You are ${
        variant === 'Removed' ? 'no longer assigned' : 'now also assigned'
      } to the statio${stationNames.length > 1 ? 'ns:' : 'n'} ${stationNamesString}`,
      createdAt: String(new Date().getTime()),
    };

    await this.notificationsRepository.create(createNotificationDto);
    await this.sendNotificationBySocket(userId);
  }

  async createActivationNotificationForAdmin(adminId: number, userName: string): Promise<void> {
    const createNotificationDto: CreateNotificationDto = {
      userId: adminId,
      title: 'New account activation!',
      message: `${userName} activated the account!`,
      createdAt: String(new Date().getTime()),
    };

    await this.notificationsRepository.create(createNotificationDto);
    await this.sendNotificationBySocket(adminId);
  }

  async createPaymentNotificationForAdmin(
    adminId: number,
    userName: string,
    stationName: string,
    paymentAmount: string,
    paymentSubject: string,
  ): Promise<void> {
    const createNotificationDto: CreateNotificationDto = {
      userId: adminId,
      title: 'New payment',
      message: `${userName} made a payment for the ${stationName} station in the amount of $${paymentAmount}. Subject of payment: ${paymentSubject}.`,
      createdAt: String(new Date().getTime()),
    };

    await this.notificationsRepository.create(createNotificationDto);
    await this.sendNotificationBySocket(adminId);
  }

  async createDeletePaymentNotificationForAdmin(
    adminId: number,
    userName: string,
    stationName: string,
    paymentAmount: string,
    paymentSubjects: string[],
  ): Promise<void> {
    const isMultiplePayments = paymentSubjects.length > 1;
    const paymentWord = isMultiplePayments ? 'payments' : 'payment';
    const subjectWord = isMultiplePayments ? 'subjects' : 'subject';

    const title = `Deleted ${paymentWord}`;
    const message = `${userName} deleted ${paymentWord} for the ${stationName} station. The amount of deleted ${paymentWord}: $${paymentAmount}, ${subjectWord} of ${paymentWord}: ${paymentSubjects.join(
      ', ',
    )}.`;

    const createNotificationDto: CreateNotificationDto = {
      userId: adminId,
      title,
      message,
      createdAt: String(new Date().getTime()),
    };

    await this.notificationsRepository.create(createNotificationDto);
    await this.sendNotificationBySocket(adminId);
  }

  async deleteNotifications(userId: number): Promise<IBasicResponse> {
    const notifications: Notification[] | null = await this.notificationsRepository.findAll({
      where: { userId },
    });

    for (const notificationRecord of notifications) {
      await notificationRecord.destroy();
    }

    await this.sendNotificationBySocket(userId);

    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: messageGenerators.makeDeleteMessage('Notifications'),
    };
    return response;
  }

  private async markAllNotificationsAsViewed(userId: number): Promise<void> {
    const notifications: Notification[] = await this.notificationsRepository.findAll({
      where: { userId, isViewed: false },
    });

    for (const notification of notifications) {
      await notification.update({ isViewed: true });
    }
  }

  private async markNotificationAsViewed(notificationId: number): Promise<void> {
    const notification: Notification = await this.notificationsRepository.findByPk(notificationId);
    await notification.update({ isViewed: true });
  }

  private async sendNotificationBySocket(userId: number): Promise<void> {
    const calcAmountOfUserUnreadNotifications: number =
      await this.calcAmountOfUserUnreadNotifications(userId);

    await this.socketService.sendNotificationToUser(userId, calcAmountOfUserUnreadNotifications);
  }

  private async calcAmountOfUserUnreadNotifications(userId: number): Promise<number> {
    const notifications: Notification[] | null = await this.notificationsRepository.findAll({
      where: { userId, isViewed: false },
    });

    return notifications.length;
  }

  private async findPaginatedNotifications(
    userId: number,
    page: number,
    notificationsPerPage: number,
  ): Promise<{
    notifications: Notification[];
    amountOfNotifications: number;
    amountOfPages: number;
  }> {
    const offset: number = (page - 1) * notificationsPerPage;

    const notifications = await this.notificationsRepository.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: notificationsPerPage,
      offset: offset,
    });

    const amountOfNotifications: number = await this.notificationsRepository.count({
      where: { userId },
    });

    const amountOfPages: number = Math.ceil(amountOfNotifications / notificationsPerPage);

    return { notifications, amountOfNotifications, amountOfPages };
  }
}
