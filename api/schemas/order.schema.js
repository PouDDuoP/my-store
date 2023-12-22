const Joi = require('joi');

const id = Joi.number().integer();
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);
const tierId = Joi.number().integer();
const statusId = Joi.number().integer();
const orderId = Joi.number().integer();
const productId = Joi.number().integer();
const amount = Joi.number().integer().min(1);

const createOrderSchema = Joi.object({
  isActive: isActive,
  tierId: tierId.required(),
  statusId: statusId.required()
});

const updateOrderSchema = Joi.object({
  isActive: isActive,
  tierId: tierId,
  statusId: statusId
});

const getOrderSchema = Joi.object({
  id: id.required(),
});

const addProductSchema = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required(),
  isActive: isActive
});

module.exports = { createOrderSchema, updateOrderSchema, getOrderSchema, addProductSchema }
