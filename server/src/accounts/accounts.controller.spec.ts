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
import { Account, AccountSchema, AccountType } from './schemas/account.schema';

describe('AccountsController', () => {
  let accountsController: AccountsController;
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

    accountsController = moduleRef.get<AccountsController>(AccountsController);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  describe('[POST]', () => {
    const BASE_ACCOUNT_PAYLOAD = {
      name: 'Compte Courant',
      externalId: 'abc123',
      type: 'Other' as unknown as AccountType,
      isClosed: false,
      balance: 12345,
    };

    it('should return the saved object', async () => {
      const createdAccount =
        await accountsController.create(BASE_ACCOUNT_PAYLOAD);

      expect(createdAccount).toMatchObject(BASE_ACCOUNT_PAYLOAD);
    });

    it('should fail if the name is empty', async () => {
      const accountPayload = {
        ...BASE_ACCOUNT_PAYLOAD,
        name: '',
      };

      expect(accountsController.create(accountPayload)).rejects.toThrow(
        'Account validation failed: name: Path `name` is required.',
      );
    });

    it('should work if the balance is negative', async () => {
      const createdAccount = await accountsController.create({
        ...BASE_ACCOUNT_PAYLOAD,
        balance: -10_000_000,
      });

      expect(createdAccount).toMatchObject({ balance: -10_000_000 });
    });

    it('should work if the externalId is undefined', async () => {
      const accountPayload = {
        ...BASE_ACCOUNT_PAYLOAD,
        externalId: undefined,
      };

      await expect(
        accountsController.create(accountPayload),
      ).resolves.toMatchObject({
        name: 'Compte Courant',
        externalId: undefined,
      });
    });

    it('should work if the type is undefined', async () => {
      const accountPayload = {
        ...BASE_ACCOUNT_PAYLOAD,
        type: undefined,
      };

      await expect(
        accountsController.create(accountPayload),
      ).resolves.toMatchObject({
        name: 'Compte Courant',
        type: undefined,
      });
    });

    it('should work if isClosed is undefined; defaults to false', async () => {
      const accountPayload = {
        ...BASE_ACCOUNT_PAYLOAD,
        isClosed: undefined,
      };

      await expect(
        accountsController.create(accountPayload),
      ).resolves.toMatchObject({
        name: 'Compte Courant',
        isClosed: false,
      });
    });

    it('should work if the balance is undefined; default to 0', async () => {
      const accountPayload = {
        ...BASE_ACCOUNT_PAYLOAD,
        balance: undefined,
      };

      await expect(
        accountsController.create(accountPayload),
      ).resolves.toMatchObject({
        name: 'Compte Courant',
        balance: 0,
      });
    });
  });

  describe('[GET]', () => {
    it('should return an array of accounts', async () => {
      const accountPayload = {
        name: 'Compte Courant',
        externalId: 'abc123',
      };
      await accountModel.create(accountPayload);

      await expect(accountsController.findAll()).resolves.toMatchObject([
        accountPayload,
      ]);
    });

    it('should return an array of accounts matching the filter', async () => {
      const accountPayload1 = {
        name: 'Account 1',
        externalId: 'abc123',
      };
      const accountPayload2 = {
        name: 'Account 2',
        externalId: 'def456',
      };
      await accountModel.create(accountPayload1, accountPayload2);

      expect(
        await accountsController.findAll({ externalId: 'def456' }),
      ).toMatchObject([accountPayload2]);
    });
  });
});
