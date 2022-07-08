import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), BudgetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
