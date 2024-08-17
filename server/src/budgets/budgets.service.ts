import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(createBudgetDto: CreateBudgetDto): Promise<BudgetDocument> {
    return this.budgetModel.create(createBudgetDto);
  }

  async findAll(filters?: { externalId?: string }): Promise<BudgetDocument[]> {
    return this.budgetModel
      .find({
        ...(filters?.externalId ? { externalId: filters.externalId } : {}),
      })
      .exec();
  }

  async findOne(id: Types.ObjectId): Promise<BudgetDocument> {
    const budget = await this.budgetModel.findById(id).exec();
    if (!budget) {
      throw new NotFoundException(`No budget found for id ${id}`);
    }

    return budget;
  }

  async update(
    id: Types.ObjectId,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<BudgetDocument> {
    const budget = await this.budgetModel
      .findByIdAndUpdate(id, updateBudgetDto, { new: true })
      .exec();
    if (!budget) {
      throw new NotFoundException(`No budget found for id ${id}`);
    }

    return budget;
  }

  async remove(id: Types.ObjectId): Promise<any> {
    const budget = await this.budgetModel.findByIdAndDelete(id).exec();
    if (!budget) {
      throw new NotFoundException(`No budget found for id ${id}`);
    }

    return budget;
  }
}
