# HackYatra Coding Guidelines

This document outlines the coding standards, patterns, and best practices for the HackYatra project. Adhering to these guidelines ensures a cohesive, maintainable, and scalable codebase across our Next.js (TypeScript) frontend and Python (FastAPI) backend.

---

## 1. General Principles

### Clean Code Philosophy
Write code for humans first and machines second. Code should be readable, well-structured, and self-documenting. Use clear and descriptive names for variables, functions, classes, and modules.

### Core Principles
- **DRY (Don't Repeat Yourself):** Abstract shared logic into reusable functions, hooks, or components. Avoid copy-pasting.
- **SOLID:** Follow Object-Oriented design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) particularly in the backend and when structuring complex frontend services.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering. Write the simplest code that effectively solves the problem.

### Code Review Process
- All code must be reviewed by at least one other engineer before merging.
- Reviewers should focus on architecture, logic, readability, security, and performance.
- Automated checks (linting, formatting, tests) must pass before a review is requested.
- Feedback should be constructive, and authors should remain open to suggestions.

### Definition of Done (DoD)
A feature or bug fix is "Done" when:
- Code meets all acceptance criteria.
- Unit and integration tests are written and pass.
- Code has been peer-reviewed and approved.
- Documentation (API docs, READMEs) is updated.
- CI/CD pipeline builds and deploys successfully to the staging environment.
- The feature is manually verified in the staging environment.

---

## 2. Git Workflow

### Branching Strategy
We use a **Trunk-Based Development** approach with short-lived feature branches, complemented by environment branches (`main` for production, `staging` for pre-production).

### Branch Naming Conventions
Use descriptive, hyphen-separated names prefixed with the type of work:
- `feature/` - For new features (e.g., `feature/user-auth`)
- `bugfix/` - For bug fixes (e.g., `bugfix/login-crash`)
- `hotfix/` - For critical production fixes (e.g., `hotfix/payment-gateway-timeout`)
- `chore/` - For maintenance, dependency updates, etc. (e.g., `chore/update-react`)

### Commit Message Format (Conventional Commits)
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
`<type>[optional scope]: <description>`
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- **Example:** `feat(auth): add JWT token refresh mechanism`

### Pull Request (PR)
- Use the provided PR template.
- Keep PRs small and focused (ideal size: < 400 lines of code).
- Link the PR to the relevant issue/ticket.
- Provide a clear description of the changes and how to test them.

### Merge Strategy
- **Squash and Merge:** Squashing commits keeps the target branch history clean and linear. Ensure the final squashed commit message clearly describes the entire feature/fix.

---

## 3. Frontend (Next.js/TypeScript)

### Project Structure
Follow an app-router or page-router consistent structure based on feature encapsulation:
```text
src/
├── app/               # Next.js App Router (pages & layouts)
├── components/        # Shared reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs)
│   └── layout/        # Layout components (navbar, footer)
├── features/          # Feature-based modules (domain logic)
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── utils/
├── hooks/             # Shared custom hooks
├── lib/               # Third-party library integrations (axios, queryClient)
├── store/             # Global state management
├── types/             # Shared TypeScript type definitions
└── utils/             # Helper functions and constants
```

### Naming Conventions
- **Components:** `PascalCase` (e.g., `UserProfile.tsx`)
- **Files/Folders:** `kebab-case` for general files (e.g., `format-date.ts`), `PascalCase` for component files.
- **Hooks:** `camelCase`, prefixed with `use` (e.g., `useAuth.ts`)
- **Variables/Functions:** `camelCase` (e.g., `fetchUserData`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)

### TypeScript Best Practices
- **Strict Mode:** Always enable strict mode in `tsconfig.json`.
- **No `any`:** Avoid using `any`. Use `unknown` if the type is truly not known beforehand, and use type guards to narrow it down.
- **Interfaces vs. Types:** Use `interface` for object shapes and defining component props. Use `type` for unions, intersections, or primitives.

### State Management Patterns
- **Local State:** Use `useState` or `useReducer` for state localized to a component.
- **Server State (API):** Use **TanStack Query** (React Query) for fetching, caching, and mutating server data. Do not store API responses in global state (like Redux/Zustand) unless absolutely necessary.
- **Global UI State:** Use **Zustand** or Context API for lightweight global UI state (e.g., theme, sidebar toggle, current user session).

### API Integration (TanStack Query)
Abstract API calls into custom hooks:
```typescript
// features/users/api/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users');
      return data;
    }
  });
};
```

