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
  const water = await Water.findOneAndDelete({
    _id: waterId,
    owner: ownerId,
  });
  if (!water) throw HttpError(404, 'Water not found');

  return water;
};

const updateWater = async (waterId, ownerId, updData) => {
  const water = await Water.findOneAndUpdate(
    { _id: waterId, owner: ownerId },
    updData,
    { new: true },
  );

  if (!water) throw HttpError(404);

  return water;
};

const getDayWater = async (req) => {
  const { _id: owner } = req.user;
  const dateParam = new Date(+req.params.date);
  const userTimezoneOffset = req.user.timezoneOffset || 0;

  const startOfDay = new Date(dateParam);
  startOfDay.setHours(0 - userTimezoneOffset / 60, 0, 0, 0);

  const endOfDay = new Date(dateParam);
  endOfDay.setHours(23 - userTimezoneOffset / 60, 59, 59, 999);

  const utcStart = startOfDay.getTime();
  const utcEnd = endOfDay.getTime();

  const foundWaterDayData = await Water.find({
    owner,
    date: {
      $gte: utcStart,
      $lt: utcEnd,
    },
  });

  const totalDayWater = foundWaterDayData.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  return {
    date: dateParam,
    totalDayWater,
    waterData: foundWaterDayData,
    owner,
  };
};

const getMonthWater = async (req) => {
  const { _id: owner } = req.user;
  const dateParam = new Date(+req.params.date);
  const userTimezoneOffset = req.user.timezoneOffset || 0;
  const startOfMonthDate = startOfMonth(dateParam);
  const endOfMonthDate = endOfMonth(dateParam);

  const startOfDay = new Date(startOfMonthDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(endOfMonthDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const utcStartTime = startOfDay.getTime();
  const utcEndTime = endOfDay.getTime();

  const foundWaterMonthData = await Water.find({
    owner,
    date: {
      $gte: utcStartTime,
      $lt: utcEndTime,
    },
  });

  const aggregatedMonthlyData = foundWaterMonthData.reduce((acc, item) => {
    const date = new Date(item.date);
    const dayOfMonth = date.getUTCDate();

    if (!acc[dayOfMonth]) {
      acc[dayOfMonth] = {
        dateParam: new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), dayOfMonth),
        ).toISOString(),
        totalDayWater: 0,
      };
    }
    acc[dayOfMonth].totalDayWater += item.amount;

    return acc;
  }, {});

  const daysInMonth = getDaysInMonth(dateParam);
  const result = [];

  for (let i = 1; i <= daysInMonth; i++) {
    if (aggregatedMonthlyData[i]) {
      result.push(aggregatedMonthlyData[i]);
    } else {
      const date = new Date(
        Date.UTC(dateParam.getUTCFullYear(), dateParam.getUTCMonth(), i),
      );
      result.push({
        dateParam: date.toISOString(),
        totalDayWater: 0,
      });
    }
  }

  return result;
};

const getSumaryAmount = async (req) => {
  const { _id: owner } = req.user;
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);

  const todayDrinkWater = await Water.find({
    owner,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });
  const totalAmount = todayDrinkWater.reduce(
    (sum, record) => sum + record.amount,
    0,
  );
  return { totalAmount };
};
export default {
  createWater,
  deleteWater,
  updateWater,
  getDayWater,
  getMonthWater,
  getSumaryAmount,
};
