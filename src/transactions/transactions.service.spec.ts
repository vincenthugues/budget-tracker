import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionModel: Model<Transaction>;
  const TRANSACTION_PAYLOAD: CreateTransactionDto = {
    date: new Date('2022-01-15'),
    amount: 123,
    accountId: '5e1a0651741b255ddda996c4',
    payeeId: '5e1a0651741b255ddda996c4',
    categoryId: '5e1a0651741b255ddda996c4',
  };

  beforeAll(async () => {
    await setupInMemoryMongo();
    transactionModel = inMemoryMongoConnection.model(
      Transaction.name,
      TransactionSchema,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModel,
        },
      ],
    }).compile();

    transactionsService =
      moduleRef.get<TransactionsService>(TransactionsService);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
  });

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const createdTransaction = await transactionsService.create(
        TRANSACTION_PAYLOAD,
      );

      expect(createdTransaction).toMatchObject(TRANSACTION_PAYLOAD);
      expect(createdTransaction.createdAt).toBeDefined();
      expect(createdTransaction.updatedAt).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      await new transactionModel(TRANSACTION_PAYLOAD).save();

      expect(await transactionsService.findAll()).toMatchObject([
        TRANSACTION_PAYLOAD,
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a transaction if given a valid id', async () => {
      const savedTransaction = await new transactionModel(
        TRANSACTION_PAYLOAD,
      ).save();

      expect(
        await transactionsService.findOne(savedTransaction.id),
      ).toMatchObject(TRANSACTION_PAYLOAD);
    });

    it('should return null otherwise', async () => {
      expect(
        await transactionsService.findOne(
          new Types.ObjectId('ffffffffffffffffffffffff'),
        ),
      ).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a transaction if given a valid id', async () => {
      const savedTransaction = await new transactionModel({
        ...TRANSACTION_PAYLOAD,
        amount: 1234,
      }).save();

      const transactionPatch = {
        amount: 5678,
      };
      expect(
        await transactionsService.update(savedTransaction.id, transactionPatch),
      ).toMatchObject({
        ...TRANSACTION_PAYLOAD,
        amount: 5678,
      });
    });

    it('should return null otherwise', async () => {
      expect(
        await transactionsService.update(
          new Types.ObjectId('ffffffffffffffffffffffff'),
          {
            amount: 1234,
          },
        ),
      ).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a transaction if given a valid id', async () => {
      const savedTransaction = await new transactionModel(
        TRANSACTION_PAYLOAD,
      ).save();

      expect(
        (await transactionsService.remove(savedTransaction.id)).deletedCount,
      ).toBe(1);
      expect((await transactionModel.find().exec()).length).toBe(0);
    });

    it('should return null otherwise', async () => {
      expect(
        (
          await transactionsService.remove(
            new Types.ObjectId('ffffffffffffffffffffffff'),
          )
        ).deletedCount,
      ).toBe(0);
    });
  });
});
