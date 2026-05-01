const request = require('supertest');
const express = require('express');

// Mock passport - returns 401 if no Authorization header
jest.mock('passport', () => {
  const authenticateMock = jest.fn((strategy, options) => {
    return (req, res, next) => {
      if (req.headers.authorization) {
        req.user = { sub: 1, profile: 'customer' };
        next();
      } else {
        // No auth header - return 401
        return res.status(401).json({ message: 'Unauthorized' });
      }
    };
  });
  
  return {
    authenticate: authenticateMock,
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next())
  };
});

// Mock auth.handler
jest.mock('../../../api/middleware/auth.handler', () => {
  return {
    checkApiKey: jest.fn((req, res, next) => next()),
    checkAdminProfile: jest.fn((req, res, next) => next()),
    checkProfile: jest.fn((...profiles) => {
      return (req, res, next) => next();
    })
  };
});

// Mock validator.handler
jest.mock('../../../api/middleware/validator.handler', () => {
  return jest.fn((schema, property) => {
    return (req, res, next) => next();
  });
});

// Mock order service
jest.mock('../../../api/services/order.service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      findByUser: jest.fn().mockResolvedValue([
        { id: 1, tierId: 1, statusId: 1, userId: 1 }
      ])
    };
  });
});

describe('Profile Routes - Integration Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    app = express();
    app.use(express.json());
    
    const profileRouter = require('../../../api/routes/profile.router');
    app.use('/api/v1/profile', profileRouter);

    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });

  describe('GET /api/v1/profile/my-orders', () => {
    test('should return 200 with orders when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/profile/my-orders')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/profile/my-orders');

      expect(response.status).toBe(401);
    });
  });
});
