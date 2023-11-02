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
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import {
  Transaction,
  TransactionSchema,
  TransferType,
} from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { CreateTransactionUseCase } from './create-transaction.use-case';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionModel: Model<Transaction>;

  const BASE_TRANSACTION_PAYLOAD: CreateTransactionDto = {
    date: new Date('2022-01-15'),
    amount: 123,
    transferType: TransferType.DEBIT,
    accountId: '5e1a0651741b255ddda996c4',
    payeeId: '5e1a0651741b255ddda996c4',
    categoryId: '5e1a0651741b255ddda996c4',
    isCleared: false,
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
      providers: [
        CreateTransactionUseCase,
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

    useCase = moduleRef.get<CreateTransactionUseCase>(CreateTransactionUseCase);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  it('should return the saved object with timestamps', async () => {
    const createdTransaction = await useCase.execute({
      ...BASE_TRANSACTION_PAYLOAD,
      notes: '[create] Test transaction',
    });

    expect(createdTransaction).toMatchObject({
      _id: expect.any(Types.ObjectId),
      date: expect.any(Date),
      amount: -123,
      accountId: expect.any(Types.ObjectId),
      payeeId: expect.any(Types.ObjectId),
      categoryId: expect.any(Types.ObjectId),
      isCleared: false,
      isDeleted: false,
      externalId: expect.any(String),
      notes: '[create] Test transaction',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should fail if the amount is negative', async () => {
    const createTransactionDto = { ...BASE_TRANSACTION_PAYLOAD, amount: -1 };

    await expect(useCase.execute(createTransactionDto)).rejects.toThrowError(
      'Transaction amount must be positive',
    );
  });

  it('should fail if the amount is 0', async () => {
    const createTransactionDto = { ...BASE_TRANSACTION_PAYLOAD, amount: 0 };

    await expect(useCase.execute(createTransactionDto)).rejects.toThrowError(
      'Transaction amount must be positive',
    );
  });
});
