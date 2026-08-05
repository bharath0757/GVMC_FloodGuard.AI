# HackYatra Platform - REST API Specification

**Version:** 1.0.0
**Base URL:** `https://api.hackyatra.com/api/v1`
**Backend Tech Stack:** Python / FastAPI
**Scale Target:** 100K+ Concurrent Users

---

## 1. Global Conventions

### 1.1 Authentication & Authorization

HackYatra uses stateless JWT (JSON Web Tokens) for authentication.

- **Header:** `Authorization: Bearer <token>`
- **Roles:** `public`, `student`, `mentor`, `gvmc_official`, `admin`

### 1.2 Pagination

List endpoints implement cursor-based pagination for high performance at scale.

- **Query Params:** `?limit=50&cursor=eyJpZCI6MTIzfQ==`
- **Response format:** Includes a `next_cursor` string.

### 1.3 Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [{ "field": "email", "issue": "Must be a valid .edu address" }]
  }
}
```

### 1.4 Rate Limiting

Implemented via Redis cell rate-limiting. Standard headers included in responses:
`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 2. API Modules

### 2.1 Auth API

Manages user identity, registration, and session tokens.

| Method | Endpoint                 | Description                   | Auth                | Rate Limit |
| :----- | :----------------------- | :---------------------------- | :------------------ | :--------- |
| POST   | `/auth/register`         | Register a new user           | Public              | 5/hr       |
| POST   | `/auth/login`            | Authenticate and retrieve JWT | Public              | 10/min     |
| POST   | `/auth/refresh`          | Refresh an expired JWT        | Valid Refresh Token | 5/min      |
| POST   | `/auth/logout`           | Invalidate current session    | Authenticated       | 10/min     |
| POST   | `/auth/password-reset`   | Request password reset link   | Public              | 3/hr       |
| GET    | `/auth/oauth/{provider}` | OAuth2 login (Google/GitHub)  | Public              | 10/min     |

**Example: `POST /auth/login`**

- **Request Body:** `{"email": "user@example.com", "password": "secure_password"}`
- **Success Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbG...",
    "refresh_token": "def456...",
    "expires_in": 3600
  }
  ```
- **Error Codes:** `401 UNAUTHORIZED`, `400 BAD_REQUEST`, `429 TOO_MANY_REQUESTS`

### 2.2 Users API

Manages user profiles, skills, and avatars.

| Method | Endpoint           | Description                      | Auth          | Rate Limit |
| :----- | :----------------- | :------------------------------- | :------------ | :--------- |
| GET    | `/users/me`        | Get current user profile         | Authenticated | 60/min     |
| PUT    | `/users/me`        | Update profile data & skill tags | Authenticated | 20/min     |
| POST   | `/users/me/avatar` | Upload profile avatar            | Authenticated | 5/hr       |
| GET    | `/users`           | Search users by skills/college   | Authenticated | 30/min     |

**Example: `GET /users?skills=python&role=student`**

- **Success Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "u_123",
        "name": "Jane Doe",
        "skills": ["python", "fastapi"],
        "reputation": 450
      }
    ],
    "next_cursor": "cXdlcnR5"
  }
  ```

### 2.3 Problems API (GVMC Challenges)

Endpoints for managing and discovering civic problems posted by GVMC.

| Method | Endpoint                | Description                              | Auth            | Rate Limit |
| :----- | :---------------------- | :--------------------------------------- | :-------------- | :--------- |
| GET    | `/problems`             | List problems (filter by category, ward) | Public          | 100/min    |
| POST   | `/problems`             | Create a new challenge                   | `gvmc_official` | 10/hr      |
| GET    | `/problems/{id}`        | Get challenge details                    | Public          | 100/min    |
| PATCH  | `/problems/{id}/status` | Update problem status (open/closed)      | `gvmc_official` | 10/min     |

**Example: `POST /problems`**

- **Request Body:**
  ```json
  {
    "title": "Smart Waste Management",
    "description": "Optimize garbage truck routing...",
    "category": "Sanitation",
    "ward_number": 12,
    "deadline": "2026-12-01T00:00:00Z"
  }
  ```

### 2.4 Teams API

Team formation, invitations, and management.

| Method | Endpoint                    | Description                 | Auth          | Rate Limit |
| :----- | :-------------------------- | :-------------------------- | :------------ | :--------- |
| POST   | `/teams`                    | Create a new team           | `student`     | 5/day      |
| GET    | `/teams/{id}`               | Get team details & members  | Authenticated | 60/min     |
| POST   | `/teams/{id}/invites`       | Invite user to team         | Team Leader   | 20/day     |
| POST   | `/teams/{id}/join`          | Request to join a team      | `student`     | 10/day     |
| DELETE | `/teams/{id}/members/{uid}` | Remove member or leave team | Auth / Leader | 5/day      |

### 2.5 Solutions API

Submission and tracking of project solutions.

| Method | Endpoint                | Description                     | Auth          | Rate Limit |
| :----- | :---------------------- | :------------------------------ | :------------ | :--------- |
| POST   | `/solutions`            | Submit a new solution           | `student`     | 5/day      |
| PUT    | `/solutions/{id}`       | Update existing solution        | Team Member   | 20/day     |
| GET    | `/solutions/{id}`       | View solution details           | Authenticated | 100/min    |
| POST   | `/solutions/{id}/files` | Link uploaded demo/presentation | Team Member   | 10/min     |

**Example: `POST /solutions`**

- **Request Body:** `{"problem_id": "p_456", "team_id": "t_789", "github_repo": "https://...", "abstract": "..."}`

