import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateCryptoToken,
  hashCryptoToken,
} from '../utils/auth';
import { AppError, sendSuccess } from '../utils/response';
import { AuditLog } from '../models/AuditLog';
import { config } from '../config/env';

/**
 * Helper to set auth cookies consistently
 */
function setAuthCookies(res: Response, token: string, refreshToken?: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.isProd,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/api/v1/auth/refresh',
    });
  }
}

/**
 * POST /api/v1/auth/register
 * Public registration strictly for candidate or recruiter roles
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role = 'candidate' } = req.body;

    // Security Gate: Admin role can never be publicly registered
    if (role === 'admin' || (req.body as any).role === 'admin') {
      throw new AppError('Administrative accounts cannot be registered publicly.', 403, 'FORBIDDEN_ADMIN_REGISTRATION');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
    }

    // Generate email verification token
    const verificationRaw = generateCryptoToken();
    const verificationHash = hashCryptoToken(verificationRaw);

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === 'recruiter' ? 'recruiter' : 'candidate',
      status: 'active',
      emailVerified: false,
      emailVerificationToken: verificationHash,
      tokenVersion: 0,
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    user.refreshToken = refreshToken;
    await user.save();

    // Append-only audit record
    await AuditLog.create({
      actorId: user._id,
      action: 'USER_REGISTERED',
      resourceType: 'User',
      resourceId: user._id.toString(),
      metadata: { role: user.role, email: user.email },
      ipAddress: req.ip,
    });

    setAuthCookies(res, token, refreshToken);

    sendSuccess(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
        },
        token,
        refreshToken,
        verificationToken: config.isProd ? undefined : verificationRaw, // Available in dev/test for automation
      },
      'User registered successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/provision-admin
 * Secure administrative account provisioning protected by master secret
 */
export async function provisionAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!adminSecret || adminSecret !== config.adminSecret) {
      throw new AppError('Invalid administrative provisioning credentials.', 403, 'FORBIDDEN_PROVISIONING');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        throw new AppError('Admin account already provisioned with this email.', 409, 'ADMIN_EXISTS');
      }
      // Escalate existing user to admin with new password
      existingUser.role = 'admin';
      existingUser.status = 'active';
      existingUser.passwordHash = await hashPassword(password);
      existingUser.tokenVersion = (existingUser.tokenVersion || 0) + 1;
      await existingUser.save();

      await AuditLog.create({
        actorId: existingUser._id,
        action: 'ADMIN_PROVISIONED',
        resourceType: 'User',
        resourceId: existingUser._id.toString(),
        metadata: { email, escalated: true },
        ipAddress: req.ip,
      });

      sendSuccess(res, { userId: existingUser._id, role: 'admin' }, 'Existing user elevated to admin successfully.');
      return;
    }

    const passwordHash = await hashPassword(password);
    const adminUser = await User.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      status: 'active',
      emailVerified: true,
      tokenVersion: 0,
    });

    await AuditLog.create({
      actorId: adminUser._id,
      action: 'ADMIN_PROVISIONED',
      resourceType: 'User',
      resourceId: adminUser._id.toString(),
      metadata: { email },
      ipAddress: req.ip,
    });

    sendSuccess(res, { userId: adminUser._id, role: 'admin' }, 'Administrator account provisioned successfully.', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/login
 * User login with rate limiting & multi-role session generation
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password credentials.', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      throw new AppError('This account has been suspended by an administrator.', 403, 'ACCOUNT_SUSPENDED');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials.', 401, 'INVALID_CREDENTIALS');
    }

    user.lastLoginAt = new Date();
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    });

    user.refreshToken = refreshToken;
    await user.save();

    await AuditLog.create({
      actorId: user._id,
      action: 'USER_LOGIN',
      resourceType: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
    });

    setAuthCookies(res, token, refreshToken);

    sendSuccess(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
        },
        token,
        refreshToken,
      },
      'Login successful.'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/refresh
 * Refresh token rotation
 */
