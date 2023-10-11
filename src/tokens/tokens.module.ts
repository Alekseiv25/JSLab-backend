import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [TokensService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'TOP_SECRET',
      signOptions: {
        expiresIn: '12h',
      },
    }),
  ],
  exports: [TokensService],
})
export class TokensModule {}
