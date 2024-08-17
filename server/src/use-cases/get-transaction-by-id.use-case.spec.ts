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
import { GetTransactionByIdUseCase } from './get-transaction-by-id.use-case';

describe('GetTransactionByIdUseCase', () => {
  let useCase: GetTransactionByIdUseCase;
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
        GetTransactionByIdUseCase,
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

    useCase = moduleRef.get<GetTransactionByIdUseCase>(
      GetTransactionByIdUseCase,
    );
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

  it('should return the transaction with matching id', async () => {
    const result = await useCase.execute(transaction.id);

    await expect(result).toMatchObject({
      date: new Date('2022-01-15T00:00:00.000Z'),
      amount: 123,
      transferType: 'Credit',
      accountId: new Types.ObjectId('5e1a0651741b255ddda996c4'),
      payeeId: new Types.ObjectId('5e1a0651741b255ddda996c4'),
      categoryId: new Types.ObjectId('5e1a0651741b255ddda996c4'),
      isCleared: true,
      isDeleted: false,
      externalId: 'abc123',
      notes: 'Test',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should fail if no transaction matches the id', async () => {
    const wrongId = '6348784df0ea88d406093123';

    await expect(
      useCase.execute(wrongId as unknown as Types.ObjectId),
    ).rejects.toThrow(`No transaction found for id ${wrongId}`);
  });
});
