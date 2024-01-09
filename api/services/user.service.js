const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

// const getConnection = require('../libs/postgres');
// const pool = require('../libs/postgres.pool');
const { models } = require('../libs/sequelize');

class UserService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.users = [];
  }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async find() {
    const response = await models.User.findAll({
      include: ['tier']
    });
    return response;
  }

  async findByUsername(username) {
    const response = await models.User.findOne({
      where: { username }
    });
    return response;
  }

  async findByEmail(email) {
    const response = await models.User.findOne({
      where: { email }
    });
    return response;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id , changes) {
    if (changes.password) {
      const hash = await bcrypt.hash(changes.password, 10);
      changes.password = hash;
    }
    const user = await this.findOne(id);
    const response = await user.update(changes);
    delete response.dataValues.password;
    return response;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }

}

module.exports = UserService
