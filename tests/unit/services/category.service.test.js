const CategoryService = require('../../../api/services/category.service');
const { models } = require('../../../api/libs/sequelize');
const boom = require('@hapi/boom');

jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    Category: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    }
  }
}));

describe('CategoryService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategoryService();
  });

  describe('create', () => {
    test('should create a category', async () => {
      const categoryData = { name: 'Electronics' };
      const createdCategory = { id: 1, ...categoryData };
      models.Category.create.mockResolvedValue(createdCategory);

      const result = await service.create(categoryData);

      expect(models.Category.create).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(createdCategory);
    });
  });

  describe('find', () => {
    test('should return all categories with products included', async () => {
      const categories = [
        { id: 1, name: 'Electronics', products: [{ id: 1, name: 'Laptop' }] },
        { id: 2, name: 'Books', products: [{ id: 2, name: 'Novel' }] }
      ];

      models.Category.findAll.mockResolvedValue(categories);

      const result = await service.find();

      expect(models.Category.findAll).toHaveBeenCalledWith({
        include: ['products']
      });
      expect(result).toEqual(categories);
    });
  });

  describe('findOne', () => {
    test('should return category by id with products', async () => {
      const category = {
        id: 1,
        name: 'Electronics',
        products: [{ id: 1, name: 'Laptop' }]
      };
      models.Category.findByPk.mockResolvedValue(category);

      const result = await service.findOne(1);

      expect(models.Category.findByPk).toHaveBeenCalledWith(1, {
        include: ['products']
      });
      expect(result).toEqual(category);
    });

    test('should throw boom.notFound if category does not exist', async () => {
      models.Category.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('category not found');
    });
  });

  describe('update', () => {
    test('should update category', async () => {
      const existingCategory = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated' })
      };

      models.Category.findByPk.mockResolvedValue(existingCategory);

      const changes = { name: 'Updated Category' };
      const result = await service.update(1, changes);

      expect(existingCategory.update).toHaveBeenCalledWith(changes);
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });
  });

  describe('delete', () => {
    test('should soft delete category and return id', async () => {
      const existingCategory = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.Category.findByPk.mockResolvedValue(existingCategory);

      const result = await service.delete(1);

      expect(existingCategory.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
