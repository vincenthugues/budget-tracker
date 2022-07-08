import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget, BudgetDocument } from './schemas/budget.schema';

@Injectable()
export class BudgetsService {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const createdBudget = new this.budgetModel(createBudgetDto);
    return createdBudget.save();
  }

  findAll() {
    return this.budgetModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
