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
  TransactionDocument,
  TransactionSchema,
  TransferType,
} from '../transactions/schemas/transaction.schema';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { DeleteTransactionUseCase } from './delete-transaction.use-case';

describe('DeleteTransactionUseCase', () => {
  let useCase: DeleteTransactionUseCase;
  let transactionModel: Model<Transaction>;
  let transaction: TransactionDocument;

  beforeAll(async () => {
    await setupInMemoryMongo();
    transactionModel = inMemoryMongoConnection.model(
      Transaction.name,
      TransactionSchema,
    );

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTransactionUseCase,
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

    useCase = moduleRef.get<DeleteTransactionUseCase>(DeleteTransactionUseCase);
  });

  beforeEach(async () => {
    transaction = await transactionModel.create({
      date: new Date('2022-01-15'),
      amount: 123,
      transferType: TransferType.DEBIT,
      accountId: '5e1a0651741b255ddda996c4',
      payeeId: '5e1a0651741b255ddda996c4',
    });
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  it('should delete the object', async () => {
    await useCase.execute(transaction.id);

    expect(await transactionModel.findById(transaction._id)).toBeNull();
  });

  it('should return the deleted object', async () => {
    const deletedTransaction = await useCase.execute(transaction.id);

    expect(deletedTransaction).toMatchObject({
      _id: expect.any(Types.ObjectId),
      date: expect.any(Date),
      amount: expect.any(Number),
      accountId: expect.any(Types.ObjectId),
      payeeId: expect.any(Types.ObjectId),
      isCleared: expect.any(Boolean),
      isDeleted: expect.any(Boolean),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should fail if the transaction is not found', async () => {
    const wrongId = '6348784df0ea88d406093123';
    await expect(useCase.execute(wrongId)).rejects.toThrow(
      /^No transaction found for id .*/,
    );
  });
});
