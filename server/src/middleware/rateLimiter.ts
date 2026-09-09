import { Request, Response, NextFunction } from 'express';

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

    let record = rateLimitStore.get(clientKey);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(clientKey, record);
    } else {
      record.count++;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    // Set standard rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (record.count > max) {
      res.setHeader('Retry-After', resetSeconds);
      res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: customMessage,
        retry_after_seconds: resetSeconds,
      });
      return;
    }

    next();
  };
}

/**
 * Helper to reset rate limit store for automated testing
 */
export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
