import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget, BudgetSchema } from './schemas/budget.schema';

describe('BudgetsController', () => {
  let budgetsController: BudgetsController;
  let budgetModel: Model<Budget>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    budgetModel = inMemoryMongoConnection.model(Budget.name, BudgetSchema);

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [
        BudgetsService,
        { provide: getModelToken(Budget.name), useValue: budgetModel },
      ],
    }).compile();

    budgetsController = moduleRef.get<BudgetsController>(BudgetsController);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  describe('[POST]', () => {
    const BASE_BUDGET_PAYLOAD = {
      name: 'New budget',
      externalId: 'abc123',
      startingDate: new Date('2022-01-15'),
    };

    it('should return the saved object', async () => {
      const createdBudget = await budgetsController.create(BASE_BUDGET_PAYLOAD);

      expect(createdBudget).toMatchObject(BASE_BUDGET_PAYLOAD);
    });

    it('should fail if the name is empty', async () => {
      const budgetPayload = {
        ...BASE_BUDGET_PAYLOAD,
        name: '',
      };

      expect(budgetsController.create(budgetPayload)).rejects.toThrowError(
        'Budget validation failed: name: Path `name` is required.',
      );
    });

    it('should fail if the externalId is undefined', async () => {
      const budgetPayload = {
        ...BASE_BUDGET_PAYLOAD,
        externalId: undefined,
      };

      expect(await budgetsController.create(budgetPayload)).toMatchObject({
        name: 'New budget',
        externalId: undefined,
      });
    });

    it('should work if the startingDate is undefined', async () => {
      const budgetPayload = {
        ...BASE_BUDGET_PAYLOAD,
        startingDate: undefined,
      };

      expect(await budgetsController.create(budgetPayload)).toMatchObject({
        name: 'New budget',
        externalId: 'abc123',
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of budgets', async () => {
      const budgetPayload = {
        name: 'New Budget',
        externalId: 'abc123',
      };
      await budgetModel.create(budgetPayload);

      expect(await budgetsController.findAll()).toMatchObject([budgetPayload]);
    });

    it('should return an array of budgets matching the filter', async () => {
      const budgetPayload1 = {
        name: 'Budget 1',
        externalId: 'abc123',
      };
      const budgetPayload2 = {
        name: 'Budget 2',
        externalId: 'def456',
      };
      await budgetModel.create(budgetPayload1, budgetPayload2);

      expect(
        await budgetsController.findAll({ externalId: 'def456' }),
      ).toMatchObject([budgetPayload2]);
    });
  });
});
