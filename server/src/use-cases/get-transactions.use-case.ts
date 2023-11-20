import { Injectable, Logger } from '@nestjs/common';
import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { FilterTransactionDto } from 'src/transactions/dto/filter-transaction.dto';

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private readonly logger: Logger,
  ) {}

  async execute(
    filters?: FilterTransactionDto,
  ): Promise<TransactionDocument[]> {
    this.logger.debug('GetTransactionsUseCase');

    const transactions = await this.transactionsRepository.findAll({
      externalId: filters?.externalId,
    });

    return transactions;
  }
}
