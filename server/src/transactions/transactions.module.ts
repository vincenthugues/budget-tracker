import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionUseCase } from '../use-cases/update-transaction.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
    TransactionsRepository,
    TransactionsService,
    Logger,
  ],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
