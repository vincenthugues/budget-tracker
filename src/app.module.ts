import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BudgetsModule } from './budgets/budgets.module';

const MONGODB_CONNECTION_URI = 'mongodb://localhost/nest';

@Module({
  imports: [MongooseModule.forRoot(MONGODB_CONNECTION_URI), BudgetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
