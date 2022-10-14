import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { PayeesController } from './payees.controller';
import { PayeesService } from './payees.service';
import { Payee, PayeeSchema } from './schemas/payee.schema';

describe('PayeesService', () => {
  let payeesService: PayeesService;
  let payeeModel: Model<Payee>;

  beforeAll(async () => {
    await setupInMemoryMongo();
    payeeModel = inMemoryMongoConnection.model(Payee.name, PayeeSchema);

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PayeesController],
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

  it('should be defined', () => {
    expect(payeesService).toBeDefined();
  });

  describe('create', () => {
    it('should return the saved object with timestamps', async () => {
      const payeePayload = {
        name: 'New Payee',
        externalId: 'abd123',
      };
      const createdPayee = await payeesService.create(payeePayload);

      expect(createdPayee).toMatchObject(payeePayload);
      expect(createdPayee.createdAt).toBeDefined();
      expect(createdPayee.updatedAt).toBeDefined();
    });

    // it('should throw AlreadyExists (Bad Request - 400) exception', async () => {
    //   const payeePayload = {
    //     name: 'New Payee',
    //     externalId: 'abd123',
    //   };

    //   await new payeeModel(payeePayload).save();

    //   await expect(payeesService.create(payeePayload)).rejects.toThrow();
    // });
  });

  describe('findAll', () => {
    it('should return an array of payees', async () => {
      const payeePayload = {
        name: 'New Payee',
        externalId: 'abd123',
      };

      await new payeeModel(payeePayload).save();

      expect(await payeesService.findAll()).toMatchObject([payeePayload]);
    });
  });

  describe('findOne', () => {
    it('should return a payee if given a valid id', async () => {
      const payeePayload = {
        name: 'New Payee',
        externalId: 'abd123',
      };

      const savedPayee = await new payeeModel(payeePayload).save();

      expect(await payeesService.findOne(savedPayee.id)).toMatchObject(
        payeePayload,
      );
    });

    it('should return null otherwise', async () => {
      expect(
        await payeesService.findOne(
          new Types.ObjectId('ffffffffffffffffffffffff'),
        ),
      ).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a payee if given a valid id', async () => {
      const payeePayload = {
        name: 'Payee',
        externalId: 'abd123',
      };
      const savedPayee = await new payeeModel(payeePayload).save();

      const payeePatch = {
        name: 'Payee (updated)',
      };
      expect(
        await payeesService.update(savedPayee.id, payeePatch),
      ).toMatchObject({
        name: 'Payee (updated)',
        externalId: 'abd123',
      });
    });

    it('should return null otherwise', async () => {
      expect(
        await payeesService.update(
          new Types.ObjectId('ffffffffffffffffffffffff'),
          {
            name: 'Payee (updated)',
          },
        ),
      ).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a payee if given a valid id', async () => {
      const payeePayload = {
        name: 'Payee',
        externalId: 'abd123',
      };
      const savedPayee = await new payeeModel(payeePayload).save();

      expect((await payeesService.remove(savedPayee.id)).deletedCount).toBe(1);
      expect((await payeeModel.find().exec()).length).toBe(0);
    });

    it('should return null otherwise', async () => {
      expect(
        (
          await payeesService.remove(
            new Types.ObjectId('ffffffffffffffffffffffff'),
          )
        ).deletedCount,
      ).toBe(0);
    });
  });
});
