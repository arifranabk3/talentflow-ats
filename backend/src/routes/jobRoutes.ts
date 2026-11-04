import { Router } from 'express';
import { listJobs } from '../controllers/jobController';

export const jobRouter = Router();

jobRouter.get('/', listJobs);

