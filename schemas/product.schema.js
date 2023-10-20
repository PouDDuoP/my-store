const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().alphanum().min(3).max(15);
const price = Joi.number().integer.min(10);

const createProdctSchema = Joi.object({
    name: name.required(),
    price: price.required(),
});

const updateProdctSchema = Joi.object({
  name: name,
  price: price,
});

const getProdctSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProdctSchema, updateProdctSchema, getProdctSchema }
