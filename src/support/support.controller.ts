import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { ISupportResponse } from 'src/types/responses/support';
import { ISupportRequest } from 'src/types/requests/support';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @UseGuards(AuthGuard)
  async handleSupportRequest(@Body() requestBody: ISupportRequest): Promise<ISupportResponse> {
    const { userID, userMessage } = requestBody;
    const response: ISupportResponse = await this.supportService.sendEmails(userID, userMessage);
    return response;
  }
}
