import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Job } from '../models/Job';
import { CompanyMember } from '../models/CompanyMember';
import { Application } from '../models/Application';
import { AuditLog } from '../models/AuditLog';
import { AppError, sendSuccess } from '../utils/response';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Helper to check if a user is an active recruiter/owner in the target company
 */
async function verifyCompanyAccess(userId: string, companyId: string | Types.ObjectId, isAdmin = false): Promise<boolean> {
  if (isAdmin) return true;
  const membership = await CompanyMember.findOne({
    companyId,
    userId,
    status: 'active',
  });
  return !!membership;
}

/**
 * POST /api/v1/jobs
 * Recruiter creates a job for their company
 */
export async function createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const {
      companyId,
      title,
      slug: customSlug,
      description,
      responsibilities = [],
      requirements = [],
      location,
      employmentType = 'full-time',
      workplaceType = 'remote',
      salaryRange,
      skills = [],
      status = 'draft',
      applicationDeadline,
    } = req.body;

    if (!Types.ObjectId.isValid(companyId)) {
      throw new AppError('Invalid company ID.', 400, 'BAD_REQUEST');
    }

    const hasAccess = await verifyCompanyAccess(req.user.userId, companyId, req.user.role === 'admin');
    if (!hasAccess) {
      throw new AppError('You are not authorized to create jobs for this company.', 403, 'FORBIDDEN');
    }

    let slug = customSlug ? slugify(customSlug) : slugify(title);
    const existingJob = await Job.findOne({ companyId, slug });
    if (existingJob) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const job = await Job.create({
      companyId: new Types.ObjectId(companyId),
      createdBy: new Types.ObjectId(req.user.userId),
      title,
      slug,
      description,
      responsibilities,
      requirements,
      location,
      employmentType,
      workplaceType,
      salaryRange,
      skills,
      status,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
    });

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'JOB_CREATED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
      metadata: { title: job.title, companyId, status },
    });

    sendSuccess(res, job, 'Job created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/jobs
 * Public / Candidate job listings (published only) OR recruiter company jobs (all statuses)
 */
export async function listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      search,
      location,
      employmentType,
      workplaceType,
      skills,
      companyId,
      status,
      page = '1',
      limit = '20',
    } = req.query;

    const filter: Record<string, any> = {};

    // Candidate default: only view published jobs
    const isRecruiterOrAdmin = req.user && (req.user.role === 'recruiter' || req.user.role === 'admin');

    if (companyId && Types.ObjectId.isValid(companyId as string)) {
      filter.companyId = new Types.ObjectId(companyId as string);
    }

    if (isRecruiterOrAdmin && status && status !== 'all') {
      filter.status = status;
    } else if (!isRecruiterOrAdmin) {
      filter.status = 'published';
    }

    if (employmentType && employmentType !== 'all') {
      filter.employmentType = employmentType;
    }

    if (workplaceType && workplaceType !== 'all') {
      filter.workplaceType = workplaceType;
    }

    if (location && typeof location === 'string') {
      filter.location = new RegExp(location, 'i');
    }

    if (skills && typeof skills === 'string') {
      const skillsArray = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { skills: new RegExp(search, 'i') },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('companyId', 'name slug logo location website')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(filter),
    ]);

    sendSuccess(res, {
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/jobs/:id
 * Retrieve single job by ID or slug
 */
export async function getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const isObjectId = Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const job = await Job.findOne(query).populate('companyId', 'name slug logo location website description');
    if (!job) {
      throw new AppError('Job not found.', 404, 'NOT_FOUND');
    }

    // If job is not published, only authorized members or admins can inspect it
    if (job.status !== 'published') {
      if (!req.user) {
        throw new AppError('Job opening is not currently published.', 404, 'NOT_FOUND');
      }
      const hasAccess = await verifyCompanyAccess(req.user.userId, job.companyId as any, req.user.role === 'admin');
      if (!hasAccess) {
        throw new AppError('You are not authorized to view this unpublished job.', 403, 'FORBIDDEN');
      }
    }

    sendSuccess(res, job);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/jobs/:id
 * Update job details (Authorized recruiter only)
 */
export async function updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid job ID.', 400, 'BAD_REQUEST');
    }

    const job = await Job.findById(id);
    if (!job) {
      throw new AppError('Job not found.', 404, 'NOT_FOUND');
    }

    const hasAccess = await verifyCompanyAccess(req.user.userId, job.companyId, req.user.role === 'admin');
    if (!hasAccess) {
      throw new AppError('You are not authorized to edit jobs for this company.', 403, 'FORBIDDEN');
    }

    Object.assign(job, req.body);
    await job.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'JOB_UPDATED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
      metadata: req.body,
    });

    sendSuccess(res, job, 'Job updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/jobs/:id
 * Delete job (If applications exist, soft close to protect applicant records)
 */
export async function deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid job ID.', 400, 'BAD_REQUEST');
    }

    const job = await Job.findById(id);
    if (!job) {
      throw new AppError('Job not found.', 404, 'NOT_FOUND');
    }

    const hasAccess = await verifyCompanyAccess(req.user.userId, job.companyId, req.user.role === 'admin');
    if (!hasAccess) {
      throw new AppError('You are not authorized to delete jobs for this company.', 403, 'FORBIDDEN');
    }

    // Check if job has applications
    const applicationCount = await Application.countDocuments({ jobId: job._id });
    if (applicationCount > 0) {
      // Prevent permanent destruction of candidate history - soft close
      job.status = 'closed';
      await job.save();

      await AuditLog.create({
        actorId: new Types.ObjectId(req.user.userId),
        action: 'JOB_CLOSED_ARCHIVED',
        resourceType: 'Job',
        resourceId: job._id.toString(),
        metadata: { reason: 'Job closed instead of deleted due to existing applications', applicationCount },
      });

      sendSuccess(
        res,
        { jobId: job._id, status: 'closed', message: 'Job closed to preserve existing candidate application history.' },
        'Job closed successfully'
      );
      return;
    }

    await Job.findByIdAndDelete(job._id);

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'JOB_DELETED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
    });

    sendSuccess(res, { jobId: job._id, deleted: true }, 'Job permanently removed.');
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/jobs/:id/publish
 */
