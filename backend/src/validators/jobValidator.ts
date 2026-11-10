import { z } from 'zod';

export const createJobSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  title: z.string().min(3, 'Job title must be at least 3 characters').max(180),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens only').optional(),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  location: z.string().min(2, 'Location is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).default('full-time'),
  workplaceType: z.enum(['remote', 'hybrid', 'on-site']).default('remote'),
  salaryRange: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      currency: z.string().default('USD'),
    })
    .optional(),
  skills: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'paused', 'closed', 'rejected']).default('draft'),
  applicationDeadline: z.string().datetime().optional().or(z.date().optional()),
});

export const updateJobSchema = createJobSchema.partial().omit({ companyId: true });

export const listJobsQuerySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'all']).optional(),
  workplaceType: z.enum(['remote', 'hybrid', 'on-site', 'all']).optional(),
  skills: z.string().optional(),
  companyId: z.string().optional(),
  status: z.enum(['draft', 'published', 'paused', 'closed', 'rejected', 'all']).optional(),
  page: z.string().regex(/^\d+$/).default('1'),
  limit: z.string().regex(/^\d+$/).default('20'),
});

