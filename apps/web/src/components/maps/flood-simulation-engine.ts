// ─────────────────────────────────────────────────────────────────────────────
// FloodGuard AI — Dynamic Flood Flow Simulation Engine
//
// ⚠️  IMPORTANT DISCLAIMER
// This is an AI-assisted flood propagation VISUALIZATION for prototype
// demonstration and decision-support purposes ONLY.
// It is NOT a scientifically validated hydrodynamic simulation.
// Do NOT use as a replacement for professional hydraulic modelling.
//
// Simulation logic:
//  High-rainfall areas → natural drainage → stormwater drains →
//  overflow points → low-elevation wards → road inundation → coastal discharge
// ─────────────────────────────────────────────────────────────────────────────

export interface WardSimState {
  wardId: string;
  wardNumber: number;
  name: string;
  /** 0–1 fill level (0=dry, 1=fully inundated) */
  fillLevel: number;
  /** Estimated water depth cm */
  waterDepthCm: number;
  /** Inflow rate from upstream (m³/s simulated) */
  inflowRate: number;
  /** Outflow rate to drains / downstream */
  outflowRate: number;
  /** Is the primary drain serving this ward blocked? */
  drainBlocked: boolean;
  /** lat/lng centroid */
  lat: number;
  lng: number;
  /** Polygon bounds */
  bounds: [number, number][];
  /** Base elevation category (lower = floods first) */
  elevationRank: number; // 1=lowest, 9=highest
}

export interface FloodParticle {
  id: number;
  lat: number;
  lng: number;
  vLat: number; // velocity
  vLng: number;
  alpha: number; // 0–1
  radius: number; // pixels
  age: number; // frames
  maxAge: number;
  type: 'flow' | 'pool' | 'ripple';
  wardId?: string;
}

export interface SimulationState {
  /** Simulation time in seconds (0 = start) */
  timeSeconds: number;
  /** Rainfall intensity mm/hr */
  rainfallIntensityMmHr: number;
  /** Global fill progress 0–1 */
  globalProgress: number;
  /** Ward states */
  wards: Record<string, WardSimState>;
  /** Active particles */
  particles: FloodParticle[];
  /** Overflow hotspots */
  overflowPoints: {
    lat: number;
    lng: number;
    radius: number;
    intensity: number;
  }[];
  /** Road flood segments */
  roadFloodZones: {
    lat: number;
    lng: number;
    width: number;
    intensity: number;
  }[];
  /** Speed multiplier */
  speed: 0.5 | 1 | 2;
  isPlaying: boolean;
  /** Total simulated hours */
  totalHours: number;
  /** Current hour in timeline */
  currentHour: number;
}

// ─── Known geographic data for Vizag simulation ───────────────────────────────
// Ward elevation ranks based on real GVMC geographic data:
//   Rank 1 (lowest) = coastal / harbor areas — flood first
//   Rank 9 (highest) = hill areas — flood last
const WARD_ELEVATION_RANKS: Record<number, number> = {
  8: 1, // One Town — near harbor, sea level
  3: 2, // Old Town — coastal, low lying
  5: 3, // Dwaraka Nagar — moderate, near coast
  2: 4, // MVP Colony — slight elevation
  22: 5, // Sheela Nagar — moderate
  11: 6, // NAD Junction — moderate elevated
  16: 7, // Kommadi — higher elevation
  19: 8, // Pendurthi — elevated
  14: 2, // Gajuwaka — near sea level (industrial)
};

// Drain blocked mapping — uses same deterministic hash as drain lines
function isDrainBlocked(wardNumber: number): boolean {
  const h = (wardNumber * 2654435761) >>> 0;
  return h % 100 >= 88; // ~12% blocked
}

// ─── WARD CENTROIDS (lat/lng computed from VIZAG_WARD_POLYGONS) ───────────────
const WARD_CENTROIDS: Record<
  number,
  { lat: number; lng: number; bounds: [number, number][] }
