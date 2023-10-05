import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  TransactionDocument,
  TransferType,
} from './schemas/transaction.schema';
import { TransactionsRepository } from './transactions.repository';
import { ValidationError } from 'class-validator';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    if (createTransactionDto.amount <= 0) {
      console.log(
        `Transaction amount must be positive: ${createTransactionDto.amount}`,
      );
      throw new Error('Transaction amount must be positive');
    }

    return this.transactionsRepository.create({
      date: createTransactionDto.date,
      amount:
        createTransactionDto.amount *
        (createTransactionDto.transferType === TransferType.CREDIT ? 1 : -1),
      accountId: createTransactionDto.accountId,
      payeeId: createTransactionDto.payeeId,
      categoryId: createTransactionDto.categoryId,
      isCleared: createTransactionDto.isCleared,
      isDeleted: createTransactionDto.isDeleted,
      externalId: createTransactionDto.externalId,
      notes: createTransactionDto.notes,
    });
  }
}
