const pool = require('../libs/postgres.pool');

class CategoriesService {

  constructor() {
    this.categories = [
      {
        id: "1",
        name: 'Category One'
      },
      {
        id: "2",
        name: 'Category Two'
      }
    ];
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  create() {

  }

  async find() {
    const query = 'SELECT * FROM tasks';
    const response = await this.pool.query(query);
    return response.rows;
    // return this.categories;
  }

  findOne(id) {
    return this.categories.find(item => item.id === id)
  }

  update() {

  }

  delete() {

  }

}

module.exports = CategoriesService;
