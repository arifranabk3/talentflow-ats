import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Company } from '../models/Company';
import { CompanyMember } from '../models/CompanyMember';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { Job } from '../models/Job';
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
 * POST /api/v1/companies
 * Authenticated recruiter creates a company and becomes the owner
 */
export async function createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { name, slug: customSlug, description, website, logo, industry, companySize, location } = req.body;

    let slug = customSlug ? slugify(customSlug) : slugify(name);
    // Ensure slug uniqueness
    const existingSlug = await Company.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const company = await Company.create({
      name,
      slug,
      description,
      website,
      logo,
      industry,
      companySize,
      location,
      verificationStatus: 'verified', // Staging/verified for seamless ATS flow
      createdBy: new Types.ObjectId(req.user.userId),
    });

    // Make creator the company Owner
    await CompanyMember.create({
      companyId: company._id,
      userId: new Types.ObjectId(req.user.userId),
      role: 'owner',
      status: 'active',
    });

    // Audit log
    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'COMPANY_CREATED',
      resourceType: 'Company',
      resourceId: company._id.toString(),
      metadata: { name: company.name, slug: company.slug },
    });

    sendSuccess(res, company, 'Company created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/companies
 * List verified companies or public listings
 */
export async function listCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, page = '1', limit = '20' } = req.query;

    const filter: Record<string, any> = {};

    if (search && typeof search === 'string') {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { industry: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Company.countDocuments(filter),
    ]);

    sendSuccess(res, {
      companies,
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
 * GET /api/v1/companies/:id
 * Retrieve company details + active jobs count
 */
export async function getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const isObjectId = Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

    const company = await Company.findOne(query).populate('createdBy', 'name email');
    if (!company) {
      throw new AppError('Company not found.', 404, 'NOT_FOUND');
    }

    const openJobsCount = await Job.countDocuments({
      companyId: company._id,
      status: 'published',
    });

    sendSuccess(res, { company, openJobsCount });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/companies/:id
 * Update company profile (Owner or Recruiter of the company only)
 */
export async function updateCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid company ID.', 400, 'BAD_REQUEST');
    }

    const company = await Company.findById(id);
    if (!company) {
      throw new AppError('Company not found.', 404, 'NOT_FOUND');
    }

    // Role check: Admin or Company Member (owner/recruiter)
    if (req.user.role !== 'admin') {
      const membership = await CompanyMember.findOne({
        companyId: company._id,
        userId: req.user.userId,
        status: 'active',
        role: { $in: ['owner', 'recruiter'] },
      });

      if (!membership) {
        throw new AppError('You do not have permission to update this company.', 403, 'FORBIDDEN');
      }
    }

    const { name, description, website, logo, industry, companySize, location } = req.body;

    if (name) company.name = name;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (logo !== undefined) company.logo = logo;
    if (industry !== undefined) company.industry = industry;
    if (companySize !== undefined) company.companySize = companySize;
    if (location !== undefined) company.location = location;

    await company.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'COMPANY_UPDATED',
      resourceType: 'Company',
      resourceId: company._id.toString(),
      metadata: req.body,
    });

    sendSuccess(res, company, 'Company profile updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/companies/:id
 * Archival/soft deletion to preserve application history
 */
export async function deleteCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid company ID.', 400, 'BAD_REQUEST');
    }

    const company = await Company.findById(id);
    if (!company) {
      throw new AppError('Company not found.', 404, 'NOT_FOUND');
    }

    // Only owner or admin can archive/delete company
    if (req.user.role !== 'admin') {
      const membership = await CompanyMember.findOne({
        companyId: company._id,
        userId: req.user.userId,
        status: 'active',
        role: 'owner',
      });

      if (!membership) {
        throw new AppError('Only the company owner or an admin can archive this company.', 403, 'FORBIDDEN');
      }
    }

    // Soft-close all published jobs to prevent orphaned active openings
    await Job.updateMany({ companyId: company._id, status: 'published' }, { $set: { status: 'closed' } });

    // Mark company as rejected / suspended or archived to protect historical data
    company.verificationStatus = 'rejected';
    await company.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'COMPANY_ARCHIVED',
      resourceType: 'Company',
      resourceId: company._id.toString(),
      metadata: { reason: 'Company archived by owner' },
    });

    sendSuccess(res, { companyId: company._id, status: 'archived' }, 'Company safely archived and active jobs closed.');
  } catch (error) {
    next(error);
  }
}

// -------------------------------------------------------------
// MODULE 2: COMPANY MEMBERSHIP & TEAM MANAGEMENT
// -------------------------------------------------------------

/**
 * GET /api/v1/companies/:companyId/members
 * List company members
 */
export async function listCompanyMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { companyId } = req.params;
    if (!Types.ObjectId.isValid(companyId)) {
      throw new AppError('Invalid company ID.', 400, 'BAD_REQUEST');
    }

    // Membership verification
    if (req.user.role !== 'admin') {
      const isMember = await CompanyMember.findOne({
        companyId,
        userId: req.user.userId,
        status: 'active',
      });
      if (!isMember) {
        throw new AppError('You are not a member of this company.', 403, 'FORBIDDEN');
      }
    }

    const members = await CompanyMember.find({ companyId })
      .populate('userId', 'name email role status lastLoginAt')
      .sort({ createdAt: -1 });

    sendSuccess(res, { members, count: members.length });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/companies/:companyId/invitations
 * Owner or recruiter invites new team member
 */
