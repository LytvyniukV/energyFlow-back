import express from 'express';
import validator from '../helpers/validator.js';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/auth.js';
import {
  authSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../schemas/auth.js';

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

router.get('/verify/:verificationToken', wrapper(controller.verifyEmail));

router.post(
  '/verify',
  validator.body(resetEmailSchema),
  wrapper(controller.extraVerifyEmail),
);

router.post(
  '/reset-token',
  validator.body(resetEmailSchema),
  wrapper(controller.resetTokenByEmail),
);

router.post(
  '/reset-password',
  validator.body(resetPasswordSchema),
  wrapper(controller.resetPassword),
);

export default router;
