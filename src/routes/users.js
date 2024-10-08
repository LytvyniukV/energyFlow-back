import express from 'express';
import validator from '../helpers/validator.js';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/users.js';
import { updUser } from '../schemas/users.js';
import { upload } from '../helpers/cloudinary.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../helpers/validateBody.js';

const router = express.Router();

router.get('/current', wrapper(controller.current));

router.patch(
  '/',
  upload.single('avatar'),
  validateBody(updUser),
  wrapper(controller.updateUser),
);

router.delete('/', wrapper(controller.deleteUser));

router.patch('/favorites/:id', isValidId, wrapper(controller.toggleFavorites));

export default router;
