const TierService = require('../../../api/services/tier.service');
const { models } = require('../../../api/libs/sequelize');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');

jest.mock('bcrypt');
jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    sequelize: {
      transaction: jest.fn().mockResolvedValue({
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      })
    },
    Tier: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
    User: {
      create: jest.fn(),
    }
  }
}));

describe('TierService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TierService();
  });

  describe('create', () => {
    test('should create a tier with hashed user password', async () => {
      const tierData = {
        name: 'Premium',
        user: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          profile: 'customer'
        }
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = { id: 1, ...tierData.user, password: hashedPassword };
      const createdTier = { id: 1, name: 'Premium', userId: 1 };
      const tierWithUser = {
        dataValues: {
          id: 1,
          name: 'Premium',
          user: {
            dataValues: {
              id: 1,
              username: 'testuser',
              password: hashedPassword
            }
          }
        }
      };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      models.User.create.mockResolvedValue(createdUser);
      models.Tier.create.mockResolvedValue(createdTier);
      models.Tier.findByPk.mockResolvedValue(tierWithUser);

      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      models.sequelize.transaction.mockResolvedValue(mockTransaction);

      const result = await service.create(tierData);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(models.User.create).toHaveBeenCalledWith({
        ...tierData.user,
        password: hashedPassword
      }, { transaction: mockTransaction });
      expect(models.Tier.create).toHaveBeenCalledWith({
        ...tierData,
        userId: 1,
        user: undefined
      }, { transaction: mockTransaction });
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    test('should delete password from user in response', async () => {
      const tierData = {
        name: 'Basic',
        user: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          profile: 'customer'
        }
      };

      const createdUser = { id: 1, ...tierData.user, password: 'hashed' };
      const createdTier = { id: 1, name: 'Basic', userId: 1 };
      const tierWithUser = {
        dataValues: {
          id: 1,
          name: 'Basic',
          user: {
            dataValues: {
              id: 1,
              username: 'testuser',
              password: 'hashed'
            }
          }
        }
      };

      bcrypt.hash.mockResolvedValue('hashed');
      models.User.create.mockResolvedValue(createdUser);
      models.Tier.create.mockResolvedValue(createdTier);
      models.Tier.findByPk.mockResolvedValue(tierWithUser);

      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      models.sequelize.transaction.mockResolvedValue(mockTransaction);

      const result = await service.create(tierData);

      expect(result.dataValues.user.dataValues.password).toBeUndefined();
    });
  });

  describe('find', () => {
    test('should return all tiers with user included', async () => {
      const tiers = [
        { id: 1, name: 'Basic', user: { id: 1, username: 'user1' } },
        { id: 2, name: 'Premium', user: { id: 2, username: 'user2' } }
      ];

      models.Tier.findAll.mockResolvedValue(tiers);

      const result = await service.find();

      expect(models.Tier.findAll).toHaveBeenCalledWith({
        include: ['user']
      });
      expect(result).toEqual(tiers);
    });
  });

  describe('findOne', () => {
    test('should return tier by id', async () => {
      const tier = { id: 1, name: 'Premium' };
      models.Tier.findByPk.mockResolvedValue(tier);

      const result = await service.findOne(1);

      expect(models.Tier.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(tier);
    });

    test('should throw boom.notFound if tier does not exist', async () => {
      models.Tier.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('tier not found');
    });
  });

  describe('update', () => {
    test('should update tier', async () => {
      const existingTier = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated' })
      };

      models.Tier.findByPk.mockResolvedValue(existingTier);

      const changes = { name: 'Updated Tier' };
      const result = await service.update(1, changes);

      expect(existingTier.update).toHaveBeenCalledWith(changes);
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });
  });

  describe('delete', () => {
    test('should soft delete tier and return id', async () => {
      const existingTier = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.Tier.findByPk.mockResolvedValue(existingTier);

      const result = await service.delete(1);

      expect(existingTier.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
