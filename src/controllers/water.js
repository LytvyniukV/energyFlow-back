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

export default { createWater, deleteWater };
