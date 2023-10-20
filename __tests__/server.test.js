const http = require('http');
const supertest = require('supertest');
const app = require('../app');
const { connectDatabase } = require('../database');

jest.mock('../database', () => {
  return {
    connectDatabase: jest.fn(),
  };
});

describe('Server Initialization', () => {
  let testServer;

  beforeAll(async () => {
    // Mocking the database connection
    connectDatabase.mockImplementation(async () => {
      console.log('Mocked database connection');
    });

    // Start the server and return a promise
    return new Promise((resolve) => {
      testServer = http.createServer(app);
      testServer.listen(0, () => {
        resolve();
      });
    });
  });

  afterAll((done) => {
    testServer.close(done);
  });

  it('should create and start the server on the specified port', () => {
    const port = testServer.address().port;
    expect(port).toBeGreaterThan(0);
  });

  it('should execute the server start callback', () => {
    // The server should already be started before this test
    let loggedMessage = '';
    const originalConsoleLog = console.log;

    console.log = (message) => {
      loggedMessage = message;
      // Ensure it's only called once
      if (loggedMessage === 'Server has started and is running on port undefined') {
        console.log = originalConsoleLog;
      }
    };
  });
});
