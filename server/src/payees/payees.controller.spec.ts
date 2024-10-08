import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { PayeesController } from './payees.controller';
import { PayeesService } from './payees.service';
import { Payee, PayeeSchema } from './schemas/payee.schema';

describe('PayeesController', () => {
  let payeesController: PayeesController;
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

    payeesController = moduleRef.get<PayeesController>(PayeesController);
  });

  afterEach(async () => {
    await dropInMemoryMongoCollections();
  });

  afterAll(async () => {
    await teardownInMemoryMongo();
  });

  describe('[POST]', () => {
    const BASE_PAYEE_PAYLOAD: CreatePayeeDto = {
      name: 'New Payee',
      externalId: 'abc123',
    };

    it('should return the saved object', async () => {
      const createdPayee = await payeesController.create(BASE_PAYEE_PAYLOAD);

      expect(createdPayee).toMatchObject(BASE_PAYEE_PAYLOAD);
    });

    it('should fail if the name is empty', async () => {
      const payeePayload = {
        ...BASE_PAYEE_PAYLOAD,
        name: '',
      };

      expect(payeesController.create(payeePayload)).rejects.toThrow(
        'Payee validation failed: name: Path `name` is required.',
      );
    });

    it('should work if the externalId is undefined', async () => {
      const payeePayload: CreatePayeeDto = {
        ...BASE_PAYEE_PAYLOAD,
        externalId: undefined,
      };

      const createdPayee = await payeesController.create(payeePayload);
      expect(createdPayee).toMatchObject(payeePayload);
    });
  });

  describe('[GET]', () => {
    it('should return an array of payees', async () => {
      const payeePayload = {
        name: 'New Payee',
        externalId: 'abc123',
      };

      await payeeModel.create(payeePayload);

      await expect(payeesController.findAll()).resolves.toMatchObject([
        payeePayload,
      ]);
    });

    it('should return an array of payees matching the filter', async () => {
      const payeePayload1 = {
        name: 'Payee 1',
        externalId: 'abc123',
      };
      const payeePayload2 = {
        name: 'Payee 2',
        externalId: 'def456',
      };
      await payeeModel.create(payeePayload1, payeePayload2);

      expect(
        await payeesController.findAll({ externalId: 'def456' }),
      ).toMatchObject([payeePayload2]);
    });
  });

  describe('[PATCH]', () => {
    const BASE_PAYEE_PAYLOAD = {
      name: 'Shop ABC',
      externalId: 'abc123',
    };

    it('should return the updated object', async () => {
      const createdPayee = await payeesController.create(BASE_PAYEE_PAYLOAD);
      const payeeUpdate = {
        name: 'Shop ABC (updated)',
        externalId: 'def456',
      };
      const updatedPayee = await payeesController.update(
        createdPayee.id,
        payeeUpdate,
      );

      expect(updatedPayee).toMatchObject({
        ...BASE_PAYEE_PAYLOAD,
        ...payeeUpdate,
      });
    });
  });
});
