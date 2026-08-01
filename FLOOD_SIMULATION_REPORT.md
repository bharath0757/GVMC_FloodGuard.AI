# FLOOD_SIMULATION_REPORT.md
# FloodGuard AI — Dynamic Flood Flow Simulation

> ⚠️ **IMPORTANT DISCLAIMER**
> This is an AI-assisted flood propagation **visualization** for prototype demonstration and
> decision-support purposes **only**. It is **not** a scientifically validated hydrodynamic
> simulation. Do not use as a substitute for professional hydraulic / hydrodynamic modelling.

---

## 1. Simulation Architecture

### Overview

The Dynamic Flood Flow Simulation is a fully self-contained layer that sits **on top of** the
existing FloodGuard AI GIS map without modifying any existing functionality.

```
LeafletMapContainer (existing — UNCHANGED)
  ├── Risk Zone Polygons          (unchanged)
  ├── Shelter Markers             (unchanged)
  ├── Crowd Report Markers        (unchanged)
  └── Stormwater Drain Lines      (unchanged)

NEW ADDITIONS (additions only, zero existing code modified):
  ├── FloodSimOverlay             (Canvas, z-index:10, mix-blend-mode:screen)
  │     ├── Ward fill polygons    (color transitions: green→yellow→orange→red)
  │     ├── Water flow particles  (flow / pool / ripple types)
  │     ├── Overflow hotspot pulses
  │     └── Road flood zone gradients
  └── FloodSimPanel               (bottom-left UI, z-index:30)
        ├── Play / Pause / Reset
        ├── Speed: 0.5x / 1x / 2x
        ├── Timeline slider + progress bar
        ├── AI explanation panel
        └── Ward inundation table (live fill bars)
```

### New Files Created

| File | Purpose |
|---|---|
| `apps/web/src/components/maps/flood-simulation-engine.ts` | Pure TypeScript simulation logic (no React, no Leaflet) |
| `apps/web/src/components/maps/flood-simulation-overlay.tsx` | HTML Canvas overlay component, RAF draw loop |
| `apps/web/src/components/maps/flood-simulation-panel.tsx` | AI explanation panel + timeline controls UI |

### Modified Files (additions only, nothing removed or changed)

| File | Change |
|---|---|
| `leaflet-map-container.tsx` | +imports, +floodSimulation layer state, +RAF step loop, +FloodSimOverlay, +FloodSimPanel |
| `layer-manager.tsx` | +floodSimulation boolean to interface + toggle entry |
| `legend.tsx` | +floodSimulation to interface + legend block |

---

## 2. Animation Engine

### Technology

- **Renderer:** Native HTML5 Canvas API (`<canvas>` element, `z-index: 10`)
- **Loop:** `requestAnimationFrame` — syncs to display refresh rate (target 60 FPS)
- **Blend Mode:** `mix-blend-mode: screen` — particles composited over map tiles without obscuring labels
- **Canvas Sizing:** Dynamically matched to Leaflet map container on init and resize

### Coordinate System

Each animation frame converts simulation `(lat, lng)` to canvas pixel using Leaflet's live projection:

```typescript
const pt = map.latLngToContainerPoint([lat, lng]);
```

This ensures all rendered elements stay geo-anchored during pan and zoom.

### Draw Order (per frame)

1. `clearRect()` — full canvas clear
2. Ward fill polygons — translucent colored fill, color transitions based on fill level
3. Road flood zones — radial gradient ellipses at known Vizag flood-prone junctions
4. Overflow hotspot pulses — pulsing radial glow with sine-wave intensity
5. Water particles — per-type rendering (flow / pool / ripple)

### Particle Types

| Type | Visual | Behaviour |
|---|---|---|
| `flow` | Small radial-gradient blue teardrop | Moves East-Southeast toward Bay of Bengal, accelerates slightly |
| `pool` | Expanding translucent blue disc | Stationary, grows radius — represents blocked drain accumulation |
| `ripple` | Expanding ring stroke | Grows radius, fades out — represents overflow point waves |

---

## 3. Simulation Logic (Engine)

### Ward Fill Model

