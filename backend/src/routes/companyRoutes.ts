import { Router } from 'express';
import {
  createCompany,
  listCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  listCompanyMembers,
  inviteCompanyMember,
  updateCompanyMember,
  removeCompanyMember,
} from '../controllers/companyController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import {
  createCompanySchema,
  updateCompanySchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
} from '../validators/companyValidator';

export const companyRouter = Router();

// Public / Candidate company discovery
companyRouter.get('/', listCompanies);
companyRouter.get('/:id', getCompanyById);

// Company Management (Recruiters & Admins)
companyRouter.post('/', requireAuth, requireRole('recruiter', 'admin'), validateBody(createCompanySchema), createCompany);
companyRouter.patch('/:id', requireAuth, requireRole('recruiter', 'admin'), validateBody(updateCompanySchema), updateCompany);
companyRouter.delete('/:id', requireAuth, requireRole('recruiter', 'admin'), deleteCompany);

// Member & Team Management (Module 2)
companyRouter.get('/:companyId/members', requireAuth, requireRole('recruiter', 'admin'), listCompanyMembers);
companyRouter.post(
  '/:companyId/invitations',
  requireAuth,
  requireRole('recruiter', 'admin'),
  validateBody(inviteMemberSchema),
  inviteCompanyMember
);
companyRouter.patch(
  '/:companyId/members/:memberId',
  requireAuth,
  requireRole('recruiter', 'admin'),
  validateBody(updateMemberRoleSchema),
  updateCompanyMember
);
companyRouter.delete('/:companyId/members/:memberId', requireAuth, requireRole('recruiter', 'admin'), removeCompanyMember);
