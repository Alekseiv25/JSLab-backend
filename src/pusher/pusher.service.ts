/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const Pusher = require('pusher');

const NOTIFICATIONS_EVENT = 'notifications-event';

@Injectable()
export class PusherService {
  private pusher: typeof Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      encrypted: true,
    });
  }

  async sendAmountOfUnviewedNotifications(userId: number, amount: number): Promise<void> {
    await this.pusher.trigger(`notifications-channel-${userId}`, NOTIFICATIONS_EVENT, { amount });
  }
}
