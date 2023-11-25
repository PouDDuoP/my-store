const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const description = Joi.string().min(3).max(500);
const price = Joi.number().integer().min(10);
const image = Joi.string().uri();
const categoryId = Joi.number().integer();
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);

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
  isActive: isActive
});

const getProductSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema }
