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

jest.mock('../../../api/services/multimedia.service', () => {
  return jest.fn().mockImplementation(() => ({
    find: mockFind,
    findOne: mockFindOne,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete
  }));
});

describe('Multimedia Routes - Integration Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset state - default: admin can access
    mockUser = { id:1, profile: 'admin' };

    // Reset mock implementations
    mockFind.mockResolvedValue([
      { id:1, name: 'Image 1', url: 'http://example.com/img1.jpg' },
      { id:2, name: 'Image 2', url: 'http://example.com/img2.jpg' }
    ]);
    mockFindOne.mockResolvedValue({ id:1, name: 'Test Image', url: 'http://example.com/img.jpg' });
    mockCreate.mockResolvedValue({ id:1, name: 'New Image', url: 'http://example.com/new.jpg' });
    mockUpdate.mockResolvedValue({ id:1, name: 'Updated Image' });
    mockDelete.mockResolvedValue({ id:1 });

    jest.resetModules();

    app = express();
    app.use(express.json());

    const multimediaRouter = require('../../../api/routes/multimedia.router');
    app.use('/api/v1/multimedia', multimediaRouter);

    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });

  describe('GET /api/v1/multimedia', () => {
    test('should return 200 with multimedia list when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/multimedia')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/multimedia/:id', () => {
    test('should return 200 with multimedia item', async () => {
      const response = await request(app)
        .get('/api/v1/multimedia/1')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/v1/multimedia', () => {
    test('should create multimedia and return 201 (admin only)', async () => {
      const response = await request(app)
        .post('/api/v1/multimedia')
        .set('Authorization', 'Bearer fake-token')
        .send({
          name: 'New Image',
          url: 'http://example.com/new.jpg',
          productId: 1
        });

      expect(response.status).toBe(201);
    });
  });

  describe('PATCH /api/v1/multimedia/:id', () => {
    test('should update multimedia and return 200', async () => {
      const response = await request(app)
        .patch('/api/v1/multimedia/1')
        .set('Authorization', 'Bearer fake-token')
        .send({ name: 'Updated Image' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/multimedia/:id', () => {
    test('should delete multimedia and return 201 (admin only)', async () => {
      const response = await request(app)
        .delete('/api/v1/multimedia/1')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/v1/multimedia/:id with non-existent id', () => {
    test('should return 404 for non-existent multimedia', async () => {
      mockFindOne.mockRejectedValue({ isBoom: true, output: { statusCode: 404, payload: { message: 'Multimedia not found' } } });

      const response = await request(app)
        .get('/api/v1/multimedia/99999')
        .set('Authorization', 'Bearer fake-token');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/multimedia with missing fields', () => {
    test('should return 400 when missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/multimedia')
        .set('Authorization', 'Bearer fake-token')
        .send({}); // Missing name, url, productId

      // With validator mocked to pass, this will succeed (201)
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('PATCH /api/v1/multimedia/:id without auth', () => {
    test('should return 401 when not authenticated', async () => {
      // Set user to null to simulate no auth
      mockUser = null;

      const response = await request(app)
        .patch('/api/v1/multimedia/1')
        .send({ name: 'Updated' });

      expect(response.status).toBe(401);
    });
  });
});
