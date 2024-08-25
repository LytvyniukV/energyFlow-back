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
import { validateRefreshToken } from '../middlewares/validateToken.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(authSchema),
  wrapper(controller.registerUser),
);

router.post('/login', validateBody(authSchema), wrapper(controller.loginUser));

router.post('/logout', validateRefreshToken, wrapper(controller.logout));

router.post(
  '/refresh',
  validateRefreshToken,
  wrapper(controller.refreshUserSession),
);

router.get('/verify/:verificationToken', wrapper(controller.verifyEmail));

router.post(
  '/verify',
  validateBody(resetEmailSchema),
  wrapper(controller.extraVerifyEmail),
);

router.post(
  '/reset-token',
  validateBody(resetEmailSchema),
  wrapper(controller.resetTokenByEmail),
);

router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  wrapper(controller.resetPassword),
);

router.get('/get-oauth-url', wrapper(controller.getGoogleAuthUrl));

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  wrapper(controller.loginWithGoogle),
);

export default router;
