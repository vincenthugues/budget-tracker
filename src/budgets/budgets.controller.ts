import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './schemas/budget.schema';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto): Promise<Budget> {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  findAll(): Promise<Budget[]> {
    return this.budgetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId): Promise<Budget> {
    return this.budgetsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.budgetsService.remove(id);
  }
}
