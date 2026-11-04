import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback_development_secret_not_for_prod_1234',
  cookieSecret: process.env.COOKIE_SECRET || 'fallback_cookie_secret_not_for_prod_1234',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  isProd: process.env.NODE_ENV === 'production',
};

if (!config.mongodbUri) {
  console.warn('[CONFIG WARNING] MONGODB_URI is not set in environment.');
}

