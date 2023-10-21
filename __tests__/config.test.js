const config = require('../config');
// const jest = require('jest');
const process = require('process');
const { describe, it, expect, beforeEach } = require('@jest/globals');

describe('Config Module', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    jest.resetModules();
  });

  it('should have a default port of 3000', () => {
    expect(config).toHaveProperty('port', 3000);
  });

  it('should read port from environment variables if available', () => {
    process.env.PORT = '4000';
    const newConfig = require('../config');
    expect(newConfig).toHaveProperty('port', '4000');
  });

  it('should use the default port if the environment variable is not set', () => {
    delete process.env.PORT;
    const newConfig = require('../config');
    expect(newConfig).toHaveProperty('port', 3000);
  });
});
