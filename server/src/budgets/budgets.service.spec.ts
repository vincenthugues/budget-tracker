import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { BudgetsService } from './budgets.service';
import { Budget, BudgetSchema } from './schemas/budget.schema';

describe('BudgetsService', () => {
  let budgetsService: BudgetsService;
  let budgetModel: Model<Budget>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    budgetModel = inMemoryMongoConnection.model(Budget.name, BudgetSchema);

    const moduleRef: TestingModule = await Test.createTestingModule({
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

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const budgetPayload = {
        name: 'New Budget',
        externalId: 'abc123',
      };
      const createdBudget = await budgetsService.create(budgetPayload);

      expect(createdBudget).toMatchObject(budgetPayload);
      expect(createdBudget.createdAt).toBeDefined();
      expect(createdBudget.updatedAt).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of all budgets', async () => {
      const budget1Payload = { name: 'Budget 1' };
      const budget2Payload = { name: 'Budget 2' };
      await budgetModel.create(budget1Payload, budget2Payload);

      await expect(budgetsService.findAll()).resolves.toMatchObject([
        budget1Payload,
        budget2Payload,
      ]);
    });

    it('should return an empty array when there are no budgets', async () => {
      await expect(budgetsService.findAll()).resolves.toMatchObject([]);
    });
  });

  describe('findOne', () => {
    it('should return the budget with matching id', async () => {
      const budgetPayload = { name: 'Test Budget' };
      const { id } = await budgetModel.create(budgetPayload);

      const foundBudget = await budgetsService.findOne(id);

      expect(foundBudget.name).toBe(budgetPayload.name);
    });

    it('should fail if no budget matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        budgetsService.findOne(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No budget found for id ${id}`);
    });
  });

  describe('update', () => {
    it('should update the budget', async () => {
      const { id } = await budgetModel.create({ name: 'Test Budget' });
      const update = { name: 'Test Budget (updated)' };

      const updatedBudget = await budgetsService.update(id, update);

      expect(updatedBudget.name).toEqual(update.name);
    });

    it('should fail if no budget matches the id', async () => {
      const id = '6348784df0ea88d406093123';
      const update = { name: 'Budget (updated)' };

      expect(
        budgetsService.update(id as unknown as Types.ObjectId, update),
      ).rejects.toThrow(`No budget found for id ${id}`);
    });
  });

  describe('remove', () => {
    it('should remove the budget', async () => {
      const { id } = await budgetModel.create({ name: 'Test Budget' });

      await budgetsService.remove(id);

      await expect(budgetModel.find({})).resolves.toMatchObject([]);
    });

    it('should fail if no budget matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        budgetsService.remove(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No budget found for id ${id}`);
    });
  });
});
