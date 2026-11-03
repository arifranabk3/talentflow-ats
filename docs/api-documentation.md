# API Specification & Integration Guide â€” talentflow-ats

## 1. Overview
The **talentflow-ats** API provides standard RESTful JSON interfaces for interacting with the platform's core domains.

- **Base URL:** https://api.talentflow-ats.domain.com/v1
- **Content-Type:** pplication/json
- **Standard Authentication:** Bearer Token (Authorization: Bearer <JWT>)

---

## 2. Authentication & Session Management

### 2.1 Authenticate User
`http
POST /v1/auth/login
`
**Request Body:**
`json
{
  "email": "developer@domain.com",
  "password": "SecurePassword123!"
}
`
**Response (200 OK):**
`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "c1f2b3e4-5678-90ab-cdef-1234567890ab",
    "email": "developer@domain.com",
    "role": "admin"
  }
}
`

---

## 3. Core Resource Endpoints

### 3.1 List All Records
`http
GET /v1/resources?page=1&limit=20&status=active
`
**Response (200 OK):**
`json
{
  "data": [
    {
      "id": "e4a1b2c3-d4e5-6789-0abc-def123456789",
      "name": "Sample Instance",
      "status": "active",
      "created_at": "2026-11-03T18:00:00Z"
    }
  ],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "total_pages": 8
  }
}
`

### 3.2 Create Resource
`http
POST /v1/resources
`
**Request Body:**
`json
{
  "name": "Production Entity",
  "status": "active",
  "config": {
    "retries": 3,
    "auto_sync": true
  }
}
`
**Response (201 Created):**
`json
{
  "success": true,
  "id": "e4a1b2c3-d4e5-6789-0abc-def123456789",
  "message": "Resource successfully instantiated."
}
`

### 3.3 Get Resource by ID
`http
GET /v1/resources/:id
`
**Response (200 OK):**
`json
{
  "id": "e4a1b2c3-d4e5-6789-0abc-def123456789",
  "name": "Production Entity",
  "status": "active",
  "created_at": "2026-11-03T18:00:00Z"
}
`

---

## 4. Error Code Conventions
All responses use standard HTTP status codes accompanied by detailed error structures:
`json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided configuration payload contains invalid keys.",
    "details": [
      { "field": "email", "issue": "Invalid format" }
    ]
  }
}
`
- 400 Bad Request â€” Missing or malformed parameters.
- 401 Unauthorized â€” Missing or invalid authentication token.
- 403 Forbidden â€” Insufficient role permissions.
- 404 Not Found â€” Requested entity does not exist.
- 429 Too Many Requests â€” Rate limit exceeded.
- 500 Internal Error â€” Server-side exception.
