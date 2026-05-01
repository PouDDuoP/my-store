const StatusService = require('../../../api/services/status.service');
const { models } = require('../../../api/libs/sequelize');
const boom = require('@hapi/boom');

jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    Status: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    }
  }
}));

describe('StatusService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StatusService();
  });

  describe('create', () => {
    test('should create a status', async () => {
      const statusData = { name: 'pending' };
      const createdStatus = { id: 1, ...statusData };
      models.Status.create.mockResolvedValue(createdStatus);

      const result = await service.create(statusData);

      expect(models.Status.create).toHaveBeenCalledWith(statusData);
      expect(result).toEqual(createdStatus);
    });
  });

  describe('find', () => {
    test('should return all statuses', async () => {
      const statuses = [
        { id: 1, name: 'pending' },
        { id: 2, name: 'completed' },
        { id: 3, name: 'cancelled' }
      ];

      models.Status.findAll.mockResolvedValue(statuses);

      const result = await service.find();

      expect(models.Status.findAll).toHaveBeenCalled();
      expect(result).toEqual(statuses);
    });
  });

  describe('findOne', () => {
    test('should return status by id', async () => {
      const status = { id: 1, name: 'pending' };
      models.Status.findByPk.mockResolvedValue(status);

      const result = await service.findOne(1);

      expect(models.Status.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(status);
    });

    test('should throw boom.notFound if status does not exist', async () => {
      models.Status.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('status not found');
    });
  });

  describe('update', () => {
    test('should update status', async () => {
      const existingStatus = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, name: 'updated' })
      };

      models.Status.findByPk.mockResolvedValue(existingStatus);

      const changes = { name: 'updated status' };
      const result = await service.update(1, changes);

      expect(existingStatus.update).toHaveBeenCalledWith(changes);
      expect(result).toEqual({ id: 1, name: 'updated' });
    });
  });

  describe('delete', () => {
    test('should soft delete status and return id', async () => {
      const existingStatus = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.Status.findByPk.mockResolvedValue(existingStatus);

      const result = await service.delete(1);

      expect(existingStatus.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
