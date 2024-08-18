import express from 'express';
import validator from '../helpers/validator.js';
import { validateBody } from '../helpers/validateBody.js';
import wrapper from '../helpers/wrapper.js';
import controller from '../controllers/auth.js';
import {
  authSchema,
  loginWithGoogleOAuthSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../schemas/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(authSchema),
  wrapper(controller.registerUser),
);

router.post('/login', validateBody(authSchema), wrapper(controller.loginUser));

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

router.get('/get-oauth-url', wrapper(controller.getGoogleAuthUrl));

router.post(
  '/confirm-oauth',
  validator.body(loginWithGoogleOAuthSchema),
  wrapper(controller.loginWithGoogle),
);

export default router;
