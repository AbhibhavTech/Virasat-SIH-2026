import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../../db/client';
import { requireAuth, JWT_SECRET } from '../../middleware/auth';
import { validateBody, sendError } from '../../middleware/validate';

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
 * Google OAuth 2.0 & Firebase Account Authentication with Account Merging
 */
authRouter.post('/google', validateBody(googleAuthSchema), async (req: Request, res: Response): Promise<void> => {
  const { user_info, client_id, sub } = req.body;
  const email = (req.body.email || user_info?.email || '').toLowerCase().trim();

  if (!email) {
    sendError(res, 400, 'INVALID_GOOGLE_AUTH', 'Google email is required to complete authentication', req.requestId);
    return;
  }

  const name = req.body.name || user_info?.name || email.split('@')[0];
  const avatar_url = req.body.picture || req.body.avatar_url || user_info?.picture || user_info?.avatar_url;
  const google_id = sub || user_info?.sub || client_id || `google-${Date.now()}`;

  // Check if existing user by Google ID or by Email
  let user = await db.users.findByGoogleId(google_id);
  if (!user) {
    user = await db.users.findByEmail(email);
  }

  if (user) {
    // Existing user: update google_id and avatar if missing
    const updates: any = {};
    if (!user.google_id && google_id) updates.google_id = google_id;
    if (!user.avatar_url && avatar_url) updates.avatar_url = avatar_url;
    if (Object.keys(updates).length > 0) {
      user = (await db.users.update(user.id, updates)) || user;
    }
  } else {
    // New user: register via Google
    const id = `user-g-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    user = await db.users.create({
      id,
      email,
      name,
      avatar_url: avatar_url || undefined,
      home_city: 'Mumbai',
      auth_provider: 'google',
      role: 'traveller',
      google_id,
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
