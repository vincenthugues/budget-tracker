import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account, AccountSchema } from './schemas/account.schema';

describe('AccountsService', () => {
  let accountsService: AccountsService;
  let accountModel: Model<Account>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    accountModel = inMemoryMongoConnection.model(Account.name, AccountSchema);

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        { provide: getModelToken(Account.name), useValue: accountModel },
      ],
    }).compile();

    accountsService = moduleRef.get<AccountsService>(AccountsService);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  it('should be defined', () => {
    expect(accountsService).toBeDefined();
  });

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const accountStub = {
        name: 'New Account',
        externalId: 'abc123',
        type: 'checking',
      };
      const createdAccount = await accountsService.create(accountStub);

      expect(createdAccount).toMatchObject(accountStub);
      expect(createdAccount.createdAt).toBeDefined();
      expect(createdAccount.updatedAt).toBeDefined();
    });
  });
});
