import { UsersParamsService } from 'src/users_params/users_params.service';
import { Notification } from 'src/notifications/notifications.model';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private usersParamsService: UsersParamsService) {}
  private readonly connectedUsers = new Map<string, any>();

  @SubscribeMessage('update-user-id')
  handleUserIdUpdate(_: never, dto: { id: number }) {
    if (dto && dto.id) {
      this.updateUserLastActivityTimestamp(dto.id);
    }
  }

  updateUserLastActivityTimestamp(id: number): void {
    this.usersParamsService.updateUserLastActivityTimestamp(id);
  }

  @WebSocketServer() server;

  sendNotificationToUser(userId: number, amountOfNotifications: number): void {
    const socket = this.connectedUsers.get(String(userId));

    if (socket && socket.connected) {
      socket.emit('new-notification', amountOfNotifications);
    }
  }

  async handleConnection(client) {
    const userId: string = client.handshake.query.userId;

    if (userId) {
      this.connectedUsers.set(userId, client);
      this.sendAmountOfUsersUnviewedNotifications(Number(userId));
    }
  }

  handleDisconnect(client): void {
    const userId: string = client.handshake.query.userId;

    if (userId && this.connectedUsers.has(userId)) {
      this.connectedUsers.delete(userId);
    }
  }

  async sendAmountOfUsersUnviewedNotifications(userId: number): Promise<void> {
    const notifications: Notification[] | null = await Notification.findAll({
      where: { userId, isViewed: false },
    });

    this.sendNotificationToUser(Number(userId), notifications.length);
  }
}
