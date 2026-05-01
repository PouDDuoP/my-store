const boom = require("@hapi/boom");

const { models } = require('../libs/sequelize');

class MultimediaService {

  constructor() {}

  async create(data) {
    const newMultimedia = await models.Multimedia.create(data)
    return newMultimedia;
  }

  async find(query = {}) {
    const options = {
      include: ['product']
    };
    if (query.limit) options.limit = query.limit;
    if (query.offset) options.offset = query.offset;

    const response = await models.Multimedia.findAll(options);
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
    await multimedia.update({ isActive: false });
    return { id };
  }

}

module.exports = MultimediaService;
