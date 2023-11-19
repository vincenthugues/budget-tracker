import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
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
import { UpdateTransactionUseCase } from './update-transaction.use-case';

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
  let transactionModel: Model<Transaction>;
  let transaction;

  beforeAll(async () => {
    await setupInMemoryMongo();
    transactionModel = inMemoryMongoConnection.model(
      Transaction.name,
      TransactionSchema,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionUseCase,
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

    useCase = moduleRef.get<UpdateTransactionUseCase>(UpdateTransactionUseCase);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  beforeEach(async () => {
    transaction = await transactionModel.create({
      date: new Date('2022-01-15'),
      amount: 123,
      transferType: TransferType.CREDIT,
      accountId: '5e1a0651741b255ddda996c4',
      payeeId: '5e1a0651741b255ddda996c4',
      categoryId: '5e1a0651741b255ddda996c4',
      isCleared: true,
      isDeleted: false,
      externalId: 'abc123',
      notes: 'Test',
    });
  });

  it('should return the updated object', async () => {
    await expect(
      useCase.execute(transaction._id, {
        notes: 'update',
      }),
    ).resolves.toMatchObject({
      notes: 'update',
    });
  });

  it('should fail if no transaction matches the id', async () => {
    const wrongId = '6348784df0ea88d406093123';
    const transactionUpdate = { notes: 'Category (updated)' };

    await expect(
      useCase.execute(wrongId as unknown as Types.ObjectId, transactionUpdate),
    ).rejects.toThrow(`No transaction found for id ${wrongId}`);
  });

  it('should fail if the amount is negative', async () => {
    const transactionUpdate = { amount: -1 };

    await expect(
      useCase.execute(transaction._id, transactionUpdate),
    ).rejects.toThrow('Transaction amount must be positive');
  });

  it('should fail if the amount is 0', async () => {
    const transactionUpdate = { amount: 0 };

    await expect(
      useCase.execute(transaction._id, transactionUpdate),
    ).rejects.toThrow('Transaction amount must be positive');
  });
});
