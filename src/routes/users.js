import express from 'express';
import validator from '../helpers/validator.js';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/users.js';
import { authSchema } from '../schemas/users.js';

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

router.post('/logout', wrapper(controller.logout));

router.post('/refresh', wrapper(controller.refreshUserSession));
router.get('/current', wrapper(controller.current));

export default router;
