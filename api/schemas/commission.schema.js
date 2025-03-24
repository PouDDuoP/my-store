const Joi = require('joi');

const id = Joi.number().integer();
const percentage = Joi.number().min(0).max(100);
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);
const userId = Joi.number().integer();
const productId = Joi.number().integer();

const createCommissionSchema = Joi.object({
  percentage: percentage.required(),
  userId: userId.required(),
  productId: productId.required(),
  isActive: isActive
});

const updateCommissionSchema = Joi.object({
  percentage: percentage,
  userId: userId,
  productId: productId,
  isActive: isActive
});

const getCommissionSchema = Joi.object({
  id: id.required(),
});

module.exports = { createCommissionSchema, updateCommissionSchema, getCommissionSchema }
