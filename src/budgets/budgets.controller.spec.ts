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
        name: 'New Budget',
        externalId: 'abd123',
      };
      const createdBudget = await budgetsController.create({
        name: 'New Budget',
        externalId: 'abd123',
      });

      expect(createdBudget.name).toBe(budgetStub.name);
    });

    // it('should throw AlreadyExists (Bad Request - 400) exception', async () => {
    //   const budgetStub = {
    //     name: 'New Budget',
    //     externalId: 'abd123',
    //   };

    //   await new budgetModel(budgetStub).save();

    //   await expect(budgetsController.create(budgetStub)).rejects.toThrow();
    // });
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
