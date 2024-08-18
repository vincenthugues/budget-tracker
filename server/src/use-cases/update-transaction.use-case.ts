import { Injectable, Logger } from '@nestjs/common';
import { UpdateTransactionDto } from '../transactions/dto/update-transaction.dto';
import {
  TransactionDocument,
  TransferType,
} from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private readonly logger: Logger,
  ) {}

  async execute(
    transactionId: TransactionDocument['_id'],
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDocument | null> {
    this.logger.debug('CreateTransactionUseCase', {
      transactionId,
      updateTransactionDto,
    });

    const transaction =
      await this.transactionsRepository.findById(transactionId);
    if (!transaction) {
      throw new Error(`No transaction found for id ${transactionId}`);
    }

    const transferType: TransferType =
      updateTransactionDto.transferType ||
      (transaction.amount > 0 ? TransferType.CREDIT : TransferType.DEBIT);

    if (
      updateTransactionDto.amount !== undefined &&
      updateTransactionDto.amount <= 0
    ) {
      this.logger.log(
        `Transaction amount must be positive: ${updateTransactionDto.amount}`,
      );
      throw new Error('Transaction amount must be positive');
    }
    const amount: number | undefined = updateTransactionDto.amount
      ? updateTransactionDto.amount *
        (transferType === TransferType.CREDIT ? 1 : -1)
      : undefined;

    return this.transactionsRepository.update(transactionId, {
      ...updateTransactionDto,
      amount,
    });
  }
}
