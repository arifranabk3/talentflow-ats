import { z } from 'zod';

export const applyJobSchema = z.object({
  resumeId: z.string().optional(),
  coverLetter: z.string().max(5000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['applied', 'screening', 'interview', 'offered', 'hired', 'rejected']),
  reason: z.string().max(1000).optional(),
});

export const updateApplicationNotesSchema = z.object({
  recruiterNotes: z.string().max(5000),
});
