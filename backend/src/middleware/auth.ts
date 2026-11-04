import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/auth';
import { AppError } from '../utils/response';
import { CompanyMember } from '../models/CompanyMember';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    let token: string | undefined;

    // Check Authorization header Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Check HTTP-only cookie
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError('Authentication required. Missing token.', 401, 'UNAUTHORIZED');
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    if (error instanceof AppError) return next(error);
    return next(new AppError('Invalid or expired authentication token.', 401, 'INVALID_TOKEN'));
  }
}

export function requireRole(...allowedRoles: Array<'candidate' | 'recruiter' | 'admin'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
}

export function requireCompanyMember(allowedMemberRoles?: Array<'owner' | 'recruiter' | 'hiring_manager'>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
      }

      // Admins bypass tenant restriction
      if (req.user.role === 'admin') {
        return next();
      }

      const companyId = req.params.companyId || req.body.companyId;
      if (!companyId) {
        throw new AppError('Company ID context missing in request.', 400, 'BAD_REQUEST');
      }

      const membership = await CompanyMember.findOne({
        companyId,
        userId: req.user.userId,
        status: 'active',
      });

      if (!membership) {
        throw new AppError('You do not have active membership in this organization.', 403, 'FORBIDDEN_TENANT');
      }

      if (allowedMemberRoles && !allowedMemberRoles.includes(membership.role)) {
        throw new AppError('Insufficient company permissions.', 403, 'INSUFFICIENT_COMPANY_PERMISSIONS');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

