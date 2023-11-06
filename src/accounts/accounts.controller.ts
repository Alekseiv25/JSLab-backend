import { Controller, Body, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  IBasicAccountResponse,
  IDeleteAccountResponse,
  IGetAllAccountsResponse,
} from 'src/types/responses/accounts';
import { Account } from './accounts.model';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  getAccountById(@Param('id') id: number): Promise<Account | null> {
    return this.accountsService.getAccountById(id);
  }

  @Get('businessId/:businessId')
  getAccountsByBusinessId(
    @Param('businessId') businessId: number,
  ): Promise<IGetAllAccountsResponse> {
    return this.accountsService.getAccountsByBusinessId(businessId);
  }

  @Post()
  createNewAccount(@Body() accountDto: CreateAccountDto): Promise<IBasicAccountResponse> {
    console.log(accountDto);
    return this.accountsService.createNewAccount(accountDto);
  }

  @Put(':id')
  updateAccount(
    @Param('id') id: number,
    @Body() updatedData: CreateAccountDto,
  ): Promise<IBasicAccountResponse> {
    return this.accountsService.updateAccount(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<IDeleteAccountResponse> {
    return this.accountsService.deleteAccount(id);
  }
}
