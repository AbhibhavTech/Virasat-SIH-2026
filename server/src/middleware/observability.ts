import { Request, Response, NextFunction } from 'express';

// Extend Express Request with correlation properties
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

/**
 * Observability & Correlation Middleware
 * Generates or propagates X-Request-Id and emits structured JSON access logs with millisecond latency.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.headers['x-request-id'] as string;
  const requestId = incomingId || `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const startTime = Date.now();

  req.requestId = requestId;
  req.startTime = startTime;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const logRecord = {
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      request_id: requestId,
      method: req.method,
      route: req.originalUrl || req.url,
      status: res.statusCode,
      latency_ms: durationMs,
      ip: req.ip || req.socket.remoteAddress,
      user_agent: req.headers['user-agent'] || 'unknown',
    };

    // Log structured JSON in production for log ingestion engines (CloudWatch, Cloud Run, Datadog)
    if (process.env.NODE_ENV === 'production' && res.statusCode >= 400) {
      console.log(JSON.stringify(logRecord));
    }
  });

  next();
}

/**
 * Security Headers Hardening Middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

/**
 * Centralized Safe Error Handler
 * Sanitizes errors to prevent credential, DB schema, or stack trace leaks to client.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const requestId = req.requestId || 'unknown-req';
  const status = Number(err.status || err.statusCode) || 500;

  // Log full error details server-side with correlation ID
  console.error(`[Error ${requestId}] ${req.method} ${req.originalUrl}:`, err);

  // Safe client response (no internal stack trace exposure)
  res.status(status).json({
    success: false,
    error: err.code || (status === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'),
    message: status === 500 ? 'An internal error occurred. Please quote request ID to support.' : (err.message || 'Request failed'),
    request_id: requestId,
  });
}
