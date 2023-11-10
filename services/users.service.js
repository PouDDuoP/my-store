// const boom = require('@hapi/boom');

// const getConnection = require('../libs/postgres');
// const pool = require('../libs/postgres.pool');
const { models } = require('../libs/sequelize');

class UsersService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.users = [];
  }

  create(data) {
    return data;
  }

  async find() {
    const response = await models.User.findAll();
    return response;
  }

  findOne(id) {
    return this.users.find(item => item.id === id)
  }

  update() {

  }

  delete() {

  }

}

module.exports = UsersService
