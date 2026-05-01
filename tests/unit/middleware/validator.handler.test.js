const validatorHandler = require('../../../api/middleware/validator.handler');
const boom = require('@hapi/boom');
const Joi = require('joi');

describe('Validator Handler Middleware', () => {
  test('should call next() when validation passes', () => {
    const schema = Joi.object({
      name: Joi.string().required()
    });
    const req = {
      body: { name: 'Test' }
    };
    const res = {};
    const next = jest.fn();

    const middleware = validatorHandler(schema, 'body');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

    test('should call next with boom.badRequest when validation fails', () => {
      const schema = Joi.object({
        name: Joi.string().required()
      });
      const req = {
        body: {} // missing required name
      };
      const res = {};
      const next = jest.fn();
      
      const middleware = validatorHandler(schema, 'body');
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error.output.statusCode).toBe(400);
    });

  test('should validate query parameters', () => {
    const schema = Joi.object({
      page: Joi.number().integer().min(1)
    });
    const req = {
      query: { page: 2 }
    };
    const res = {};
    const next = jest.fn();

    const middleware = validatorHandler(schema, 'query');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  test('should validate params', () => {
    const schema = Joi.object({
      id: Joi.number().integer().required()
    });
    const req = {
      params: { id: 1 }
    };
    const res = {};
    const next = jest.fn();

    const middleware = validatorHandler(schema, 'params');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

    test('should return all validation errors with abortEarly: false', () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required()
      });
      const req = {
        body: { name: '', email: 'invalid' }
      };
      const res = {};
      const next = jest.fn();
      
      const middleware = validatorHandler(schema, 'body');
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.isBoom).toBe(true);
      expect(error.output.statusCode).toBe(400);
      expect(error.data).toBeDefined();
    });
});
