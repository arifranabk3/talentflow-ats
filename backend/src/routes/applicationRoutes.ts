import { Router } from 'express';
import {
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  getCompanyApplications,
  updateApplicationStatus,
  updateApplicationNotes,
} from '../controllers/applicationController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { updateApplicationStatusSchema, updateApplicationNotesSchema } from '../validators/applicationValidator';

export const applicationRouter = Router();

// Candidate endpoints
applicationRouter.get('/me', requireAuth, requireRole('candidate'), getMyApplications);
applicationRouter.get('/:id', requireAuth, getApplicationById);
applicationRouter.patch('/:id/withdraw', requireAuth, requireRole('candidate'), withdrawApplication);

// Recruiter pipeline endpoints
applicationRouter.get('/company/:companyId', requireAuth, requireRole('recruiter', 'admin'), getCompanyApplications);
applicationRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('recruiter', 'admin'),
  validateBody(updateApplicationStatusSchema),
  updateApplicationStatus
);
applicationRouter.patch(
  '/:id/notes',
  requireAuth,
  requireRole('recruiter', 'admin'),
  validateBody(updateApplicationNotesSchema),
  updateApplicationNotes
);

