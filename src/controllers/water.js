import services from '../services/water.js';

const createWater = async (req, res) => {
  const water = await services.createWater(
    req.body.date,
    req.body.amount,
    req.user._id,
  );

  res.status(201).json({
    message: 'Water card was created',
    data: water,
  });
};

const deleteWater = async (req, res) => {
  const water = await services.deleteWater(req.params.id, req.user._id);

  res.status(200).json({
    message: 'Water card was deleted',
    data: water,
  });
};

const updateWater = async (req, res) => {
  const water = await services.updateWater(
    req.params.id,
    req.user._id,
    req.body,
  );

  res.status(200).json({
    message: 'Water card was updated',
    data: water,
  });
};

const getDayWater = async (req, res) => {
  const data = await services.getDayWater(req);

  res.status(200).json({
    data: data,
  });
};

const getMonthWater = async (req, res) => {
  const result = await services.getMonthWater(req);

  res.status(200).json({
    data: result,
  });
};

const getSummaryAmount = async (req, res) => {
  const amount = await services.getSumaryAmount(req);

  res.status(200).json({
    data: amount,
  });
};
export default {
  createWater,
  deleteWater,
  updateWater,
  getDayWater,
  getMonthWater,
  getSummaryAmount,
};
