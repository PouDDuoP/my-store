const Joi = require('joi');

const id = Joi.string().uuid();
const username = Joi.string().min(4).max(15);
const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));
const first_name = Joi.string().min(2).max(15);
const last_name = Joi.string().min(2).max(15);
const date_joined = Joi.date();
const is_active = Joi.boolean().default(true);
const is_superuser = Joi.boolean().default(false);

const createUserSchema = Joi.object({
    username: username.required(),
    password: password.required(),
    first_name: first_name.required(),
    last_name: last_name.required()
});

const updateUserSchema = Joi.object({
  username: username,
  password: password,
  first_name: first_name,
  last_name: last_name,
  is_active: is_active,
  is_superuser: is_superuser
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
