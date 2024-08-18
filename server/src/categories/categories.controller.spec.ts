import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  Category,
  CategoryDocument,
  CategorySchema,
} from './schemas/category.schema';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoryModel: Model<Category>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    categoryModel = inMemoryMongoConnection.model(
      Category.name,
      CategorySchema,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        { provide: getModelToken(Category.name), useValue: categoryModel },
      ],
    }).compile();

    categoriesController =
      moduleRef.get<CategoriesController>(CategoriesController);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  describe('[POST]', () => {
    const BASE_CATEGORY_PAYLOAD: CreateCategoryDto = {
      name: 'Coffee shop',
      externalId: 'abc123',
      parentCategoryId: '5e1a0651741b255ddda996c4' as unknown as Types.ObjectId,
      isHidden: false,
      isDeleted: false,
    };

    it('should return the saved object', async () => {
      const createdCategory = await categoriesController.create({
        ...BASE_CATEGORY_PAYLOAD,
        name: 'Test',
      });

      expect(createdCategory).toMatchObject({ name: 'Test' });
    });

    it('should fail if the name is empty', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        name: '',
      };

      expect(categoriesController.create(categoryPayload)).rejects.toThrow(
        'Category validation failed: name: Path `name` is required.',
      );
    });

    it('should work if the externalId is undefined', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        externalId: undefined,
      };

      await expect(
        categoriesController.create(categoryPayload),
      ).resolves.toMatchObject({
        name: 'Coffee shop',
        externalId: undefined,
      });
    });

    it('should work if parentCategoryId is undefined', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        parentCategoryId: undefined,
      };

      await expect(
        categoriesController.create(categoryPayload),
      ).resolves.toMatchObject({
        name: 'Coffee shop',
        externalId: 'abc123',
        parentCategoryId: undefined,
      });
    });

    it('should work if isHidden is undefined; defaults to false', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        isHidden: undefined,
      };

      await expect(
        categoriesController.create(categoryPayload),
      ).resolves.toMatchObject({
        name: 'Coffee shop',
        isHidden: false,
      });
    });

    it('should work if isDeleted is undefined; defaults to false', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        isDeleted: undefined,
      };

      await expect(
        categoriesController.create(categoryPayload),
      ).resolves.toMatchObject({
        name: 'Coffee shop',
        isDeleted: false,
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of categories', async () => {
      const categoryPayload = {
        name: 'Coffee shop',
        externalId: 'abc123',
      };

      await categoryModel.create(categoryPayload);

      await expect(categoriesController.findAll()).resolves.toMatchObject([
        categoryPayload,
      ]);
    });

    it('should return an array of categories matching the filter', async () => {
      const categoryPayload1 = {
        name: 'Category 1',
        externalId: 'abc123',
      };
      const categoryPayload2 = {
        name: 'Category 2',
        externalId: 'def456',
      };
      await categoryModel.create(categoryPayload1, categoryPayload2);

      expect(
        await categoriesController.findAll({ externalId: 'def456' }),
      ).toMatchObject([categoryPayload2]);
    });
  });

  describe('[PATCH]', () => {
    const CATEGORY_PAYLOAD = {
      name: 'Coffee shop',
      externalId: 'abc123',
      parentCategoryId: undefined,
      isHidden: false,
      isDeleted: false,
    };

    it('should return the updated object', async () => {
      const createdCategory: CategoryDocument =
        await categoriesController.create(CATEGORY_PAYLOAD);
      const categoryUpdate = {
        name: 'New name',
        externalId: 'def456',
        parentCategoryId:
          '5e1a0651741b255ddda996c4' as unknown as Types.ObjectId,
        isHidden: true,
        isDeleted: true,
      };
      const updatedCategory = await categoriesController.update(
        createdCategory.id,
        categoryUpdate,
      );

      expect(updatedCategory).toMatchObject({
        name: 'New name',
        externalId: 'def456',
        isHidden: true,
        isDeleted: true,
      });
    });
  });
});
