import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  controllers: [SupportController],
  providers: [SupportService],
  imports: [UsersModule, TokensModule],
})
export class SupportModule {}
