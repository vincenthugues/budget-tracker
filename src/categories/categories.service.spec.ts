import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, ObjectId, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.entity';

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
      controllers: [CategoriesController],
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

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const categoryStub = {
        name: 'Coffee shop',
        externalId: 'abc123',
        parentCategory: '5e1a0651741b255ddda996c4' as unknown as Types.ObjectId,
      };
      const createdCategory = await categoriesService.create(categoryStub);

      expect(createdCategory).toMatchObject(categoryStub);
      expect(createdCategory.createdAt).toBeDefined();
      expect(createdCategory.updatedAt).toBeDefined();
    });
  });
});
