import services from '../services/trainings.js';

const createTraining = async (req, res) => {
  const train = await services.createTraining(req.user._id, req.body);

  res.status(201).json({
    message: 'Training was created',
    data: train,
  });
};

const deleteTraining = async (req, res) => {
  const train = await services.deleteTraining(req.params.id, req.user._id);

  res.status(200).json({
    message: 'Training was deleted',
    data: train,
  });
};

const getDayTrainings = async (req, res) => {
  const data = await services.getDayTrainings(req);

  res.status(200).json({
    data: data,
  });
};

const getMonthTrainings = async (req, res) => {
  const data = await services.getMonthTrainings(req);

  res.status(200).json({
    data: data,
  });
};

export default {
  createTraining,
  deleteTraining,
  getDayTrainings,
  getMonthTrainings,
};
