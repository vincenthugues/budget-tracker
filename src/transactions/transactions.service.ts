import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDocument> {
    return this.transactionModel.create(createTransactionDto);
  }

  findAll(): Promise<TransactionDocument[]> {
    return this.transactionModel.find().exec();
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
    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    if (!transaction) {
      throw new NotFoundException(`No transaction found for id ${id}`);
    }

    return transaction;
  }

  async remove(id: Types.ObjectId): Promise<TransactionDocument> {
    const transaction = await this.transactionModel
      .findByIdAndDelete(id)
      .exec();
    if (!transaction) {
      throw new NotFoundException(`No transaction found for id ${id}`);
    }

    return transaction;
  }
}
