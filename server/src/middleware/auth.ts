import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../db/types';

export const JWT_SECRET = process.env.JWT_SECRET || 'virasat-secret-key-change-in-production-2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  home_city?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
    }
  }
}

/**
 * Middleware: Verifies JWT token and attaches user to request
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication token is missing or malformed',
      },
      request_id: req.requestId || `req-${Date.now()}`,
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Session has expired or token is invalid',
      },
      request_id: req.requestId || `req-${Date.now()}`,
    });
  }
}

/**
 * Middleware: Optional authentication (attaches user if valid token present, does not reject if missing)
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch {
      // Ignored for optional auth
    }
  }
  next();
}

/**
 * Middleware: Enforces user roles (RBAC)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required for this resource',
        },
        request_id: req.requestId || `req-${Date.now()}`,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Role '${req.user.role}' is not authorized to perform this action`,
        },
        request_id: req.requestId || `req-${Date.now()}`,
      });
      return;
    }

    next();
  };
}
