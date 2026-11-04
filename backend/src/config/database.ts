import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<typeof mongoose> {
  if (!config.mongodbUri) {
    throw new Error('MONGODB_URI is required to establish database connection.');
  }

  // Enforce connecting specifically to talentflow database
  const uri = config.mongodbUri;
  if (!uri.includes('/talentflow')) {
    logger.warn('Connecting to MongoDB: Ensuring database target is talentflow');
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'talentflow',
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    logger.info({ db: conn.connection.name, host: conn.connection.host }, 'MongoDB Atlas Connected Successfully');
    return conn;
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to connect to MongoDB Atlas');
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed.');
  }
}

