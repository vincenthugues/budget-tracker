import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { AccountsService } from './accounts.service';
import { Account, AccountSchema, AccountType } from './schemas/account.schema';

describe('AccountsService', () => {
  let accountsService: AccountsService;
  let accountModel: Model<Account>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    accountModel = inMemoryMongoConnection.model(Account.name, AccountSchema);

    const moduleRef: TestingModule = await Test.createTestingModule({
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

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const accountPayload = {
        name: 'New Account',
        externalId: 'abc123',
        type: 'Savings' as unknown as AccountType,
      };
      const createdAccount = await accountsService.create(accountPayload);

      expect(createdAccount).toMatchObject(accountPayload);
      expect(createdAccount.createdAt).toBeDefined();
      expect(createdAccount.updatedAt).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of all accounts', async () => {
      const account1Payload = { name: 'Account 1' };
      const account2Payload = { name: 'Account 2' };
      await accountModel.create(account1Payload, account2Payload);

      await expect(accountsService.findAll()).resolves.toMatchObject([
        account1Payload,
        account2Payload,
      ]);
    });

    it('should return an empty array when there are no accounts', async () => {
      await expect(accountsService.findAll()).resolves.toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the account with matching id', async () => {
      const accountPayload = { name: '[findOne] Test account' };
      const { id } = await accountModel.create(accountPayload);
      const foundAccount = await accountsService.findOne(id);

      expect(foundAccount.name).toEqual(accountPayload.name);
    });

    it('should fail if no account matches the id', async () => {
      const id = '6348784df0ea88d406093123';
      expect(
        accountsService.findOne(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No account found for id ${id}`);
    });
  });

  describe('update', () => {
    it('should update the account', async () => {
      const { id } = await accountModel.create({
        name: '[update] Test account',
      });
      const update = { name: '[update] Test account (updated)' };
      const updatedAccount = await accountsService.update(id, update);

      expect(updatedAccount.name).toEqual(update.name);
    });

    it('should fail if no account matches the id', async () => {
      const id = '6348784df0ea88d406093123';
      const update = { name: '[update] Test account (updated)' };

      expect(
        accountsService.update(id as unknown as Types.ObjectId, update),
      ).rejects.toThrow(`No account found for id ${id}`);
    });
  });

  describe('remove', () => {
    it('should remove the account', async () => {
      const { id } = await accountModel.create({
        name: '[remove] Test account',
      });
      await accountsService.remove(id);

      await expect(accountModel.find({})).resolves.toEqual([]);
    });

    it('should fail if no account matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        accountsService.remove(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No account found for id ${id}`);
    });
  });
});
