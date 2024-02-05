import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { IBasicResponse } from '../types/responses';
import { AuthGuard } from '../auth/auth.guard';
import {
  ILastNotificationResponse,
  INotificationsResponse,
} from '../types/responses/notifications';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getNotifications(
    @Query('userId') userId: number,
    @Query('page') page?: number,
    @Query('notificationsPerPage') notificationsPerPage?: number,
  ): Promise<INotificationsResponse> {
    return this.notificationsService.getNotifications(userId, page, notificationsPerPage);
  }

  @Get('last')
  @UseGuards(AuthGuard)
  getLastNotification(@Query('userId') userId: number): Promise<ILastNotificationResponse> {
    return this.notificationsService.getLastNotification(userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateNotifications(
    @Param('id') id: number,
    @Body('notificationId') notificationId: 'all' | number,
  ): Promise<IBasicResponse> {
    return this.notificationsService.updateNotifications(id, notificationId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteNotifications(@Param('id') id: number): Promise<IBasicResponse> {
    return this.notificationsService.deleteNotifications(id);
  }
}
