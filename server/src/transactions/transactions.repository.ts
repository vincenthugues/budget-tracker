import { Injectable, NotFoundException } from '@nestjs/common';
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
    transferType: string;
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

  findById(
    id: TransactionDocument['_id'],
  ): Promise<TransactionDocument | null> {
    return this.transactionModel.findById(id);
  }

  update(
    id: TransactionDocument['_id'],
    transaction: {
      date?: Date;
      amount?: number;
      transferType?: string;
      accountId?: string;
      payeeId?: string;
      categoryId?: string;
      isCleared?: boolean;
      isDeleted?: boolean;
      externalId?: string;
      notes?: string;
    },
  ): Promise<TransactionDocument> {
    return this.transactionModel.findByIdAndUpdate(id, transaction, {
      new: true,
    });
  }

  async delete(id: TransactionDocument['_id']): Promise<TransactionDocument> {
    const transaction = await this.transactionModel
      .findByIdAndDelete(id)
      .exec();
    if (!transaction) {
      throw new NotFoundException(`No transaction found for id ${id}`);
    }

    return transaction;
  }
}
