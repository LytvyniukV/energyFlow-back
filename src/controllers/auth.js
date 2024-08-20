import { generateAuthUrl } from '../helpers/googleAuth.js';
import { setupCookie } from '../middlewares/createSession.js';
import authServices from '../services/auth.js';

const registerUser = async (req, res) => {
  const user = await authServices.registerUser(req.body);
  setupCookie(res, user.refreshToken);
  res.status(201).json({
    message: 'Successfull registration',
    data: {
      email: user.email,
      accessToken: user.accessToken,
    },
  });
};

const loginUser = async (req, res) => {
  const data = await authServices.loginUser(req.body);
  setupCookie(res, data.refreshToken);

  res.status(200).json({
    message: 'Successfull login',
    data: {
      accessToken: data.accessToken,
    },
  });
};

const logout = async (req, res) => {
  if (req.cookies.refreshToken) {
    await authServices.logout(req.cookies.refreshToken);
  }

  res.clearCookie('refreshToken');

  res.status(204).send();
};

const refreshUserSession = async (req, res) => {
  const data = await authServices.refreshUsersSession(req.cookies.refreshToken);

  setupCookie(res, data.refreshToken);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      user: {
        email: data.user.email,
        gender: data.user.gender,
        name: data.user.name,
        activeTime: data.user.activeTime,
        weight: data.user.weight,
        liters: data.user.liters,
        avatarURL: data.user.avatarURL,
        favoriteExercises: data.user.favoriteExercises,
      },
      accessToken: data.accessToken,
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
  const data = await authServices.loginOrSignupWithGoogle(req.body.code);
  setupCookie(res, data.refreshToken);

  res.json({
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: data.accessToken,
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
