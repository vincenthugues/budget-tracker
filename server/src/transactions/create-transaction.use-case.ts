import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  TransactionDocument,
  TransferType,
} from './schemas/transaction.schema';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    console.log('UpdateTransactionUseCase', { createTransactionDto });

    if (createTransactionDto.amount <= 0) {
      console.log(
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
