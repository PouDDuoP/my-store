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
jest.mock('../../../api/services/product.service', () => {
  const mockService = {
    find: jest.fn().mockResolvedValue([
      { id: 1, name: 'Product 1', price: 99.99 },
      { id: 2, name: 'Product 2', price: 149.99 }
    ]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test Product', price: 99.99 }),
    create: jest.fn().mockResolvedValue({ id: 1, name: 'New Product' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Product' }),
    delete: jest.fn().mockResolvedValue({ id: 1 })
  };
  
  return jest.fn().mockImplementation(() => mockService);
});

describe('Products Routes - Integration Tests', () => {
  let app;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    app = express();
    app.use(express.json());
    
    const productsRouter = require('../../../api/routes/products.router');
    app.use('/api/v1/products', productsRouter);
    
    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });
  
  describe('GET /api/v1/products', () => {
    test('should return 200 with products', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(200);
    });
    
    test('should return 200 with filtered products by price', async () => {
      const response = await request(app)
        .get('/api/v1/products?price=100')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('GET /api/v1/products/:id', () => {
    test('should return 200 with product', async () => {
      const response = await request(app)
        .get('/api/v1/products/1')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('POST /api/v1/products', () => {
    test('should create product and return 201', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'New Product',
          price: 99.99,
          image: 'http://example.com/img.jpg',
          categoryId: 1
        });
      
      expect(response.status).toBe(201);
    });
  });
  
  describe('PATCH /api/v1/products/:id', () => {
    test('should update product and return 200', async () => {
      const response = await request(app)
        .patch('/api/v1/products/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ name: 'Updated Product' });
      
      expect(response.status).toBe(200);
    });
  });
  
  describe('DELETE /api/v1/products/:id', () => {
    test('should delete product and return 201', async () => {
      const response = await request(app)
        .delete('/api/v1/products/1')
        .set('Authorization', 'Bearer fake-token');
      
      expect(response.status).toBe(201);
    });
  });
  
  describe('Authentication required', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/products');
      
      expect(response.status).toBe(401);
    });
  });
});
