import { Request, Response, NextFunction } from 'express';
import { Company } from '../models/Company';
import { sendSuccess } from '../utils/response';

export async function listCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search } = req.query;

    const filter: Record<string, any> = { verificationStatus: 'verified' };

    if (search && typeof search === 'string') {
      filter.$text = { $search: search };
    }

    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    sendSuccess(res, { companies, count: companies.length });
  } catch (error) {
    next(error);
  }
}

