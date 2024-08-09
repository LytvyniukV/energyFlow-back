import userServices from '../services/users.js';

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
  let avatar;

  if (req.file) {
    avatar = req.file.path;
  }

  const user = await userServices.updateUser(req.user._id, {
    ...req.body,
    avatarURL: avatar,
  });

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

const toggleFavorites = async (req, res) => {
  const user = await userServices.toggleFavorites(req.user._id, req.params.id);

  res.status(200).json({
    message: 'Favorites updated',
    data: user.favoriteExercises,
  });
};
export default {
  current,
  updateUser,
  deleteUser,
  toggleFavorites,
};
