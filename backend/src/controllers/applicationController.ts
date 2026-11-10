import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Application, IApplication } from '../models/Application';
import { Job } from '../models/Job';
import { CompanyMember } from '../models/CompanyMember';
import { Resume } from '../models/Resume';
import { AuditLog } from '../models/AuditLog';
import { AppError, sendSuccess } from '../utils/response';

// Allowed sequential pipeline transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  applied: ['screening', 'rejected'],
  screening: ['interview', 'rejected'],
  interview: ['offered', 'rejected'],
  offered: ['hired', 'rejected'],
  hired: [], // Terminal stage
  rejected: ['screening'], // Reconsideration allowed back to screening
};

/**
 * POST /api/v1/jobs/:jobId/applications
 * Authenticated candidate applies to a published job
 */
export async function applyToJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    if (req.user.role !== 'candidate') {
      throw new AppError('Only candidates can submit job applications.', 403, 'FORBIDDEN');
    }

    const { jobId } = req.params;
    const { resumeId, coverLetter } = req.body;

    if (!Types.ObjectId.isValid(jobId)) {
      throw new AppError('Invalid job ID.', 400, 'BAD_REQUEST');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new AppError('Job not found.', 404, 'NOT_FOUND');
    }

    if (job.status !== 'published') {
      throw new AppError('This job opening is no longer accepting applications.', 400, 'JOB_NOT_OPEN');
    }

    // Check duplicate application
    const existing = await Application.findOne({
      jobId: job._id,
      candidateId: req.user.userId,
    });
    if (existing) {
      throw new AppError('You have already applied for this position.', 409, 'DUPLICATE_APPLICATION');
    }

    // Validate resume ownership if resumeId is provided
    let resumeObjectId: Types.ObjectId | undefined;
    if (resumeId) {
      if (!Types.ObjectId.isValid(resumeId)) {
        throw new AppError('Invalid resume ID.', 400, 'BAD_REQUEST');
      }
      const resume = await Resume.findOne({ _id: resumeId, candidateId: req.user.userId });
      if (!resume) {
        throw new AppError('Resume not found or does not belong to you.', 403, 'INVALID_RESUME_OWNERSHIP');
      }
      resumeObjectId = resume._id as Types.ObjectId;
    }

    const application = await Application.create({
      jobId: job._id,
      candidateId: new Types.ObjectId(req.user.userId),
      companyId: job.companyId,
      resumeId: resumeObjectId,
      coverLetter,
      status: 'applied',
      appliedAt: new Date(),
    });

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'APPLICATION_SUBMITTED',
      resourceType: 'Application',
      resourceId: application._id.toString(),
      metadata: { jobId: job._id.toString(), companyId: job.companyId.toString() },
    });

    sendSuccess(res, application, 'Application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/applications/me
 * Candidate views their own application history
 */
export async function getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const applications = await Application.find({ candidateId: req.user.userId })
      .populate('jobId', 'title slug location employmentType workplaceType status')
      .populate('companyId', 'name slug logo location website')
      .populate('resumeId', 'fileName fileType fileSize uploadedAt')
      .sort({ appliedAt: -1 });

    sendSuccess(res, { applications, count: applications.length });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/applications/:id
 * Retrieve single application details
 */
export async function getApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid application ID.', 400, 'BAD_REQUEST');
    }

    const application = await Application.findById(id)
      .populate('jobId', 'title slug location employmentType workplaceType status')
      .populate('companyId', 'name slug logo location')
      .populate('candidateId', 'name email')
      .populate('resumeId', 'fileName fileType fileSize uploadedAt storageKey');

    if (!application) {
      throw new AppError('Application not found.', 404, 'NOT_FOUND');
    }

    // Candidate can only view their own application
    if (req.user.role === 'candidate') {
      if (application.candidateId._id.toString() !== req.user.userId) {
        throw new AppError('You do not have permission to view this application.', 403, 'FORBIDDEN');
      }
    } else if (req.user.role === 'recruiter') {
      // Recruiter must belong to the application's company
      const membership = await CompanyMember.findOne({
        companyId: application.companyId._id,
        userId: req.user.userId,
        status: 'active',
      });
      if (!membership) {
        throw new AppError('Access forbidden. Application does not belong to your company.', 403, 'FORBIDDEN');
      }
    }

    sendSuccess(res, application);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/applications/:id/withdraw
 * Candidate withdraws their active application
 */
