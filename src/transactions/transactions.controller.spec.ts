import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionModel: Model<Transaction>;

  const TRANSACTION_PAYLOAD = {
    date: new Date('2022-01-15'),
    amount: 123,
    account: new Types.ObjectId('5e1a0651741b255ddda996c4'),
    payee: new Types.ObjectId('5e1a0651741b255ddda996c4'),
    category: new Types.ObjectId('5e1a0651741b255ddda996c4'),
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

    transactionsController = moduleRef.get<TransactionsController>(
      TransactionsController,
    );
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  it('should be defined', () => {
    expect(TransactionsController).toBeDefined();
  });

  describe('[POST]', () => {
    it('should return the saved object', async () => {
      const createdTransaction = await transactionsController.create(
        TRANSACTION_PAYLOAD,
      );

      expect(createdTransaction).toMatchObject(TRANSACTION_PAYLOAD);
    });

    it('should fail if the date is empty', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        date: null,
      };

      expect(
        transactionsController.create(transactionStub),
      ).rejects.toThrowError(
        'Transaction validation failed: date: Path `date` is required.',
      );
    });

    it('should fail if the amount is empty', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        amount: null,
      };

      expect(
        transactionsController.create(transactionStub),
      ).rejects.toThrowError(
        'Transaction validation failed: amount: Path `amount` is required.',
      );
    });

    it('should fail if the account is empty', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        account: null,
      };

      expect(
        transactionsController.create(transactionStub),
      ).rejects.toThrowError(
        'Transaction validation failed: account: Path `account` is required.',
      );
    });

    it('should fail if the payee is empty', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        payee: null,
      };

      expect(
        transactionsController.create(transactionStub),
      ).rejects.toThrowError(
        'Transaction validation failed: payee: Path `payee` is required.',
      );
    });

    it('should fail if the category is empty', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        category: null,
      };

      expect(
        transactionsController.create(transactionStub),
      ).rejects.toThrowError(
        'Transaction validation failed: category: Path `category` is required',
      );
    });

    it('should work if isCleared is undefined; defaults to false', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        isCleared: undefined,
      };

      expect(
        await transactionsController.create(transactionStub),
      ).toMatchObject({
        ...TRANSACTION_PAYLOAD,
        isCleared: false,
      });
    });

    it('should work if the externalId is undefined', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        externalId: undefined,
      };

      expect(
        await transactionsController.create(transactionStub),
      ).toMatchObject({
        ...TRANSACTION_PAYLOAD,
        externalId: undefined,
      });
    });

    it('should work if isDeleted is undefined; defaults to false', async () => {
      const transactionStub = {
        ...TRANSACTION_PAYLOAD,
        isDeleted: undefined,
      };

      expect(
        await transactionsController.create(transactionStub),
      ).toMatchObject({
        ...TRANSACTION_PAYLOAD,
        isDeleted: false,
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of transactions', async () => {
      await new transactionModel(TRANSACTION_PAYLOAD).save();

      expect(await transactionsController.findAll()).toMatchObject([
        TRANSACTION_PAYLOAD,
      ]);
    });
  });
});
