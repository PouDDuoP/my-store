const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const image = Joi.string().uri();
const tierId = Joi.number().integer();
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);

const createTierSchema = Joi.object({
  name: name.required(),
  image: image.required(),
  tierId: tierId.required(),
  isActive: isActive
});

const updateTierSchema = Joi.object({
  name: name,
  image: image,
  tierId: tierId,
  isActive: isActive
});

const getTierSchema = Joi.object({
  id: id.required(),
});

module.exports = { createTierSchema, updateTierSchema, getTierSchema }