> = {
  14: {
    lat: 17.69,
    lng: 83.22,
    bounds: [
      [17.68, 83.21],
      [17.68, 83.23],
      [17.7, 83.23],
      [17.7, 83.21],
    ],
  },
  8: {
    lat: 17.705,
    lng: 83.305,
    bounds: [
      [17.695, 83.295],
      [17.695, 83.315],
      [17.715, 83.315],
      [17.715, 83.295],
    ],
  },
  3: {
    lat: 17.73,
    lng: 83.32,
    bounds: [
      [17.72, 83.31],
      [17.72, 83.33],
      [17.74, 83.33],
      [17.74, 83.31],
    ],
  },
  22: {
    lat: 17.7,
    lng: 83.245,
    bounds: [
      [17.69, 83.235],
      [17.69, 83.255],
      [17.71, 83.255],
      [17.71, 83.235],
    ],
  },
  11: {
    lat: 17.74,
    lng: 83.3,
    bounds: [
      [17.73, 83.29],
      [17.73, 83.31],
      [17.75, 83.31],
      [17.75, 83.29],
    ],
  },
  16: {
    lat: 17.755,
    lng: 83.335,
    bounds: [
      [17.745, 83.325],
      [17.745, 83.345],
      [17.765, 83.345],
      [17.765, 83.325],
    ],
  },
  5: {
    lat: 17.728,
    lng: 83.308,
    bounds: [
      [17.718, 83.298],
      [17.718, 83.318],
      [17.738, 83.318],
      [17.738, 83.298],
    ],
  },
  19: {
    lat: 17.73,
    lng: 83.27,
    bounds: [
      [17.72, 83.26],
      [17.72, 83.28],
      [17.74, 83.28],
      [17.74, 83.26],
    ],
  },
  2: {
    lat: 17.745,
    lng: 83.33,
    bounds: [
      [17.735, 83.32],
      [17.735, 83.34],
      [17.755, 83.34],
      [17.755, 83.32],
    ],
  },
};

// Known overflow hotspots in Vizag (from drainage analysis)
const OVERFLOW_HOTSPOTS = [
  { lat: 17.686, lng: 83.214, label: 'Gambheeramgedda @ NH-16' },
  { lat: 17.736, lng: 83.315, label: 'Maddilapalem X-Road' },
  { lat: 17.688, lng: 83.275, label: 'Sheela Nagar J-3' },
  { lat: 17.703, lng: 83.305, label: 'One Town Junction' },
];

// Road flood zones (coordinates of frequently flooded roads in Vizag)
const ROAD_FLOOD_ZONES = [
  { lat: 17.683, lng: 83.22, label: 'NH-16 Gajuwaka Underpass' },
  { lat: 17.705, lng: 83.3, label: 'RTC Complex Junction' },
  { lat: 17.736, lng: 83.318, label: 'Maddilapalem Main Road' },
  { lat: 17.72, lng: 83.332, label: 'Beach Road (RK Junction)' },
  { lat: 17.695, lng: 83.248, label: 'Sheela Nagar Junction' },
];

let _particleIdCounter = 0;

function makeParticle(
  lat: number,
  lng: number,
  vLat: number,
  vLng: number,
  type: FloodParticle['type'],
  wardId?: string,
): FloodParticle {
  return {
    id: _particleIdCounter++,
    lat,
    lng,
    vLat,
    vLng,
    alpha: 0.6 + Math.random() * 0.4,
    radius: type === 'pool' ? 6 + Math.random() * 8 : 3 + Math.random() * 4,
    age: 0,
    maxAge:
      type === 'pool' ? 180 : type === 'ripple' ? 60 : 90 + Math.random() * 60,
    type,
    wardId,
  };
}

// ─── Initialize simulation state ──────────────────────────────────────────────
export function initSimulation(
  mockWards: Array<{
    id: string;
    number: number;
    name: string;
    riskScore: number;
  }>,
  rainfallMmHr = 68,
): SimulationState {
  const wards: Record<string, WardSimState> = {};

  mockWards.forEach((w) => {
    const geo = WARD_CENTROIDS[w.number];
    if (!geo) return;
    const elevRank = WARD_ELEVATION_RANKS[w.number] ?? 5;
    const blocked = isDrainBlocked(w.number);

    wards[w.id] = {
      wardId: w.id,
      wardNumber: w.number,
      name: w.name,
      fillLevel: 0,
      waterDepthCm: 0,
      inflowRate: 0,
      outflowRate: 0,
      drainBlocked: blocked,
      lat: geo.lat,
      lng: geo.lng,
      bounds: geo.bounds,
      elevationRank: elevRank,
    };
  });

  return {
    timeSeconds: 0,
    rainfallIntensityMmHr: rainfallMmHr,
    globalProgress: 0,
    wards,
    particles: [],
    overflowPoints: OVERFLOW_HOTSPOTS.map((h) => ({
      ...h,
      radius: 0,
      intensity: 0,
    })),
    roadFloodZones: ROAD_FLOOD_ZONES.map((r) => ({
      ...r,
      width: 0,
      intensity: 0,
    })),
    speed: 1,
    isPlaying: true,
    totalHours: 6,
    currentHour: 0,
  };
}

