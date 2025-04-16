const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class OrderService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.Orders = [];
  }

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async addProduct(data) {
    const newAddProduct = await models.OrderProduct.create(data);
    return newAddProduct;
  }

  async addCommission(data) {
    const newAddCommission = await models.OrderProductCommission.create(data);
    return newAddCommission;
  }

  async find() {
    const response = await models.Order.findAll({
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
    return response;
  }

  async findByUser(userId) {
    const response = await models.Order.findAll({
      where: {
        '$tier.user.id$': userId
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
    return response;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
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
    if (!order) {
      throw boom.notFound('order not found');
    }
    return order;
  }

  async update(id , changes) {
    const order = await this.findOne(id);
    const response = await order.update(changes);
    return response;
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return { id };
  }

}

module.exports = OrderService;
