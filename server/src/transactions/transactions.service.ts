import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findOne(id: Types.ObjectId): Promise<TransactionDocument> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`No transaction found for id ${id}`);
    }

    return transaction;
  }
}
