# Frontend Architecture: FloodGuard AI

This document outlines the frontend architecture for the FloodGuard AI platform, designed to support 100K+ concurrent users with high performance, offline capabilities, and complex geospatial visualization.

## 1. Architecture Overview

```mermaid
graph TD
    subgraph "Application Core"
        App[App Entry (React 18)]
        Router[React Router v6]
        Store[Zustand Client State]
        QueryCache[TanStack Query Server State]
    end

    subgraph "Pages (Feature Modules)"
        Dashboard[Citizen Dashboard]
        GovDashboard[Gov Dashboard]
        Map[Interactive Map]
        Reports[Crowdsourced Reports]
        Admin[Admin Panel]
    end

    subgraph "UI Component Library (Atomic Design)"
        Atoms[Atoms: Buttons, Inputs]
        Molecules[Molecules: Form Fields, Cards]
        Organisms[Organisms: Headers, Data Tables]
        Templates[Templates: Page Layouts]
    end

    subgraph "Services & Integration"
        API[Axios API Client]
        WS[WebSocket Manager]
        PWA[Service Worker / PWA]
        MapBox[Mapbox GL JS / CesiumJS]
    end

    App --> Router
    App --> Store
    App --> QueryCache

    Router --> Pages
    Pages --> UI Component Library

    Pages --> API
    Pages --> WS
    Pages --> MapBox

    API --> PWA
    WS --> PWA
```

Our frontend utilizes an **Atomic Design** approach for UI components and a **Feature-based** module organization for pages and business logic.

## 2. Technology Decisions

- **Vite:** Chosen as the build tool for its lightning-fast HMR, native ESM support, and optimized production builds.
- **TypeScript (Strict Mode):** Ensures type safety across the application. We strictly forbid `any` and require explicit return types for robust, maintainable code.
- **TailwindCSS + Shadcn UI:** Provides a consistent, accessible design system. Tailwind enables rapid UI development, while Shadcn offers unstyled, accessible radix-based components we can fully customize.
- **Zustand:** Selected for client state management due to its minimal boilerplate and lightweight nature compared to Redux, perfect for UI states.
- **TanStack Query (v5):** Handles all asynchronous server state, providing built-in caching, background refetching, and optimistic updates.
- **React Router v6:** Manages routing with support for nested layouts, data routers, and lazy loading for code splitting.

## 3. Routing Architecture

Our routing structure is segregated by user personas and access levels:

- **Public Routes:** `/`, `/login`, `/register`, `/flood-map`
- **Citizen Routes:** `/dashboard`, `/report`, `/shelters`, `/evacuation`, `/voice`, `/profile`
- **Government Routes:** `/gov/dashboard`, `/gov/reports`, `/gov/shelters`, `/gov/alerts`, `/gov/analytics`, `/gov/digital-twin`
- **Admin Routes:** `/admin/users`, `/admin/system`, `/admin/settings`

**Route Guards:** We employ Higher-Order Components (HOCs) to protect routes based on authentication status and RBAC (Role-Based Access Control).

## 4. State Management Architecture

```mermaid
flowchart LR
    Component[React Component]

    subgraph "Client State (Zustand)"
        AuthStore[authStore]
        MapStore[mapStore]
        UIStore[uiStore]
    end

    subgraph "Server State (TanStack Query)"
        QueryCache[(Query Cache)]
        Mutations[Mutations]
    end

    subgraph "URL State"
        Router[URL Params / Search]
    end

    Component <--> Client State
    Component <--> Server State
    Component <--> URL State
```

- **Zustand Stores:** Manages global UI states like `authStore` (user session), `mapStore` (viewport, active layers), and `notificationStore`.
- **TanStack Query:** Manages all API data (flood risks, predictions, shelters).
- **URL State:** Used for shareable states like map coordinates, active filters, and pagination.
- **Form State:** Managed locally using `react-hook-form` integrated with `zod` for schema validation.

## 5. API Integration Layer

- **Axios Instance:** Configured with interceptors to automatically attach JWT tokens, handle token refresh, and standardize error responses.
- **Custom Hooks:** Every feature module exposes its own TanStack Query hooks (e.g., `useFloodData`, `useSubmitReport`).
- **Optimistic Updates:** Used extensively for interactive elements (like upvoting a crowd report) to ensure a snappy user experience.
- **WebSockets:** A custom `useWebSocket` hook manages real-time connections.
- **Offline Queue:** Failed mutation requests (like submitting a report while offline) are queued in IndexedDB and synchronized when connectivity returns.

