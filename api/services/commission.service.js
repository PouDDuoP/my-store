const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class CommissionService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.commissions = [];
  }

  create(data) {
    const newCommission = models.Commission.create(data);
    return newCommission;
  }

  find() {
    const response = models.Commission.findAll({
      include: ['user', 'product']
    });
    return response;
  }

  findOne(id) {
    const commission = models.Commission.findByPk(id, {
      include: ['user', 'product']
    });
    if (!commission) {
      throw boom.notFound('commission not found');
    }
    return commission;
  }

  async update(id , changes) {
    const commission = await this.findOne(id);
    const response = await commission.update(changes);
    return response;
  }

  async delete(id) {
    const commission = await this.findOne(id);
    await commission.destroy();
    return { id };
  }

}

module.exports = CommissionService;
