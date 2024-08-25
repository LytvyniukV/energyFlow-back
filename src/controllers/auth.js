import { generateAuthUrl } from '../helpers/googleAuth.js';
import { setupCookie } from '../middlewares/createSession.js';
import authServices from '../services/auth.js';

const registerUser = async (req, res) => {
  const user = await authServices.registerUser(req.body);

  res.status(201).json({
    message: 'Successfull registration',
    data: {
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    },
  });
};

const loginUser = async (req, res) => {
  const data = await authServices.loginUser(req.body);

  res.status(200).json({
    message: 'Successfull login',
    data: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    },
  });
};

const logout = async (req, res) => {
  await authServices.logout(req.user._id);

  res.status(204).send();
};

const refreshUserSession = async (req, res) => {
  const data = await authServices.refreshUsersSession(req.user._id);

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
      refreshToken: data.refreshToken,
    },
  });
};

const verifyEmail = async (req, res) => {
  await authServices.verifyEmail(req.params.verificationToken);
  return res.redirect('https://energy-flow-mu.vercel.app/exercises');
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

  res.json({
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
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
