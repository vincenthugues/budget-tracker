import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { FilterAccountDto } from './dto/filter-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  create(createAccountDto: CreateAccountDto): Promise<AccountDocument> {
    return this.accountModel.create(createAccountDto);
  }

  findAll(filters?: FilterAccountDto): Promise<AccountDocument[]> {
    return this.accountModel
      .find({
        ...(filters?.externalId ? { externalId: filters.externalId } : {}),
      })
      .exec();
  }

  async findOne(id: Types.ObjectId): Promise<AccountDocument> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new NotFoundException(`No account found for id ${id}`);
    }

    return account;
  }

  async update(
    id: Types.ObjectId,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDocument> {
    const account = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec();
    if (!account) {
      throw new NotFoundException(`No account found for id ${id}`);
    }

    return account;
  }

  async remove(id: Types.ObjectId): Promise<any> {
    const account = await this.accountModel.findByIdAndDelete(id).exec();
    if (!account) {
      throw new NotFoundException(`No account found for id ${id}`);
    }

    return account;
  }
}
