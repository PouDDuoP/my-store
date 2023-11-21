const Joi = require('joi');

const id = Joi.number().integer();
const username = Joi.string().min(4).max(15);
const email = Joi.string().email();
const password = Joi.string().min(4).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));
const firstName = Joi.string().min(2).max(15);
const lastName = Joi.string().min(2).max(15);
const profile = Joi.string().min(4).max(15);
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);
const isSuperuser = Joi.boolean().default(false);

const createUserSchema = Joi.object({
    username: username.required(),
    email: email.required(),
    password: password.required(),
    firstName: firstName.required(),
    lastName: lastName.required(),
    profile: profile.required()
});

const updateUserSchema = Joi.object({
  username: username,
  password: password,
  firstName: firstName,
  lastName: lastName,
  profile: profile,
  isActive: isActive,
  isSuperuser: isSuperuser
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
