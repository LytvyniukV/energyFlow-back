import { ONE_DAY } from '../constants/index.js';
import { generateAuthUrl } from '../helpers/googleAuth.js';
import { setupSession } from '../middlewares/createSession.js';
import authServices from '../services/auth.js';

const registerUser = async (req, res) => {
  const user = await authServices.registerUser(req.body);

  res.status(201).json({
    message: 'Successfull registration',
    data: {
      email: user.email,
    },
  });
};

const loginUser = async (req, res) => {
  const session = await authServices.loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.status(200).json({
    message: 'Successfull login',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const logout = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logout(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const refreshUserSession = async (req, res) => {
  const session = await authServices.refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const verifyEmail = async (req, res) => {
  await authServices.verifyEmail(req.params.verificationToken);
  res.redirect('https://energy-flow-mu.vercel.app/tracker');
  res.status(200).send({ message: 'Verification successfully' });
};

const extraVerifyEmail = async (req, res) => {
  await authServices.extraVerifyEmail(req.body);

  res.status(200).json({ message: 'Verification email sent', data: {} });
};

const resetTokenByEmail = async (req, res) => {
  await authServices.resetTokenByEmail(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

const resetPassword = async (req, res) => {
  await authServices.resetPassword(req.body);

  res.status(200).json({
    message: 'Password updated',
    data: {},
  });
};

const getGoogleAuthUrl = async (req, res) => {
  const url = generateAuthUrl();

  res.status(200).json({
    message: 'Success',
    data: {
      url,
    },
  });
};

const loginWithGoogle = async (req, res) => {
  const session = await authServices.loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export default {
  registerUser,
  loginUser,
  logout,
  refreshUserSession,
  resetTokenByEmail,
  verifyEmail,
  extraVerifyEmail,
  resetPassword,
  getGoogleAuthUrl,
  loginWithGoogle,
};
