import { Controller, Body, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Post()
  createNewAccount(@Body() accountDto: CreateAccountDto) {
    return this.accountsService.createNewAccount(accountDto);
  }

  @Put(':id')
  updateAccount(@Param('id') id: number, @Body() updateAccountDto: CreateAccountDto) {
    return this.accountsService.updateAccount(id, updateAccountDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.accountsService.deleteAccount(id);
  }
}
