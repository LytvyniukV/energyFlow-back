import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import router from './src/routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
  next();
});

export { app };
