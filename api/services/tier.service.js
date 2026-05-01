const boom = require("@hapi/boom");
const bcrypt = require('bcrypt');

const { models } = require('../libs/sequelize');

class TierService {

  constructor() {}

  async create(data) {
    const t = await models.sequelize.transaction();
    try {
      const hash = await bcrypt.hash(data.user.password, 10);
      const user = await models.User.create({
        ...data.user,
        password: hash
      }, { transaction: t });

      const tier = await models.Tier.create({
        ...data,
        userId: user.id,
        user: undefined
      }, { transaction: t });

      await t.commit();
      const result = await models.Tier.findByPk(tier.id, { include: ['user'] });
      delete result.dataValues.user.dataValues.password;
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
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
      throw boom.notFound('tier not found');
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
    await tier.update({ isActive: false });
    return { id };
  }

}

module.exports = TierService;
