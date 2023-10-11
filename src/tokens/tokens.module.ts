import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './tokens.model';

@Module({
  providers: [TokensService],
  imports: [SequelizeModule.forFeature([Token])],
  exports: [TokensService],
})
export class TokensModule {}
