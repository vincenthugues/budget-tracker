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
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  Transaction,
  TransactionSchema,
  TransferType,
} from './schemas/transaction.schema';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
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

    transactionsService =
      moduleRef.get<TransactionsService>(TransactionsService);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
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
});
