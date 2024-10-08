import express from 'express';
import userRouter from './users.js';
import exercisesRouter from './exercises.js';
import authRouter from './auth.js';
import filtersRouter from './filters.js';
import waterRouter from './water.js';
import trainingsRouter from './trainings.js';
import { validateToken } from '../middlewares/validateToken.js';

const router = express.Router();

router.use('/users', validateToken, userRouter);
router.use('/exercises', validateToken, exercisesRouter);
router.use('/auth', authRouter);
router.use('/filters', validateToken, filtersRouter);
router.use('/water', validateToken, waterRouter);
router.use('/trainings', trainingsRouter);
export default router;
