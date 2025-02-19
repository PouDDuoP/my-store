const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class OrderStatusService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.status = [];
  }

  async create(data) {
    const newStatus = await models.OrderStatus.create(data);
    return newStatus;
  }

  async find() {
    const response = await models.OrderStatus.findAll();
    return response;
  }

  async findOne(id) {
    const status = await models.OrderStatus.findByPk(id);
    if (!status) {
      throw boom.notFound('status not found');
    }
    return status;
  }

  async update(id , changes) {
    const status = await this.findOne(id);
    const response = await status.update(changes);
    return response;
  }

  async delete(id) {
    const status = await this.findOne(id);
    await status.destroy();
    return { id };
  }

}

module.exports = OrderStatusService;
