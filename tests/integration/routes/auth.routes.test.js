const request = require('supertest');
const express = require('express');

// Mock passport - TOP LEVEL (gets hoisted by Jest)
// Use mock prefix for variables referenced in jest.mock factory
let mockAuthenticate = jest.fn((strategy, options) => {
  return (req, res, next) => {
    if (strategy === 'local') {
      req.user = { id:1, username: 'testuser', profile: 'customer' };
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

// Mock auth service
jest.mock('../../../api/services/auth.service', () => {
  return jest.fn().mockImplementation(() => ({
    signToken: jest.fn().mockReturnValue({
      user: { id:1, username: 'testuser', profile: 'customer' },
      token: 'jwt-token-123'
    }),
    sendRecovery: jest.fn().mockResolvedValue({ message: 'mail sent' }),
    changePassword: jest.fn().mockResolvedValue({ message: 'password changed' })
  }));
});

describe('Auth Routes - Integration Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    app = express();
    app.use(express.json());

    const authRouter = require('../../../api/routes/auth.router');
    app.use('/api/v1/auth', authRouter);

    app.use((err, req, res, next) => {
      if (err && err.isBoom) {
        return res.status(err.output.statusCode).json(err.output.payload);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('should return 200 with token for valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/v1/auth/recovery', () => {
    test('should return 200 for valid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/recovery')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/v1/auth/change-password', () => {
    test('should return 200 for valid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .send({ token: 'valid-token', newPassword: 'newpassword123' });

      expect(response.status).toBe(200);
    });
  });
});