### CSS/Tailwind Conventions
- Utilize Tailwind CSS for styling.
- Extract complex or heavily repeated utility classes into components rather than `@apply` directives, to maintain component isolation.
- Maintain responsive design using Tailwind's `sm:`, `md:`, `lg:` prefixes.

### Accessibility Standards
- Ensure WCAG 2.1 AA compliance.
- Use semantic HTML tags (`<main>`, `<nav>`, `<article>`).
- Always include `alt` tags on images.
- Ensure keyboard navigability (focus states, logical tab order).
- Use ARIA roles where semantic HTML is insufficient.

### Performance
- **Lazy Loading & Code Splitting:** Use `next/dynamic` for heavy components that aren't needed immediately.
- **Image Optimization:** Always use Next.js `<Image />` component for automatic resizing, WebP conversion, and lazy loading.
- Avoid unnecessary re-renders by memoizing expensive calculations (`useMemo`) and stable callbacks (`useCallback`).

### Error Handling
- Use React Error Boundaries to catch render errors.
- Handle API errors gracefully via TanStack Query's `onError` callbacks and show user-friendly toast notifications.

---

## 4. Backend (Python/FastAPI)

### Project Structure
Organize the backend into domains/modules:
```text
backend/
├── app/
│   ├── api/             # API routing (v1, endpoints)
│   │   ├── dependencies/# Reusable FastAPI dependencies (auth, db session)
│   │   └── v1/          # Route handlers grouped by domain
│   ├── core/            # App-wide settings, config, security, exceptions
│   ├── db/              # Database setup, Base models, migrations (Alembic)
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic models (Input/Output validation)
│   ├── services/        # Business logic and database operations (CRUD)
│   └── main.py          # FastAPI application factory
├── tests/               # Pytest test suite
├── alembic/             # Database migrations
└── requirements.txt     # or pyproject.toml
```

### Naming Conventions
- **Files/Folders:** `snake_case` (e.g., `user_service.py`)
- **Functions/Variables:** `snake_case`
- **Classes (Models, Schemas):** `PascalCase` (e.g., `UserCreate`, `UserModel`)
- **Constants:** `UPPER_SNAKE_CASE`

### FastAPI Router & Business Logic
Keep route handlers thin. Delegate business logic and database interactions to the `services` layer.

```python
# api/v1/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import dependencies
from app.schemas.user import UserOut, UserCreate
from app.services import user_service

router = APIRouter()

@router.post("/", response_model=UserOut)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(dependencies.get_db)
):
    return await user_service.create_user(db=db, user_in=user_in)
```

### Pydantic & SQLAlchemy Conventions
- Keep Pydantic schemas in `schemas/` and SQLAlchemy models in `models/`.
- Schemas should strictly define what inputs are required and what outputs are exposed.
- Use `ConfigDict(from_attributes=True)` on Pydantic response models to serialize ORM objects.

### Async/Await Best Practices
- FastAPI handles async natively. Use `async def` for route handlers.
- Use `sqlalchemy.ext.asyncio` for non-blocking database queries.
- Do not mix synchronous IO bound calls (like standard `requests`) inside async routes; use async libraries like `httpx`.

### Error Handling & Exceptions
- Raise custom HTTPException classes defined in `core/exceptions.py`.
- Use global exception handlers in `main.py` to catch common errors (e.g., SQLAlchemy `IntegrityError`) and return standardized JSON error responses.

### Logging
- Use standard Python `logging` or libraries like `loguru`.
- Log important events (warnings, errors, critical auth events) with contextual information. Do not log sensitive user data (PII, passwords).

### Type Hints and Docstrings
- Type hints are **mandatory** everywhere in the Python codebase to leverage static analysis (`mypy`) and IDE autocomplete.
- Use **Google Style Docstrings** for complex functions, classes, and modules.

```python
def calculate_discount(price: float, discount_rate: float) -> float:
    """
    Calculates the final price after applying a discount.

    Args:
        price (float): The original price.
        discount_rate (float): The discount rate as a decimal (e.g., 0.20 for 20%).

    Returns:
        float: The final calculated price.
    """
    return price * (1 - discount_rate)
```

---

## 5. Database (PostgreSQL)

### Migration Management
- Use **Alembic** for managing migrations.
- Migration scripts must be generated using `alembic revision --autogenerate`.
- Review auto-generated migration files to ensure correct operations before applying them.
- Name migrations descriptively: `alembic revision -m "add_user_profile_table"`.

### Query Optimization
- Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
- Avoid `SELECT *`. Select only the required columns.
- Use explicit JOINs.

