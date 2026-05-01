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
jest.mock('../../../api/services/category.service', () => {
  const mockService = {
    find: jest.fn().mockResolvedValue([
      { id: 1, name: 'Category 1', image: 'http://example.com/img1.jpg' },
      { id: 2, name: 'Category 2', image: 'http://example.com/img2.jpg' }
    ]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test Category', image: 'http://example.com/img.jpg' }),
    create: jest.fn().mockResolvedValue({ id: 1, name: 'New Category', image: 'http://example.com/new.jpg' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Category' }),
    delete: jest.fn().mockResolvedValue({ id: 1 })
  };
  
  return jest.fn().mockImplementation(() => mockService);
});

describe('Categories Routes - Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    app = express();
    app.use(express.json());
    
    const categoriesRouter = require('../../../api/routes/categories.router');
    app.use('/api/v1/categories', categoriesRouter);
    
    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });
  
  describe('GET /api/v1/categories', () => {
    test('should return 200 with categories when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/categories')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('GET /api/v1/categories/:id', () => {
    test('should return 200 with category', async () => {
      const response = await request(app)
        .get('/api/v1/categories/1')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('POST /api/v1/categories', () => {
    test('should create category and return 201 (admin only)', async () => {
      const response = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'New Category',
          image: 'http://example.com/new.jpg'
        });
      
      expect(response.status).toBe(201);
    });
    
    // Validation tests are covered in unit tests (validator.handler.test.js)
    // Integration tests focus on route behavior with mocks
  });
  
  describe('PATCH /api/v1/categories/:id', () => {
    test('should update category and return 200 (admin only)', async () => {
      const response = await request(app)
        .patch('/api/v1/categories/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ name: 'Updated Category' });
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('DELETE /api/v1/categories/:id', () => {
    test('should delete category and return 201 (admin only)', async () => {
      const response = await request(app)
        .delete('/api/v1/categories/1')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(201);
    });
  });
  
  describe('Authentication required', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/categories/1');
      
      expect(response.status).toBe(401);
    });
  });
});
