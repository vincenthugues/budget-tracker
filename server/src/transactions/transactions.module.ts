import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeleteTransactionUseCase } from 'src/use-cases/delete-transaction.use-case';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { UpdateTransactionUseCase } from '../use-cases/update-transaction.use-case';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

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
    DeleteTransactionUseCase,
    TransactionsRepository,
    TransactionsService,
    Logger,
  ],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
