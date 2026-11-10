import { Router } from 'express';
import { getMyProfile, updateMyProfile, getCandidateById } from '../controllers/candidateController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { updateCandidateProfileSchema } from '../validators/candidateValidator';

export const candidateRouter = Router();

// Candidate self profile management
candidateRouter.get('/me', requireAuth, requireRole('candidate'), getMyProfile);
candidateRouter.patch('/me', requireAuth, requireRole('candidate'), validateBody(updateCandidateProfileSchema), updateMyProfile);

// Inspection by recruiter / admin (or self)
candidateRouter.get('/:id', requireAuth, getCandidateById);
