import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { Payee, PayeeDocument } from './schemas/payee.schema';

@Injectable()
export class PayeesService {
  constructor(
    @InjectModel(Payee.name) private payeeModel: Model<PayeeDocument>,
  ) {}

  create(createPayeeDto: CreatePayeeDto): Promise<PayeeDocument> {
    const createdPayee = new this.payeeModel(createPayeeDto);
    return createdPayee.save();
  }

  findAll(): Promise<PayeeDocument[]> {
    return this.payeeModel.find().exec();
  }

  findOne(id: Types.ObjectId): Promise<PayeeDocument> {
    return this.payeeModel.findById(id).exec();
  }

  update(id: Types.ObjectId, updatePayeeDto: UpdatePayeeDto) {
    return this.payeeModel.findOneAndUpdate({ id }, updatePayeeDto, {
      new: true,
    });
  }

  remove(id: Types.ObjectId) {
    return this.payeeModel.deleteOne({ id });
  }
}
