const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const image = Joi.string().uri();
const userId = Joi.number().integer();
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);
const username = Joi.string().min(4).max(15);
const email = Joi.string().email();
const password = Joi.string().min(4).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));
const firstName = Joi.string().min(2).max(15);
const lastName = Joi.string().min(2).max(15);
const profile = Joi.string().min(2).max(15);

const createTierSchema = Joi.object({
  name: name.required(),
  image: image.required(),
  // userId: userId.required(),
  user: Joi.object({
    username: username.required(),
    email: email.required(),
    password: password.required(),
    firstName: firstName.required(),
    lastName: lastName.required(),
    profile: profile.required()
  }),
  isActive: isActive
});

const updateTierSchema = Joi.object({
  name: name,
  image: image,
  isActive: isActive,
  userId: userId
});

const getTierSchema = Joi.object({
  id: id.required(),
});

module.exports = { createTierSchema, updateTierSchema, getTierSchema }