export async function withdrawApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid application ID.', 400, 'BAD_REQUEST');
    }

    const application = await Application.findById(id);
    if (!application) {
      throw new AppError('Application not found.', 404, 'NOT_FOUND');
    }

    if (application.candidateId.toString() !== req.user.userId && req.user.role !== 'admin') {
      throw new AppError('You cannot withdraw someone else’s application.', 403, 'FORBIDDEN');
    }

    if (application.status === 'hired') {
      throw new AppError('Cannot withdraw an offer that has already reached hired status.', 400, 'INVALID_STATE');
    }

    application.status = 'rejected'; // Or withdrawn
    application.recruiterNotes = `${application.recruiterNotes ? application.recruiterNotes + '\n' : ''}[Candidate Withdrawn]: Application withdrawn by candidate on ${new Date().toISOString()}`;
    await application.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'APPLICATION_WITHDRAWN',
      resourceType: 'Application',
      resourceId: application._id.toString(),
    });

    sendSuccess(res, application, 'Application withdrawn successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/companies/:companyId/applications
 * Recruiter lists all applications for their company pipeline
 */
export async function getCompanyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { companyId } = req.params;
    const { status, jobId, page = '1', limit = '50' } = req.query;

    if (!Types.ObjectId.isValid(companyId)) {
      throw new AppError('Invalid company ID.', 400, 'BAD_REQUEST');
    }

    if (req.user.role !== 'admin') {
      const membership = await CompanyMember.findOne({
        companyId,
        userId: req.user.userId,
        status: 'active',
      });
      if (!membership) {
        throw new AppError('Access forbidden. You do not belong to this company.', 403, 'FORBIDDEN');
      }
    }

    const filter: Record<string, any> = { companyId: new Types.ObjectId(companyId) };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (jobId && Types.ObjectId.isValid(jobId as string)) {
      filter.jobId = new Types.ObjectId(jobId as string);
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('jobId', 'title slug location employmentType')
        .populate('candidateId', 'name email')
        .populate('resumeId', 'fileName fileType fileSize uploadedAt')
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(filter),
    ]);

    sendSuccess(res, {
      applications,
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
 * PATCH /api/v1/applications/:id/status
 * Recruiter advances or changes stage of application in pipeline
 */
export async function updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const { status: targetStatus, reason } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid application ID.', 400, 'BAD_REQUEST');
    }

    const application = await Application.findById(id);
    if (!application) {
      throw new AppError('Application not found.', 404, 'NOT_FOUND');
    }

    // Company isolation check
    if (req.user.role !== 'admin') {
      const membership = await CompanyMember.findOne({
        companyId: application.companyId,
        userId: req.user.userId,
        status: 'active',
      });
      if (!membership) {
        throw new AppError('You are not authorized to update applications for this company.', 403, 'FORBIDDEN');
      }
    }

    const currentStatus = application.status;

    // Validate state machine transition
    const allowedNextStages = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowedNextStages.includes(targetStatus) && req.user.role !== 'admin') {
      throw new AppError(
        `Invalid pipeline transition from '${currentStatus}' to '${targetStatus}'. Allowed: ${allowedNextStages.join(', ') || 'None'}`,
        400,
        'INVALID_PIPELINE_TRANSITION'
      );
    }

    application.status = targetStatus;
    if (reason) {
      application.recruiterNotes = `${application.recruiterNotes ? application.recruiterNotes + '\n' : ''}[Transition to ${targetStatus}]: ${reason}`;
    }
    await application.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'APPLICATION_STATUS_UPDATED',
      resourceType: 'Application',
      resourceId: application._id.toString(),
      metadata: { from: currentStatus, to: targetStatus, reason },
    });

    sendSuccess(res, application, `Application status updated to ${targetStatus}`);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/applications/:id/notes
 * Recruiter updates internal evaluation notes
 */
export async function updateApplicationNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const { recruiterNotes } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid application ID.', 400, 'BAD_REQUEST');
    }

    const application = await Application.findById(id);
    if (!application) {
      throw new AppError('Application not found.', 404, 'NOT_FOUND');
    }

    // Company isolation check
    if (req.user.role !== 'admin') {
      const membership = await CompanyMember.findOne({
        companyId: application.companyId,
        userId: req.user.userId,
        status: 'active',
      });
      if (!membership) {
        throw new AppError('Unauthorized.', 403, 'FORBIDDEN');
      }
    }

    application.recruiterNotes = recruiterNotes;
    await application.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'APPLICATION_NOTES_UPDATED',
      resourceType: 'Application',
      resourceId: application._id.toString(),
    });

    sendSuccess(res, application, 'Recruiter notes saved');
  } catch (error) {
    next(error);
  }
}
