# Backend Architecture: FloodGuard AI

This document outlines the backend architecture for the FloodGuard AI platform, engineered to support high concurrency (100K+ users), complex AI workloads, and real-time geospatial processing using a modern Python async stack.

## 1. Architecture Overview

```mermaid
graph TD
    subgraph "API Layer (FastAPI)"
        Routers[Routers & Endpoints]
        Middlewares[Middlewares]
        Validation[Pydantic Validation]
    end

    subgraph "Service Layer"
        BusinessLogic[Business Logic]
        Cache[Redis Caching]
        TaskDispatch[Celery Task Dispatch]
    end

    subgraph "Data Access Layer"
        Repos[Repositories]
        SQLAlchemy[SQLAlchemy 2.0 Async]
    end

    subgraph "Infrastructure"
        DB[(PostgreSQL + PostGIS)]
        Redis[(Redis)]
        Workers[Celery Workers]
        AIModels[AI Inference Engine]
    end

    Routers --> Service Layer
    Service Layer --> Data Access Layer
    Data Access Layer --> DB
    
    Service Layer --> Cache
    Cache --> Redis
    
    Service Layer --> TaskDispatch
    TaskDispatch --> Workers
    Workers --> AIModels
    Workers --> DB
```

The system employs a **Modular Monolith** pattern with strict logical boundaries, utilizing a layered architecture: Router → Service → Repository → Model.

## 2. FastAPI Application Structure

- **App Factory:** A robust `create_app()` factory function initializes the application, allowing for flexible testing and environment configurations.
- **Lifespan Events:** Async context managers handle startup (initializing DB connection pools, warming up Redis, loading lightweight ML models) and graceful shutdown (closing connections, cleaning up tasks).
- **Middleware Stack:** Requests pass through CORS → Rate Limiter → Authentication → Correlation ID Injection → Structured Logging.
- **Dependency Injection:** Extensive use of `FastAPI.Depends` for injecting database sessions, current user contexts, and service instances.
- **Exception Handlers:** Standardized global handlers convert domain exceptions into consistent RFC 7807 problem details JSON responses.

## 3. API Layer

- **Router Organization:** Segmented into modules (`APIRouter` per feature) and versioned under `/api/v1/`.
- **Validation:** Strict I/O validation using Pydantic v2 models.
- **Serialization:** Responses are wrapped in a standard envelope (e.g., `{"data": {...}, "meta": {...}}`).
- **Pagination:** Cursor-based pagination utilized for high-performance listing of large datasets (like historical reports).
- **File Uploads:** Managed via multipart parsing, streaming directly to S3-compatible blob storage to prevent memory exhaustion on large image/video uploads.

## 4. Service Layer

- **Business Logic Isolation:** Controllers (Routers) contain zero business logic. All rules reside in the Service layer.
- **Modular Communication:** Services interact via direct imports currently, structured to allow easy extraction into microservices if needed via event buses.
- **Transactions:** Handled via async context managers wrapping SQLAlchemy sessions to guarantee atomicity.
- **Caching:** A custom decorator pattern over Redis handles caching for expensive queries, with robust tag-based invalidation strategies.

## 5. Repository / Data Access Layer

- **SQLAlchemy 2.0:** Fully asynchronous ORM usage.
- **Repository Pattern:** A generic `BaseRepository[Model]` provides standard CRUD operations, extended by specific repositories (e.g., `UserRepository`, `FloodReportRepository`).
- **Spatial Queries:** Custom query builders leverage PostGIS functions for radius searches, bounding box intersections, and spatial joins.
- **Connection Pooling:** `asyncpg` manages connection pooling, tuned for high concurrency.
- **Read/Write Splitting:** Architecture is designed with separate read and write DB sessions to support future database replication.

## 6. Database Integration

- **PostgreSQL 16 + PostGIS:** The core relational and spatial engine.
- **Models:** Declarative base definitions using `geoalchemy2` for mapping PostGIS geometry/geography types.
- **Migrations:** `Alembic` manages schema changes, integrated into the CI/CD pipeline.
- **Seeding:** Python scripts for populating initial administrative data and sample geometries.

## 7. Async Task Architecture (Celery)

Background processing is handled by Celery 5.