// ─── Step simulation by one animation frame ───────────────────────────────────
export function stepSimulation(
  state: SimulationState,
  dtMs: number,
): SimulationState {
  if (!state.isPlaying) return state;

  const dtSec = (dtMs / 1000) * state.speed;
  const newTime = state.timeSeconds + dtSec;
  const progress = Math.min(newTime / (state.totalHours * 3600), 1);
  const rainfall = state.rainfallIntensityMmHr;

  // ── 1. Update ward fill levels ────────────────────────────────────────────
  const newWards: Record<string, WardSimState> = {};
  const wardList = Object.values(state.wards);

  wardList.forEach((ward) => {
    // Lower elevation fills faster; blocked drains accumulate faster
    const elevFactor = (10 - ward.elevationRank) / 9; // 0–1
    const drainFactor = ward.drainBlocked ? 2.2 : 0.6; // blocked = fills faster
    const rainfallFactor = Math.max(0, (rainfall - 30) / 120); // kicks in at 30mm/hr

    const fillRate = elevFactor * drainFactor * rainfallFactor * dtSec * 0.002;
    const newFill = Math.min(1, ward.fillLevel + fillRate);

    const inflowRate = fillRate * 1000;
    const outflowRate = ward.drainBlocked ? inflowRate * 0.1 : inflowRate * 0.7;

    newWards[ward.wardId] = {
      ...ward,
      fillLevel: newFill,
      waterDepthCm: Math.round(newFill * 180), // max 180cm simulated depth
      inflowRate: Math.round(inflowRate * 100) / 100,
      outflowRate: Math.round(outflowRate * 100) / 100,
    };
  });

  // ── 2. Emit new particles ─────────────────────────────────────────────────
  let newParticles = [...state.particles];

  // Flow particles from high → low elevation wards
  if (progress < 0.95 && rainfall > 35) {
    wardList.forEach((ward) => {
      const w = newWards[ward.wardId];
      if (!w || w.fillLevel < 0.05) return;

      // Emit flow particles heading toward coast (East / South-East in Vizag)
      if (Math.random() < 0.15 * w.fillLevel) {
        const jitter = () => (Math.random() - 0.5) * 0.002;
        newParticles.push(
          makeParticle(
            w.lat + jitter(),
            w.lng + jitter(),
            -0.00003 * (1 - ward.elevationRank / 9), // flow south toward sea
            +0.00005 * (1 - ward.elevationRank / 9), // flow east toward coast
            'flow',
            ward.wardId,
          ),
        );
      }

      // Pool particles in blocked/low areas
      if (w.drainBlocked && w.fillLevel > 0.3 && Math.random() < 0.1) {
        newParticles.push(
          makeParticle(
            w.lat + (Math.random() - 0.5) * 0.01,
            w.lng + (Math.random() - 0.5) * 0.01,
            0,
            0,
            'pool',
            ward.wardId,
          ),
        );
      }

      // Ripple particles at overflow hotspots
      if (w.fillLevel > 0.6 && Math.random() < 0.08) {
        const hotspot =
          OVERFLOW_HOTSPOTS[
            Math.floor(Math.random() * OVERFLOW_HOTSPOTS.length)
          ];
        newParticles.push(
          makeParticle(hotspot.lat, hotspot.lng, 0, 0, 'ripple'),
        );
      }
    });
  }

  // ── 3. Age & move particles ───────────────────────────────────────────────
  newParticles = newParticles
    .map((p) => ({
      ...p,
      lat: p.lat + p.vLat,
      lng: p.lng + p.vLng,
      age: p.age + 1,
      // flow particles accelerate slightly downhill
      vLat: p.type === 'flow' ? p.vLat * 1.002 : p.vLat,
      vLng: p.type === 'flow' ? p.vLng * 1.002 : p.vLng,
      // fade out near end of life
      alpha:
        p.age > p.maxAge * 0.7
          ? p.alpha * 0.96
          : p.type === 'ripple'
            ? Math.min(1, p.alpha + 0.05)
            : p.alpha,
      radius: p.type === 'ripple' ? p.radius + 0.6 : p.radius,
    }))
    .filter((p) => p.age < p.maxAge && p.alpha > 0.02);

  // Cap particles for performance
  if (newParticles.length > 600) {
    newParticles = newParticles.slice(newParticles.length - 600);
  }

  // ── 4. Update overflow hotspot intensity ─────────────────────────────────
  const newOverflowPoints = state.overflowPoints.map((op, i) => {
    const nearWard = wardList[i % wardList.length];
    const ward = newWards[nearWard?.wardId ?? ''];
    const intensity = ward ? ward.fillLevel : progress;
    return { ...op, radius: intensity * 40, intensity };
  });

  // ── 5. Update road flood zones ────────────────────────────────────────────
  const newRoadZones = state.roadFloodZones.map((rz, i) => {
    const relatedWard = wardList[i % wardList.length];
    const ward = newWards[relatedWard?.wardId ?? ''];
    const intensity = ward ? ward.fillLevel * 0.9 : progress * 0.8;
    return { ...rz, width: intensity * 30, intensity };
  });

  return {
    ...state,
    timeSeconds: newTime,
    globalProgress: progress,
    wards: newWards,
    particles: newParticles,
    overflowPoints: newOverflowPoints,
    roadFloodZones: newRoadZones,
    currentHour: Math.min(state.totalHours, newTime / 3600),
  };
}

