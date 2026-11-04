import { Router } from 'express';
import { listCompanies } from '../controllers/companyController';

export const companyRouter = Router();

companyRouter.get('/', listCompanies);

