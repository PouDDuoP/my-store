const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class TierService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.tiers = [];
  }

  async create(data) {
    const newUser = await models.User.create(data.user);
    const newTier = await models.Tier.create({
      ...data,
      userId: newUser.id
    });
    return newTier;
  }

  async find() {
    const response = await models.Tier.findAll({
      include: ['user']
    });
    return response;
  }

  async findOne(id) {
    const tier = await models.Tier.findByPk(id);
    if (!tier) {
      throw boom.notFound('product not found');
    }
    return tier;
  }

  async update(id , changes) {
    const tier = await this.findOne(id);
    const response = await tier.update(changes);
    return response;
  }

  async delete(id) {
    const tier = await this.findOne(id);
    await tier.destroy();
    return { id };
  }

}

module.exports = TierService;
