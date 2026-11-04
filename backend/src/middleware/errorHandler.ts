import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log unexpected errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path }, err.message);
    }
    sendError(res, err.message, err.code, err.statusCode, err.details);
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Request validation failed', 'VALIDATION_ERROR', 400, formatted);
    return;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const keys = Object.keys(err.keyPattern || {});
    const field = keys[0] || 'record';
    sendError(res, `Duplicate record found for ${field}. Value must be unique.`, 'DUPLICATE_KEY', 409);
    return;
  }

  // Generic unhandled internal errors
  logger.error({ err: err.message, stack: err.stack, path: req.path }, 'Unhandled server error');
  sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An internal server error occurred.' : err.message,
    'INTERNAL_SERVER_ERROR',
    500
  );
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `API endpoint not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND', 404);
}

