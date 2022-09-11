import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { Payee, PayeeDocument } from './schemas/payee.schema';

@Injectable()
export class PayeesService {
  constructor(
    @InjectModel(Payee.name) private payeeModel: Model<PayeeDocument>,
  ) {}

  create(createPayeeDto: CreatePayeeDto): Promise<Payee> {
    const createdPayee = new this.payeeModel(createPayeeDto);
    return createdPayee.save();
  }

  findAll() {
    return this.payeeModel.find().exec();
  }

  findOne(id: string) {
    return this.payeeModel.findById(id).exec();
  }

  update(id: string, updatePayeeDto: UpdatePayeeDto) {
    return this.payeeModel.findOneAndUpdate({ id }, updatePayeeDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.payeeModel.deleteOne({ id });
  }
}
