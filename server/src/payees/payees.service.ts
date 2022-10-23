import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.payeeModel.create(createPayeeDto);
  }

  findAll(): Promise<PayeeDocument[]> {
    return this.payeeModel.find().exec();
  }

  async findOne(id: Types.ObjectId): Promise<PayeeDocument> {
    const payee = await this.payeeModel.findById(id).exec();
    if (!payee) {
      throw new NotFoundException(`No payee found for id ${id}`);
    }

    return payee;
  }

  async update(
    id: Types.ObjectId,
    updatePayeeDto: UpdatePayeeDto,
  ): Promise<PayeeDocument> {
    const payee = await this.payeeModel
      .findByIdAndUpdate(id, updatePayeeDto, { new: true })
      .exec();
    if (!payee) {
      throw new NotFoundException(`No payee found for id ${id}`);
    }

    return payee;
  }

  async remove(id: Types.ObjectId): Promise<any> {
    const payee = await this.payeeModel.findByIdAndDelete(id).exec();
    if (!payee) {
      throw new NotFoundException(`No payee found for id ${id}`);
    }

    return payee;
  }
}
