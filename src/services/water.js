import { startOfMonth, endOfMonth, getDaysInMonth } from 'date-fns';
import { Water } from '../models/water.js';
import HttpError from '../helpers/httpError.js';

const createWater = async (date, amount, ownerId) => {
  return await Water.create({
    date,
    amount,
    owner: ownerId,
  });
};

const deleteWater = async (waterId, ownerId) => {
  console.log(waterId);
  const water = await Water.findOneAndDelete({
    _id: waterId,
    owner: ownerId,
  });
  if (!water) throw HttpError(404, 'Water not found');

  return water;
};
export default { createWater, deleteWater };
