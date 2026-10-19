import { Request, Response, NextFunction } from 'express';
import { db } from '../db/client';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export interface RateLimiterOptions {
  windowMs?: number; // Time window in ms (default: 60,000 = 1 minute)
  max?: number; // Maximum requests allowed in window (default: 30)
  message?: string;
}

/**
 * Sliding window rate limiting middleware
 */
export function rateLimiter(options: RateLimiterOptions = {}) {
  const windowMs = options.windowMs || 60 * 1000;
  const max = options.max || 30;
  const customMessage = options.message || 'Too many requests. Please slow down your travel inquiries.';

  return (req: Request, res: Response, next: NextFunction): void => {
    // Key by authenticated user ID or IP address
    const clientKey = req.user?.id || req.ip || req.headers['x-forwarded-for']?.toString() || 'anonymous-client';
    const now = Date.now();

    const windowStart = Math.floor(now / windowMs) * windowMs;
    const resetTime = windowStart + windowMs;
    const resetSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));
    const finish = (count: number) => {
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));
      res.setHeader('X-RateLimit-Reset', resetSeconds);
      if (count > max) {
        res.setHeader('Retry-After', resetSeconds);
        res.status(429).json({ success: false, error: 'RATE_LIMIT_EXCEEDED', message: customMessage, retry_after_seconds: resetSeconds });
        return;
      }
      next();
    };
    const localCount = () => {
      let record = rateLimitStore.get(clientKey);
      if (!record || now >= record.resetTime) { record = { count: 0, resetTime }; rateLimitStore.set(clientKey, record); }
      return ++record.count;
    };
    if (db.getMode() !== 'postgresql') { finish(localCount()); return; }
    void db.rateLimits.consume(clientKey, new Date(windowStart))
      .then(sharedCount => finish(sharedCount ?? localCount()))
      .catch(() => finish(localCount()));
  };
}

/**
 * Helper to reset rate limit store for automated testing
 */
export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