- **Queues:** Tasks are routed to specific queues based on resource needs: `ai_queue` (GPU bound), `notification_queue` (I/O bound), `data_queue` (CPU bound).
- **Task Categories:** AI inference, external API polling, report generation, and automated database cleanup.
- **Reliability:** Strict retry policies with exponential backoff and a Dead Letter Queue (DLQ) for failed tasks.
- **Periodic Tasks (Celery Beat):** 
  - Weather API sync (every 15 mins)
  - Flood risk model recalculation (hourly)
  - Stale data archival (daily)
- **Monitoring:** Managed via the Flower dashboard.

## 8. WebSocket Architecture

- **Endpoints:** Native FastAPI WebSocket support.
- **Connection Manager:** In-memory tracking of active connections linked to user IDs and session metadata.
- **Channels/Rooms:** Users subscribe to specific channels (e.g., `city:mumbai`, `zone:andheri_east`, `user:123`).
- **Scaling:** Redis Pub/Sub acts as the backplane to broadcast messages across multiple Uvicorn worker instances.
- **Resilience:** Implements server-side heartbeats (ping/pong) to drop dead connections.

## 9. AI Model Integration

- **Lifecycle:** Models are loaded during the FastAPI lifespan event. Large models may be lazy-loaded on first request.
- **Abstraction:** An `InferenceService` interface decouples the application from specific model implementations (PyTorch/TensorFlow).
- **Batching:** The service supports batch inference to optimize GPU utilization for bulk processing.
- **Fallbacks:** In case of GPU unavailability or memory limits, models gracefully degrade to CPU inference or return cached fallback estimates.

## 10. External Integration Layer

- **Adapter Pattern:** External services are wrapped in adapter classes to standardize interfaces and mock them during testing.
- **Weather APIs:** Integrations with IMD / OpenWeatherMap.
- **Mapping:** Mapbox API for routing and reverse geocoding.
- **Communications:** 
  - SMS: Twilio / MSG91 (India)
  - Email: AWS SES
  - Push: Firebase Cloud Messaging (FCM)
- **Rate Limiting:** Outbound requests are throttled using Redis to respect third-party API limits.

## 11. Security Implementation

- **Authentication:** JWT tokens via `python-jose`. Passwords hashed with `bcrypt`.
- **Authorization:** Custom RBAC (Role-Based Access Control) dependency injected into route handlers.
- **Injection Prevention:** Strict use of parameterized queries via SQLAlchemy; no raw string interpolation.
- **Upload Validation:** Strict MIME type checking, size limits, and asynchronous malware scanning for uploaded media.
- **Rate Limiting:** Redis-based sliding window algorithm protects login, registration, and reporting endpoints from abuse.

## 12. Observability

- **Logging:** `structlog` for structured, JSON-formatted logs easily ingestible by ELK/Datadog.
- **Tracing:** Correlation IDs generated at the edge (or by FastAPI middleware) are propagated through logs and Celery tasks.
- **Metrics:** A `/metrics` endpoint exposes Prometheus data (request duration, error rates, active WS connections).
- **Health Checks:** `/health` (liveness) and `/ready` (readiness, checking DB/Redis connectivity) endpoints for Kubernetes probes.

## 13. Configuration Management

- **Pydantic Settings:** Strongly typed configuration management loading from `.env` files and environment variables.
- **Environments:** Distinct configurations for `dev`, `staging`, and `prod`.
- **Secrets:** Integration ready for pulling sensitive credentials from AWS Secrets Manager at startup.
- **Feature Flags:** Simple boolean toggles in the config to enable/disable specific modules dynamically.

## 14. Testing Strategy

- **Framework:** `pytest` combined with `pytest-asyncio`.
- **Database:** Ephemeral PostgreSQL containers (via Docker) used for integration testing.
- **Fixtures:** `factory_boy` generates reproducible, complex object graphs for tests.
- **API Tests:** `httpx.AsyncClient` simulates requests against the FastAPI app.
- **Mocking:** External integrations (Weather, SMS) are strictly mocked using `unittest.mock`.
- **Targets:** 80%+ line coverage enforced by CI.
- **Load Testing:** `Locust` scripts defined to simulate traffic spikes (e.g., mass reporting during an event).
