const MultimediaService = require('../../../api/services/multimedia.service');
const { models } = require('../../../api/libs/sequelize');
const boom = require('@hapi/boom');

jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    Multimedia: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    }
  }
}));

describe('MultimediaService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MultimediaService();
  });

  describe('create', () => {
    test('should create multimedia', async () => {
      const multimediaData = {
        url: 'http://example.com/image.jpg',
        productId: 1
      };
      const createdMultimedia = { id: 1, ...multimediaData };
      models.Multimedia.create.mockResolvedValue(createdMultimedia);

      const result = await service.create(multimediaData);

      expect(models.Multimedia.create).toHaveBeenCalledWith(multimediaData);
      expect(result).toEqual(createdMultimedia);
    });
  });

  describe('find', () => {
    test('should return all multimedia with product included', async () => {
      const multimediaItems = [
        { id: 1, url: 'http://example.com/img1.jpg', product: { id: 1, name: 'Product 1' } },
        { id: 2, url: 'http://example.com/img2.jpg', product: { id: 2, name: 'Product 2' } }
      ];

      models.Multimedia.findAll.mockResolvedValue(multimediaItems);

      const result = await service.find();

      expect(models.Multimedia.findAll).toHaveBeenCalledWith({
        include: ['product']
      });
      expect(result).toEqual(multimediaItems);
    });
  });

  describe('findOne', () => {
    test('should return multimedia by id with product', async () => {
      const multimedia = {
        id: 1,
        url: 'http://example.com/image.jpg',
        product: { id: 1, name: 'Product 1' }
      };
      models.Multimedia.findByPk.mockResolvedValue(multimedia);

      const result = await service.findOne(1);

      expect(models.Multimedia.findByPk).toHaveBeenCalledWith(1, {
        include: ['product']
      });
      expect(result).toEqual(multimedia);
    });

    test('should throw boom.notFound if multimedia does not exist', async () => {
      models.Multimedia.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('multimedia not found');
    });
  });

  describe('update', () => {
    test('should update multimedia', async () => {
      const existingMultimedia = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, url: 'updated-url.jpg' })
      };

      models.Multimedia.findByPk.mockResolvedValue(existingMultimedia);

      const changes = { url: 'updated-url.jpg' };
      const result = await service.update(1, changes);

      expect(existingMultimedia.update).toHaveBeenCalledWith(changes);
      expect(result).toEqual({ id: 1, url: 'updated-url.jpg' });
    });
  });

  describe('delete', () => {
    test('should soft delete multimedia and return id', async () => {
      const existingMultimedia = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.Multimedia.findByPk.mockResolvedValue(existingMultimedia);

      const result = await service.delete(1);

      expect(existingMultimedia.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
