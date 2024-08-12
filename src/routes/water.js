import express from 'express';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/water.js';
import { validateDateMiddleware } from '../middlewares/validateDate.js';
import { createWaterSchema, updateWaterSchema } from '../schemas/water.js';
import { WaterDate, WaterMonth } from '../middlewares/waterMiddlewares.js';

const router = express.Router();

router.post(
  '/',
  validateDateMiddleware(createWaterSchema),
  wrapper(controller.createWater),
);

router.delete('/:id', wrapper(controller.deleteWater));
router.patch(
  '/:id',
  validateDateMiddleware(updateWaterSchema),
  wrapper(controller.updateWater),
);
router.get('/', wrapper(controller.getSummaryAmount));
router.get('/day/:date', WaterDate, wrapper(controller.getDayWater));
router.get('/month/:date', WaterMonth, wrapper(controller.getMonthWater));

export default router;
