import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ISuccessfulSupportResponse } from 'src/types/responses/support';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SupportService {
  constructor(private userService: UsersService) {}

  async sendEmails(userID: number, userMessage: string): Promise<ISuccessfulSupportResponse> {
    const userInformation: User | null = await this.userService.findUserByID(userID);

    const transporter = nodemailer.createTransport({
      service: 'mail.ru',
      auth: {
        user: 'supprtmailjslab@mail.ru',
        pass: 'CVNHGLN2GgFj2Tct1Rts',
      },
    });

    const mailOptionsForSupportEmail = {
      from: 'supprtmailjslab@mail.ru',
      to: 'supprtmailjslab@mail.ru',
      subject: 'New Support Request',
      text: `Hello, ${userInformation.firstName}!\nWe received your message: ${userMessage}.\nWe will come back as soon as possible.`,
    };

    const mailOptionsForUserEmail = {
      from: 'supprtmailjslab@mail.ru',
      to: `${userInformation.email}`,
      subject: 'Support Request',
      text: `Hello, ${userInformation.firstName}!\nWe received your message: ${userMessage}.\nWe will come back as soon as possible.`,
    };

    const responseOfSendingEmailToSupport = await transporter.sendMail(mailOptionsForSupportEmail);
    const responseOfSendingEmailToUser = await transporter.sendMail(mailOptionsForUserEmail);

    if (responseOfSendingEmailToSupport && responseOfSendingEmailToUser) {
      return {
        status: 200,
        message: '',
      };
    }
  }
}
