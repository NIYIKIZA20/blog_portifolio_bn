import Joi from 'joi';

export const blogSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must be at most 100 characters',
      'any.required': 'Title is required',
    }),
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be at most 50 characters',
      'any.required': 'Name is required',
    }),
  description: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must be at most 1000 characters',
      'any.required': 'Description is required',
    }),
  profilePhoto: Joi.string()
    .uri({ scheme: [/https?/] })
    .optional()
    .messages({
      'string.uri': 'Profile photo must be a valid URL',
    }),
  created: Joi.string().required().messages({
    'string.base': 'Created date must be a string',
    'any.required': 'Created date is required',
  }),
  updated: Joi.string().required().messages({
    'string.base': 'Updated date must be a string',
    'any.required': 'Updated date is required',
  }),
});
