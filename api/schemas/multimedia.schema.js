const Joi = require('joi');

const id = Joi.number().integer();
const mediaType = Joi.string().valid('image', 'video', 'audio');
const fileUrl = Joi.string().uri();
const order = Joi.number().integer().default(1);
const description = Joi.string().min(3).max(500);
// const createdAt = Joi.date();
const isActive = Joi.boolean().default(true);
const multimediaId = Joi.number().integer();

const createMultimediaSchema = Joi.object({
  mediaType: mediaType.required(),
  fileUrl: fileUrl.required(),
  order: order.required(),
  description: description,
  isActive: isActive,
  multimediaId: multimediaId.required()
});

const updateMultimediaSchema = Joi.object({
  mediaType: mediaType,
  fileUrl: fileUrl,
  order: order,
  description: description,
  isActive: isActive,
  multimediaId: multimediaId
});

const getMultimediaSchema = Joi.object({
  id: id.required()
});

module.exports = { createMultimediaSchema, updateMultimediaSchema, getMultimediaSchema }
