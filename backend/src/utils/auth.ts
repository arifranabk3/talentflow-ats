import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

const SALT_ROUNDS = 12;

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  tokenVersion?: number;
}

export function generateToken(payload: TokenPayload, expiresIn: string | number = '15m'): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: expiresIn as any });
}

export function generateRefreshToken(payload: TokenPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(
    { ...payload, tokenType: 'refresh' },
    config.jwtSecret,
    { expiresIn: expiresIn as any }
  );
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload & { tokenType?: string };
  if (decoded.tokenType !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

/**
 * Generate a cryptographically secure random token (hex) for email verification & password reset
 */
export function generateCryptoToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a plain crypto token using SHA-256 before persisting into database
 */
export function hashCryptoToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
