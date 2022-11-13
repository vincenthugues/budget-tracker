import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { CategoriesModule } from '../categories/categories.module';
import { ImportController } from './import.controller';

@Module({
  imports: [BudgetsModule, AccountsModule, CategoriesModule],
  controllers: [ImportController],
})
export class ImportModule {}
