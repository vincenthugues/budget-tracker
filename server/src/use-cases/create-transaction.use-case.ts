import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import {
  TransactionDocument,
  TransferType,
} from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private readonly logger: Logger,
  ) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    this.logger.debug('CreateTransactionUseCase', { createTransactionDto });

    if (createTransactionDto.amount <= 0) {
      this.logger.log(
        `Transaction amount must be positive: ${createTransactionDto.amount}`,
      );
      throw new Error('Transaction amount must be positive');
    }

    return this.transactionsRepository.create({
      ...createTransactionDto,
      amount:
        createTransactionDto.amount *
        (createTransactionDto.transferType === TransferType.CREDIT ? 1 : -1),
    });
  }
}
