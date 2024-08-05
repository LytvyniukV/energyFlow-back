import dotenv from 'dotenv';

dotenv.config();

export const SERVER_HOST = process.env.SERVER_HOST;
export const PORT = process.env.PORT || 3000;
export const uriDb = process.env.DB_HOST;
export const SECRET_KEY = process.env.SECRET_KEY;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const SEND_GRID_TOKEN = process.env.SEND_GRID_API_KEY;