export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const incomingToken = req.body.refreshToken || req.cookies?.refreshToken;
    if (!incomingToken) {
      throw new AppError('Refresh token required.', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    const decoded = verifyRefreshToken(incomingToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.status === 'suspended') {
      throw new AppError('User not found or account is suspended.', 401, 'USER_INACTIVE');
    }

    // Verify token version match (revocation check)
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError('Session has expired or was revoked. Please log in again.', 401, 'TOKEN_REVOKED');
    }

    // Rotate tokens
    const newToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    setAuthCookies(res, newToken, newRefreshToken);

    sendSuccess(
      res,
      {
        token: newToken,
        refreshToken: newRefreshToken,
      },
      'Token refreshed successfully.'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/logout
 * Invalidate session and clear HTTP-only cookies
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user) {
      // Invalidate current refresh token
      await User.findByIdAndUpdate(req.user.userId, { $unset: { refreshToken: 1 } });
      await AuditLog.create({
        actorId: req.user.userId,
        action: 'USER_LOGOUT',
        resourceType: 'User',
        resourceId: req.user.userId,
      });
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: config.isProd,
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.isProd,
      sameSite: 'lax',
      path: '/api/v1/auth/refresh',
    });

    sendSuccess(res, null, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/auth/me
 * Retrieve authenticated profile
 */
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized.', 401, 'UNAUTHORIZED');
    }

    const user = await User.findById(req.user.userId).select('-passwordHash -refreshToken -resetPasswordToken -emailVerificationToken');
    if (!user) {
      throw new AppError('User profile not found.', 404, 'NOT_FOUND');
    }

    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/auth/profile
 * Update user name or profile attributes
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized.', 401, 'UNAUTHORIZED');
    }

    const { name } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }

    if (name) user.name = name.trim();
    await user.save();

    await AuditLog.create({
      actorId: user._id,
      action: 'USER_PROFILE_UPDATED',
      resourceType: 'User',
      resourceId: user._id.toString(),
      metadata: { name: user.name },
    });

    sendSuccess(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    }, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/auth/change-password
 * Change password and invalidate all other existing active sessions
 */
export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized.', 401, 'UNAUTHORIZED');
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password provided is incorrect.', 400, 'INVALID_CURRENT_PASSWORD');
    }

    user.passwordHash = await hashPassword(newPassword);
    // Increment tokenVersion to revoke all other existing sessions
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    // Re-issue fresh tokens for current device
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, token, refreshToken);

    await AuditLog.create({
      actorId: user._id,
      action: 'USER_PASSWORD_CHANGED',
      resourceType: 'User',
      resourceId: user._id.toString(),
    });

    sendSuccess(res, { token, refreshToken }, 'Password changed successfully. All previous sessions invalidated.');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/forgot-password
 * Generate secure, SHA-256 hashed password reset token with 1-hour expiration
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond with success to prevent user email enumeration
    if (!user) {
      sendSuccess(res, null, 'If that email address is in our system, recovery instructions have been dispatched.');
      return;
    }

    const resetToken = generateCryptoToken();
    user.resetPasswordToken = hashCryptoToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await AuditLog.create({
      actorId: user._id,
      action: 'PASSWORD_RESET_REQUESTED',
      resourceType: 'User',
      resourceId: user._id.toString(),
    });

    sendSuccess(
      res,
      {
        resetToken: config.isProd ? undefined : resetToken, // Exposed in non-production for automated testing
      },
      'If that email address is in our system, recovery instructions have been dispatched.'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/reset-password
 * Reset password using valid crypto token
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    const hashed = hashCryptoToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Password reset token is invalid or has expired.', 400, 'INVALID_RESET_TOKEN');
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate all prior sessions
    await user.save();

    await AuditLog.create({
      actorId: user._id,
      action: 'PASSWORD_RESET_COMPLETED',
      resourceType: 'User',
      resourceId: user._id.toString(),
    });

    sendSuccess(res, null, 'Password has been successfully reset. You may now log in.');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/auth/verify-email/:token
 * Verify candidate/recruiter email address
 */
export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.params;
    const hashed = hashCryptoToken(token);

    const user = await User.findOne({ emailVerificationToken: hashed });
    if (!user) {
      throw new AppError('Invalid email verification link.', 400, 'INVALID_VERIFICATION_TOKEN');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    await AuditLog.create({
      actorId: user._id,
      action: 'EMAIL_VERIFIED',
      resourceType: 'User',
      resourceId: user._id.toString(),
    });

    sendSuccess(res, null, 'Email verified successfully.');
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/auth/me
 * Self-deactivation / soft delete of user account
 */
export async function deactivateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized.', 401, 'UNAUTHORIZED');
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }

    user.status = 'suspended';
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate current session
    await user.save();

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    await AuditLog.create({
      actorId: user._id,
      action: 'ACCOUNT_DEACTIVATED',
      resourceType: 'User',
      resourceId: user._id.toString(),
    });

    sendSuccess(res, null, 'Your account has been deactivated successfully.');
  } catch (error) {
    next(error);
  }
}
