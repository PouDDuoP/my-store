const boom = require('@hapi/boom');

const getConnection = require('../libs/postgres');

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
    // const client = await getConnection();
    // const response = await client.query('SELECT * FROM tasks');
    return this.users;
    // return response.rows;
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