export async function publishJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) throw new AppError('Invalid job ID.', 400, 'BAD_REQUEST');

    const job = await Job.findById(id);
    if (!job) throw new AppError('Job not found.', 404, 'NOT_FOUND');

    const hasAccess = await verifyCompanyAccess(req.user.userId, job.companyId, req.user.role === 'admin');
    if (!hasAccess) throw new AppError('Unauthorized.', 403, 'FORBIDDEN');

    job.status = 'published';
    await job.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'JOB_PUBLISHED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
    });

    sendSuccess(res, job, 'Job published successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/jobs/:id/pause
 */
export async function pauseJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) throw new AppError('Invalid job ID.', 400, 'BAD_REQUEST');

    const job = await Job.findById(id);
    if (!job) throw new AppError('Job not found.', 404, 'NOT_FOUND');

    const hasAccess = await verifyCompanyAccess(req.user.userId, job.companyId, req.user.role === 'admin');
    if (!hasAccess) throw new AppError('Unauthorized.', 403, 'FORBIDDEN');

    job.status = 'paused';
    await job.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'JOB_PAUSED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
    });

    sendSuccess(res, job, 'Job paused successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/jobs/:id/close
 */
export async function closeJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) throw new AppError('Invalid job ID.', 400, 'BAD_REQUEST');

    const job = await Job.findById(id);
    if (!job) throw new AppError('Job not found.', 404, 'NOT_FOUND');

    const hasAccess = await verifyCompanyAccess(req.user.userId, job.companyId, req.user.role === 'admin');
    if (!hasAccess) throw new AppError('Unauthorized.', 403, 'FORBIDDEN');

    job.status = 'closed';
    await job.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'JOB_CLOSED',
      resourceType: 'Job',
      resourceId: job._id.toString(),
    });

    sendSuccess(res, job, 'Job closed successfully');
  } catch (error) {
    next(error);
  }
}
