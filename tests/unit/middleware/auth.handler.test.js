const { checkApiKey, checkAdminProfile, checkProfile } = require('../../../api/middleware/auth.handler');
const boom = require('@hapi/boom');

// Mock config
jest.mock('../../../api/config/config', () => ({
  config: {
    apiKey: 'test-api-key'
  }
}));

describe('Auth Handler Middleware', () => {
  describe('checkApiKey', () => {
    test('should call next() when api key is valid', () => {
      const req = { headers: { 'api': 'test-api-key' } };
      const res = {};
      const next = jest.fn();

      checkApiKey(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should call next with boom.unauthorized when api key is invalid', () => {
      const req = { headers: { 'api': 'wrong-key' } };
      const res = {};
      const next = jest.fn();
      
      checkApiKey(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error.output.statusCode).toBe(401);
    });
    
    test('should call next with boom.unauthorized when api key is missing', () => {
      const req = { headers: {} };
      const res = {};
      const next = jest.fn();
      
      checkApiKey(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error.output.statusCode).toBe(401);
    });
  });

  describe('checkAdminProfile', () => {
    test('should call next() when user has admin profile', () => {
      const req = { user: { profile: 'admin' } };
      const res = {};
      const next = jest.fn();

      checkAdminProfile(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should call next with boom.unauthorized when user has non-admin profile', () => {
      const req = { user: { profile: 'customer' } };
      const res = {};
      const next = jest.fn();
      
      checkAdminProfile(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error.output.statusCode).toBe(401);
    });
    
    test('should call next with boom.unauthorized when user is not set', () => {
      const req = {};
      const res = {};
      const next = jest.fn();
      
      checkAdminProfile(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error.output.statusCode).toBe(401);
    });
  });

  describe('checkProfile', () => {
    test('should call next() when user profile matches', () => {
      const req = { user: { profile: 'tier' } };
      const res = {};
      const next = jest.fn();

      const middleware = checkProfile('admin', 'tier', 'customer');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should call next with boom.unauthorized when user profile does not match', () => {
      const req = { user: { profile: 'customer' } };
      const res = {};
      const next = jest.fn();
      
      const middleware = checkProfile('admin', 'tier');
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error.output.statusCode).toBe(401);
    });

    test('should work with single profile', () => {
      const req = { user: { profile: 'admin' } };
      const res = {};
      const next = jest.fn();

      const middleware = checkProfile('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
