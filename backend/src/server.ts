import { createApp } from './app';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

async function startServer() {
  try {
    // Connect to MongoDB Atlas (talentflow database)
    await connectDatabase();

    const app = createApp();

    const server = app.listen(config.port, () => {
      logger.info(
        { port: config.port, env: config.nodeEnv },
        `🚀 TALENTFLOW Backend API Server running on port ${config.port}`
      );
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error: any) {
    logger.error({ error: error.message }, 'Fatal error during server startup');
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export default startServer;
