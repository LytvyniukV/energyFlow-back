import express from 'express';
import userRouter from './users.js';
import exercisesRouter from './exercises.js';
import authRouter from './auth.js';
import { validateToken } from '../middlewares/validateToken.js';

const router = express.Router();

router.use('/users', validateToken, userRouter);
router.use('/exercises', validateToken, exercisesRouter);
router.use('/auth', authRouter);

export default router;
