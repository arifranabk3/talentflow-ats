export interface User {
  id: string;
  name: string;
  email: string;
  role: 'recruiter' | 'candidate' | 'admin';
  avatar: string;
  title?: string;
  companyName?: string;
}

export type JobStatus = 'published' | 'draft' | 'archived' | 'closed';
export type JobType = 'Full-time' | 'Contract' | 'Remote' | 'Part-time';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  experienceLevel: 'Entry' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive';
  salaryRange: string;
  salary?: string;
  status: JobStatus;
  applicantsCount: number;
  openingsCount: number;
  publishedAt: string;
  description: string;
  requirements: string[];
  skills: string[];
}

export type PipelineStage = 'sourced' | 'screening' | 'technical' | 'cultural' | 'offer' | 'hired' | 'rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentRole: string;
  role?: string;
  currentCompany: string;
  location: string;
  experienceYears: number;
  matchScore: number;
  skills: string[];
  stage: PipelineStage;
  appliedRole: string;
  appliedDate: string;
  avatar: string;
  rating: number;
  resumeUrl?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId?: string;
  candidateName?: string;
  candidateAvatar?: string;
  score?: number;
  companyName: string;
  appliedDate: string;
  appliedAt?: string;
  stage: PipelineStage;
  status: 'In Review' | 'Interview Scheduled' | 'Offer Extended' | 'Declined';
  nextStep?: string;
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  role: string;
  jobTitle?: string;
  date: string;
  time: string;
  scheduledTime?: string;
  interviewer?: string;
  interviewers: string[];
  type: 'Technical' | 'Screening' | 'Executive Presentation' | string;
  meetingLink: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}
