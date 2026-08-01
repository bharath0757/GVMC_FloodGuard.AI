# Folder Structure - FloodGuard AI

This document details the standardized directory structure for the FloodGuard AI project.

## Frontend (React/Vite/TypeScript)

```text
frontend/
├── public/                 # Public assets (favicon, manifest.json)
├── src/
│   ├── app/                # App initialization, main providers, global router
│   ├── assets/             # Images, fonts, SVG icons
│   ├── components/         # Shared, reusable UI components
│   │   ├── ui/             # Shadcn UI primitives (buttons, dialogs)
│   │   ├── layout/         # App layouts, Sidebar, Navbar
│   │   ├── maps/           # MapboxGL wrapper components
│   │   ├── charts/         # Recharts / visualization components
│   │   └── forms/          # Form inputs and wrappers
│   ├── features/           # Domain-driven feature modules
│   │   ├── auth/
│   │   ├── flood-risk/
│   │   ├── prediction/
│   │   ├── evacuation/
│   │   ├── shelters/
│   │   ├── crowd-reports/
│   │   ├── voice-assistant/
│   │   ├── dashboard/
│   │   ├── digital-twin/
│   │   ├── analytics/
│   │   └── weather/
│   ├── hooks/              # Global custom React hooks
│   ├── lib/                # Utils, axios instances, constants
│   ├── stores/             # Global Zustand stores (Auth, MapState)
│   ├── types/              # Global TypeScript interfaces
│   └── styles/             # Global Tailwind and custom CSS
├── tests/                  # E2E and unit tests (Playwright/Vitest)
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Backend (FastAPI/Python)

```text
backend/
├── app/
│   ├── api/                # API route definitions
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── flood_risk.py
│   │       ├── predictions.py
│   │       ├── evacuation.py
│   │       ├── shelters.py
│   │       ├── crowd_reports.py
│   │       ├── voice.py
│   │       ├── dashboard.py
│   │       ├── digital_twin.py
│   │       ├── analytics.py
│   │       ├── weather.py
│   │       └── admin.py
│   ├── core/               # Settings, DB session, security, exceptions
│   ├── models/             # SQLAlchemy ORM definitions
│   ├── schemas/            # Pydantic validation schemas
│   ├── services/           # Core business logic (called by APIs and Tasks)
│   ├── ai/                 # AI Model integration and inference
│   │   ├── risk_scoring/
│   │   ├── prediction/
│   │   ├── evacuation/
│   │   ├── image_analysis/
│   │   ├── voice/
│   │   └── models/         # (Gitignored) downloaded model weights
│   ├── gis/                # PostGIS spatial utility functions
│   ├── tasks/              # Celery background workers
│   ├── websockets/         # WebSocket connection managers
│   ├── utils/              # Generic Python helpers
│   └── main.py             # FastAPI application setup
├── alembic/                # Database migration scripts
├── tests/                  # Pytest test suites
├── scripts/                # Utility scripts (seed data, admin tasks)
├── docker/                 # Dockerfiles and compose configs
├── .env.example
├── requirements.txt
├── pyproject.toml
└── Dockerfile
```

## Infrastructure & Automation

- **`infrastructure/`**: Contains Terraform scripts for AWS deployment, Nginx configurations, and Kubernetes manifests (for future scaling).
- **`.github/workflows/`**: CI/CD pipelines (Lint, Test, Build Docker, Deploy to ECS).
- **`docs/`**: Project documentation, Architecture Decision Records (ADRs), API specs.

## Naming Conventions & Rules

- **Folders & Files**: Use `kebab-case` for frontend features and components (except React components which use `PascalCase.tsx`). Use `snake_case` for Python backend files and directories.
- **Classes**: `PascalCase`.
- **Functions/Variables**: `camelCase` (Frontend), `snake_case` (Backend).

## Decision Guide: What Goes Where?

- **Is it a UI button?** -> `frontend/src/components/ui/`
- **Is it the Flood Risk Map logic?** -> `frontend/src/features/flood-risk/`
- **Is it database interaction?** -> `backend/app/services/`
- **Is it model inference (e.g., Whisper)?** -> `backend/app/ai/voice/`
- **Is it a slow background job?** -> `backend/app/tasks/`