## 6. Map Architecture (2D)

- **Mapbox GL JS:** Powers our high-performance 2D vector maps.
- **React Wrappers:** Custom React components (`MapContainer`, `MapLayer`, `MapMarker`) wrap Mapbox instances to integrate with React's lifecycle.
- **Layer Management:** A centralized configuration handles layer z-ordering and visibility toggling.
- **Performance optimizations:** We utilize viewport-based data loading, supercluster for marker clustering, and debounced viewport updates to maintain 60fps even with dense datasets.
- **Data Binding:** GeoJSON data fetched via TanStack Query is seamlessly bound to Mapbox layers.

## 7. 3D Digital Twin Architecture

For advanced government planning and simulation:

- **CesiumJS:** Integrated for accurate global terrain and large-scale geographic visualization.
- **Three.js & React-Three-Fiber:** Used for rendering custom 3D objects (e.g., building extrusions, simulated water levels) declaratively within React.
- **Performance Budget:** We target 60fps using Level of Detail (LOD) systems, geometry instancing, and strict WebGL memory management.

## 8. Real-time Architecture

- **WebSocket Manager:** A singleton class that maintains the persistent WS connection.
- **Event Taxonomy:** Standardized events: `flood_alert`, `risk_update`, `report_new`, `shelter_update`, `weather_alert`.
- **Resilience:** Implements exponential backoff for reconnections.
- **Notifications:** Real-time events trigger in-app toasts and native Push Notifications via the Service Worker.

## 9. PWA Strategy

- **Service Worker:** Utilizes Workbox for runtime caching of static assets and API responses.
- **Installability:** Valid `manifest.json` enables the "Add to Home Screen" prompt for mobile users.
- **Offline-First:** Critical modules like Evacuation Routes and Shelter Lists are cached for offline availability.
- **Background Sync:** Queued actions (like citizen reports) are dispatched automatically when the network recovers.

## 10. Performance Strategy

- **Code Splitting:** Route-level chunking using `React.lazy` and `Suspense`.
- **Media:** Strict use of WebP/AVIF formats, lazy loading, and responsive `srcset` for images.
- **Budgets:** Initial JS payload must remain under 200KB (gzipped).
- **Virtualization:** `TanStack Virtual` is used for rendering long lists (e.g., report feeds) without DOM bloat.
- **Memoization:** Strategic use of `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders.
- **Web Workers:** Heavy client-side computations (e.g., parsing large GeoJSON datasets) are offloaded to Web Workers.

## 11. Accessibility (a11y)

- Target: **WCAG 2.1 AA Compliance**.
- Complete keyboard navigability for all interactive elements and maps.
- Comprehensive screen reader support via ARIA attributes and live regions for dynamic alerts.
- Support for OS-level high contrast modes.
- Strict focus management during route transitions and modal dialogs.

## 12. i18n Strategy

- Powered by `react-i18next`.
- Translation files are split into namespaces and loaded on demand per feature module.
- RTL (Right-to-Left) readiness built into the Tailwind configuration.
- Native `Intl` API used for locale-aware date, time, and currency formatting.

## 13. Error Handling

- **Error Boundaries:** Placed at the feature module level to prevent total app crashes.
- **Global Handler:** Catches unhandled promise rejections and runtime errors.
- **UX:** Graceful fallback UI for 404s, 500s, and offline states.
- **Telemetry:** Errors are sanitized and reported to a monitoring service (e.g., Sentry).

## 14. Testing Strategy

- **Unit Testing:** `Vitest` + `React Testing Library` for hooks, utilities, and isolated components.
- **Integration Testing:** `Mock Service Worker (MSW)` intercepts API calls to test component interactions.
- **E2E Testing:** `Playwright` covers critical user journeys (e.g., login, reporting a flood, viewing evacuation routes).
- **Visual Regression:** `Chromatic` or `Percy` integrated into CI to catch unintended UI changes.
- **Coverage Targets:** 70% overall statements, 80% for critical path modules.
