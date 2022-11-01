import { Module } from '@nestjs/common';
import { BudgetsModule } from 'src/budgets/budgets.module';
import { ImportController } from './import.controller';

@Module({
  imports: [BudgetsModule],
  controllers: [ImportController],
})
export class ImportModule {}
