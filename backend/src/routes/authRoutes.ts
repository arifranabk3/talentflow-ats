import { Router } from 'express';
import {
  register,
  provisionAdmin,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deactivateAccount,
} from '../controllers/authController';
import { validateRequest } from '../middleware/validate';
import {
  registerSchema,
  adminProvisionSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  refreshTokenSchema,
} from '../validators/authValidator';
import { requireAuth } from '../middleware/auth';
import { loginLimiter, passwordResetLimiter, registrationLimiter } from '../middleware/rateLimiter';

export const authRouter = Router();

// Public Authentication
authRouter.post('/register', registrationLimiter, validateRequest(registerSchema), register);
authRouter.post('/provision-admin', validateRequest(adminProvisionSchema), provisionAdmin);
authRouter.post('/login', loginLimiter, validateRequest(loginSchema), login);
authRouter.post('/refresh', validateRequest(refreshTokenSchema), refresh);
authRouter.post('/forgot-password', passwordResetLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
authRouter.post('/reset-password', passwordResetLimiter, validateRequest(resetPasswordSchema), resetPassword);
authRouter.get('/verify-email/:token', verifyEmail);

// Authenticated Session & Profile
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/me', requireAuth, getMe);
authRouter.patch('/profile', requireAuth, validateRequest(updateProfileSchema), updateProfile);
authRouter.patch('/change-password', requireAuth, validateRequest(changePasswordSchema), changePassword);
authRouter.delete('/me', requireAuth, deactivateAccount);
