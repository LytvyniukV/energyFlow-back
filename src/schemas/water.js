import Joi from 'joi';
import { startDate, unixDay } from '../constants/index.js';

export const createWaterSchema = () => {
  return Joi.object({
    date: Joi.number()
      .min(+startDate)
      .max(Date.now() + unixDay)
      .required(),
    amount: Joi.number().min(10).max(3000).required(),
  });
};

export const updateWaterSchema = () => {
  return Joi.object({
    date: Joi.number()
      .min(+startDate)
      .max(Date.now() + unixDay),
    amount: Joi.number().min(10).max(3000),
  }).or('date', 'amount');
};
