import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { DeleteTransactionUseCase } from '../use-cases/delete-transaction.use-case';
import { GetTransactionByIdUseCase } from '../use-cases/get-transaction-by-id.use-case';
import { UpdateTransactionUseCase } from '../use-cases/update-transaction.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  Transaction,
  TransactionSchema,
  TransferType,
} from './schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionModel: Model<Transaction>;

  const BASE_TRANSACTION_PAYLOAD: CreateTransactionDto = {
    date: new Date('2022-01-15'),
    amount: 123,
    transferType: TransferType.DEBIT,
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
        CreateTransactionUseCase,
        GetTransactionByIdUseCase,
        UpdateTransactionUseCase,
        DeleteTransactionUseCase,
        TransactionsRepository,
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModel,
        },
        Logger,
      ],
    })
      .setLogger(new Logger())
      .compile();

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
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: 'Test',
      };

      await expect(
        transactionsController.create(transactionPayload),
      ).resolves.toMatchObject({ notes: 'Test' });
    });

    it('should fail if the date is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        date: null,
      };

      await expect(
        transactionsController.create(transactionPayload),
      ).rejects.toThrowError(
        'Transaction validation failed: date: Path `date` is required.',
      );
    });

    it('should fail if the amount is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        amount: undefined,
      };

      await expect(
        transactionsController.create(transactionPayload),
      ).rejects.toThrowError(
        'Transaction validation failed: amount: Cast to Number failed for value "NaN" (type number) at path "amount"',
      );
    });

    it('should fail if the accountId is empty', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        accountId: null,
      };

      await expect(
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

      await expect(
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

      await expect(
        transactionsController.create(transactionPayload),
      ).resolves.toMatchObject({
        categoryId: null,
      });
    });

    it('should work if isCleared is undefined; defaults to false', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        isCleared: undefined,
      };

      await expect(
        transactionsController.create(transactionPayload),
      ).resolves.toMatchObject({
        isCleared: false,
      });
    });

    it('should work if isDeleted is undefined; defaults to false', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        isDeleted: undefined,
      };

      await expect(
        transactionsController.create(transactionPayload),
      ).resolves.toMatchObject({
        isDeleted: false,
      });
    });

    it('should work if the externalId is undefined', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        externalId: undefined,
      };

      await expect(
        transactionsController.create(transactionPayload),
      ).resolves.toMatchObject({
        externalId: undefined,
      });
    });

    it('should work if notes is undefined', async () => {
      const transactionPayload = {
        ...BASE_TRANSACTION_PAYLOAD,
        notes: undefined,
      };

      await expect(
        transactionsController.create(transactionPayload),
      ).resolves.toMatchObject({
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
      const transaction = await transactionsController.create(
        BASE_TRANSACTION_PAYLOAD,
      );
      const transactionUpdate = {
        amount: 456,
      };

      await expect(
        transactionsController.update(transaction._id, transactionUpdate),
      ).resolves.toMatchObject({
        amount: -456,
      });
    });
  });
});
