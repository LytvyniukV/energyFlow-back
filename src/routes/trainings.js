import express from 'express';
import wrapper from '../helpers/wrapper.js';
import { WaterDate, WaterMonth } from '../middlewares/waterMiddlewares.js';
import { validateDateMiddleware } from '../middlewares/validateDate.js';
import controller from '../controllers/trainings.js';
import { createTrainingSchema } from '../schemas/trainings.js';

const router = express.Router();

router.post(
  '/',
  validateDateMiddleware(createTrainingSchema),
  wrapper(controller.createTraining),
);

router.delete('/:id', wrapper(controller.deleteTraining));

router.get('/day/:date', WaterDate, wrapper(controller.getDayTrainings));

router.get('/month/:date', WaterMonth, wrapper(controller.getMonthTrainings));

export default router;
