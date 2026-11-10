# TALENTFLOW — PHASE 04: API INTEGRATION MATRIX

**Release:** Phase 04 — Frontend Integration & End-to-End ATS Workflows  
**Date:** November 10, 2026  
**Auditor:** Senior Full-Stack Engineer & QA Architect  

---

| Feature | Frontend Page | Backend Endpoint | Method | Integration Status | Test Verification |
|:---|:---|:---|:---:|:---:|:---:|
| **Authentication: Login** | `/login` (`src/views/public/LoginPage.tsx`) | `/api/v1/auth/login` | `POST` | **Pass** | **Pass (Verified)** |
| **Authentication: Register** | `/register` (`src/views/public/RegisterPage.tsx`) | `/api/v1/auth/register` | `POST` | **Pass** | **Pass (Verified)** |
| **Authentication: Verify Session** | Global (`src/context/AuthContext.tsx`) | `/api/v1/auth/me` | `GET` | **Pass** | **Pass (Verified)** |
| **Authentication: Logout** | Dashboard Shell / Navigation | `/api/v1/auth/logout` | `POST` | **Pass** | **Pass (Verified)** |
| **Candidate: Job Discovery** | `/candidate/jobs` (`src/views/candidate/BrowseJobsPage.tsx`) | `/api/v1/jobs` | `GET` | **Pass** | **Pass (Verified)** |
| **Candidate: Job Details** | `/candidate/jobs/[id]` (`src/views/candidate/CandidateJobDetailsPage.tsx`) | `/api/v1/jobs/:id` | `GET` | **Pass** | **Pass (Verified)** |
| **Candidate: Apply to Job** | `/candidate/apply/[id]` (`src/views/candidate/CandidateApplyPage.tsx`) | `/api/v1/jobs/:jobId/applications` | `POST` | **Pass** | **Pass (Verified)** |
| **Candidate: Application History** | `/candidate/applications` (`src/views/candidate/CandidateApplicationsPage.tsx`) | `/api/v1/applications/me` | `GET` | **Pass** | **Pass (Verified)** |
| **Candidate: Application Withdrawal** | `/candidate/applications` (`src/views/candidate/CandidateApplicationsPage.tsx`) | `/api/v1/applications/:id/withdraw` | `PATCH` | **Pass** | **Pass (Verified)** |
| **Candidate: Profile & Credentials** | `/candidate/profile` (`src/views/candidate/CandidateProfilePage.tsx`) | `/api/v1/candidates/me` | `GET` & `PATCH` | **Pass** | **Pass (Verified)** |
| **Recruiter: Command Center** | `/recruiter/dashboard` (`src/views/recruiter/RecruiterDashboardPage.tsx`) | `/api/v1/companies`, `/api/v1/jobs` | `GET` | **Pass** | **Pass (Verified)** |
| **Recruiter: Requisition Directory** | `/recruiter/jobs` (`src/views/recruiter/RecruiterJobsPage.tsx`) | `/api/v1/jobs` | `GET` | **Pass** | **Pass (Verified)** |
| **Recruiter: Job Lifecycle (Publish)** | `/recruiter/jobs` (`src/views/recruiter/RecruiterJobsPage.tsx`) | `/api/v1/jobs/:id/publish` | `PATCH` | **Pass** | **Pass (Verified)** |
| **Recruiter: Job Lifecycle (Pause)** | `/recruiter/jobs` (`src/views/recruiter/RecruiterJobsPage.tsx`) | `/api/v1/jobs/:id/pause` | `PATCH` | **Pass** | **Pass (Verified)** |
| **Recruiter: Job Lifecycle (Close)** | `/recruiter/jobs` (`src/views/recruiter/RecruiterJobsPage.tsx`) | `/api/v1/jobs/:id/close` | `PATCH` | **Pass** | **Pass (Verified)** |
| **Recruiter: Pipeline Board** | `/recruiter/pipeline` (`src/views/recruiter/RecruiterPipelinePage.tsx`) | `/api/v1/applications/company/:id` | `GET` | **Pass** | **Pass (Verified)** |
| **Recruiter: Stage Progression** | `/recruiter/pipeline` (`src/views/recruiter/RecruiterPipelinePage.tsx`) | `/api/v1/applications/:id/status` | `PATCH` | **Pass** | **Pass (Verified)** |
| **Recruiter: Evaluation Notes** | `/recruiter/pipeline` (`src/views/recruiter/RecruiterPipelinePage.tsx`) | `/api/v1/applications/:id/notes` | `PATCH` | **Pass** | **Pass (Verified)** |
| **Company: Team & Members** | `/recruiter/settings` (`src/views/recruiter/RecruiterSettingsPage.tsx`) | `/api/v1/companies/:id/members` | `GET` | **Pass** | **Pass (Verified)** |
| **Company: Invitations** | `/recruiter/settings` (`src/views/recruiter/RecruiterSettingsPage.tsx`) | `/api/v1/companies/:id/invitations` | `POST` | **Pass** | **Pass (Verified)** |
