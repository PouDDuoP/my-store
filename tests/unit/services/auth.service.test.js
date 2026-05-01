// Mock modules BEFORE requiring anything that depends on them
// Jest will automatically use __mocks__/bcrypt.js etc. when jest.mock() is called
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
jest.mock('../../../api/config/config', () => ({
  config: {
    jwtSecret: 'test-secret',
    emailUser: 'test@example.com',
    emailPassword: 'test-pass',
    frontendUrl: 'http://localhost:8080'
  }
}));

// Create mock functions that will be used by the UserService instance
const mockFindByUsername = jest.fn();
const mockFindByEmail = jest.fn();
const mockFindOne = jest.fn();
const mockUpdate = jest.fn();

// Mock the user service module
jest.mock('../../../api/services/user.service', () => {
  return jest.fn().mockImplementation(() => ({
    findByUsername: mockFindByUsername,
    findByEmail: mockFindByEmail,
    findOne: mockFindOne,
    update: mockUpdate
  }));
});

const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthService = require('../../../api/services/auth.service');
const UserService = require('../../../api/services/user.service');

describe('AuthService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();
  });

  describe('getUser', () => {
    test('should return user when credentials are valid', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        profile: 'customer',
        dataValues: {
          username: 'testuser',
          password: 'hashedPassword',
          profile: 'customer'
        }
      };

      mockFindByUsername.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.getUser('testuser', 'password123');

      expect(mockFindByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result.dataValues.password).toBeUndefined();
    });

    test('should throw unauthorized if user not found', async () => {
      mockFindByUsername.mockResolvedValue(null);

      await expect(service.getUser('nonexistent', 'password'))
        .rejects.toThrow();
    });

    test('should throw unauthorized if password does not match', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        dataValues: { password: 'hashedPassword' }
      };

      mockFindByUsername.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(service.getUser('testuser', 'wrongpassword'))
        .rejects.toThrow();
    });
  });

  describe('signToken', () => {
    test('should return user and token', () => {
      const user = { id: 1, profile: 'customer' };
      const token = 'jwt-token-123';

      jwt.sign.mockReturnValue(token);

      const result = service.signToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 1, profile: 'customer' },
        'test-secret'
      );
      expect(result).toEqual({ user, token });
    });
  });

  describe('sendRecovery', () => {
    test('should send recovery email and update recovery token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com'
      };

      mockFindByEmail.mockResolvedValue(user);
      jwt.sign.mockReturnValue('recovery-token-123');

      const result = await service.sendRecovery('test@example.com');

      expect(mockFindByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 1 },
        'test-secret',
        { expiresIn: '15min' }
      );
      expect(mockUpdate).toHaveBeenCalledWith(1, {
        recoveryToken: 'recovery-token-123'
      });
      expect(result).toEqual({ message: 'mail sent' });
    });

    test('should throw unauthorized if email not found', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(service.sendRecovery('nonexistent@example.com'))
        .rejects.toThrow();
    });
  });

  describe('changePassword', () => {
    test('should change password with valid token', async () => {
      const user = {
        id: 1,
        recoveryToken: 'valid-token',
        dataValues: { recoveryToken: 'valid-token' }
      };

      jwt.verify.mockReturnValue({ sub: 1 });
      mockFindOne.mockResolvedValue(user);
      bcrypt.hash.mockResolvedValue('newHashedPassword');

      const result = await service.changePassword('valid-token', 'newpassword123');

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(mockFindOne).toHaveBeenCalledWith(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockUpdate).toHaveBeenCalledWith(1, {
        recoveryToken: null,
        password: 'newHashedPassword'
      });
      expect(result).toEqual({ message: 'password changed' });
    });

    test('should throw unauthorized if token is invalid', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.changePassword('invalid-token', 'newpassword'))
        .rejects.toThrow();
    });

    test('should throw unauthorized if recovery token does not match', async () => {
      const user = {
        id: 1,
        recoveryToken: 'different-token',
        dataValues: { recoveryToken: 'different-token' }
      };

      jwt.verify.mockReturnValue({ sub: 1 });
      mockFindOne.mockResolvedValue(user);

      await expect(service.changePassword('valid-token', 'newpassword'))
        .rejects.toThrow();
    });

    test('should throw unauthorized if token is expired', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.changePassword('expired-token', 'newpassword'))
        .rejects.toThrow();
    });

    test('should throw unauthorized if user not found with token', async () => {
      jwt.verify.mockReturnValue({ sub: 999 });
      mockFindOne.mockResolvedValue(null);

      await expect(service.changePassword('valid-token', 'newpassword'))
        .rejects.toThrow();
    });

    test('should throw unauthorized if recovery token is null', async () => {
      const user = {
        id: 1,
        recoveryToken: null,
        dataValues: { recoveryToken: null }
      };

      jwt.verify.mockReturnValue({ sub: 1 });
      mockFindOne.mockResolvedValue(user);

      await expect(service.changePassword('valid-token', 'newpassword'))
        .rejects.toThrow();
    });
  });
});