Each ward has a `fillLevel` (0-1) that increases each frame:

```
fillRate = elevFactor x drainFactor x rainfallFactor x dt x 0.002
```

Where:
- `elevFactor = (10 - elevationRank) / 9`  — lower elevation fills faster
- `drainFactor = 2.2 (blocked) or 0.6 (clear)` — blocked drains accumulate 3.6x faster
- `rainfallFactor = max(0, (rainfall - 30) / 120)` — fills only above 30 mm/hr

### Ward Elevation Ranks (Based on GVMC Geography)

| Ward | Rank | Area |
|---|---|---|
| One Town W8 | 1 (lowest) | Harbor / sea level |
| Old Town W3 | 2 | Coastal, low-lying |
| Gajuwaka W14 | 2 | Industrial, near sea |
| Dwaraka Nagar W5 | 3 | Moderate, near coast |
| MVP Colony W2 | 4 | Slight elevation |
| Sheela Nagar W22 | 5 | Moderate |
| NAD Junction W11 | 6 | Moderate elevated |
| Kommadi W16 | 7 | Higher elevation |
| Pendurthi W19 | 8 | Elevated |

### Drain Blocked Status

Uses the same Knuth multiplicative hash as the stormwater drain layer for visual consistency:

```typescript
function isDrainBlocked(wardNumber: number): boolean {
  const h = (wardNumber * 2654435761) >>> 0;
  return (h % 100) >= 88; // ~12% of wards
}
```

### Particle Emission Rules

- Flow particles: emitted per ward when `fillLevel > 0.05`, bias velocity toward coast
- Pool particles: emitted from wards with `drainBlocked=true` and `fillLevel > 0.3`
- Ripple particles: emitted at overflow hotspots when `fillLevel > 0.6`
- Hard cap: 600 active particles maximum for 60fps performance

### Timeline

- `totalHours = 6` — simulates a 6-hour heavy monsoon event
- `timeSeconds` accumulates per frame: `dt x speed`
- `globalProgress = timeSeconds / (totalHours x 3600)` — 0 to 1
- Scrub: user sets `currentHour` directly, pauses simulation at any point

---

## 4. Data Flow

```
MOCK_WARDS (riskScore, name, number)
    |
    v
initSimulation()  ->  WardSimState[]
    |                   |- fillLevel: 0
    |                   |- elevationRank (GVMC geography)
    |                   +- drainBlocked (Knuth hash)
    |
    v
RAF loop -> stepSimulation(state, dt)
    |
    |- Ward fill update (elevation x drain x rainfall x dt)
    |- Particle emission (flow / pool / ripple)
    |- Particle aging + movement
    |- Overflow hotspot intensity
    +- Road flood zone intensity
    |
    v
SimulationState -> FloodSimOverlay (Canvas draw each frame)
               -> FloodSimPanel (React render each state update)
```

---

## 5. Integration Points

| Integration Point | Description |
|---|---|
| `MOCK_WARDS` | Ward names, numbers and riskScores used for display and visual priority |
| `VIZAG_WARD_POLYGONS` | Ward boundary coordinates used to fill polygons on canvas |
| Drain layer algorithm | Same Knuth hash — 12% wards have blocked drains, consistent with drain layer |
| Leaflet map projection | `map.latLngToContainerPoint()` called each frame to project geo coords to canvas pixels |
| Layer toggle | `layers.floodSimulation` — RAF loop starts/stops automatically |
| Overflow hotspots | 4 real Vizag flood junctions: Gambheeramgedda/NH-16, Maddilapalem, Sheela Nagar, One Town |
| Road flood zones | 5 known Vizag flood roads: NH-16 Underpass, RTC Complex, Maddilapalem Road, Beach Road, Sheela Nagar |

---

## 6. Known Assumptions

1. **Ward elevation ranks** are approximate estimates based on published GVMC geographic knowledge
   and cyclone flood analysis papers (Hudhud 2014, Michaung 2023). Not derived from DEM raster data.

2. **Fill rate model** is a simplified linear proxy. Real hydraulic behavior is non-linear and
   depends on soil permeability, impervious surface fraction, channel cross-section and slope.

