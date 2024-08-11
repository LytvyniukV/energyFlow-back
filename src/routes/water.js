import express from 'express';
import validator from '../helpers/validator.js';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/water.js';
import { validateDateMiddleware } from '../middlewares/validateDate.js';
import { createWaterSchema } from '../schemas/water.js';

const router = express.Router();

router.post(
  '/',
  validateDateMiddleware(createWaterSchema),
  wrapper(controller.createWater),
);

router.delete('/:id', wrapper(controller.deleteWater));

export default router;
