import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';

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

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('[POST]', () => {
    const BASE_CATEGORY_PAYLOAD = {
      name: 'Coffee shop',
      externalId: 'abc123',
      parentCategoryId: undefined,
      isHidden: false,
      isDeleted: false,
    };

    it('should return the saved object', async () => {
      const createdCategory = await categoriesController.create(
        BASE_CATEGORY_PAYLOAD,
      );

      expect(createdCategory).toMatchObject(BASE_CATEGORY_PAYLOAD);
    });

    it('should fail if the name is empty', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        name: '',
      };

      expect(categoriesController.create(categoryPayload)).rejects.toThrowError(
        'Category validation failed: name: Path `name` is required.',
      );
    });

    it('should work if the externalId is undefined', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        externalId: undefined,
      };

      expect(await categoriesController.create(categoryPayload)).toMatchObject({
        name: 'Coffee shop',
        externalId: undefined,
      });
    });

    it('should work if parentCategoryId is undefined', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        parentCategoryId: undefined,
      };

      expect(await categoriesController.create(categoryPayload)).toMatchObject({
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

      expect(await categoriesController.create(categoryPayload)).toMatchObject({
        name: 'Coffee shop',
        isHidden: false,
      });
    });

    it('should work if isDeleted is undefined; defaults to false', async () => {
      const categoryPayload = {
        ...BASE_CATEGORY_PAYLOAD,
        isDeleted: undefined,
      };

      expect(await categoriesController.create(categoryPayload)).toMatchObject({
        name: 'Coffee shop',
        isDeleted: false,
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of categories', async () => {
      const categoryStub = {
        name: 'Coffee shop',
        externalId: 'abc123',
      };

      await new categoryModel(categoryStub).save();

      expect(await categoriesController.findAll()).toMatchObject([
        categoryStub,
      ]);
    });
  });
});
