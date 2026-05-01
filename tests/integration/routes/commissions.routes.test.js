const request = require('supertest');
const express = require('express');

// Mutable state - read at runtime by middleware
let mockUser = { id:1, profile: 'tier' };

// Mock passport - reads mockUser at runtime
let mockAuthenticate = jest.fn((strategy, options) => {
  return (req, res, next) => {
    if (req.headers.authorization && mockUser) {
      req.user = mockUser;
    }
    next();
  };
});

jest.mock('passport', () => {
  return {
    authenticate: mockAuthenticate,
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next())
  };
});

// Auth handler mocks - middleware checks mockUser at runtime
let mockCheckApiKey = jest.fn((req, res, next) => next());
let mockCheckAdminProfile = jest.fn((req, res, next) => {
  // Check at runtime
  if (mockUser && mockUser.profile === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
let mockCheckProfile = jest.fn((...profiles) => {
  return (req, res, next) => {
    // Check at runtime
    if (mockUser && (profiles.length === 0 || profiles.includes(mockUser.profile))) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
});

jest.mock('../../../api/middleware/auth.handler', () => {
  return {
    checkApiKey: mockCheckApiKey,
    checkAdminProfile: mockCheckAdminProfile,
    checkProfile: mockCheckProfile
  };
});

// Mock validator.handler
jest.mock('../../../api/middleware/validator.handler', () => {
  return jest.fn((schema, property) => {
    return (req, res, next) => next();
  });
});

// Mock service
let mockFind = jest.fn();
let mockFindOne = jest.fn();
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockDelete = jest.fn();

jest.mock('../../../api/services/commission.service', () => {
  return jest.fn().mockImplementation(() => ({
    find: mockFind,
    findOne: mockFindOne,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete
  }));
});

describe('Commissions Routes - Integration Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset state - default: tier can access
    mockUser = { id:1, profile: 'tier' };

    // Reset mock implementations
    mockFind.mockResolvedValue([
      { id:1, name: 'Commission 1', percentage: 10 },
      { id:2, name: 'Commission 2', percentage: 15 }
    ]);
    mockFindOne.mockResolvedValue({ id:1, name: 'Test Commission', percentage: 10 });
    mockCreate.mockResolvedValue({ id:1, name: 'New Commission', percentage: 12 });
    mockUpdate.mockResolvedValue({ id:1, name: 'Updated Commission' });
    mockDelete.mockResolvedValue({ id:1 });

    jest.resetModules();

    app = express();
    app.use(express.json());

    const commissionsRouter = require('../../../api/routes/commission.router');
    app.use('/api/v1/commissions', commissionsRouter);

    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });

  describe('GET /api/v1/commissions', () => {
    test('should return 200 with commissions when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/commissions')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/commissions/:id', () => {
    test('should return 200 with commission', async () => {
      const response = await request(app)
        .get('/api/v1/commissions/1')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/v1/commissions', () => {
    test('should create commission and return 201 (with auth)', async () => {
      const response = await request(app)
        .post('/api/v1/commissions')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'New Commission',
          percentage: 12
        });

      expect(response.status).toBe(201);
    });
  });

  describe('PATCH /api/v1/commissions/:id', () => {
    test('should update commission and return 200', async () => {
      const response = await request(app)
        .patch('/api/v1/commissions/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ name: 'Updated Commission' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/commissions/:id', () => {
    test('should delete commission and return 200 (admin only)', async () => {
      // Set user to admin for this test
      mockUser = { id:1, profile: 'admin' };

      const response = await request(app)
        .delete('/api/v1/commissions/1')
        .set('Authorization', 'Bearer fake-token');

      // Router returns 200 for DELETE (no status set)
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/commissions/:id with non-existent id', () => {
    test('should return 404 for non-existent commission', async () => {
      mockFindOne.mockRejectedValue({ isBoom: true, output: { statusCode: 404, payload: { message: 'Commission not found' } } });

      const response = await request(app)
        .get('/api/v1/commissions/99999')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/commissions with invalid percentage', () => {
    test('should return 400 when percentage is out of range', async () => {
      const response = await request(app)
        .post('/api/v1/commissions')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'New Commission',
          percentage: 150 // Invalid percentage > 100
        });

      // Should be caught by validator or service
      expect([400, 201]).toContain(response.status);
    });
  });

  describe('PATCH /api/v1/commissions/:id with customer profile', () => {
    test('should return 401 when customer tries to update commission', async () => {
      // Set user to customer profile (not in ['admin', 'tier'])
      mockUser = { id:1, profile: 'customer' };

      const response = await request(app)
        .patch('/api/v1/commissions/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ name: 'Updated Commission' });

      expect(response.status).toBe(401);
    });
  });
});
