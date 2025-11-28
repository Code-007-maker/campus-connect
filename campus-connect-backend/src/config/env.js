// src/config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = process.env.NODE_ENV === 'test'
  ? path.join(process.cwd(), '.env.test')
  : path.join(process.cwd(), '.env');

dotenv.config({ path: envPath });

const required = [
  'NODE_ENV',
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_PROJECT_ID',
  'GOOGLE_CALENDAR_ID',
  'SOCKET_ORIGIN'
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || "primary",
  SOCKET_ORIGIN: process.env.SOCKET_ORIGIN || "*",
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`,
  NODE_LOG_LEVEL: process.env.NODE_LOG_LEVEL || "info",
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || ""
};
