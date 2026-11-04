import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { requireAuth } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    error: { code: 'RATE_LIMIT_EXCEEDED' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post('/register', authLimiter, validateRequest(registerSchema), register);
authRouter.post('/login', authLimiter, validateRequest(loginSchema), login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, getMe);

