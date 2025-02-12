const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const description = Joi.string().min(3).max(500);
const price = Joi.number().integer().min(10);
const image = Joi.string().uri();
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);
const categoryId = Joi.number().integer();

const price_min = Joi.number().integer()
const price_max = Joi.number().integer()

const offset = Joi.number().integer().min(0);
const limit = Joi.number().integer().min(1).max(100);


const createProductSchema = Joi.object({
  name: name.required(),
  description: description,
  price: price.required(),
  image: image.required(),
  categoryId: categoryId.required(),
  isActive: isActive
});

const updateProductSchema = Joi.object({
  name: name,
  description: description,
  price: price,
  image: image,
  categoryId: categoryId,
  isActive: isActive
});

const getProductSchema = Joi.object({
  id: id.required()
});

const queryProductSchema = Joi.object({
  offset: offset,
  limit: limit,
  price: price,
  price_min: price_min,
  price_max: price_max.when('price_min', {
    is: Joi.number().integer(),
    then: Joi.required()
  })
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema }
