import { ONE_DAY } from '../constants/index.js';
import { setupSession } from '../middlewares/createSession.js';
import userServices from '../services/users.js';

const registerUser = async (req, res) => {
  const user = await userServices.registerUser(req.body);

  res.status(201).json({
    message: 'Successfull registration',
    data: {
      email: user.email,
    },
  });
};

const loginUser = async (req, res) => {
  const session = await userServices.loginUser(req.body);
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
    await userServices.logout(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const refreshUserSession = async (req, res) => {
  const session = await userServices.refreshUsersSession({
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

const current = async (req, res) => {
  const user = await userServices.current(req.user._id);
  res.status(200).json({
    message: 'Success',
    data: {
      email: user.email,
      gender: user.gender,
      name: user.name,
      activeTime: user.activeTime,
      weight: user.weight,
      liters: user.liters,
      avatarURL: user.avatarURL,
    },
  });
};

const updateUser = async (req, res) => {
  const user = await userServices.updateUser(req.user._id, req.body);

  res.status(200).json({
    message: 'User updated',
    data: {
      email: user.email,
      gender: user.gender,
      name: user.name,
      activeTime: user.activeTime,
      weight: user.weight,
      liters: user.liters,
      avatarURL: user.avatarURL,
    },
  });
};

const deleteUser = async (req, res) => {
  await userServices.deleteUser(req.user._id);

  res.status(200).json({
    message: 'User was deleted',
    data: {},
  });
};

const verifyEmail = async (req, res) => {
  await userServices.verifyEmail(req.params.verificationToken);

  res.status(200).send({ message: 'Verification successfully' });
};

const extraVerifyEmail = async (req, res) => {
  await userServices.extraVerifyEmail(req.body);

  res.status(200).json({ message: 'Verification email sent', data: {} });
};

const resetTokenByEmail = async (req, res) => {
  await userServices.resetTokenByEmail(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

const resetPassword = async (req, res) => {
  await userServices.resetPassword(req.body);

  res.status(200).json({
    message: 'Password updated',
    data: {},
  });
};
export default {
  registerUser,
  loginUser,
  logout,
  refreshUserSession,
  current,
  updateUser,
  deleteUser,
  resetTokenByEmail,
  verifyEmail,
  extraVerifyEmail,
  resetPassword,
};
