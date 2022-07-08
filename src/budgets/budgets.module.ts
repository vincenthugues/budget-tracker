import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from './schemas/budget.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }])],
  controllers: [BudgetsController],
  providers: [BudgetsService]
})
export class BudgetsModule {}
