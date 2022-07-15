import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection } from 'mongoose';

let mongod: MongoMemoryServer;
export let inMemoryMongoConnection: Connection;

export const setupInMemoryMongo = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  inMemoryMongoConnection = (await connect(uri)).connection;
};

export const dropInMemoryMongoCollections = async () => {
  const collections = inMemoryMongoConnection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const teardownInMemoryMongo = async () => {
  await inMemoryMongoConnection.dropDatabase();
  await inMemoryMongoConnection.close();
  await mongod.stop();
};
