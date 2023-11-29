const Joi = require('joi');

const id = Joi.number().integer();
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);
const tierId = Joi.number().integer();
const statusId = Joi.number().integer();

const createOrderSchema = Joi.object({
  isActive: isActive,
  tierId: tierId.required(),
  statusId: statusId
});

const updateOrderSchema = Joi.object({
  isActive: isActive,
  tierId: tierId,
  statusId: statusId
});

const getOrderSchema = Joi.object({
  id: id.required(),
});

module.exports = { createOrderSchema, updateOrderSchema, getOrderSchema }
