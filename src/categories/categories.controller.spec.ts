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
import { Category, CategorySchema } from './schemas/category.entity';

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
    const CATEGORY_PAYLOAD = {
      name: 'Coffee shop',
      externalId: 'abc123',
      parentCategory: undefined,
      isHidden: false,
      isDeleted: false,
    };

    it('should return the saved object', async () => {
      const createdCategory = await categoriesController.create(
        CATEGORY_PAYLOAD,
      );

      expect(createdCategory).toMatchObject(CATEGORY_PAYLOAD);
    });

    it('should fail if the name is empty', async () => {
      const categoryStub = {
        ...CATEGORY_PAYLOAD,
        name: '',
      };

      expect(categoriesController.create(categoryStub)).rejects.toThrowError(
        'Category validation failed: name: Path `name` is required.',
      );
    });

    it('should work if the externalId is undefined', async () => {
      const categoryStub = {
        ...CATEGORY_PAYLOAD,
        externalId: undefined,
      };

      expect(await categoriesController.create(categoryStub)).toMatchObject({
        name: 'Coffee shop',
        externalId: undefined,
      });
    });

    it('should work if parentCategory is undefined', async () => {
      const categoryStub = {
        ...CATEGORY_PAYLOAD,
        parentCategory: undefined,
      };

      expect(await categoriesController.create(categoryStub)).toMatchObject({
        name: 'Coffee shop',
        externalId: 'abc123',
        parentCategory: undefined,
      });
    });

    it('should work if isHidden is undefined; defaults to false', async () => {
      const categoryStub = {
        ...CATEGORY_PAYLOAD,
        isHidden: undefined,
      };

      expect(await categoriesController.create(categoryStub)).toMatchObject({
        name: 'Coffee shop',
        isHidden: false,
      });
    });

    it('should work if isDeleted is undefined; defaults to false', async () => {
      const categoryStub = {
        ...CATEGORY_PAYLOAD,
        isDeleted: undefined,
      };

      expect(await categoriesController.create(categoryStub)).toMatchObject({
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
