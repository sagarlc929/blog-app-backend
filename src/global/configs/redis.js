import logger from '../utils/logger.util.js';
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://127.0.0.1:6379', // Using 127.0.0.1 instead of localhost for better security
  socket: {
    connectTimeout: 10000,
  },
});

// Initialize Redis connection
const initRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis successfully');
  } catch (error) {
    logger.error('Redis connection error:', error);
    process.exit(1);
  }
};

// Redis error handling
redisClient.on('error', (error) => {
  logger.error('Redis Client Error:', error);
});

export { redisClient, initRedis };
