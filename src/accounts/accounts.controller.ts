import { Controller, Body, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicAccountResponse,
  IDeleteAccountResponse,
  IGetAllAccountsResponse,
} from 'src/types/responses/accounts';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':businessId')
  @UseGuards(AuthGuard)
  getAccountsByBusinessId(
    @Param('businessId') businessId: number,
  ): Promise<IGetAllAccountsResponse> {
    return this.accountsService.getAccountsByBusinessId(businessId);
  }

  @Post()
  @UseGuards(AuthGuard)
  createNewAccount(@Body() accountDto: CreateAccountDto): Promise<IBasicAccountResponse> {
    console.log(accountDto);
    return this.accountsService.createNewAccount(accountDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateAccount(
    @Param('id') id: number,
    @Body() updatedData: CreateAccountDto,
  ): Promise<IBasicAccountResponse> {
    return this.accountsService.updateAccount(id, updatedData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number): Promise<IDeleteAccountResponse> {
    return this.accountsService.deleteAccount(id);
  }
}
