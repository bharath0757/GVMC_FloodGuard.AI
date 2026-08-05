# API Specification

## 1. API Conventions

- **Base URL:** `/api/v1/`
- **Authentication:** Bearer JWT tokens in the `Authorization` header.
- **Content Type:** `application/json` (except for multipart file uploads).
- **Pagination:**
  - Cursor-based (`?limit=50&cursor=XYZ`) for high-volume endpoints (e.g., reports, telemetry).
  - Offset-based (`?page=1&size=20`) for administrative lists.
- **Filtering:** Query parameters using operators (e.g., `?severity=high`, `?created_at__gt=2023-01-01`).
- **Sorting:** `?sort=field` (ascending) or `?sort=-field` (descending).
- **Response Envelope:**
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "pagination": { ... } },
    "errors": null
  }
  ```
- **Error Format:**
  ```json
  {
    "success": false,
    "data": null,
    "meta": null,
    "errors": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": [{ "field": "email", "issue": "Invalid format" }]
    }
  }
  ```
- **Rate Limits (Default):**
  - Citizen: 100 req/min
  - Gov Officer: 500 req/min
  - Admin: 1000 req/min
- **Spatial Data:** Returns standard GeoJSON format for geometry fields.

---

## 2. Endpoint Groups

### Auth

Authentication and session management.

- **`POST /auth/register`**
  - **Desc:** Register a new citizen account.
  - **Auth:** None
  - **Body:** `{ "email": "user@example.com", "password": "...", "full_name": "John Doe", "phone": "+1234567890" }`
- **`POST /auth/login`**
  - **Desc:** Authenticate and receive tokens.
  - **Auth:** None
  - **Body:** `{ "email": "user@example.com", "password": "..." }`
  - **Response:** `{ "access_token": "jwt...", "refresh_token": "jwt...", "user": {...} }`
- **`POST /auth/refresh`**
  - **Desc:** Get a new access token using a refresh token.
  - **Auth:** None
  - **Body:** `{ "refresh_token": "..." }`
- **`POST /auth/logout`**
  - **Desc:** Invalidate the current session.
  - **Auth:** Bearer
- **`POST /auth/forgot-password`** / **`POST /auth/verify-email`**
  - **Desc:** Account recovery and verification flows.
- **`GET /auth/me`**
  - **Desc:** Get current authenticated user profile and permissions.
  - **Auth:** Bearer

### Users

User profile and location management.

- **`GET /users/profile`** | **`PATCH /users/profile`**
  - **Desc:** Manage own profile data.
  - **Auth:** Bearer
- **`PATCH /users/location`**
  - **Desc:** Update user's last known background location (for targeted alerts).
  - **Auth:** Bearer
  - **Body:** `{ "lat": 12.97, "lng": 77.59 }`
- **`GET /users/{id}`** | **`GET /users`** | **`PATCH /users/{id}/role`**
  - **Desc:** Administrative user management.
  - **Auth:** Bearer (Admin only)

### Flood Risk (AI Risk Scoring)

Core risk assessment endpoints.

- **`GET /flood-risk/zones`**
  - **Desc:** List defined flood zones.
  - **Params:** `city_id`, `risk_level`
- **`GET /flood-risk/zones/{id}`**
  - **Desc:** Detailed zone geometry and metrics.
- **`GET /flood-risk/scores`**
  - **Desc:** Get current AI risk scores.
  - **Params:** `zone_id`, `city_id`
  - **Response:** `{ "data": [{ "zone_id": "...", "overall_score": 85, "terrain_score": 90, ... }] }`
- **`GET /flood-risk/heatmap`**
  - **Desc:** Get GeoJSON heatmap data for rendering on maps.
  - **Params:** `city_id`, `bbox`
- **`POST /flood-risk/calculate`**
  - **Desc:** Manually trigger a recalculation of risk scores.
  - **Auth:** Bearer (Admin/Gov)

### Predictions (Street Prediction)

Time-series forecasting.

- **`GET /predictions`**
  - **Desc:** Get forecasted water levels.
  - **Params:** `zone_id`, `horizon` (hours)
- **`GET /predictions/street-level`**
  - **Desc:** Get granular predictions for a specific coordinate radius.
  - **Params:** `lat`, `lng`, `radius`
- **`GET /predictions/timeline`**
  - **Desc:** Get historical and future forecast timeline for a zone.
  - **Params:** `zone_id`

### Evacuation (Evacuation Routing)

Safe pathfinding.

- **`POST /evacuation/route`**
  - **Desc:** Calculate safest route to a destination or nearest shelter.
  - **Body:** `{ "origin": {"lat": X, "lng": Y}, "preferences": ["wheelchair_accessible"] }`
  - **Response:** GeoJSON LineString with turn-by-turn and risk warnings.
- **`GET /evacuation/routes/active`**
  - **Desc:** Get pre-computed major evacuation corridors for a zone.
  - **Params:** `zone_id`
- **`GET /evacuation/nearby-shelters`**
  - **Desc:** Find closest shelters with availability.
  - **Params:** `lat`, `lng`, `radius`

### Shelters (Shelter Engine)

Resource and capacity management.

- **`GET /shelters`**
  - **Desc:** List shelters.
  - **Params:** `city_id`, `available` (bool)
- **`GET /shelters/{id}`**
  - **Desc:** Shelter details.
- **`POST /shelters`**
  - **Desc:** Create a new shelter location.
  - **Auth:** Bearer (Gov)
- **`PATCH /shelters/{id}/occupancy`**
  - **Desc:** Update current headcount.
  - **Auth:** Bearer (Gov)
- **`GET /shelters/nearest`**
  - **Desc:** Find nearest matching specific needs.
  - **Params:** `lat`, `lng`, `needs`

### Crowd Reports (YOLOv11+BLIP-2)

Citizen science and reporting.

- **`POST /reports`**
  - **Desc:** Submit a hazard report. Triggers background AI analysis.
  - **Content-Type:** `multipart/form-data`
  - **Body:** `image` (file), `lat`, `lng`, `description`, `title`
- **`GET /reports`**
  - **Desc:** List reports.
  - **Params:** `zone_id`, `status`, `severity`
- **`GET /reports/{id}`**
  - **Desc:** Get specific report details including AI analysis results.
- **`POST /reports/{id}/verify`**
  - **Desc:** Officer verification of a report.
  - **Auth:** Bearer (Gov)
- **`POST /reports/{id}/upvote`**
  - **Desc:** Citizen upvote/validation.
- **`GET /reports/heatmap`**
  - **Desc:** Density map of recent reports.
  - **Params:** `bbox`

### Voice (Whisper Assistant)

Accessibility and natural language interaction.

- **`POST /voice/query`**
  - **Desc:** Process voice command (e.g., "Where is the nearest shelter?").
  - **Content-Type:** `multipart/form-data`
  - **Body:** `audio` (file), `language` (code)
  - **Response:** Text response, structured action data, and synthesized audio URL.
- **`POST /voice/transcribe`**
  - **Desc:** Simple Speech-to-Text for form filling.

### Dashboard (Gov Dashboard)

Aggregated views for officials.

- **`GET /dashboard/overview`**
  - **Desc:** High-level metrics (total affected, active alerts, shelter capacity).
  - **Params:** `city_id`
  - **Auth:** Bearer (Gov)
- **`GET /dashboard/real-time`**
  - **Desc:** Stream of real-time events (new reports, severe weather).
- **`GET /dashboard/resources`**
  - **Desc:** Availability of rescue teams, pumps, etc.
- **`POST /dashboard/alerts`**
  - **Desc:** Issue a new mass alert (push/sms).
  - **Body:** `{ "zone_ids": [...], "type": "evacuation", "message": "..." }`
- **`GET /dashboard/reports/export`**
  - **Desc:** Generate CSV/PDF report of incident data.

### Digital Twin

Simulation and modeling data.

- **`GET /digital-twin/terrain`**
  - **Desc:** Fetch elevation grid data for 3D rendering.
  - **Params:** `city_id`
- **`GET /digital-twin/buildings`**
  - **Desc:** Fetch building footprints.
  - **Params:** `bbox`
- **`POST /digital-twin/simulate`**
  - **Desc:** Trigger a new hydrologic simulation run (asynchronous).
  - **Body:** `{ "city_id": "...", "rainfall_intensity": 150, "duration": 4 }`
- **`GET /digital-twin/simulations/{id}`**
  - **Desc:** Check status and retrieve results of a simulation.

### Analytics (Historical)

Long-term data trends.

- **`GET /analytics/historical`**
  - **Desc:** Query past flood events.
  - **Params:** `city_id`, `from`, `to`
- **`GET /analytics/trends`**
  - **Desc:** Risk progression over time for a zone.
  - **Params:** `zone_id`
- **`GET /analytics/seasonal`**
  - **Desc:** Seasonality analysis of flooding.
  - **Params:** `city_id`
- **`GET /analytics/ward-comparison`**
  - **Desc:** Comparative metrics across wards.

### Weather

Meteorological integration.

- **`GET /weather/current`**
  - **Desc:** Current localized weather conditions.
  - **Params:** `city_id`
- **`GET /weather/forecast`**
  - **Desc:** Short/medium term weather forecast.
  - **Params:** `city_id`, `hours`
- **`GET /weather/alerts`**
  - **Desc:** Active warnings from meteorological agencies.
  - **Params:** `city_id`
- **`GET /weather/rainfall-map`**
  - **Desc:** Spatial precipitation data.
  - **Params:** `bbox`

### Admin

System configuration and monitoring.

- **`GET /admin/stats`** | **`GET /admin/users`** | **`PATCH /admin/users/{id}`**
  - **Desc:** Platform metrics and user management.
  - **Auth:** Bearer (Admin)
- **`GET /admin/system-health`**
  - **Desc:** Check status of DB, Redis, Celery workers, external APIs.
- **`POST /admin/maintenance`**
  - **Desc:** Toggle system maintenance mode.
