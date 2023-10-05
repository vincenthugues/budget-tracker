import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  create(transaction: {
    date: Date;
    amount: number;
    accountId: string;
    payeeId: string;
    categoryId?: string;
    isCleared?: boolean;
    isDeleted?: boolean;
    externalId?: string;
    notes?: string;
  }): Promise<TransactionDocument> {
    return this.transactionModel.create(transaction);
  }
}
