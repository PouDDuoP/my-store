const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class CommissionService {

  constructor() {}

  async create(data) {
    const newCommission = await models.Commission.create(data);
    return newCommission;
  }

  async find(query = {}) {
    const options = {
      include: ['user', 'product']
    };
    if (query.limit) options.limit = query.limit;
    if (query.offset) options.offset = query.offset;

    const response = await models.Commission.findAll(options);
    return response;
  }

  async findOne(id) {
    const commission = await models.Commission.findByPk(id, {
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
    await commission.update({ isActive: false });
    return { id };
  }

}

module.exports = CommissionService;