### 2.6 Evaluations API

Judging system for GVMC officials and assigned mentors.

| Method | Endpoint                | Description                     | Auth            | Rate Limit |
| :----- | :---------------------- | :------------------------------ | :-------------- | :--------- |
| POST   | `/evaluations/assign`   | Assign judges to a solution     | `admin`         | 50/min     |
| POST   | `/evaluations/{sol_id}` | Submit rubric scores & feedback | `judge`         | 30/min     |
| GET    | `/evaluations/results`  | View aggregated solution scores | `admin`/`judge` | 30/min     |

### 2.7 Mentorship API

Connecting students with industry/government mentors.

| Method | Endpoint                    | Description                  | Auth          | Rate Limit |
| :----- | :-------------------------- | :--------------------------- | :------------ | :--------- |
| POST   | `/mentorship/requests`      | Request a mentor session     | `student`     | 3/day      |
| GET    | `/mentorship/sessions`      | List scheduled sessions      | Authenticated | 30/min     |
| POST   | `/mentorship/{id}/feedback` | Submit post-session feedback | Authenticated | 10/day     |

### 2.8 Milestones API

Stage-gated progress tracking for ongoing hackathon projects.

| Method | Endpoint                    | Description                    | Auth             | Rate Limit |
| :----- | :-------------------------- | :----------------------------- | :--------------- | :--------- |
| GET    | `/milestones/{team_id}`     | View team's milestone progress | Authenticated    | 60/min     |
| POST   | `/milestones/{id}/progress` | Update completion status       | Team Member      | 20/day     |
| PATCH  | `/milestones/{id}/approve`  | Approve milestone              | `mentor`/`judge` | 50/min     |

### 2.9 Leaderboard API

Gamification, rankings, and achievements.

| Method | Endpoint                  | Description                   | Auth   | Rate Limit |
| :----- | :------------------------ | :---------------------------- | :----- | :--------- |
| GET    | `/leaderboard/users`      | Top contributors by points    | Public | 120/min    |
| GET    | `/leaderboard/teams`      | Top teams by problem category | Public | 120/min    |
| GET    | `/achievements/{user_id}` | List badges and certificates  | Public | 60/min     |

### 2.10 Discussions API

Forum threads for problem statements and platform support.

| Method | Endpoint                     | Description                    | Auth          | Rate Limit |
| :----- | :--------------------------- | :----------------------------- | :------------ | :--------- |
| POST   | `/discussions/threads`       | Create a new discussion thread | Authenticated | 20/hr      |
| GET    | `/discussions/threads/{id}`  | Get thread and comments        | Public        | 100/min    |
| POST   | `/discussions/{id}/comments` | Add a comment                  | Authenticated | 60/hr      |
| POST   | `/discussions/{id}/upvote`   | Upvote a thread/comment        | Authenticated | 100/hr     |

### 2.11 Notifications API

In-app and push notification management.

| Method | Endpoint                     | Description                | Auth          | Rate Limit |
| :----- | :--------------------------- | :------------------------- | :------------ | :--------- |
| GET    | `/notifications`             | List user's notifications  | Authenticated | 60/min     |
| PATCH  | `/notifications/{id}/read`   | Mark notification as read  | Authenticated | 100/min    |
| PUT    | `/notifications/preferences` | Update email/push settings | Authenticated | 10/min     |

### 2.12 Admin API

Platform governance and analytics.

| Method | Endpoint              | Description                      | Auth    | Rate Limit |
| :----- | :-------------------- | :------------------------------- | :------ | :--------- |
| GET    | `/admin/stats`        | Platform usage and metrics       | `admin` | 30/min     |
| GET    | `/admin/users`        | Manage/ban users                 | `admin` | 60/min     |
| DELETE | `/admin/content/{id}` | Moderation: remove toxic content | `admin` | 50/min     |

### 2.13 AI API

Smart matching and recommendation endpoints.

| Method | Endpoint                 | Description                           | Auth      | Rate Limit |
| :----- | :----------------------- | :------------------------------------ | :-------- | :--------- |
| POST   | `/ai/match-team`         | Get AI-suggested teammates            | `student` | 10/hr      |
| POST   | `/ai/recommend-problems` | Suggest GVMC problems based on skills | `student` | 10/hr      |
| POST   | `/ai/idea-generation`    | LLM-based brainstorming assistant     | `student` | 20/day     |

**Example: `POST /ai/match-team`**

- **Request Body:** `{"required_skills": ["react", "ui/ux"]}`
- **Success Response:**
  ```json
  {
    "matches": [
      {
        "user_id": "u_999",
        "match_score": 0.92,
        "reason": "Complementary skills and high availability"
      }
    ]
  }
  ```

### 2.14 File Upload API

Secure, scalable asset management via Cloud Storage (S3/GCS).

| Method | Endpoint                 | Description                        | Auth          | Rate Limit |
| :----- | :----------------------- | :--------------------------------- | :------------ | :--------- |
| POST   | `/uploads/presigned-url` | Request direct-to-cloud upload URL | Authenticated | 20/hr      |
| DELETE | `/uploads/{file_id}`     | Delete a user-owned file           | Authenticated | 30/hr      |

**Upload Flow:**

1. Client calls `POST /uploads/presigned-url` with `{"filename": "demo.mp4", "content_type": "video/mp4"}`
2. Server responds with `{"upload_url": "https://s3...", "file_id": "f_123"}`
3. Client uploads directly to the cloud bucket using the URL.
4. Client passes `file_id` to the Solutions or Users API.