### N+1 Query Prevention
When fetching relationships in SQLAlchemy, use eager loading techniques (`joinedload`, `selectinload`) to prevent the N+1 query problem.
```python
# Bad: Causes N+1 queries when iterating over users and accessing items
users = await db.execute(select(User))

# Good: Loads items in a single query
users = await db.execute(select(User).options(selectinload(User.items)))
```

### Transaction Management
- Group related database operations within a single transaction to ensure atomicity.
- In FastAPI, relying on a session dependency (`yield session`) generally wraps the request in a single transaction that commits on success or rolls back on exception.

---

## 6. Testing

### Organization & Naming
- Place tests in the `tests/` directory at the root level, mirroring the `app/` (backend) or `src/` (frontend) structure.
- Test files must be named `test_*.py` (Python) or `*.test.ts` / `*.spec.ts` (Next.js).
- Test functions should clearly describe the behavior being tested: `test_create_user_returns_201_on_success`.

### Coverage Requirements
- **Backend:** Minimum 80% coverage.
- **Frontend:** Minimum 70% coverage.
- Test edge cases, validation errors, and failure states, not just the happy path.

### Backend Testing (Pytest)
- Use `pytest` and `pytest-asyncio`.
- Use fixtures (`conftest.py`) for setup like generating DB sessions, creating test users, and spinning up a `TestClient` or `AsyncClient`.
- Avoid mocking the database directly if possible; use an isolated test database (e.g., PostgreSQL test schema or SQLite memory database) for integration tests.

### Frontend Testing (Vitest/Jest & React Testing Library)
- Test user interactions and accessible outputs rather than implementation details.
- Mock network requests using **MSW (Mock Service Worker)**.

### E2E Testing
- Use **Playwright** or **Cypress** for critical user flows (e.g., Signup, Login, Checkout).
- Run E2E tests against a staging-like environment during CI.

---

## 7. Security

### Input Validation
- Rely on Pydantic (backend) and Zod/Yup (frontend) for strict input validation. Never trust client data.

### Authentication & Authorization
- Use JWTs for stateless authentication, with appropriately short expiration times.
- Implement robust Role-Based Access Control (RBAC) checked at the FastAPI dependency level.

### Secret Management
- Never commit secrets, API keys, or database credentials to version control.
- Use `.env` files for local development (add to `.gitignore`).
- Use secure secret managers (e.g., AWS Secrets Manager, GitHub Secrets) in production and CI/CD pipelines.

### Web Vulnerability Prevention
- **SQL Injection:** Always use the ORM (SQLAlchemy). Never concatenate strings to form SQL queries.
- **XSS:** Next.js (React) automatically escapes variables. When using `dangerouslySetInnerHTML`, sanitize the input using libraries like `DOMPurify`.
- **CORS:** Configure FastAPI's `CORSMiddleware` strictly. Only allow trusted origins; avoid `allow_origins=["*"]` in production.

---

## 8. Documentation

- **Code Comments:** Write comments to explain *why* something is done, not *what* is done (the code should explain the what).
- **API Documentation:** FastAPI auto-generates OpenAPI (Swagger) documentation at `/docs`. Use Pydantic `Field` descriptions to enrich this documentation.
- **README Requirements:** Every major module/repository must contain a `README.md` detailing:
  - Setup and installation instructions.
  - Environment variable requirements.
  - Scripts for running tests, linting, and starting the server.
  - High-level architectural overview.

---

## 9. Environment Management

### Config Management
- Use `pydantic-settings` in the backend to manage and validate environment variables strongly typed.
```python
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env")
```

### Environments
- **Development:** Local setup, debug mode enabled, mock external services where applicable.
- **Staging:** Production-like environment for final QA and UAT. Uses separate staging databases and credentials.
- **Production:** Optimized builds, strict security settings, debug mode disabled.

---

## 10. Code Formatting & Linting

Automated tools maintain consistency. Do not manually format code.

### Frontend
- **ESLint:** Catches JS/TS issues. Use the strict Next.js configuration.
- **Prettier:** Code formatter. Must be integrated with ESLint to prevent conflicts.

### Backend
- **Ruff:** Ultra-fast linter and formatter. Replaces Flake8, isort, and others.
- **Black:** Enforces uncompromising Python code formatting (can be used alongside or replaced by Ruff formatter).
- **Mypy:** Static type checker for Python.

### Pre-commit Hooks
Use `pre-commit` to ensure code meets formatting and linting standards before it can be committed.
```yaml
# .pre-commit-config.yaml example
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
```

### Editor Config
Include a `.editorconfig` file at the root of the repositories to unify basic settings (indentation, line endings, trailing spaces) across different IDEs (VSCode, PyCharm, etc.).
