const UserService = require('../../../api/services/user.service');
const { models } = require('../../../api/libs/sequelize');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');

jest.mock('bcrypt');
jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    User: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
    }
  }
}));

describe('UserService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
  });

  describe('create', () => {
    test('should create a user with hashed password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        profile: 'customer'
      };

      const hashedPassword = 'hashedPassword123';

      bcrypt.hash.mockResolvedValue(hashedPassword);
      models.User.create.mockResolvedValue({
        dataValues: {
          id: 1,
          ...userData,
          password: hashedPassword
        }
      });

      const result = await service.create(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(models.User.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
    });

    test('should delete password and recoveryToken from response', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        profile: 'customer'
      };

      const createdUser = {
        dataValues: {
          id: 1,
          ...userData,
          password: 'hashed',
          recoveryToken: 'some-token'
        }
      };

      bcrypt.hash.mockResolvedValue('hashed');
      models.User.create.mockResolvedValue(createdUser);

      const result = await service.create(userData);

      expect(result.dataValues.password).toBeUndefined();
      expect(result.dataValues.recoveryToken).toBeUndefined();
    });
  });

  describe('find', () => {
    test('should return all users with tier included', async () => {
      const users = [
        { id: 1, username: 'user1', tier: { id: 1, name: 'basic' } },
        { id: 2, username: 'user2', tier: { id: 2, name: 'premium' } }
      ];

      models.User.findAll.mockResolvedValue(users);

      const result = await service.find();

      expect(models.User.findAll).toHaveBeenCalledWith({
        include: ['tier']
      });
      expect(result).toEqual(users);
    });
  });

  describe('findByUsername', () => {
    test('should find user by username', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      models.User.findOne.mockResolvedValue(user);

      const result = await service.findByUsername('testuser');

      expect(models.User.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' }
      });
      expect(result).toEqual(user);
    });

    test('should return null if user not found', async () => {
      models.User.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    test('should find user by email', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      models.User.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(models.User.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    test('should return user by id', async () => {
      const user = { id: 1, username: 'testuser' };
      models.User.findByPk.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(models.User.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    test('should throw boom.notFound if user does not exist', async () => {
      models.User.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('user not found');
    });
  });

  describe('update', () => {
    test('should update user and hash password if provided', async () => {
      const existingUser = {
        id: 1,
        update: jest.fn().mockResolvedValue({
          dataValues: { id: 1, username: 'updated' }
        }),
        dataValues: { id: 1, username: 'test' }
      };

      models.User.findByPk.mockResolvedValue(existingUser);
      bcrypt.hash.mockResolvedValue('newHashedPassword');

      const changes = { password: 'newpassword' };
      await service.update(1, changes);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(existingUser.update).toHaveBeenCalledWith({
        password: 'newHashedPassword'
      });
    });

    test('should update user without password hashing if password not provided', async () => {
      const existingUser = {
        id: 1,
        update: jest.fn().mockResolvedValue({
          dataValues: { id: 1, username: 'newusername' }
        }),
        dataValues: { id: 1, username: 'test' }
      };

      models.User.findByPk.mockResolvedValue(existingUser);

      const changes = { username: 'newusername' };
      await service.update(1, changes);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(existingUser.update).toHaveBeenCalledWith(changes);
    });
  });

  describe('delete', () => {
    test('should soft delete user and return id', async () => {
      const existingUser = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.User.findByPk.mockResolvedValue(existingUser);

      const result = await service.delete(1);

      expect(existingUser.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
