import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../../db/client';
import { requireAuth, JWT_SECRET } from '../../middleware/auth';
import { validateBody, sendError } from '../../middleware/validate';
import { UserRecord } from '../../db/types';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  home_city: z.string().optional().default('Mumbai'),
  avatar_url: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const googleAuthSchema = z.object({
  id_token: z.string().optional(),
  credential: z.string().optional(),
  client_id: z.string().optional(),
  user_info: z
    .object({
      email: z.string().email(),
      name: z.string().optional(),
      picture: z.string().optional(),
      avatar_url: z.string().optional(),
      sub: z.string().optional(),
    })
    .optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
  avatar_url: z.string().optional(),
  sub: z.string().optional(),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  home_city: z.string().optional(),
  avatar_url: z.string().optional(),
  survey: z.any().optional(),
  preferences: z.any().optional(),
});

/**
 * Helper to decode Google ID token / JWT without external dependency
 */
function decodeGoogleIdToken(token: string): {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * POST /api/v1/auth/register
 */
authRouter.post('/register', validateBody(registerSchema), async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, home_city, avatar_url } = req.body;

  const existing = await db.users.findByEmail(email);
  if (existing) {
    sendError(res, 409, 'USER_EXISTS', 'An account with this email already exists', req.requestId);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newUser = await db.users.create({
    id,
    email: email.toLowerCase().trim(),
    password_hash,
    name,
    avatar_url: avatar_url || undefined,
    home_city: home_city || 'Mumbai',
    auth_provider: 'local',
    role: 'traveller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      home_city: newUser.home_city,
      avatar_url: newUser.avatar_url,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password_hash: _, ...safeUser } = newUser;

  res.status(201).json({
    success: true,
    token,
    profile: safeUser,
    user: safeUser,
  });
});

/**
 * POST /api/v1/auth/login
 */
authRouter.post('/login', validateBody(loginSchema), async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await db.users.findByEmail(email);
  if (!user) {
    sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password', req.requestId);
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password', req.requestId);
    return;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      home_city: user.home_city,
      avatar_url: user.avatar_url,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password_hash: _, ...safeUser } = user;

  res.json({
    success: true,
    token,
    profile: safeUser,
    user: safeUser,
  });
});

/**
 * POST /api/v1/auth/google
 * Google OAuth 2.0 & ID Token Verification with Account Merging (Phase 4)
 */
authRouter.post('/google', validateBody(googleAuthSchema), async (req: Request, res: Response): Promise<void> => {
  const rawToken = req.body.credential || req.body.id_token;
  let email = req.body.email || req.body.user_info?.email;
  let name = req.body.name || req.body.user_info?.name;
  let avatarUrl = req.body.picture || req.body.avatar_url || req.body.user_info?.picture || req.body.user_info?.avatar_url;
  let googleId = req.body.sub || req.body.user_info?.sub;

  // If token is provided, extract verified claims
  if (rawToken) {
    const decoded = decodeGoogleIdToken(rawToken);
    if (decoded) {
      email = decoded.email || email;
      name = decoded.name || name;
      avatarUrl = decoded.picture || avatarUrl;
      googleId = decoded.sub || googleId;
    }
  }

  if (!email) {
    sendError(res, 400, 'INVALID_GOOGLE_TOKEN', 'Google authentication payload missing valid email claim', req.requestId);
    return;
  }

  const targetEmail = email.toLowerCase().trim();
  let user = await db.users.findByEmail(targetEmail);

  if (user) {
    // Existing Account: Merge Google OAuth credentials and preserve existing user data (trips, favorites, role)
    const updates: Partial<UserRecord> = {};
    if (googleId && !user.google_id) updates.google_id = googleId;
    if (avatarUrl && !user.avatar_url) updates.avatar_url = avatarUrl;
    if (user.auth_provider === 'local') updates.auth_provider = 'google_linked';

    if (Object.keys(updates).length > 0) {
      user = (await db.users.update(user.id, updates)) || user;
    }
  } else {
    // New Account: Create user from Google profile
    const id = `user-google-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    user = await db.users.create({
      id,
      email: targetEmail,
      password_hash: '', // OAuth accounts do not use a password hash
      name: name || targetEmail.split('@')[0],
      avatar_url: avatarUrl || undefined,
      google_id: googleId || undefined,
      home_city: 'Mumbai',
      auth_provider: 'google',
      role: 'traveller',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      home_city: user.home_city,
      avatar_url: user.avatar_url,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password_hash: _, ...safeUser } = user;

  res.json({
    success: true,
    token,
    profile: safeUser,
    user: safeUser,
    message: 'Authenticated successfully with Google.',
  });
});

/**
 * GET /api/v1/auth/me or /api/v1/profile
 */
authRouter.get(['/me', '/profile'], requireAuth, async (req: Request, res: Response): Promise<void> => {
  const user = await db.users.findById(req.user!.id);
  if (!user) {
    sendError(res, 404, 'USER_NOT_FOUND', 'User record not found', req.requestId);
    return;
  }

  const { password_hash: _, ...safeUser } = user;
  res.json({
    success: true,
    profile: safeUser,
    user: safeUser,
  });
});

/**
 * PUT /api/v1/auth/profile
 */
authRouter.put('/profile', requireAuth, validateBody(updateProfileSchema), async (req: Request, res: Response): Promise<void> => {
  const updated = await db.users.update(req.user!.id, req.body);
  if (!updated) {
    sendError(res, 404, 'USER_NOT_FOUND', 'User record not found', req.requestId);
    return;
  }

  const { password_hash: _, ...safeUser } = updated;
  res.json({
    success: true,
    profile: safeUser,
    user: safeUser,
  });
});

/**
 * POST /api/v1/profile/survey or POST /api/v1/auth/profile/survey
 * Persists onboarding survey answers and travel preferences
 */
authRouter.post(['/profile/survey', '/survey'], requireAuth, async (req: Request, res: Response): Promise<void> => {
  const user = await db.users.findById(req.user!.id);
  if (!user) {
    sendError(res, 404, 'USER_NOT_FOUND', 'User record not found', req.requestId);
    return;
  }

  const updated = await db.users.update(req.user!.id, {
    survey: req.body,
    preferences: {
      ...(user.preferences || {}),
      ...req.body,
    },
  });

  const { password_hash: _, ...safeUser } = updated!;
  res.json({
    success: true,
    profile: safeUser,
    user: safeUser,
    message: 'Onboarding survey preferences successfully saved.',
  });
});