export async function inviteCompanyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { companyId } = req.params;
    const { email, role = 'recruiter' } = req.body;

    if (!Types.ObjectId.isValid(companyId)) {
      throw new AppError('Invalid company ID.', 400, 'BAD_REQUEST');
    }

    // Verify caller is owner or admin
    if (req.user.role !== 'admin') {
      const callerMembership = await CompanyMember.findOne({
        companyId,
        userId: req.user.userId,
        status: 'active',
        role: 'owner',
      });
      if (!callerMembership) {
        throw new AppError('Only company owners can invite new team members.', 403, 'FORBIDDEN');
      }
    }

    // Find target user by email
    let targetUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!targetUser) {
      // Create user with recruiter role in pending state with a placeholder hashed password
      const crypto = await import('crypto');
      const tempHash = crypto.randomBytes(32).toString('hex');
      targetUser = await User.create({
        name: email.split('@')[0],
        email: email.toLowerCase().trim(),
        passwordHash: tempHash,
        role: 'recruiter',
        status: 'pending',
        emailVerified: false,
      });
    }

    // Check if membership already exists
    const existingMembership = await CompanyMember.findOne({
      companyId,
      userId: targetUser._id,
    });

    if (existingMembership) {
      if (existingMembership.status === 'active') {
        throw new AppError('User is already an active member of this company.', 409, 'ALREADY_EXISTS');
      }
      existingMembership.status = 'active';
      existingMembership.role = role;
      await existingMembership.save();
      sendSuccess(res, existingMembership, 'Company member re-activated successfully');
      return;
    }

    const newMember = await CompanyMember.create({
      companyId: new Types.ObjectId(companyId),
      userId: targetUser._id,
      role,
      status: 'active',
    });

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'MEMBER_INVITED',
      resourceType: 'CompanyMember',
      resourceId: newMember._id.toString(),
      metadata: { invitedEmail: email, role },
    });

    sendSuccess(res, newMember, 'Team member added successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/companies/:companyId/members/:memberId
 * Update membership role or status
 */
export async function updateCompanyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { companyId, memberId } = req.params;
    const { role, status } = req.body;

    if (!Types.ObjectId.isValid(companyId) || !Types.ObjectId.isValid(memberId)) {
      throw new AppError('Invalid ID provided.', 400, 'BAD_REQUEST');
    }

    // Verify caller is owner or admin
    if (req.user.role !== 'admin') {
      const callerMembership = await CompanyMember.findOne({
        companyId,
        userId: req.user.userId,
        status: 'active',
        role: 'owner',
      });
      if (!callerMembership) {
        throw new AppError('Only company owners can update member roles.', 403, 'FORBIDDEN');
      }
    }

    const member = await CompanyMember.findOne({ _id: memberId, companyId });
    if (!member) {
      throw new AppError('Company member not found.', 404, 'NOT_FOUND');
    }

    // Safety guard: Prevent demoting the last active owner
    if (member.role === 'owner' && role && role !== 'owner') {
      const activeOwnersCount = await CompanyMember.countDocuments({
        companyId,
        role: 'owner',
        status: 'active',
      });
      if (activeOwnersCount <= 1) {
        throw new AppError('Cannot demote the last active owner of the company.', 400, 'LAST_OWNER_PROTECTION');
      }
    }

    if (role) member.role = role;
    if (status) member.status = status;
    await member.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'MEMBER_ROLE_UPDATED',
      resourceType: 'CompanyMember',
      resourceId: member._id.toString(),
      metadata: { newRole: role, newStatus: status },
    });

    sendSuccess(res, member, 'Member updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/companies/:companyId/members/:memberId
 * Remove team member (revocation)
 */
export async function removeCompanyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const { companyId, memberId } = req.params;
    if (!Types.ObjectId.isValid(companyId) || !Types.ObjectId.isValid(memberId)) {
      throw new AppError('Invalid ID provided.', 400, 'BAD_REQUEST');
    }

    // Verify caller is owner or admin
    if (req.user.role !== 'admin') {
      const callerMembership = await CompanyMember.findOne({
        companyId,
        userId: req.user.userId,
        status: 'active',
        role: 'owner',
      });
      if (!callerMembership) {
        throw new AppError('Only company owners can remove team members.', 403, 'FORBIDDEN');
      }
    }

    const member = await CompanyMember.findOne({ _id: memberId, companyId });
    if (!member) {
      throw new AppError('Company member not found.', 404, 'NOT_FOUND');
    }

    // Safety guard: Prevent removing the last active owner
    if (member.role === 'owner') {
      const activeOwnersCount = await CompanyMember.countDocuments({
        companyId,
        role: 'owner',
        status: 'active',
      });
      if (activeOwnersCount <= 1) {
        throw new AppError('Cannot remove the last active owner of the company.', 400, 'LAST_OWNER_PROTECTION');
      }
    }

    member.status = 'revoked';
    await member.save();

    await AuditLog.create({
      actorId: new Types.ObjectId(req.user.userId),
      action: 'MEMBER_REVOKED',
      resourceType: 'CompanyMember',
      resourceId: member._id.toString(),
    });

    sendSuccess(res, { memberId: member._id, status: 'revoked' }, 'Member removed successfully');
  } catch (error) {
    next(error);
  }
}
