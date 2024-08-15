import { startOfMonth, endOfMonth, getDaysInMonth } from 'date-fns';
import { Training } from '../models/trainings.js';
import HttpError from '../helpers/httpError.js';

const createTraining = async (ownerId, data) => {
  return await Training.create({
    owner: ownerId,
    ...data,
  });
};

const deleteTraining = async (trainingId, ownerId) => {
  const train = await Training.findOneAndDelete({
    owner: ownerId,
    _id: trainingId,
  });

  if (!train) throw HttpError(404, 'Training not found');
};

const getDayTrainings = async (req) => {
  const { _id: owner } = req.user;
  const dateParam = new Date(+req.params.date);
  const userTimezoneOffset = req.user.timezoneOffset || 0;

  const startOfDay = new Date(dateParam);
  startOfDay.setHours(0 - userTimezoneOffset / 60, 0, 0, 0);

  const endOfDay = new Date(dateParam);
  endOfDay.setHours(23 - userTimezoneOffset / 60, 59, 59, 999);

  const utcStart = startOfDay.getTime();
  const utcEnd = endOfDay.getTime();

  const foundTrainingsDayData = await Training.find({
    owner,
    date: {
      $gte: utcStart,
      $lt: utcEnd,
    },
  });

  return {
    date: dateParam,
    trainings: foundTrainingsDayData,
    owner,
  };
};

const getMonthTrainings = async (req) => {
  const { _id: owner } = req.user;
  const dateParam = new Date(+req.params.date);
  const startOfMonthDate = startOfMonth(dateParam);
  const endOfMonthDate = endOfMonth(dateParam);

  const startOfDay = new Date(startOfMonthDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(endOfMonthDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const utcStartTime = startOfDay.getTime();
  const utcEndTime = endOfDay.getTime();

  const foundTrainingMonthData = await Training.find({
    owner,
    date: {
      $gte: utcStartTime,
      $lt: utcEndTime,
    },
  });

  const aggregatedMonthlyData = foundTrainingMonthData.reduce((acc, item) => {
    const date = new Date(item.date);
    const dayOfMonth = date.getUTCDate();

    if (!acc[dayOfMonth]) {
      acc[dayOfMonth] = {
        dateParam: new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), dayOfMonth),
        ).toISOString(),
        totalCalories: 0,
      };
    }
    acc[dayOfMonth].totalCalories += item.burnedCalories;

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
        totalCalories: 0,
      });
    }
  }

  return result;
};

export default {
  createTraining,
  deleteTraining,
  getDayTrainings,
  getMonthTrainings,
};
