const request = require('supertest');
const express = require('express');

// Mock passport - TOP LEVEL (gets hoisted by Jest)
jest.mock('passport', () => {
  const authenticateMock = jest.fn((strategy, options) => {
    return (req, res, next) => {
      if (req.headers.authorization) {
        req.user = { sub: 1, profile: 'admin' };
        next();
      } else {
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
jest.mock('../../../api/middleware/auth.handler', () => ({
  checkApiKey: jest.fn((req, res, next) => next()),
  checkAdminProfile: jest.fn((req, res, next) => next()),
  checkProfile: jest.fn((...profiles) => {
    return (req, res, next) => next();
  })
}));

// Mock validator.handler  
jest.mock('../../../api/middleware/validator.handler', () => {
  return jest.fn((schema, property) => {
    return (req, res, next) => next();
  });
});

// Mock service - TOP LEVEL
jest.mock('../../../api/services/user.service', () => {
  const mockService = {
    find: jest.fn().mockResolvedValue([
      { id: 1, username: 'user1', email: 'user1@example.com' },
      { id: 2, username: 'user2', email: 'user2@example.com' }
    ]),
    findOne: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', email: 'test@example.com' }),
    create: jest.fn().mockResolvedValue({ id: 1, username: 'newuser' }),
    update: jest.fn().mockResolvedValue({ id: 1, username: 'updated' }),
    delete: jest.fn().mockResolvedValue({ id: 1 })
  };
  
  return jest.fn().mockImplementation(() => mockService);
});

describe('Users Routes - Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    app = express();
    app.use(express.json());
    
    const usersRouter = require('../../../api/routes/users.router');
    app.use('/api/v1/users', usersRouter);
    
    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });
  
  describe('GET /api/v1/users', () => {
    test('should return 200 with users when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('GET /api/v1/users/:id', () => {
    test('should return 200 with user', async () => {
      const response = await request(app)
        .get('/api/v1/users/1')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('POST /api/v1/users', () => {
    test('should create user and return 201', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          profile: 'customer'
        });
      
      expect(response.status).toBe(201);
    });
  });
  
  describe('PATCH /api/v1/users/:id', () => {
    test('should update user and return 200', async () => {
      const response = await request(app)
        .patch('/api/v1/users/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ username: 'updated' });
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('DELETE /api/v1/users/:id', () => {
    test('should delete user and return 201', async () => {
      const response = await request(app)
        .delete('/api/v1/users/1')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(201);
    });
  });
  
  describe('Authentication required', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/users');
      
      expect(response.status).toBe(401);
    });
  });
});
