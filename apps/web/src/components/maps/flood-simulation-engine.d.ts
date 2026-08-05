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
  elevationRank: number;
}
export interface FloodParticle {
  id: number;
  lat: number;
  lng: number;
  vLat: number;
  vLng: number;
  alpha: number;
  radius: number;
  age: number;
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
export declare function initSimulation(
  mockWards: Array<{
    id: string;
    number: number;
    name: string;
    riskScore: number;
  }>,
  rainfallMmHr?: number,
): SimulationState;
export declare function stepSimulation(
  state: SimulationState,
  dtMs: number,
): SimulationState;
export declare function resetSimulation(
  state: SimulationState,
): SimulationState;
/** Get ward fill color for map overlay */
export declare function wardFillColor(fillLevel: number): string;
/** AI panel summary text */
export declare function buildAIPanel(state: SimulationState): {
  rainfall: string;
  flowDirection: string;
  blockedDrains: string;
  affectedWards: string;
  timeToOverflow: string;
  confidence: string;
  primaryCause: string;
  recommendation: string;
};
//# sourceMappingURL=flood-simulation-engine.d.ts.map
