import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware: Attaches a unique request_id to incoming requests
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const reqId = (req.headers['x-request-id'] as string) || `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  req.requestId = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
}

/**
 * Middleware: Validates request body using a Zod schema
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues || [];
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
            details: issues,
          },
          request_id: req.requestId || `req-${Date.now()}`,
        });
        return;
      }
      next(err);
    }
  };
}

/**
 * Standard API error responder
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  requestId?: string
): void {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
    request_id: requestId || `req-${Date.now()}`,
  });
}
