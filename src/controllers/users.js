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
  const user = await userServices.loginUser(req.body);

  res.status(200).json({
    message: 'Successfull login',
    data: {
      user: {
        email: user.email,
      },
      accessToken: user.accessToken,
    },
  });
};

const logout = async (req, res) => {
  await userServices.logout(req.user.id);

  res.status(204).send();
};
export default { registerUser, loginUser, logout };
