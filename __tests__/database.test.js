const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDatabase, getCollection } = require('../database');

describe('Database Module', () => {
  let mongoServer;
  let uri;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    uri = await mongoServer.getUri();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  let dbClient;

  beforeEach(async () => {
    dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await dbClient.connect();
  });

  afterEach(async () => {
    await dbClient.close();
  });

  it('should connect to the MongoDB', async () => {
    await connectDatabase();
    const database = dbClient.db('ped');
    const collections = await database.collections();
    expect(collections).not.toBeNull();
  });

  it('should get a valid collection', async () => {
    const collectionName = 'blogs';
    const collection = getCollection(collectionName);
    expect(collection).not.toBeNull();
  });

  it('should throw an error for an invalid collection name', () => {
    const invalidCollectionName = 'invalidCollection';
    expect(() => getCollection(invalidCollectionName)).toThrowError('Invalid collection name');
  });
});
