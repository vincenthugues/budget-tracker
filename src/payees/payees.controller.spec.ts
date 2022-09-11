import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  dropInMemoryMongoCollections,
  inMemoryMongoConnection,
  setupInMemoryMongo,
  teardownInMemoryMongo,
} from '../../test/utils/inMemoryMongo';
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

  it('should be defined', () => {
    expect(payeesController).toBeDefined();
  });

  describe('[POST]', () => {
    it('should return the saved object', async () => {
      const payeeStub = {
        name: 'New Payee',
        externalId: 'abd123',
      };
      const createdPayee = await payeesController.create(payeeStub);

      expect(createdPayee).toMatchObject(payeeStub);
    });

    it('should fail if the name is empty', async () => {
      const payeeStub = {
        name: '',
        externalId: 'abd123',
      };

      expect(payeesController.create(payeeStub)).rejects.toThrowError(
        'Payee validation failed: name: Path `name` is required.',
      );
    });

    it('should work if the externalId is null', async () => {
      const payeeStub = {
        name: 'New Payee',
        externalId: null,
      };

      const createdPayee = await payeesController.create(payeeStub);
      expect(createdPayee).toMatchObject(payeeStub);
    });
  });

  describe('[GET]', () => {
    it('should return an array of payees', async () => {
      const payeeStub = {
        name: 'New Payee',
        externalId: 'abd123',
      };

      await new payeeModel(payeeStub).save();

      expect(await payeesController.findAll()).toMatchObject([payeeStub]);
    });
  });
});