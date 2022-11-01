import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { BudgetsModule } from 'src/budgets/budgets.module';
import { ImportController } from './import.controller';

@Module({
  imports: [BudgetsModule, AccountsModule],
  controllers: [ImportController],
})
export class ImportModule {}
