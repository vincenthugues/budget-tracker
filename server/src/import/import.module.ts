import { Logger, Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { CategoriesModule } from '../categories/categories.module';
import { PayeesModule } from '../payees/payees.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ImportController } from './import.controller';

@Module({
  imports: [
    BudgetsModule,
    AccountsModule,
    CategoriesModule,
    PayeesModule,
    TransactionsModule,
  ],
  controllers: [ImportController],
  providers: [Logger],
})
export class ImportModule {}
