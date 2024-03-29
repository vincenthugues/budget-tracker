import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { PayeesService } from './payees.service';
import { Payee, PayeeSchema } from './schemas/payee.schema';

describe('PayeesService', () => {
  let payeesService: PayeesService;
  let payeeModel: Model<Payee>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    payeeModel = inMemoryMongoConnection.model(Payee.name, PayeeSchema);

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PayeesService,
        { provide: getModelToken(Payee.name), useValue: payeeModel },
      ],
    }).compile();

    payeesService = moduleRef.get<PayeesService>(PayeesService);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const payeePayload = {
        name: 'New Payee',
        externalId: 'abc123',
      };
      const createdPayee = await payeesService.create(payeePayload);

      expect(createdPayee).toMatchObject(payeePayload);
      expect(createdPayee.createdAt).toBeDefined();
      expect(createdPayee.updatedAt).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of all payees', async () => {
      const payee1Payload = { name: 'Payee 1' };
      const payee2Payload = { name: 'Payee 2' };
      await payeeModel.create(payee1Payload, payee2Payload);

      await expect(payeesService.findAll()).resolves.toMatchObject([
        payee1Payload,
        payee2Payload,
      ]);
    });

    it('should return an empty array when there are no payees', async () => {
      await expect(payeesService.findAll()).resolves.toMatchObject([]);
    });
  });

  describe('findOne', () => {
    it('should return the payee with matching id', async () => {
      const payeePayload = { name: 'New Payee' };
      const { _id } = await payeeModel.create(payeePayload);

      const foundPayee = await payeesService.findOne(_id);

      expect(foundPayee.name).toBe(payeePayload.name);
    });

    it('should fail if no payee matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        payeesService.findOne(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No payee found for id ${id}`);
    });
  });

  describe('update', () => {
    it('should update the payee', async () => {
      const { _id } = await payeeModel.create({ name: 'Test Payee' });
      const update = { name: 'Test Payee (updated)' };

      const updatedPayee = await payeesService.update(_id, update);

      expect(updatedPayee.name).toEqual(update.name);
    });

    it('should fail if no payee matches the id', async () => {
      const id = '6348784df0ea88d406093123';
      const update = { name: 'Payee (updated)' };

      expect(
        payeesService.update(id as unknown as Types.ObjectId, update),
      ).rejects.toThrow(`No payee found for id ${id}`);
    });
  });

  describe('remove', () => {
    it('should remove the payee', async () => {
      const { _id } = await payeeModel.create({ name: 'Test Payee' });

      await payeesService.remove(_id);

      expect(await payeeModel.find({})).toMatchObject([]);
    });

    it('should fail if no payee matches the id', async () => {
      const id = '6348784df0ea88d406093123';

      expect(
        payeesService.remove(id as unknown as Types.ObjectId),
      ).rejects.toThrow(`No payee found for id ${id}`);
    });
  });
});
