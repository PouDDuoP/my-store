const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class StatusService {

  constructor() {}

  async create(data) {
    const newStatus = await models.Status.create(data);
    return newStatus;
  }

  async find(query = {}) {
    const options = {};
    if (query.limit) options.limit = query.limit;
    if (query.offset) options.offset = query.offset;

    const response = await models.Status.findAll(options);
    return response;
  }

  async findOne(id) {
    const status = await models.Status.findByPk(id);
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
    await status.update({ isActive: false });
    return { id };
  }

}

module.exports = StatusService;
