# Coding Standards for FloodGuard AI

This document outlines the comprehensive coding standards for the FloodGuard AI platform. Adherence to these standards is mandatory for all team members to ensure a scalable, maintainable, and high-quality codebase.

## 1. General Principles

- **Clean Code:** Code is read far more often than it is written. Optimize for readability.
- **SOLID:** Adhere to Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.
- **DRY (Don't Repeat Yourself):** Abstract shared logic, but do not force abstractions prematurely.
- **KISS (Keep It Simple, Stupid):** Avoid overly complex architectures for simple problems.
- **YAGNI (You Aren't Gonna Need It):** Implement features only when they are actually needed, not when you foresee them.

## 2. Git Workflow

- **Strategy:** Trunk-based development. `main` is always deployable.
- **Branches:** Create feature branches from `main` using the format: `feat/issue-123-short-desc`, `fix/issue-456-bug-name`, `chore/update-deps`.
- **Commits:** Follow Conventional Commits format: `feat: add flood map layer`, `fix: resolve crash on null sensor data`.
- **Pull Requests:** Must use the provided PR template, link to the issue, and have at least 1 approving review from a code owner.

## 3. Frontend Standards (TypeScript / React)

### Naming Conventions

- **Components:** `PascalCase` (e.g., `FloodMap.tsx`)
- **Functions/Variables:** `camelCase` (e.g., `calculateRiskScore`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_ZOOM_LEVEL`)
- **Files:** `kebab-case.ts` for utilities, `PascalCase.tsx` for components.

### Component Patterns

- Use functional components exclusively.
- Extract complex logic into custom hooks (e.g., `useFloodData`).

```tsx
// Example: Good Component Pattern
import { useFloodData } from '@/hooks/useFloodData';
import { LoadingSpinner } from '@/components/ui/loading';

interface FloodWidgetProps {
  regionId: string;
}

export function FloodWidget({ regionId }: FloodWidgetProps) {
  const { data, isLoading, error } = useFloodData(regionId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data.</div>;

  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <h3 className="text-lg font-bold">{data.regionName}</h3>
      <p>Risk Level: {data.riskLevel}</p>
    </div>
  );
}
```

### TypeScript

- **Strict Mode:** Enabled in `tsconfig.json`.
- **No `any`:** Use `unknown` if type is truly dynamic, or narrow via type guards.
- **State:** Use discriminated unions for complex state.
- **Validation:** Use Zod for runtime validation of API responses.

### State & Imports

- **Imports:** Use absolute paths with the `@` alias. Utilize barrel exports (`index.ts`) per feature folder.
- **State Management:**
  - Local State (`useState`, `useReducer`) for UI state.
  - Zustand for simple shared global state.
  - TanStack Query for server state (caching, fetching).

### Styling

- Use Tailwind utility classes.
- Use the `cn()` helper (clsx + tailwind-merge) for conditional classes.

```tsx
import { cn } from '@/lib/utils';

export function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        'rounded-md px-4 py-2 font-medium',
        variant === 'primary'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-black',
        className,
      )}
      {...props}
    />
  );
}
```

### Error Handling & Accessibility

- **Errors:** Use React Error Boundaries. Wrap async calls in `try/catch` and show Toast notifications.
- **a11y:** Ensure semantic HTML (`<nav>`, `<main>`), correct `aria-labels`, and maintain keyboard focus management.

---

## 4. Backend Standards (Python / FastAPI)

### Naming Conventions

- **Functions/Variables:** `snake_case` (e.g., `calculate_risk_score`)
- **Classes:** `PascalCase` (e.g., `FloodModel`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)

### Type Hints & Pydantic

- Type hints are mandatory. Avoid bare `dict` or `list`; use `Dict[str, Any]` or `List[int]` (or standard collections in 3.9+).
- **Pydantic:** Separate schemas for Create, Update, and Response.

```python
from pydantic import BaseModel, Field

class SensorDataCreate(BaseModel):
    water_level: float = Field(..., gt=0)
    location_id: int

class SensorDataResponse(SensorDataCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
```

### SQLAlchemy & Async

- One model per file. Use Mixins for common columns.
- Use `async/await` everywhere. Do not perform blocking I/O (like `time.sleep` or synchronous `requests.get`) inside async route handlers.

```python
# Mixin Example
class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### Error Handling, Logging, & Security

- **Errors:** Raise custom exception classes (e.g., `ResourceNotFoundError`) and handle them via FastAPI global exception handlers.
- **Logging:** Use `structlog` for structured JSON logging. Include correlation IDs. NO `print()` statements.
- **Security:** Never log PII. Use parameterized queries via SQLAlchemy to prevent SQL injection.

---

## 5. Database Standards

- **Migrations:** Managed via Alembic. Names must be descriptive (e.g., `add_sensor_status_column`). Ensure downgrades are tested.
- **Queries:** Use SQLAlchemy ORM for standard CRUD. Use `text()` or Core for complex spatial PostGIS queries. Always check `EXPLAIN ANALYZE` for slow queries.
- **Naming:** Plural table names (`sensors`, `regions`). Snake_case columns. Foreign keys format: `{table_singular}_id` (e.g., `region_id`).

---

## 6. Testing Standards

- **Naming:** `test_{method}_{scenario}_{expected}` (e.g., `test_calculate_risk_high_water_returns_critical`).
- **Pattern:** Use Arrange, Act, Assert (AAA).
- **Coverage Targets:** 80% Backend, 70% Frontend, 90% AI Models (logic/inference wrappers).
- Tests must be independent and not rely on the execution order or shared state.

---

## 7. Code Review Checklist

| Category         | Item to Check                                                              |
| ---------------- | -------------------------------------------------------------------------- |
| **Architecture** | Does this follow established patterns? Is the logic in the right layer?    |
| **Readability**  | Are names descriptive? Is the code self-documenting?                       |
| **Testing**      | Are there unit tests? Do they cover edge cases?                            |
| **Security**     | Is user input validated (Zod/Pydantic)? Are there authorization checks?    |
| **Performance**  | Are database queries N+1 free? Are React components memoized if necessary? |
| **Standards**    | Are there type hints? Are linters passing?                                 |

---

## 8. Pre-commit Hooks

The following tools run automatically on commit:

- **Python:** `ruff` (linting/formatting), `black`, `mypy` (type checking)
- **TypeScript:** `eslint`, `prettier`
- **Git:** `commitlint` (enforces conventional commits)

## 9. Definition of Done

A task is "Done" when:

1. Code is written and meets all standards.
2. Unit tests are written and passing.
3. Code is peer-reviewed and approved.
4. CI/CD pipeline passes (build, lint, test).
5. Deployed to the staging environment successfully.
6. Documentation (API docs, Storybook) is updated.
