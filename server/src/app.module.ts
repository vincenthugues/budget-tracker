import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BudgetsModule } from './budgets/budgets.module';
import { CategoriesModule } from './categories/categories.module';
import { ImportModule } from './import/import.module';
import { PayeesModule } from './payees/payees.module';
import { TransactionsModule } from './transactions/transactions.module';

const MONGODB_CONNECTION_URI = 'mongodb://localhost/budget-tracker';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_CONNECTION_URI),
    BudgetsModule,
    AccountsModule,
    CategoriesModule,
    PayeesModule,
    TransactionsModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
