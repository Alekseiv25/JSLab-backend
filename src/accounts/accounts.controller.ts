import { Controller, Body, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { IBasicAccountResponse, IDeleteAccountResponse } from 'src/types/responses/accounts';
import { IBasicResponse } from 'src/types/responses';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Post()
  createNewAccount(@Body() accountDto: CreateAccountDto): Promise<IBasicAccountResponse> {
    return this.accountsService.createNewAccount(accountDto);
  }

  @Put(':id')
  updateAccount(
    @Param('id') id: number,
    @Body() updatedData: CreateAccountDto,
  ): Promise<IBasicAccountResponse | IBasicResponse> {
    return this.accountsService.updateAccount(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<IDeleteAccountResponse | IBasicResponse> {
    return this.accountsService.deleteAccount(id);
  }
}
