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

  it('should be defined', () => {
    expect(budgetsController).toBeDefined();
  });

  describe('[POST]', () => {
    it('should return the saved object', async () => {
      const budgetStub = {
        name: 'New budget',
        externalId: 'abd123',
        startingDate: new Date('2022-01-15'),
      };
      const createdBudget = await budgetsController.create(budgetStub);

      expect(createdBudget).toMatchObject(budgetStub);
    });

    it('should fail if the name is empty', async () => {
      const budgetStub = {
        name: '',
        externalId: 'abd123',
        startingDate: new Date('2022-01-15'),
      };

      expect(budgetsController.create(budgetStub)).rejects.toThrowError(
        'Budget validation failed: name: Path `name` is required.',
      );
    });

    it('should fail if the externalId is empty', async () => {
      const budgetStub = {
        name: 'New budget',
        externalId: '',
        startingDate: new Date('2022-01-15'),
      };

      expect(budgetsController.create(budgetStub)).rejects.toThrowError(
        'Budget validation failed: externalId: Path `externalId` is required.',
      );
    });

    it('should work if the startingDate is empty', async () => {
      const budgetStub = {
        name: 'New budget',
        externalId: 'abc123',
        startingDate: null,
      };

      expect(await budgetsController.create(budgetStub)).toMatchObject({
        name: 'New budget',
        externalId: 'abc123',
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of budgets', async () => {
      const budgetStub = {
        name: 'New Budget',
        externalId: 'abd123',
      };

      await new budgetModel(budgetStub).save();

      expect(await budgetsController.findAll()).toMatchObject([budgetStub]);
    });
  });
});
