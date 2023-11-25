const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const description = Joi.string().min(3).max(500);
const image = Joi.string().uri();
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);

const createCategorySchema = Joi.object({
  name: name.required(),
  description: description,
  image: image.required(),
  isActive: isActive
});

const updateCategorySchema = Joi.object({
  name: name,
  description: description,
  image: image,
  isActive: isActive
});

const getCategorySchema = Joi.object({
  id: id.required(),
});

module.exports = { createCategorySchema, updateCategorySchema, getCategorySchema }
