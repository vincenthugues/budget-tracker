import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget, BudgetDocument } from './schemas/budget.schema';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Budget,
    description: 'Budget successfully created',
  })
  create(@Body() createBudgetDto: CreateBudgetDto): Promise<BudgetDocument> {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  @ApiOkResponse({
    type: [Budget],
    description: 'Returns the list of budgets',
  })
  findAll(): Promise<BudgetDocument[]> {
    return this.budgetsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: Budget,
    description: 'Returns the requested budget',
  })
  @ApiNotFoundResponse({ description: 'Budget not found' })
  findOne(@Param('id') id: Types.ObjectId): Promise<BudgetDocument> {
    return this.budgetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: Budget,
    description: 'Returns the updated budget',
  })
  @ApiNotFoundResponse({ description: 'Budget not found' })
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The requested budget was deleted' })
  @ApiNotFoundResponse({ description: 'Budget not found' })
  remove(@Param('id') id: Types.ObjectId) {
    return this.budgetsService.remove(id);
  }
}
