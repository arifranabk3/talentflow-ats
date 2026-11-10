import { apiClient } from './client';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  status: 'active' | 'suspended' | 'pending';
}

export interface CompanyDto {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  createdBy?: any;
  createdAt: string;
}

export interface CompanyMemberDto {
  _id: string;
  companyId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  role: 'owner' | 'recruiter' | 'hiring_manager';
  status: 'active' | 'invited' | 'revoked';
}

export interface JobDto {
  _id: string;
  companyId: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    location?: string;
    website?: string;
  } | string;
  createdBy: string;
  title: string;
  slug: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  workplaceType: 'remote' | 'hybrid' | 'on-site';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  status: 'draft' | 'published' | 'paused' | 'closed' | 'rejected';
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfileDto {
  _id?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  headline?: string;
  summary?: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience?: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    graduationYear?: number;
  }>;
  portfolioUrl?: string;
  linkedinUrl?: string;
}

export interface ApplicationDto {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    slug: string;
    location: string;
    employmentType: string;
    workplaceType: string;
    status: string;
  };
  candidateId: {
    _id: string;
    name: string;
    email: string;
  };
  companyId: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    location?: string;
  };
  resumeId?: {
    _id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  };
  coverLetter?: string;
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  recruiterNotes?: string;
  appliedAt: string;
}

// -------------------------------------------------------------
// AUTH API
// -------------------------------------------------------------
export const authApi = {
  register: async (payload: { name: string; email: string; password: string; role?: string }) => {
    const res = await apiClient.post<ApiResponse<{ user: UserDto; token: string }>>('/auth/register', payload);
    return res.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<{ user: UserDto; token: string }>>('/auth/login', payload);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get<ApiResponse<UserDto>>('/auth/me');
    return res.data;
  },
  logout: async () => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },
};

// -------------------------------------------------------------
// COMPANIES API
// -------------------------------------------------------------
export const companiesApi = {
  list: async (params?: { search?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get<ApiResponse<{ companies: CompanyDto[]; pagination: any }>>('/companies', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ company: CompanyDto; openJobsCount: number }>>(`/companies/${id}`);
    return res.data;
  },
  create: async (data: Partial<CompanyDto>) => {
    const res = await apiClient.post<ApiResponse<CompanyDto>>('/companies', data);
    return res.data;
  },
  update: async (id: string, data: Partial<CompanyDto>) => {
    const res = await apiClient.patch<ApiResponse<CompanyDto>>(`/companies/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ companyId: string; status: string }>>(`/companies/${id}`);
    return res.data;
  },
  listMembers: async (companyId: string) => {
    const res = await apiClient.get<ApiResponse<{ members: CompanyMemberDto[]; count: number }>>(`/companies/${companyId}/members`);
    return res.data;
  },
  inviteMember: async (companyId: string, payload: { email: string; role: string }) => {
    const res = await apiClient.post<ApiResponse<CompanyMemberDto>>(`/companies/${companyId}/invitations`, payload);
    return res.data;
  },
  updateMember: async (companyId: string, memberId: string, payload: { role?: string; status?: string }) => {
    const res = await apiClient.patch<ApiResponse<CompanyMemberDto>>(`/companies/${companyId}/members/${memberId}`, payload);
    return res.data;
  },
  removeMember: async (companyId: string, memberId: string) => {
    const res = await apiClient.delete<ApiResponse<{ memberId: string; status: string }>>(`/companies/${companyId}/members/${memberId}`);
    return res.data;
  },
};

// -------------------------------------------------------------
// JOBS API
// -------------------------------------------------------------
export const jobsApi = {
  list: async (params?: {
    search?: string;
    location?: string;
    employmentType?: string;
    workplaceType?: string;
    skills?: string;
    companyId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await apiClient.get<ApiResponse<{ jobs: JobDto[]; pagination: any }>>('/jobs', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<JobDto>>(`/jobs/${id}`);
    return res.data;
  },
  create: async (data: Partial<JobDto>) => {
    const res = await apiClient.post<ApiResponse<JobDto>>('/jobs', data);
    return res.data;
  },
  update: async (id: string, data: Partial<JobDto>) => {
    const res = await apiClient.patch<ApiResponse<JobDto>>(`/jobs/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ jobId: string; deleted?: boolean; status?: string }>>(`/jobs/${id}`);
    return res.data;
  },
  publish: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<JobDto>>(`/jobs/${id}/publish`);
    return res.data;
  },
  pause: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<JobDto>>(`/jobs/${id}/pause`);
    return res.data;
  },
  close: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<JobDto>>(`/jobs/${id}/close`);
    return res.data;
  },
  apply: async (jobId: string, payload: { resumeId?: string; coverLetter?: string }) => {
    const res = await apiClient.post<ApiResponse<ApplicationDto>>(`/jobs/${jobId}/applications`, payload);
    return res.data;
  },
};

// -------------------------------------------------------------
// CANDIDATES API
// -------------------------------------------------------------
export const candidatesApi = {
  getMyProfile: async () => {
    const res = await apiClient.get<ApiResponse<CandidateProfileDto>>('/candidates/me');
    return res.data;
  },
  updateMyProfile: async (data: Partial<CandidateProfileDto>) => {
    const res = await apiClient.patch<ApiResponse<CandidateProfileDto>>('/candidates/me', data);
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<CandidateProfileDto>>(`/candidates/${id}`);
    return res.data;
  },
};

// -------------------------------------------------------------
// APPLICATIONS API
// -------------------------------------------------------------
export const applicationsApi = {
  getMyApplications: async () => {
    const res = await apiClient.get<ApiResponse<{ applications: ApplicationDto[]; count: number }>>('/applications/me');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<ApplicationDto>>(`/applications/${id}`);
    return res.data;
  },
  withdraw: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<ApplicationDto>>(`/applications/${id}/withdraw`);
    return res.data;
  },
  getCompanyApplications: async (companyId: string, params?: { status?: string; jobId?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get<ApiResponse<{ applications: ApplicationDto[]; pagination: any }>>(`/applications/company/${companyId}`, {
      params,
    });
    return res.data;
  },
  updateStatus: async (id: string, payload: { status: string; reason?: string }) => {
    const res = await apiClient.patch<ApiResponse<ApplicationDto>>(`/applications/${id}/status`, payload);
    return res.data;
  },
  updateNotes: async (id: string, payload: { recruiterNotes: string }) => {
    const res = await apiClient.patch<ApiResponse<ApplicationDto>>(`/applications/${id}/notes`, payload);
    return res.data;
  },
};
