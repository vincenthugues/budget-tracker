import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionDocument,
  TransferType,
} from './schemas/transaction.schema';

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

  async update(
    id: Types.ObjectId,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDocument> {
    const { transferType, amount, ...transactionUpdate } = updateTransactionDto;

    const transaction = await this.transactionModel
      .findByIdAndUpdate(
        id,
        {
          ...transactionUpdate,
          amount:
            amount !== undefined
              ? amount * (transferType === TransferType.CREDIT ? 1 : -1)
              : undefined,
        },
        { new: true },
      )
      .exec();
    if (!transaction) {
      throw new NotFoundException(`No transaction found for id ${id}`);
    }

    return transaction;
  }

  async remove(id: Types.ObjectId): Promise<any> {
    const transaction = await this.transactionModel
      .findByIdAndDelete(id)
      .exec();
    if (!transaction) {
      throw new NotFoundException(`No transaction found for id ${id}`);
    }

    return transaction;
  }
}
