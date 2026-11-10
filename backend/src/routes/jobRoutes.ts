import { Router } from 'express';
import {
  createJob,
  listJobs,
  getJobById,
  updateJob,
  deleteJob,
  publishJob,
  pauseJob,
  closeJob,
} from '../controllers/jobController';
import { applyToJob } from '../controllers/applicationController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { createJobSchema, updateJobSchema, listJobsQuerySchema } from '../validators/jobValidator';
import { applyJobSchema } from '../validators/applicationValidator';

export const jobRouter = Router();

// Job search and list (Candidates & Public)
jobRouter.get('/', validateQuery(listJobsQuerySchema), listJobs);
jobRouter.get('/:id', getJobById);

// Job Management (Recruiters & Admins)
jobRouter.post('/', requireAuth, requireRole('recruiter', 'admin'), validateBody(createJobSchema), createJob);
jobRouter.patch('/:id', requireAuth, requireRole('recruiter', 'admin'), validateBody(updateJobSchema), updateJob);
jobRouter.delete('/:id', requireAuth, requireRole('recruiter', 'admin'), deleteJob);

// Status transition endpoints
jobRouter.patch('/:id/publish', requireAuth, requireRole('recruiter', 'admin'), publishJob);
jobRouter.patch('/:id/pause', requireAuth, requireRole('recruiter', 'admin'), pauseJob);
jobRouter.patch('/:id/close', requireAuth, requireRole('recruiter', 'admin'), closeJob);

// Candidate application submission
jobRouter.post('/:jobId/applications', requireAuth, requireRole('candidate'), validateBody(applyJobSchema), applyToJob);
