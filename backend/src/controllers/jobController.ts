import { Request, Response, NextFunction } from 'express';
import { Job } from '../models/Job';
import { sendSuccess } from '../utils/response';

export async function listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { department, type, location, search } = req.query;

    const filter: Record<string, any> = { status: 'published' };

    if (department && typeof department === 'string' && department !== 'all') {
      filter.department = department;
    }

    if (type && typeof type === 'string' && type !== 'all') {
      filter.employmentType = type;
    }

    if (location && typeof location === 'string') {
      filter.location = new RegExp(location, 'i');
    }

    if (search && typeof search === 'string') {
      filter.$text = { $search: search };
    }

    const jobs = await Job.find(filter)
      .populate('companyId', 'name slug logo location website')
      .sort({ createdAt: -1 })
      .limit(50);

    sendSuccess(res, { jobs, count: jobs.length });
  } catch (error) {
    next(error);
  }
}

