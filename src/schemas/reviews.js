import Joi from 'joi';

export const reviewSchema = Joi.object({
  rating: Joi.number().required('rating is required'),
  comment: Joi.string().required('comment is required'),
});