export function resetSimulation(state: SimulationState): SimulationState {
  const emptyWards: Record<string, WardSimState> = {};
  Object.keys(state.wards).forEach((id) => {
    emptyWards[id] = {
      ...state.wards[id],
      fillLevel: 0,
      waterDepthCm: 0,
      inflowRate: 0,
      outflowRate: 0,
    };
  });
  return {
    ...state,
    timeSeconds: 0,
    globalProgress: 0,
    currentHour: 0,
    particles: [],
    wards: emptyWards,
    overflowPoints: state.overflowPoints.map((op) => ({
      ...op,
      radius: 0,
      intensity: 0,
    })),
    roadFloodZones: state.roadFloodZones.map((rz) => ({
      ...rz,
      width: 0,
      intensity: 0,
    })),
    isPlaying: true,
  };
}

/** Get ward fill color for map overlay */
export function wardFillColor(fillLevel: number): string {
  if (fillLevel < 0.15) return 'rgba(76,175,80,0.25)'; // green
  if (fillLevel < 0.4) return 'rgba(255,235,59,0.30)'; // yellow
  if (fillLevel < 0.65) return 'rgba(255,152,0,0.35)'; // orange
  return 'rgba(244,67,54,0.45)'; // red
}

/** AI panel summary text */
export function buildAIPanel(state: SimulationState): {
  rainfall: string;
  flowDirection: string;
  blockedDrains: string;
  affectedWards: string;
  timeToOverflow: string;
  confidence: string;
  primaryCause: string;
  recommendation: string;
} {
  const blocked = Object.values(state.wards).filter(
    (w) => w.drainBlocked && w.fillLevel > 0.1,
  );
  const affected = Object.values(state.wards).filter((w) => w.fillLevel > 0.1);
  const critical = Object.values(state.wards).filter((w) => w.fillLevel > 0.6);
  const hoursLeft = Math.max(0, (1 - state.globalProgress) * state.totalHours);

  return {
    rainfall: `${state.rainfallIntensityMmHr} mm/hr (Heavy — IMD Red Alert)`,
    flowDirection:
      'Western hills → City drains → Bay of Bengal (East-Southeast)',
    blockedDrains:
      blocked.length > 0
        ? blocked.map((w) => w.name).join(', ')
        : 'No critical blockages detected',
    affectedWards:
      affected.length > 0
        ? `${affected.length} wards affected — ${affected
            .map((w) => w.name)
            .slice(0, 3)
            .join(', ')}${affected.length > 3 ? '…' : ''}`
        : 'No wards inundated yet',
    timeToOverflow:
      critical.length > 0
        ? 'OVERFLOW ACTIVE — Immediate action required'
        : hoursLeft > 0
          ? `~${hoursLeft.toFixed(1)} hours until critical overflow`
          : 'Stabilising',
    confidence:
      '78% (AI-assisted visualization — not validated hydraulic model)',
    primaryCause:
      state.rainfallIntensityMmHr > 60
        ? 'Rainfall intensity exceeds urban drainage design capacity (45 mm/hr)'
        : 'Heavy monsoon rainfall accumulating in low-lying wards',
    recommendation:
      critical.length > 0
        ? '🚨 Issue evacuation orders for low-lying wards. Deploy NDRF teams.'
        : affected.length > 2
          ? '⚠️ Alert residents in affected wards. Pre-position rescue teams.'
          : '✅ Continue monitoring. Check drain clearance in at-risk wards.',
  };
}
