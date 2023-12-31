const { Op } = require('sequelize');
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

  async find(query) {
    const options = {
      include: ['category'],
      where: {},
      order: [['id', 'ASC']],
    }

    const { limit, offset } = query;
    if ( limit && offset ) {
      options.limit = limit;
      options.offset = offset;
    }

    const { price } = query
    if ( price ) {
      options.where.price = price;
    }

    const { price_min, price_max } = query
    if ( price_min && price_max ) {
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max
      };
    }

    const products = await models.Product.findAll(options);
    return products;
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
