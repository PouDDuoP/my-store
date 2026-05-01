const request = require('supertest');
const express = require('express');

// Mutable state - read at runtime by middleware
let mockUser = { id:1, profile: 'admin' };

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

jest.mock('../../../api/services/tier.service', () => {
  return jest.fn().mockImplementation(() => ({
    find: mockFind,
    findOne: mockFindOne,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete
  }));
});

describe('Tiers Routes - Integration Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset state - default: admin can access
    mockUser = { id:1, profile: 'admin' };

    // Reset mock implementations
    mockFind.mockResolvedValue([
      { id:1, name: 'Tier 1' },
      { id:2, name: 'Tier 2' }
    ]);
    mockFindOne.mockResolvedValue({ id:1, name: 'Test Tier' });
    mockCreate.mockResolvedValue({ id:1, name: 'New Tier' });
    mockUpdate.mockResolvedValue({ id:1, name: 'Updated Tier' });
    mockDelete.mockResolvedValue({ id:1 });

    jest.resetModules();

    app = express();
    app.use(express.json());

    const tiersRouter = require('../../../api/routes/tiers.router');
    app.use('/api/v1/tiers', tiersRouter);

    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Tier name already exists' });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });

  describe('GET /api/v1/tiers', () => {
    test('should return 200 with tiers when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/tiers')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/tiers/:id', () => {
    test('should return 200 with tier', async () => {
      const response = await request(app)
        .get('/api/v1/tiers/1')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/v1/tiers', () => {
    test('should create tier and return 201 (with profile auth)', async () => {
      const response = await request(app)
        .post('/api/v1/tiers')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'New Tier',
          user: {
            username: 'newtier',
            email: 'newtier@example.com',
            password: 'password123',
            firstName: 'New',
            lastName: 'Tier',
            profile: 'tier'
          }
        });

      expect(response.status).toBe(201);
    });
  });

  describe('PATCH /api/v1/tiers/:id', () => {
    test('should update tier and return 200', async () => {
      const response = await request(app)
        .patch('/api/v1/tiers/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ name: 'Updated Tier' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/tiers/:id', () => {
    test('should delete tier and return 201 (admin only)', async () => {
      const response = await request(app)
        .delete('/api/v1/tiers/1')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/v1/tiers/:id with non-existent id', () => {
    test('should return 404 for non-existent tier', async () => {
      mockFindOne.mockRejectedValue({ isBoom: true, output: { statusCode: 404, payload: { message: 'Tier not found' } } });

      const response = await request(app)
        .get('/api/v1/tiers/99999')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/tiers with duplicate name', () => {
    test('should return 409 when tier name already exists', async () => {
      mockCreate.mockRejectedValue({
        name: 'SequelizeUniqueConstraintError',
        errors: [{ message: 'name must be unique' }]
      });

      const response = await request(app)
        .post('/api/v1/tiers')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'Existing Tier',
          user: {
            username: 'newtier',
            email: 'newtier@example.com',
            password: 'password123',
            firstName: 'New',
            lastName: 'Tier',
            profile: 'tier'
          }
        });

      expect(response.status).toBe(409);
    });
  });

  describe('PATCH /api/v1/tiers/:id with customer profile', () => {
    test('should return 401 when customer tries to update tier', async () => {
      // Set user to customer profile (not in ['admin', 'tier'])
      mockUser = { id:1, profile: 'customer' };

      const response = await request(app)
        .patch('/api/v1/tiers/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ name: 'Updated Tier' });

      expect(response.status).toBe(401);
    });
  });
});
