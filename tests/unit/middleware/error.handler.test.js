const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('../../../api/middleware/error.handler');
const { ValidationError } = require('sequelize');
const boom = require('@hapi/boom');

describe('Error Handler Middleware', () => {
  describe('logErrors', () => {
    test('should log error and call next with error', () => {
      const err = new Error('Test error');
      const req = {};
      const res = {};
      const next = jest.fn();

      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      logErrors(err, req, res, next);

      expect(consoleErrorSpy).toHaveBeenCalledWith(err);
      expect(next).toHaveBeenCalledWith(err);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('errorHandler', () => {
    test('should return 500 with error message', () => {
      const err = new Error('Test error');
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
    });

    test('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const err = new Error('Test error');
      err.stack = 'Error: Test error\n    at test.js:1:1';
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ stack: expect.any(String) })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('boomErrorHandler', () => {
    test('should handle boom error and return correct status code', () => {
      const err = boom.badRequest('Invalid input');
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      boomErrorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid input' })
      );
    });

    test('should call next with error if not a boom error', () => {
      const err = new Error('Regular error');
      const req = {};
      const res = {};
      const next = jest.fn();

      boomErrorHandler(err, req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('ormErrorHandler', () => {
    test('should handle Sequelize ValidationError', () => {
      const err = new ValidationError('Validation error', [
        { message: 'Name is required' }
      ]);
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
      
      ormErrorHandler(err, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 409,
          message: 'SequelizeValidationError'
        })
      );
    });

    test('should call next with error if not a ValidationError', () => {
      const err = new Error('Regular error');
      const req = {};
      const res = {};
      const next = jest.fn();

      ormErrorHandler(err, req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
