import { Controller, Body, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicAccountResponse,
  IDeleteAccountResponse,
  IGetAllAccountsResponse,
} from 'src/types/responses/accounts';
import { Account } from './accounts.model';
import { StationsService } from 'src/stations/stations.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private accountsService: AccountsService,
    private stationsService: StationsService,
  ) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getAccountById(@Param('id') id: number): Promise<Account | null> {
    return this.accountsService.getAccountById(id);
  }

  @Get('businessId/:businessId')
  @UseGuards(AuthGuard)
  getAccountsByBusinessId(
    @Param('businessId') businessId: number,
  ): Promise<IGetAllAccountsResponse> {
    return this.accountsService.getAccountsByBusinessId(businessId);
  }

  @Post(':accountId/station')
  async assignStationToAccount(
    @Param('accountId') accountId: number,
    @Body('stationId') stationId: number,
  ) {
    const response = await this.stationsService.assignStationToAccount(stationId, accountId);
    return response;
  }

  @Post()
  @UseGuards(AuthGuard)
  createNewAccount(@Body() accountDto: CreateAccountDto): Promise<IBasicAccountResponse> {
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
