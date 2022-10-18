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

      expect(payeesController.create(payeePayload)).rejects.toThrowError(
        'Payee validation failed: name: Path `name` is required.',
      );
    });

    it('should work if the externalId is null', async () => {
      const payeePayload = {
        ...BASE_PAYEE_PAYLOAD,
        externalId: null,
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

      await new payeeModel(payeePayload).save();

      expect(await payeesController.findAll()).toMatchObject([payeePayload]);
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
        createdPayee._id,
        payeeUpdate,
      );

      expect(updatedPayee).toMatchObject({
        ...BASE_PAYEE_PAYLOAD,
        ...payeeUpdate,
      });
    });
  });
});
