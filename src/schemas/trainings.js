import Joi from 'joi';
import { startDate, unixDay } from '../constants/index.js';

export const createTrainingSchema = () => {
  return Joi.object({
    date: Joi.number()
      .min(+startDate)
      .max(Date.now() + unixDay)
      .required(),
    name: Joi.string().required(),
    time: Joi.number().min(1).required(),
    muscles: Joi.string().required(),
    burnedCalories: Joi.number().min(1).required(),
  });
};
