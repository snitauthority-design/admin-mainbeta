import { Router } from 'express';
import { getDatabase } from '../db/mongo';
import { getCacheStats } from '../services/redisCache';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res, next) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: 'unknown',
        redis: 'unknown'
      },
      cache: {
        memoryEntries: 0,
        redisConnected: false
      }
    };

    // Check MongoDB (with timeout to prevent hanging)
    try {
      const db = await getDatabase();
      const pingPromise = db.admin().ping();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB ping timeout')), 5000)
      );
      await Promise.race([pingPromise, timeoutPromise]);
      health.services.mongodb = 'connected';
    } catch (error) {
      health.services.mongodb = 'disconnected';
      health.status = 'degraded';
    }

    // Check Redis and get cache stats
    try {
      const cacheStats = getCacheStats();
      health.cache = cacheStats;
      health.services.redis = cacheStats.redisConnected ? 'connected' : 'disconnected';
      if (!cacheStats.redisConnected) {
        health.status = 'degraded';
      }
    } catch (error) {
      health.services.redis = 'error';
      health.status = 'degraded';
    }

    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    next(error);
  }
});
