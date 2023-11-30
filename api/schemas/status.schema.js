const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);


const createStatusSchema = Joi.object({
  name: name.required()
});

const updateStatusSchema = Joi.object({
  name: name,
  isActive: isActive
});

const getStatusSchema = Joi.object({
  id: id.required()
});

module.exports = { createStatusSchema, updateStatusSchema, getStatusSchema }
