# UI/UX Design Guidelines for FloodGuard AI

This document establishes the comprehensive design system and guidelines for the FloodGuard AI platform. Given the critical nature of disaster management, these guidelines prioritize clarity, accessibility, and speed.

## 1. Design Philosophy
- **Emergency-First Design:** Critical alerts, evacuation routes, and SOS buttons must be immediately visible without scrolling.
- **Information Density vs. Clarity:** Balance the need for complex GIS data with clear, uncluttered interfaces. Use progressive disclosure.
- **Mobile-First:** The citizen-facing application is primarily accessed via smartphones, often under duress or poor network conditions.
- **Accessibility-First:** Ensure high contrast, large touch targets, and screen reader compatibility for elderly and disabled users.
- **Panic-Proof:** UI should use calm base colors, reserving high-intensity colors strictly for actionable emergencies.

## 2. Design System

### Color Palette
- **Primary:** Deep Blue (`#1E3A5F`) — Conveys trust, authority, and stability.
- **Secondary:** Teal (`#0D9488`) — Represents water and environmental monitoring.
- **Danger/Critical:** Red (`#DC2626`) — Active flooding, immediate evacuation, critical alerts.
- **Warning:** Amber (`#F59E0B`) — Caution, moderate risk, preparatory actions.
- **Safe:** Green (`#16A34A`) — Safe zones, active shelters, all-clear signals.
- **Neutral:** Slate (`#64748B`) — Used for secondary text, borders, and disabled states.
- **Background:** Dark (`#0F172A`) — Default primary background (Dark mode is default for reduced glare at night and better map contrast).

### Risk Level Colors
- **Very Low:** Green
- **Low:** Lime
- **Medium:** Amber
- **High:** Orange
- **Critical:** Red

### Typography
- **UI & Content:** `Inter` (sans-serif) for high legibility on digital screens.
- **Data & Metrics:** `JetBrains Mono` for tabular data, coordinates, and sensor readings to ensure alignment.

### Spacing & Geometry
- **Spacing System:** 4px base unit (4, 8, 12, 16, 24, 32, 48, 64).
- **Border Radius:**
  - `sm` (4px): Small inputs, tags.
  - `md` (8px): Buttons, standard inputs.
  - `lg` (12px): Cards, modals.
  - `xl` (16px): Large structural containers.
  - `full` (9999px): Avatars, pill badges.
- **Shadows:** Use sparingly in dark mode; rely on border borders or slight elevation (`sm`, `md`, `lg`).

## 3. Component Guidelines

- **Buttons:** 
  - Variants: Primary (Blue), Secondary (Outline), Destructive (Red), Ghost (Text only).
  - Sizes: `sm`, `md`, `lg`. Touch targets on mobile must be at least 44x44px.
  - Must include clear loading states (spinner inside button) and disabled states.
- **Cards:** Used for encapsulating distinct data objects (e.g., a Shelter, a Risk Report). Maintain consistent internal padding (usually 16px or 24px).
- **Alerts/Banners:** Color-coded by severity. Critical alerts should be persistent and non-dismissible until resolved.
- **Data Tables:** Must be sortable and filterable. On mobile screens, collapse table rows into a stacked Card layout.
- **Modals:** Use for critical confirmations (e.g., "Dispatch Rescue Team") or deep-dive details. Do not use for primary navigation flow.
- **Forms:** Labels must be associated with inputs. Use inline validation and provide clear, actionable error messages.

## 4. Map UI Guidelines
- **Legend:** Must always be visible. On mobile, provide a floating action button to toggle a bottom sheet legend.
- **Layer Controls:** Housed in a collapsible sidebar (desktop) or a floating panel (mobile).
- **Markers:** Use clustering at low zoom levels to prevent clutter. Show individual distinct markers at high zoom.
- **Interactions:** Popups/tooltips on hover for desktop, on tap for mobile.
- **Overlays:** Map must include a search bar overlay, current GPS location button, zoom controls, and a fullscreen toggle.
- **Attribution:** Ensure Mapbox/OSM attribution is clearly visible.

## 5. Responsive Breakpoints
- **Mobile:** `0 - 639px` (Stacked layouts, bottom navigation, full-screen map takeovers)
- **Tablet:** `640 - 1023px` (Two-column layouts possible)
- **Desktop:** `1024 - 1279px` (Standard dashboard view, sidebars)
- **Wide:** `1280px+` (Maximized data density, multi-panel views)

## 6. Animation Guidelines
- **Duration:** 
  - Micro-interactions (hover, press): 150ms.
  - Standard (modals, dropdowns): 300ms.
  - Emphasis (alerts entering): 500ms.
- **Easing:** `ease-out` for elements entering the screen; `ease-in` for elements exiting.
- **Map Animations:** Smooth `fly-to` transitions when changing focused locations.
- **Loading:** Prefer Skeleton screens over spinners for layout stability.
- **Accessibility:** Respect system `prefers-reduced-motion` settings and disable non-essential animations if flagged.

## 7. Iconography
- Use **Lucide React** icons.
- Maintain consistent stroke width (usually 2px).
- Develop custom SVGs for specific flood-related icons (e.g., rising water, dam breach, specific shelter types) while adhering to the Lucide style.

## 8. Voice Assistant UI
- **Visual Feedback:** Provide a waveform or pulsing indicator when listening.
- **Controls:** Clear language selector toggle.
- **Feedback:** Display a real-time text transcript of the parsed speech.
- **Discovery:** Show suggested queries (e.g., "Ask: Where is the nearest shelter?") below the input.

## 9. Government Dashboard Layout
- **Sidebar:** Persistent vertical navigation for switching between modules (Overview, Map, Sensors, Analytics).
- **Top Bar:** Quick stats (Active Alerts, Systems Status) and user profile.
- **Main Content:** Widget-based grid for data visualization.
- **Filter Panel:** Global context filters (Date range, Region) applied across widgets.

## 10. Emergency Mode UI
When a **CRITICAL** flood alert is activated for a user's region, the application interface must transform:
- **Contrast:** Switches to ultra-high contrast mode.
- **Navigation:** Standard navigation is hidden or minimized.
- **CTA:** The primary view is dominated by Evacuation Instructions, Safe Routes on the Map, and a massive "SOS / Request Rescue" button.
- **Touch Targets:** All interactive elements scale up for ease of use under stress.
