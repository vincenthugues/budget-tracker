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

describe('BudgetsService', () => {
  let budgetsController: BudgetsController;
  let budgetsService: BudgetsService;
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
    budgetsService = moduleRef.get<BudgetsService>(BudgetsService);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  it('should be defined', () => {
    expect(budgetsService).toBeDefined();
  });

  describe('create', () => {
    it('should return the saved object', async () => {
      const budgetStub = {
        name: 'New Budget',
        externalId: 'abd123',
      };
      const createdBudget = await budgetsService.create({
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

    //   await expect(budgetsService.create(budgetStub)).rejects.toThrow();
    // });
  });

  describe('findAll', () => {
    it('should return an array of budgets', async () => {
      const budgetStub = {
        name: 'New Budget',
        externalId: 'abd123',
      };

      await new budgetModel(budgetStub).save();

      expect(await budgetsService.findAll()).toMatchObject([budgetStub]);
    });
  });

  describe('findOne', () => {
    it('should return a budget if given a valid id', async () => {
      const budgetStub = {
        name: 'New Budget',
        externalId: 'abd123',
      };

      const savedBudget = await new budgetModel(budgetStub).save();

      expect(await budgetsService.findOne(savedBudget.id)).toMatchObject(
        budgetStub,
      );
    });

    it('should return null otherwise', async () => {
      expect(
        await budgetsService.findOne('ffffffffffffffffffffffff'),
      ).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a budget if given a valid id', async () => {
      const budgetStub = {
        name: 'Budget',
        externalId: 'abd123',
      };

      const savedBudget = await new budgetModel(budgetStub).save();

      expect(
        await budgetsService.update(savedBudget.id, {
          name: 'Budget (updated)',
        }),
      ).toMatchObject(budgetStub);
    });

    it('should return null otherwise', async () => {
      expect(
        await budgetsService.update('ffffffffffffffffffffffff', {
          name: 'Budget (updated)',
        }),
      ).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a budget if given a valid id', async () => {
      const budgetStub = {
        name: 'Budget',
        externalId: 'abd123',
      };
      const savedBudget = await new budgetModel(budgetStub).save();

      expect((await budgetsService.remove(savedBudget.id)).deletedCount).toBe(
        1,
      );
      expect((await budgetModel.find().exec()).length).toBe(0);
    });

    it('should return null otherwise', async () => {
      expect(
        (await budgetsService.remove('ffffffffffffffffffffffff')).deletedCount,
      ).toBe(0);
    });
  });
});
