const OrderService = require('../../../api/services/order.service');
const { models } = require('../../../api/libs/sequelize');
const boom = require('@hapi/boom');

jest.mock('../../../api/libs/sequelize', () => ({
  models: {
    sequelize: {
      transaction: jest.fn().mockResolvedValue({
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      })
    },
    Order: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
    OrderProduct: {
      create: jest.fn(),
    },
    OrderProductCommission: {
      create: jest.fn(),
    }
  }
}));

describe('OrderService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderService();
  });

  describe('create', () => {
    test('should create an order with transaction', async () => {
      const orderData = { tierId: 1, statusId: 1 };
      const createdOrder = { id: 1, ...orderData };
      const orderWithIncludes = {
        id: 1,
        tierId: 1,
        statusId: 1,
        tier: { id: 1 },
        products: []
      };

      models.Order.create.mockResolvedValue(createdOrder);
      models.Order.findByPk.mockResolvedValue(orderWithIncludes);

      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      models.sequelize.transaction.mockResolvedValue(mockTransaction);

      const result = await service.create(orderData);

      expect(models.Order.create).toHaveBeenCalledWith(orderData, { transaction: mockTransaction });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(models.Order.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(result).toEqual(orderWithIncludes);
    });
  });

  describe('addProduct', () => {
    test('should add product to order with transaction', async () => {
      const productData = { orderId: 1, productId: 1, amount: 2 };
      const createdProduct = { id: 1, ...productData };

      models.OrderProduct.create.mockResolvedValue(createdProduct);

      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      models.sequelize.transaction.mockResolvedValue(mockTransaction);

      const result = await service.addProduct(productData);

      expect(models.OrderProduct.create).toHaveBeenCalledWith(productData, { transaction: mockTransaction });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(createdProduct);
    });
  });

  describe('addCommission', () => {
    test('should add commission to order product with transaction', async () => {
      const commissionData = { orderProductId: 1, commissionId: 1 };
      const createdCommission = { id: 1, ...commissionData };

      models.OrderProductCommission.create.mockResolvedValue(createdCommission);

      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      models.sequelize.transaction.mockResolvedValue(mockTransaction);

      const result = await service.addCommission(commissionData);

      expect(models.OrderProductCommission.create).toHaveBeenCalledWith(commissionData, { transaction: mockTransaction });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(createdCommission);
    });
  });

  describe('find', () => {
    test('should return all orders with complex include structure', async () => {
      const orders = [
        {
          id: 1,
          tier: { id: 1, user: { id: 1, username: 'user1' } },
          status: { id: 1, name: 'pending' },
          products: [{ id: 1, name: 'Product 1' }]
        }
      ];

      models.Order.findAll.mockResolvedValue(orders);

      const result = await service.find();

      expect(models.Order.findAll).toHaveBeenCalledWith({
        include: [
          {
            association: 'tier',
            include: ['user']
          },
          'status',
          'products',
          {
            association: 'orderProducts',
            include: [
              {
                association: 'orderProductCommissions',
                include: ['commission']
              }
            ]
          }
        ]
      });
      expect(result).toEqual(orders);
    });
  });

  describe('findByUser', () => {
    test('should return orders for specific user', async () => {
      const orders = [
        {
          id: 1,
          tier: { id: 1, user: { id: 1, username: 'user1' } }
        }
      ];

      models.Order.findAll.mockResolvedValue(orders);

      const result = await service.findByUser(1);

      expect(models.Order.findAll).toHaveBeenCalledWith({
        where: {
          '$tier.user.id$': 1
        },
        include: [
          {
            association: 'tier',
            include: ['user']
          },
          'status',
          'products',
          {
            association: 'orderProducts',
            include: [
              {
                association: 'orderProductCommissions',
                include: ['commission']
              }
            ]
          }
        ]
      });
      expect(result).toEqual(orders);
    });

    test('should return orders for different user IDs', async () => {
      const orders = [
        {
          id: 2,
          tier: { id: 2, user: { id: 2, username: 'user2' } }
        }
      ];

      models.Order.findAll.mockResolvedValue(orders);

      const result = await service.findByUser(2);

      expect(models.Order.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { '$tier.user.id$': 2 }
        })
      );
      expect(result).toEqual(orders);
    });

    test('should return empty array if user has no orders', async () => {
      models.Order.findAll.mockResolvedValue([]);

      const result = await service.findByUser(999);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    test('should return order by id with includes', async () => {
      const order = {
        id: 1,
        tier: { id: 1, user: { id: 1 } },
        status: { id: 1 },
        products: []
      };
      models.Order.findByPk.mockResolvedValue(order);

      const result = await service.findOne(1);

      expect(models.Order.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            association: 'tier',
            include: ['user']
          },
          'status',
          'products',
          {
            association: 'orderProducts',
            include: [
              {
                association: 'orderProductCommissions',
                include: ['commission']
              }
            ]
          }
        ]
      });
      expect(result).toEqual(order);
    });

    test('should throw boom.notFound if order does not exist', async () => {
      models.Order.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('order not found');
    });
  });

  describe('update', () => {
    test('should update order', async () => {
      const existingOrder = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, statusId: 2 })
      };

      models.Order.findByPk.mockResolvedValue(existingOrder);

      const changes = { statusId: 2 };
      const result = await service.update(1, changes);

      expect(existingOrder.update).toHaveBeenCalledWith(changes);
      expect(result).toEqual({ id: 1, statusId: 2 });
    });
  });

  describe('delete', () => {
    test('should soft delete order and return id', async () => {
      const existingOrder = {
        id: 1,
        update: jest.fn().mockResolvedValue(undefined)
      };

      models.Order.findByPk.mockResolvedValue(existingOrder);

      const result = await service.delete(1);

      expect(existingOrder.update).toHaveBeenCalledWith({ isActive: false });
      expect(result).toEqual({ id: 1 });
    });
  });
});
