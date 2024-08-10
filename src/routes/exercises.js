import express from 'express';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/exercises.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', wrapper(controller.getAll));
router.get('/:id', isValidId, wrapper(controller.getById));

export default router;
