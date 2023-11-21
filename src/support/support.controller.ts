import { Body, Controller, Post } from '@nestjs/common';
import { SupportService } from './support.service';
import { ISuccessfulSupportResponse } from 'src/types/responses/support';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  async handleSupportRequest(
    @Body() requestBody: { userID: number; userMessage: string },
  ): Promise<ISuccessfulSupportResponse> {
    const { userID, userMessage } = requestBody;
    const response: ISuccessfulSupportResponse = await this.supportService.sendEmails(
      userID,
      userMessage,
    );
    return response;
  }
}
