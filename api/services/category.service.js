const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class CategoryService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.categories = [];
  }

  async create(data) {
    const newCategory= await models.Category.create(data)
    return newCategory;
  }

  async find() {
    const response = await models.Category.findAll({
      include: ['products']
    });
    return response;
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products']
    });
    if (!category) {
      throw boom.notFound('category not found');
    }
    return category;
  }

  async update(id , changes) {
    const category = await this.findOne(id);
    const response = await category.update(changes);
    return response;
  }

  async delete(id) {
    const category = await this.findOne(id);
    await category.destroy();
    return { id };
  }

}

module.exports = CategoryService;
