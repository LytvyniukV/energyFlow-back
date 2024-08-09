import express from 'express';
import userRouter from './users.js';
import exercisesRouter from './exercises.js';
import { validateToken } from '../middlewares/validateToken.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/exercises', validateToken, exercisesRouter);

export default router;
