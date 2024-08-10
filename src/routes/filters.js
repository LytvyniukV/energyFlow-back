import express from 'express';
import validator from '../helpers/validator.js';
import { filtersSchema } from '../schemas/filters.js';
import wrapper from '../helpers/wrapper.js';
import controllers from '../controllers/filters.js';

const router = express.Router();

router.get('/', wrapper(controllers.getAll));

export default router;
