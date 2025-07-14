import Joi from 'joi';

export const blogSchema = Joi.object({
  title: Joi.string().min(1).required(),
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  profilePhoto: Joi.string().optional(),
  created: Joi.string().required(),
  updated: Joi.string().required(),
});
