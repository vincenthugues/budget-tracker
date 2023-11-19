import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  findAll(filters?: FilterTransactionDto): Promise<TransactionDocument[]> {
    return this.transactionModel.find(filters).exec();
  }
}
