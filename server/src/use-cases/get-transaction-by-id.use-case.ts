import { Injectable, Logger } from '@nestjs/common';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private readonly logger: Logger,
  ) {}

  async execute(
    transactionId: TransactionDocument['_id'],
  ): Promise<TransactionDocument> {
    this.logger.debug('GetTransactionByIdUseCase', { transactionId });

    const transaction =
      await this.transactionsRepository.findById(transactionId);
    if (!transaction) {
      throw new Error(`No transaction found for id ${transactionId}`);
    }

    return transaction;
  }
}
