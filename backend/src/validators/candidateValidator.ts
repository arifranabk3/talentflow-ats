import { z } from 'zod';

export const updateCandidateProfileSchema = z.object({
  headline: z.string().max(200).optional(),
  summary: z.string().max(3000).optional(),
  phone: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  skills: z.array(z.string()).optional(),
  experience: z
    .array(
      z.object({
        title: z.string().min(1, 'Title is required'),
        company: z.string().min(1, 'Company is required'),
        startDate: z.string().or(z.date()),
        endDate: z.string().or(z.date()).optional(),
        current: z.boolean().default(false),
        description: z.string().max(2000).optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: z.string().min(1, 'Institution is required'),
        degree: z.string().min(1, 'Degree is required'),
        fieldOfStudy: z.string().optional(),
        graduationYear: z.number().int().min(1950).max(2100).optional(),
      })
    )
    .optional(),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
});

