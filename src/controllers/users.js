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
  const user = await userServices.current(req.cookies.accessToken);
  res.status(200).json({
    message: 'Success',
    data: {
      email: user.email,
    },
  });
};
export default { registerUser, loginUser, logout, refreshUserSession, current };
