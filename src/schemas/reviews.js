import Joi from 'joi';

export const reviewSchema = Joi.object({
  rating: Joi.number().required(),
  comment: Joi.string().required(),
});
