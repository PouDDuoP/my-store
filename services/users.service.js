// const boom = require('@hapi/boom');

// const getConnection = require('../libs/postgres');
const pool = require('../libs/postgres.pool');

class UsersService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.users = [];
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  create(data) {
    return data;
  }

  async find() {
    const query = 'SELECT * FROM tasks';
    const response = await this.pool.query(query);
    // return this.users;
    return response.rows;
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
