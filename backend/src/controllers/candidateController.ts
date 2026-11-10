import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { CandidateProfile } from '../models/CandidateProfile';
import { Application } from '../models/Application';
import { CompanyMember } from '../models/CompanyMember';
import { AppError, sendSuccess } from '../utils/response';

/**
 * GET /api/v1/candidates/me
 * Candidate views their own full profile
 */
export async function getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    let profile = await CandidateProfile.findOne({ userId: req.user.userId }).populate('userId', 'name email status');

    if (!profile) {
      // Auto-create blank profile for new candidate
      profile = await CandidateProfile.create({
        userId: new Types.ObjectId(req.user.userId),
        skills: [],
        experience: [],
        education: [],
      });
      profile = await CandidateProfile.findById(profile._id).populate('userId', 'name email status');
    }

    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/candidates/me
 * Candidate updates their profile
 */
export async function updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const updates = req.body;

    let profile = await CandidateProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      profile = new CandidateProfile({
        userId: new Types.ObjectId(req.user.userId),
        ...updates,
      });
    } else {
      Object.assign(profile, updates);
    }

    await profile.save();
    const updated = await CandidateProfile.findById(profile._id).populate('userId', 'name email status');

    sendSuccess(res, updated, 'Candidate profile updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/candidates/:id
 * Recruiter or admin views a candidate profile.
 * Recruiters can only access candidates who have active applications to their company's jobs.
 */
export async function getCandidateById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid candidate ID.', 400, 'BAD_REQUEST');
    }

    // Allow candidate to view their own profile by ID
    if (req.user.userId === id && req.user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({
        $or: [{ _id: id }, { userId: id }],
      }).populate('userId', 'name email');
      if (!profile) throw new AppError('Profile not found.', 404, 'NOT_FOUND');
      sendSuccess(res, profile);
      return;
    }

    // If recruiter, ensure candidate has applied to a job in one of recruiter's companies
    if (req.user.role === 'recruiter') {
      const recruiterMemberships = await CompanyMember.find({
        userId: req.user.userId,
        status: 'active',
      }).select('companyId');

      const companyIds = recruiterMemberships.map((m) => m.companyId);

      const hasApplication = await Application.findOne({
        candidateId: id,
        companyId: { $in: companyIds },
      });

      if (!hasApplication) {
        throw new AppError('Access forbidden. Candidate has not applied to your organization.', 403, 'FORBIDDEN');
      }
    } else if (req.user.role !== 'admin') {
      throw new AppError('Unauthorized to inspect this profile.', 403, 'FORBIDDEN');
    }

    const profile = await CandidateProfile.findOne({
      $or: [{ _id: id }, { userId: id }],
    }).populate('userId', 'name email');

    if (!profile) {
      throw new AppError('Candidate profile not found.', 404, 'NOT_FOUND');
    }

    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

