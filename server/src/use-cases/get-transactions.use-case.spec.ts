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
import {
  Transaction,
  TransactionSchema,
  TransferType,
} from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { GetTransactionsUseCase } from './get-transactions.use-case';

describe('GetTransactionsUseCase', () => {
  let useCase: GetTransactionsUseCase;
  let transactionModel: Model<Transaction>;
  let transaction1, transaction2;

  beforeAll(async () => {
    await setupInMemoryMongo();
    transactionModel = inMemoryMongoConnection.model(
      Transaction.name,
      TransactionSchema,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionsUseCase,
        TransactionsRepository,
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModel,
        },
        Logger,
      ],
    })
      .setLogger(new Logger())
      .compile();

    useCase = moduleRef.get<GetTransactionsUseCase>(GetTransactionsUseCase);

    transaction1 = await transactionModel.create({
      amount: 123,
      transferType: TransferType.CREDIT,
      accountId: '5e1a0651741b255ddda996c4',
      payeeId: '5e1a0651741b255ddda996c4',
      categoryId: '5e1a0651741b255ddda996c4',
      isCleared: true,
      isDeleted: false,
      externalId: 'abc123',
      notes: 'Transaction 1',
    });

    transaction2 = await transactionModel.create({
      amount: 123,
      transferType: TransferType.CREDIT,
      accountId: '5e1a0651741b255ddda996c4',
      payeeId: '5e1a0651741b255ddda996c4',
      categoryId: '5e1a0651741b255ddda996c4',
      isCleared: true,
      isDeleted: false,
      externalId: 'abc123',
      notes: 'Transaction 2',
    });
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  it('should return an array of all transactions', async () => {
    await expect(useCase.execute()).resolves.toEqual([
      expect.objectContaining({
        id: transaction1.id,
        notes: 'Transaction 1',
      }),
      expect.objectContaining({
        id: transaction2.id,
        notes: 'Transaction 2',
      }),
    ]);
  });

  it('should return an empty array when there are no transactions', async () => {
    await expect(useCase.execute()).resolves.toEqual([]);
  });
});
