import express from 'express';
import validator from '../helpers/validator.js';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/users.js';
import { authSchema } from '../schemas/users.js';
import { validateToken } from '../middlewares/validateToken.js';
const router = express.Router();

router.post(
  '/register',
  validator.body(authSchema),
  wrapper(controller.registerUser),
);

router.post(
  '/login',
  validator.body(authSchema),
  wrapper(controller.loginUser),
);

router.post('/logout', validateToken, wrapper(controller.logout));
export default router;
