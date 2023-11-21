import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ISupportResponse } from 'src/types/responses/support';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import {
  makeNotFoundMessage,
  makeSuccessSendingMessage,
} from 'src/utils/generators/messageGenerators';
import {
  ISupportEmailGeneratorArguments,
  IUserEmailGeneratorArguments,
  generateHTMLForEmailToSupport,
  generateHTMLForEmailToUser,
} from 'src/utils/generators/emailGenerators';

@Injectable()
export class SupportService {
  constructor(private userService: UsersService) {}

  async sendEmails(userID: number, userMessage: string): Promise<ISupportResponse> {
    const userInformation: User | null = await this.userService.findUserByID(userID);

    if (!userInformation) {
      throw new HttpException(makeNotFoundMessage('User'), HttpStatus.NOT_FOUND);
    }

    const userInformationForSupportEmail: ISupportEmailGeneratorArguments = {
      userID: userID,
      userEmailAddress: userInformation.email,
      userFirstName: userInformation.firstName,
      userLastName: userInformation.lastName,
      userMessage: userMessage,
    };

    const informationForUserEmail: IUserEmailGeneratorArguments = {
      userMessage: userMessage,
      userFirstName: userInformation.firstName,
    };

    const transporter = nodemailer.createTransport({
      service: process.env.SUPPORT_EMAIL_SERVICE_NAME,
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    const mailOptionsForSupportEmail = {
      from: process.env.SUPPORT_EMAIL,
      to: process.env.SUPPORT_EMAIL,
      subject: 'New Support Request',
      html: generateHTMLForEmailToSupport(userInformationForSupportEmail),
    };

    const mailOptionsForUserEmail = {
      from: process.env.SUPPORT_EMAIL,
      to: `${userInformation.email}`,
      subject: 'Support Request',
      html: generateHTMLForEmailToUser(informationForUserEmail),
    };

    await transporter.sendMail(mailOptionsForSupportEmail);
    await transporter.sendMail(mailOptionsForUserEmail);

    const response: ISupportResponse = {
      status: 200,
      message: makeSuccessSendingMessage(),
    };

    return response;
  }
}
