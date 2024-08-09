import Joi from 'joi';

export const updUser = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  gender: Joi.string(),
  name: Joi.string().min(3),
  activeTime: Joi.number().min(1),
  weight: Joi.number().min(1),
  liters: Joi.number().min(1),
  avatar: Joi.object({
    type: Joi.string().valid(
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/webp',
      'image/svg',
    ),
  }).unknown(true),
}).min(1);