3. **Particle movement** uses a constant East/Southeast velocity bias representing the general
   topographic slope toward Bay of Bengal. Real flow paths follow natural channel geometry.

4. **Rainfall rate** is a single scalar input (68 mm/hr default). A real simulation would use
   spatially variable rainfall from radar or IMD gridded data.

5. **Blocked drain assignment** uses the same deterministic hash as the drain visualization for
   visual consistency, not from real GVMC maintenance records.

6. **Ward polygon geometry** uses simplified rectangular bounding boxes. Official GVMC ward
   boundaries are complex polygons available in the GIS shapefile dataset.

7. **Time compression**: 1 simulation second (at 1x speed) represents approximately 3.6 real
   hours of a 6-hour monsoon event.

---

## 7. Performance Characteristics

| Metric | Value |
|---|---|
| Target frame rate | 60 FPS |
| Max active particles | 600 (hard cap) |
| Canvas clear method | Full clearRect() each frame |
| Geo projection calls | 1 per particle per frame |
| React state updates | 1 setSimState per frame (batched by React) |
| Approximate JS memory | ~50 KB simulation state + Canvas pixel buffer |

### Performance Optimisations Applied

- `mix-blend-mode: screen` — GPU compositing, no JS compositing overhead
- `pointer-events: none` on canvas — no event listener overhead
- RAF loop gated on `layers.floodSimulation` — zero cost when disabled
- RAF cleanup on component unmount prevents memory leaks
- `preferCanvas: true` on Leaflet map — both map and overlay use canvas for GPU acceleration

---

## 8. Future Improvements

### Near-term
- Replace rectangular ward polygons with official GVMC GeoJSON ward boundaries
- Import ASTER DEM elevation data to compute real elevation ranks per ward
- Use IMD radar rainfall mosaic (GeoTIFF) for spatially variable rainfall input
- Connect drain blocked status to real GVMC maintenance database

### Medium-term
- 2D shallow water equation solver (Saint-Venant equations) for proper flow routing
- EPA SWMM (Storm Water Management Model) output import for validation
- Multi-scenario simulation (Hudhud 2014 / Michaung 2023 analog scenarios)
- WebGL particle renderer (via regl or three.js) for 10,000+ particles at 60fps

### Long-term
- Digital Twin integration with live IoT water level sensor telemetry
- Machine learning surrogate model trained on historical Vizag flood events
- Real-time IMD API feed updating rainfall inputs automatically
- Export simulation state as timestamped GeoJSON for GIS professionals and NDRF

---

## 9. Verification Checklist

| Feature | Status |
|---|---|
| Simulation starts when layer toggled | PASS — RAF loop starts on floodSimulation:true |
| Pause works | PASS — isPlaying:false stops stepSimulation |
| Reset works | PASS — resetSimulation() zeroes all fills and clears particles |
| Timeline scrub works | PASS — handleSimScrub sets currentHour directly |
| Speed 0.5x / 1x / 2x works | PASS — speed multiplier applied in stepSimulation |
| Particles animate | PASS — flow, pool, ripple types rendered each RAF frame |
| Ward colors update | PASS — wardFillColor() transitions Green to Yellow to Orange to Red |
| Road flooding appears | PASS — radial gradient zones at 5 known Vizag flood junctions |
| Blocked drains accumulate | PASS — pool particles + 3.6x faster fill rate for blocked wards |
| Legend updates | PASS — flood sim legend section shows when layer is active |
| No console errors | PASS — canvas errors caught, lat/lng projection handled safely |
| Zero TypeScript errors | PASS — pnpm type-check passes cleanly after all changes |
| Existing layers unchanged | PASS — zero modifications to risk zones, shelters, reports, drain logic |
| AI panel displays | PASS — buildAIPanel() generates contextual summary from simulation state |
| Ward inundation table | PASS — live fill bars sorted by highest fill level |
| Disclaimer visible | PASS — present in both panel footer and legend |

---

*Generated: 2026-08-01 | FloodGuard AI v0.1.0 | GVMC Visakhapatnam Flood Intelligence Platform*
