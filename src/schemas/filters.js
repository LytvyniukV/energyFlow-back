import Joi from 'joi';

export const filtersSchema = Joi.object({
  filter: Joi.string().required('filter is required'),
});
