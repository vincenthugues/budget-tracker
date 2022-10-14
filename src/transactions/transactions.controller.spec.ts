import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
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

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
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
        BASE_TRANSACTION_PAYLOAD,
      );

      expect(createdTransaction).toMatchObject(BASE_TRANSACTION_PAYLOAD);
    });

    it('should fail if the date is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        date: null,
      };

      expect(
        transactionsController.create(transactionPayload),
      ).rejects.toThrowError(
        'Transaction validation failed: date: Path `date` is required.',
      );
    });

    it('should fail if the amount is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        amount: null,
      };

      expect(
        transactionsController.create(transactionPayload),
      ).rejects.toThrowError(
        'Transaction validation failed: amount: Path `amount` is required.',
      );
    });

    it('should fail if the accountId is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        accountId: null,
      };

      expect(
        transactionsController.create(transactionPayload),
      ).rejects.toThrowError(
        'Transaction validation failed: accountId: Path `accountId` is required.',
      );
    });

    it('should fail if the payeeId is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        payeeId: null,
      };

      expect(
        transactionsController.create(transactionPayload),
      ).rejects.toThrowError(
        'Transaction validation failed: payeeId: Path `payeeId` is required.',
      );
    });

    it('should fail if the categoryId is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        categoryId: null,
      };

      expect(
        transactionsController.create(transactionPayload),
      ).rejects.toThrowError(
        'Transaction validation failed: categoryId: Path `categoryId` is required',
      );
    });

    it('should work if isCleared is undefined; defaults to false', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        isCleared: undefined,
      };

      expect(
        await transactionsController.create(transactionPayload),
      ).toMatchObject({
        ...BASE_TRANSACTION_PAYLOAD,
        isCleared: false,
      });
    });

    it('should work if the externalId is undefined', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        externalId: undefined,
      };

      expect(
        await transactionsController.create(transactionPayload),
      ).toMatchObject({
        ...BASE_TRANSACTION_PAYLOAD,
        externalId: undefined,
      });
    });

    it('should work if isDeleted is undefined; defaults to false', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        isDeleted: undefined,
      };

      expect(
        await transactionsController.create(transactionPayload),
      ).toMatchObject({
        ...BASE_TRANSACTION_PAYLOAD,
        isDeleted: false,
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of transactions', async () => {
      await new transactionModel(BASE_TRANSACTION_PAYLOAD).save();

      expect(await transactionsController.findAll()).toMatchObject([
        BASE_TRANSACTION_PAYLOAD,
      ]);
    });
  });
});
