import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokensModule } from 'src/tokens/tokens.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payments.model';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [SequelizeModule.forFeature([Payment]), TokensModule],
})
export class PaymentsModule {}
