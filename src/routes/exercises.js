import express from 'express';
import validator from '../helpers/validator.js';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/exercises.js';

const router = express.Router();

router.get('/', wrapper(controller.getAll));

export default router;
