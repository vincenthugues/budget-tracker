import { Module } from '@nestjs/common';
import { PayeesService } from './payees.service';
import { PayeesController } from './payees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payee, PayeeSchema } from './schemas/payee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payee.name, schema: PayeeSchema }]),
  ],
  controllers: [PayeesController],
  providers: [PayeesService],
})
export class PayeesModule {}
