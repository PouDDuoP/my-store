const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class OrderService {

  constructor() {}

  async create(data) {
    const t = await models.sequelize.transaction();
    try {
      const order = await models.Order.create(data, { transaction: t });
      await t.commit();
      return await models.Order.findByPk(order.id, {
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
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async addProduct(data) {
    const t = await models.sequelize.transaction();
    try {
      const orderProduct = await models.OrderProduct.create(data, { transaction: t });
      await t.commit();
      return orderProduct;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async addCommission(data) {
    const t = await models.sequelize.transaction();
    try {
      const commission = await models.OrderProductCommission.create(data, { transaction: t });
      await t.commit();
      return commission;
    } catch (error) {
      await t.rollback();
      throw error;
    }
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
    await order.update({ isActive: false });
    return { id };
  }

}

module.exports = OrderService;
