import { z } from 'zod';

// Public registration strictly permits candidate or recruiter only
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['candidate', 'recruiter']).default('candidate'),
  }),
});

// Secure Admin Account Provisioning Schema
export const adminProvisionSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(10, 'Admin password must be at least 10 characters'),
    adminSecret: z.string().min(1, 'Administrative provisioning secret is required'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required').toLowerCase().trim(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(120).optional(),
    email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});
