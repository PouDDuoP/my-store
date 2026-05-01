const CommissionService = require('../../../api/services/commission.service');
const { models } = require('../../../api/libs/sequelize');
const boom = require('@hapi/boom');

jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    Commission: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    }
  }
}));

describe('CommissionService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommissionService();
  });

  describe('create', () => {
    test('should create a commission', async () => {
      const commissionData = {
        userId: 1,
        productId: 1,
        amount: 50.00
      };
      const createdCommission = { id: 1, ...commissionData };
      models.Commission.create.mockResolvedValue(createdCommission);

      const result = await service.create(commissionData);

      expect(models.Commission.create).toHaveBeenCalledWith(commissionData);
      expect(result).toEqual(createdCommission);
    });
  });

  describe('find', () => {
    test('should return all commissions with user and product included', async () => {
      const commissions = [
        {
          id: 1,
          amount: 50.00,
          user: { id: 1, username: 'user1' },
          product: { id: 1, name: 'Product 1' }
        },
        {
          id: 2,
          amount: 75.00,
          user: { id: 2, username: 'user2' },
          product: { id: 2, name: 'Product 2' }
        }
      ];

      models.Commission.findAll.mockResolvedValue(commissions);

      const result = await service.find();

      expect(models.Commission.findAll).toHaveBeenCalledWith({
        include: ['user', 'product']
      });
      expect(result).toEqual(commissions);
    });
  });

  describe('findOne', () => {
    test('should return commission by id with user and product', async () => {
      const commission = {
        id: 1,
        amount: 50.00,
        user: { id: 1, username: 'user1' },
        product: { id: 1, name: 'Product 1' }
      };
      models.Commission.findByPk.mockResolvedValue(commission);

      const result = await service.findOne(1);

      expect(models.Commission.findByPk).toHaveBeenCalledWith(1, {
        include: ['user', 'product']
      });
      expect(result).toEqual(commission);
    });

    test('should throw boom.notFound if commission does not exist', async () => {
      models.Commission.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('commission not found');
    });
  });

  describe('update', () => {
    test('should update commission', async () => {
      const existingCommission = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, amount: 100.00 })
      };

      models.Commission.findByPk.mockResolvedValue(existingCommission);

      const changes = { amount: 100.00 };
      const result = await service.update(1, changes);

      expect(existingCommission.update).toHaveBeenCalledWith(changes);
      expect(result).toEqual({ id: 1, amount: 100.00 });
    });
  });

  describe('delete', () => {
    test('should soft delete commission and return id', async () => {
      const existingCommission = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.Commission.findByPk.mockResolvedValue(existingCommission);

      const result = await service.delete(1);

      expect(existingCommission.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
