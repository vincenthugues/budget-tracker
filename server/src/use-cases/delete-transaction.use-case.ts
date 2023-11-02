import { Injectable, Logger } from '@nestjs/common';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private readonly logger: Logger,
  ) {}

  async execute(id: TransactionDocument['_id']): Promise<TransactionDocument> {
    this.logger.debug('DeleteTransactionUseCase', { id });

    return this.transactionsRepository.delete(id);
  }
}
