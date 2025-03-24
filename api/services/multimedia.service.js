const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class MultimediaService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
    this.multimedia = [];
  }

  async create(data) {
    const newMultimedia = await models.Multimedia.create(data)
    return newMultimedia;
  }

  async find() {
    const response = await models.Multimedia.findAll({
      include: ['product']
    });
    return response;
  }

  async findOne(id) {
    const multimedia = await models.Multimedia.findByPk(id, {
      include: ['product']
    });
    if (!multimedia) {
      throw boom.notFound('multimedia not found');
    }
    return multimedia;
  }

  async update(id , changes) {
    const multimedia = await this.findOne(id);
    const response = await multimedia.update(changes);
    return response;
  }

  async delete(id) {
    const multimedia = await this.findOne(id);
    await multimedia.destroy();
    return { id };
  }

}

module.exports = MultimediaService;
