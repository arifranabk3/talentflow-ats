import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(150),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens only').optional(),
  description: z.string().max(2000).optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  logo: z.string().optional(),
  industry: z.string().max(100).optional(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  location: z.string().max(200).optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const inviteMemberSchema = z.object({
  email: z.string().email('Valid email is required'),
  role: z.enum(['owner', 'recruiter', 'hiring_manager']).default('recruiter'),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['owner', 'recruiter', 'hiring_manager']),
  status: z.enum(['active', 'invited', 'revoked']).optional(),
});
