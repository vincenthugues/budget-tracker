import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoryModel: Model<Category>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    categoryModel = inMemoryMongoConnection.model(
      Category.name,
      CategorySchema,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getModelToken(Category.name), useValue: categoryModel },
      ],
    }).compile();

    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const categoryPayload = {
        name: 'Groceries',
        externalId: 'abc123',
        parentCategoryId:
          '5e1a0651741b255ddda996c4' as unknown as Types.ObjectId,
      };
      const createdCategory = await categoriesService.create(categoryPayload);

      expect(createdCategory).toMatchObject({ name: 'Groceries' });
      expect(createdCategory.createdAt).toBeDefined();
      expect(createdCategory.updatedAt).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of all categories', async () => {
      const category1Payload = { name: 'Category 1' };
      const category2Payload = { name: 'Category 2' };
      await categoryModel.create(category1Payload, category2Payload);

      await expect(categoriesService.findAll()).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining(category1Payload),
          expect.objectContaining(category2Payload),
        ]),
      );
    });

    it('should return an empty array when there are no categories', async () => {
      await expect(categoriesService.findAll()).resolves.toMatchObject([]);
    });
  });

  describe('findOne', () => {
    it('should return the category with matching id', async () => {
      const categoryPayload = { name: 'Test Category' };
      const { id } = await categoryModel.create(categoryPayload);

      const foundCategory = await categoriesService.findOne(id);

      expect(foundCategory.name).toBe(categoryPayload.name);
    });

    it('should fail if no category matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        categoriesService.findOne(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No category found for id ${id}`);
    });
  });

  describe('update', () => {
    it('should update the category', async () => {
      const { id } = await categoryModel.create({ name: 'Test Category' });
      const update = { name: 'Test Category (updated)' };

      const updatedCategory = await categoriesService.update(id, update);

      expect(updatedCategory.name).toEqual(update.name);
    });

    it('should fail if no category matches the id', async () => {
      const id = '6348784df0ea88d406093123';
      const update = { name: 'Category (updated)' };

      expect(
        categoriesService.update(id as unknown as Types.ObjectId, update),
      ).rejects.toThrow(`No category found for id ${id}`);
    });
  });

  describe('remove', () => {
    it('should remove the category', async () => {
      const { id } = await categoryModel.create({ name: 'Test Category' });

      await categoriesService.remove(id);

      await expect(categoryModel.find({})).resolves.toMatchObject([]);
    });

    it('should fail if no category matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        categoriesService.remove(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No category found for id ${id}`);
    });
  });
});
