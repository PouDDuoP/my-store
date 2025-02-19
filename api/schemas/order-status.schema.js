const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);


const createOrderStatusSchema = Joi.object({
  name: name.required()
});

const updateOrderStatusSchema = Joi.object({
  name: name,
  isActive: isActive
});

const getOrderStatusSchema = Joi.object({
  id: id.required()
});

module.exports = { createOrderStatusSchema, updateOrderStatusSchema, getOrderStatusSchema }
