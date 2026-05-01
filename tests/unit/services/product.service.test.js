const ProductService = require('../../../api/services/product.service');
const { models } = require('../../../api/libs/sequelize');
const { Op } = require('sequelize');
const boom = require('@hapi/boom');

jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    Product: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    }
  }
}));

describe('ProductService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService();
  });

  describe('create', () => {
    test('should create a product', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        image: 'http://image.com/img.png',
        categoryId: 1
      };

      const createdProduct = { id: 1, ...productData };
      models.Product.create.mockResolvedValue(createdProduct);

      const result = await service.create(productData);

      expect(models.Product.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('find', () => {
    test('should return all products with default options', async () => {
      const products = [
        { id: 1, name: 'Product 1', category: { id: 1, name: 'Category 1' } },
        { id: 2, name: 'Product 2', category: { id: 2, name: 'Category 2' } }
      ];

      models.Product.findAll.mockResolvedValue(products);

      const result = await service.find({});

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: {},
        order: [['id', 'ASC']]
      });
      expect(result).toEqual(products);
    });

    test('should apply limit and offset when both are provided', async () => {
      const products = [{ id: 1, name: 'Product 1' }];
      models.Product.findAll.mockResolvedValue(products);

      // Note: offset: 0 is falsy in JS, so use non-zero values
      await service.find({ limit: 10, offset: 5 });

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: {},
        order: [['id', 'ASC']],
        limit: 10,
        offset: 5
      });
    });

    test('should not apply limit and offset if only one is provided', async () => {
      const products = [{ id: 1, name: 'Product 1' }];
      models.Product.findAll.mockResolvedValue(products);

      await service.find({ limit: 10 });

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: {},
        order: [['id', 'ASC']]
      });
    });

    test('should filter by exact price', async () => {
      const products = [{ id: 1, name: 'Product 1', price: 100 }];
      models.Product.findAll.mockResolvedValue(products);

      await service.find({ price: 100 });

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: { price: 100 },
        order: [['id', 'ASC']]
      });
    });

    test('should filter by price range when price_min and price_max provided', async () => {
      const products = [
        { id: 1, name: 'Product 1', price: 75 },
        { id: 2, name: 'Product 2', price: 125 }
      ];
      models.Product.findAll.mockResolvedValue(products);

      await service.find({ price_min: 50, price_max: 150 });

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: {
          price: {
            [Op.gte]: 50,
            [Op.lte]: 150
          }
        },
        order: [['id', 'ASC']]
      });
    });

    test('should not apply price filter if only price_min or only price_max provided', async () => {
      models.Product.findAll.mockResolvedValue([]);

      await service.find({ price_min: 50 });

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: {},
        order: [['id', 'ASC']]
      });
    });

    test('should filter by price_min and price_max together', async () => {
      const products = [
        { id: 1, name: 'Product 1', price: 75 },
        { id: 2, name: 'Product 2', price: 125 }
      ];
      models.Product.findAll.mockResolvedValue(products);

      await service.find({ price_min: 50, price_max: 150 });

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: {
          price: {
            [Op.gte]: 50,
            [Op.lte]: 150
          }
        },
        order: [['id', 'ASC']]
      });
    });

    test('should apply all filters together (price, limit, offset)', async () => {
      const products = [{ id: 1, name: 'Product 1' }];
      models.Product.findAll.mockResolvedValue(products);

      await service.find({ price_min: 50, price_max: 150, limit: 10, offset: 5 });

      expect(models.Product.findAll).toHaveBeenCalledWith({
        include: ['category'],
        where: {
          price: {
            [Op.gte]: 50,
            [Op.lte]: 150
          }
        },
        order: [['id', 'ASC']],
        limit: 10,
        offset: 5
      });
    });
  });

  describe('findOne', () => {
    test('should return product by id with category', async () => {
      const product = {
        id: 1,
        name: 'Test Product',
        category: { id: 1, name: 'Category 1' }
      };
      models.Product.findByPk.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(models.Product.findByPk).toHaveBeenCalledWith(1, {
        include: ['category']
      });
      expect(result).toEqual(product);
    });

    test('should throw boom.notFound if product does not exist', async () => {
      models.Product.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('product not found');
    });
  });

  describe('update', () => {
    test('should update product', async () => {
      const existingProduct = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated' })
      };

      models.Product.findByPk.mockResolvedValue(existingProduct);

      const changes = { name: 'Updated', price: 199.99 };
      const result = await service.update(1, changes);

      expect(existingProduct.update).toHaveBeenCalledWith(changes);
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });
  });

  describe('delete', () => {
    test('should soft delete product and return id', async () => {
      const existingProduct = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.Product.findByPk.mockResolvedValue(existingProduct);

      const result = await service.delete(1);

      expect(existingProduct.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
