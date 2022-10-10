import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget, BudgetDocument } from './schemas/budget.schema';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const createdBudget = new this.budgetModel(createBudgetDto);
    return createdBudget.save();
  }

  findAll(): Promise<Budget[]> {
    return this.budgetModel.find().exec();
  }

  findOne(id: Types.ObjectId): Promise<Budget> {
    return this.budgetModel.findById(id).exec();
  }

  update(id: Types.ObjectId, updateBudgetDto: UpdateBudgetDto) {
    return this.budgetModel.findOneAndUpdate({ id }, updateBudgetDto, {
      new: true,
    });
  }

  remove(id: Types.ObjectId) {
    return this.budgetModel.deleteOne({ id });
  }
}
