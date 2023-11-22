import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  controllers: [SupportController],
  providers: [SupportService],
  imports: [UsersModule, TokensModule],
})
export class SupportModule {}
