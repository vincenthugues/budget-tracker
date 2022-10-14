import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
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
    it('should return the saved object with timestamps', async () => {
      const budgetPayload = {
        name: 'New Budget',
        externalId: 'abd123',
      };
      const createdBudget = await budgetsService.create(budgetPayload);

      expect(createdBudget).toMatchObject(budgetPayload);
      expect(createdBudget.createdAt).toBeDefined();
      expect(createdBudget.updatedAt).toBeDefined();
    });

    // it('should throw AlreadyExists (Bad Request - 400) exception', async () => {
    //   const budgetPayload = {
    //     name: 'New Budget',
    //     externalId: 'abd123',
    //   };

    //   await new budgetModel(budgetPayload).save();

    //   await expect(budgetsService.create(budgetPayload)).rejects.toThrow();
    // });
  });

  describe('findAll', () => {
    it('should return an array of budgets', async () => {
      const budgetPayload = {
        name: 'New Budget',
        externalId: 'abd123',
      };

      await new budgetModel(budgetPayload).save();

      expect(await budgetsService.findAll()).toMatchObject([budgetPayload]);
    });
  });

  describe('findOne', () => {
    it('should return a budget if given a valid id', async () => {
      const budgetPayload = {
        name: 'New Budget',
        externalId: 'abd123',
      };

      const savedBudget = await new budgetModel(budgetPayload).save();

      expect(await budgetsService.findOne(savedBudget.id)).toMatchObject(
        budgetPayload,
      );
    });

    it('should return null otherwise', async () => {
      expect(
        await budgetsService.findOne(
          new Types.ObjectId('ffffffffffffffffffffffff'),
        ),
      ).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a budget if given a valid id', async () => {
      const budgetPayload = {
        name: 'Budget',
        externalId: 'abd123',
      };
      const savedBudget = await new budgetModel(budgetPayload).save();

      const budgetPatch = {
        name: 'Budget (updated)',
        startingDate: new Date('2020-01-15'),
      };
      expect(
        await budgetsService.update(savedBudget.id, budgetPatch),
      ).toMatchObject({
        ...budgetPayload,
        ...budgetPatch,
      });
    });

    it('should return null otherwise', async () => {
      expect(
        await budgetsService.update(
          new Types.ObjectId('ffffffffffffffffffffffff'),
          {
            name: 'Budget (updated)',
          },
        ),
      ).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a budget if given a valid id', async () => {
      const budgetPayload = {
        name: 'Budget',
        externalId: 'abd123',
      };
      const savedBudget = await new budgetModel(budgetPayload).save();

      expect((await budgetsService.remove(savedBudget.id)).deletedCount).toBe(
        1,
      );
      expect((await budgetModel.find().exec()).length).toBe(0);
    });

    it('should return null otherwise', async () => {
      expect(
        (
          await budgetsService.remove(
            new Types.ObjectId('ffffffffffffffffffffffff'),
          )
        ).deletedCount,
      ).toBe(0);
    });
  });
});
