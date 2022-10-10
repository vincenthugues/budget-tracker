import { Injectable } from '@nestjs/common';
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

  create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createTransactionDto);
    return createdTransaction.save();
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  findOne(id: Types.ObjectId): Promise<Transaction> {
    return this.transactionModel.findById(id).exec();
  }

  update(id: Types.ObjectId, updateTransactionDto: UpdateTransactionDto) {
    return this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, {
      new: true,
    });
  }

  remove(id: Types.ObjectId) {
    return this.transactionModel.deleteOne({ id });
  }
}
