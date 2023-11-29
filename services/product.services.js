const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class ProductService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.products = [];
  }

  async create(data) {
    const newProduct = await models.Product.create(data)
    return newProduct;
  }

  async find() {
    const response = await models.Product.findAll({
      include: ['category']
    });
    return response;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category']
    });
    if (!product) {
      throw boom.notFound('product not found');
    }
    return product;
  }

  async update(id , changes) {
    const product = await this.findOne(id);
    const response = await product.update(changes);
    return response;
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id };
  }

}

module.exports = ProductService;
