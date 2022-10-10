import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    return createdAccount.save();
  }

  findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  findOne(id: string): Promise<Account> {
    return this.accountModel.findById(id).exec();
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.accountModel.findOneAndUpdate({ id }, updateAccountDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.accountModel.deleteOne({ id });
  }
}
