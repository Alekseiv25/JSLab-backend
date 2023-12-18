import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UsersParamsService } from 'src/users_params/users_params.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService {
  constructor(private readonly usersParamsService: UsersParamsService) {}

  updateUserId(id: number) {
    this.usersParamsService.updateUserLastActivityTimestamp(id);
  }

  @SubscribeMessage('update-user-id')
  handleUserIdUpdate(_: never, dto: { id: number }) {
    if (dto && dto.id) {
      this.updateUserId(dto.id);
    }
  }
}
