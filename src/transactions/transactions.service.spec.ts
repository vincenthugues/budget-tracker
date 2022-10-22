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

  const BASE_TRANSACTION_PAYLOAD: CreateTransactionDto = {
    date: new Date('2022-01-15'),
    amount: 123,
    accountId: '5e1a0651741b255ddda996c4',
    payeeId: '5e1a0651741b255ddda996c4',
    categoryId: '5e1a0651741b255ddda996c4',
    isCleared: true,
    isDeleted: false,
    externalId: 'abc123',
    notes: 'Test',
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

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const createdTransaction = await transactionsService.create({
        ...BASE_TRANSACTION_PAYLOAD,
        notes: '[create] Test transaction',
      });

      expect(createdTransaction).toMatchObject({
        notes: '[create] Test transaction',
      });
      expect(createdTransaction.createdAt).toBeDefined();
      expect(createdTransaction.updatedAt).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of all transactions', async () => {
      const transaction1Payload = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Transaction 1',
      };
      const transaction2Payload = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Transaction 2',
      };
      await transactionModel.create(transaction1Payload, transaction2Payload);

      expect(await transactionsService.findAll()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ notes: 'Transaction 1' }),
          expect.objectContaining({ notes: 'Transaction 2' }),
        ]),
      );
    });

    it('should return an empty array when there are no transactions', async () => {
      expect(await transactionsService.findAll()).toMatchObject([]);
    });
  });

  describe('findOne', () => {
    it('should return the transaction with matching id', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Test transaction',
      };
      const { _id } = await transactionModel.create(transactionPayload);

      const foundTransaction = await transactionsService.findOne(_id);

      expect(foundTransaction.notes).toBe(transactionPayload.notes);
    });

    it('should fail if no transaction matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        transactionsService.findOne(id as unknown as Types.ObjectId),
      ).rejects.toThrowError(`No transaction found for id ${id}`);
    });
  });

  describe('update', () => {
    it('should update the transaction', async () => {
      const { _id } = await transactionModel.create({
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Test transaction',
      });
      const update = { notes: 'Test transaction (updated)' };

      const updatedCategory = await transactionsService.update(_id, update);

      expect(updatedCategory.notes).toEqual(update.notes);
    });

    it('should fail if no transaction matches the id', async () => {
      const id = '6348784df0ea88d406093123';
      const update = { notes: 'Category (updated)' };

      expect(
        transactionsService.update(id as unknown as Types.ObjectId, update),
      ).rejects.toThrowError(`No transaction found for id ${id}`);
    });
  });

  describe('remove', () => {
    it('should remove the transaction', async () => {
      const { _id } = await transactionModel.create({
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Test transaction',
      });

      await transactionsService.remove(_id);

      expect(await transactionModel.find({})).toMatchObject([]);
    });

    it('should fail if no transaction matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        transactionsService.remove(id as unknown as Types.ObjectId),
      ).rejects.toThrowError(`No transaction found for id ${id}`);
    });
  });
});
