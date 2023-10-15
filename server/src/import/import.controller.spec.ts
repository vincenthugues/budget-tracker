import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { AccountsService } from '../accounts/accounts.service';
import { Account, AccountSchema } from '../accounts/schemas/account.schema';
import { BudgetsService } from '../budgets/budgets.service';
import { Budget, BudgetSchema } from '../budgets/schemas/budget.schema';
import { CategoriesService } from '../categories/categories.service';
import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import { PayeesService } from '../payees/payees.service';
import { Payee, PayeeSchema } from '../payees/schemas/payee.schema';
import {
  Transaction,
  TransactionSchema,
} from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { TransactionsService } from '../transactions/transactions.service';
import { ImportController } from './import.controller';

describe('ImportController', () => {
  let importController: ImportController;
  let budgetModel: Model<Budget>;
  let accountModel: Model<Account>;
  let categoryModel: Model<Category>;
  let payeeModel: Model<Payee>;
  let transactionModel: Model<Transaction>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    budgetModel = inMemoryMongoConnection.model(Budget.name, BudgetSchema);
    accountModel = inMemoryMongoConnection.model(Account.name, AccountSchema);
    categoryModel = inMemoryMongoConnection.model(
      Category.name,
      CategorySchema,
    );
    payeeModel = inMemoryMongoConnection.model(Payee.name, PayeeSchema);
    transactionModel = inMemoryMongoConnection.model(
      Transaction.name,
      TransactionSchema,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        BudgetsService,
        { provide: getModelToken(Budget.name), useValue: budgetModel },
        AccountsService,
        { provide: getModelToken(Account.name), useValue: accountModel },
        CategoriesService,
        { provide: getModelToken(Category.name), useValue: categoryModel },
        PayeesService,
        { provide: getModelToken(Payee.name), useValue: payeeModel },
        TransactionsRepository,
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModel,
        },
      ],
    })
      .setLogger(new Logger())
      .compile();

    importController = moduleRef.get<ImportController>(ImportController);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  describe('[POST]', () => {
    describe('createBudget', () => {
      const budgetsImport = [
        {
          id: 'test-budget1',
          name: 'Budget 1',
          first_month: '2022-12-01',
        },
        {
          id: 'test-budget2',
          name: 'Budget 2',
          first_month: '2023-01-01',
        },
      ];

      it('should return the created budgets', async () => {
        const importedBudgets = await importController.create({
          resourceName: 'budgets',
          json: JSON.stringify(budgetsImport),
        });

        expect(importedBudgets).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: budgetsImport[0].name,
              startingDate: new Date(budgetsImport[0].first_month),
              externalId: budgetsImport[0].id,
            }),
            expect.objectContaining({
              name: budgetsImport[1].name,
              startingDate: new Date(budgetsImport[1].first_month),
              externalId: budgetsImport[1].id,
            }),
          ]),
        );
      });

      it('should fail for unhandled resources', async () => {
        expect(
          importController.create({
            resourceName: 'test',
            json: JSON.stringify([]),
          }),
        ).rejects.toThrowError('import: Resource "test" unhandled');
      });
    });
  });
});
