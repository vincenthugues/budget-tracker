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
import {
  Transaction,
  TransactionDocument,
  TransactionSchema,
} from './schemas/transaction.schema';
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
    notes: 'default notes',
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

  describe('[POST]', () => {
    it('should return the saved object', async () => {
      const createdTransaction = await transactionsController.create({
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Test',
      });

      expect(createdTransaction).toMatchObject({ notes: 'Test' });
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

    it('should work if the categoryId is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        categoryId: null,
      };

      expect(
        await transactionsController.create(transactionPayload),
      ).toMatchObject({ categoryId: null });
    });

    it('should work if isCleared is undefined; defaults to false', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        isCleared: undefined,
      };

      expect(
        await transactionsController.create(transactionPayload),
      ).toMatchObject({
        isCleared: false,
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
        isDeleted: false,
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
        externalId: undefined,
      });
    });

    it('should work if notes is undefined', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: undefined,
      };

      expect(
        await transactionsController.create(transactionPayload),
      ).toMatchObject({
        notes: undefined,
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of transactions', async () => {
      await transactionModel.create({
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Test',
      });

      expect(await transactionsController.findAll()).toEqual(
        expect.arrayContaining([expect.objectContaining({ notes: 'Test' })]),
      );
    });

    it('should return an array of transactions matching the filter', async () => {
      const transactionPayload1 = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Transaction 1',
        externalId: 'abc123',
      };
      const transactionPayload2 = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Transaction 2',
        externalId: 'def456',
      };
      await transactionModel.create(transactionPayload1, transactionPayload2);

      expect(
        await transactionsController.findAll({ externalId: 'def456' }),
      ).toMatchObject([{ notes: 'Transaction 2' }]);
    });
  });

  describe('[PATCH]', () => {
    it('should return the updated object', async () => {
      const createdTransaction: TransactionDocument =
        await transactionsController.create(BASE_TRANSACTION_PAYLOAD);
      const transactionUpdate = { amount: 456 };
      const updatedTransaction = await transactionsController.update(
        createdTransaction._id,
        transactionUpdate,
      );

      expect(updatedTransaction).toMatchObject({
        amount: 456,
      });
    });
  });
});
