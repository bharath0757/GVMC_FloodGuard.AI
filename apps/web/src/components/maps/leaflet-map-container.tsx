import * as React from 'react';
import L from 'leaflet';
import { CoordinateDisplay } from './coordinate-display';
import { Legend } from './legend';
import { MapControls } from './map-controls';
import { LayerManager } from './layer-manager';
import { MapToolbar } from './map-toolbar';
import { Popup } from './popup';
import { MOCK_WARDS, MOCK_SHELTERS, MOCK_CROWD_REPORTS } from '@/data/mockData';
import { FloodSimOverlay } from './flood-simulation-overlay';
import { FloodSimPanel } from './flood-simulation-panel';
import {
  initSimulation,
  stepSimulation,
  resetSimulation,
  type SimulationState,
} from './flood-simulation-engine';

interface LeafletMapProps {
  selectedWardId?: string;
  onSelectWard?: (id: string) => void;
  height?: string;
}

const VIZAG_WARD_POLYGONS: Record<number, [number, number][]> = {
  14: [
    [17.68, 83.21],
    [17.68, 83.23],
    [17.7, 83.23],
    [17.7, 83.21],
  ],
  8: [
    [17.695, 83.295],
    [17.695, 83.315],
    [17.715, 83.315],
    [17.715, 83.295],
  ],
  3: [
    [17.72, 83.31],
    [17.72, 83.33],
    [17.74, 83.33],
    [17.74, 83.31],
  ],
  22: [
    [17.69, 83.235],
    [17.69, 83.255],
    [17.71, 83.255],
    [17.71, 83.235],
  ],
  11: [
    [17.73, 83.29],
    [17.73, 83.31],
    [17.75, 83.31],
    [17.75, 83.29],
  ],
  16: [
    [17.745, 83.325],
    [17.745, 83.345],
    [17.765, 83.345],
    [17.765, 83.325],
  ],
  5: [
    [17.718, 83.298],
    [17.718, 83.318],
    [17.738, 83.318],
    [17.738, 83.298],
  ],
  19: [
    [17.72, 83.26],
    [17.72, 83.28],
    [17.74, 83.28],
    [17.74, 83.26],
  ],
  2: [
    [17.735, 83.32],
    [17.735, 83.34],
    [17.755, 83.34],
    [17.755, 83.32],
  ],
};

const SURGE_COLORS: Record<string, string> = {
  Critical: '#E65100',
  High: '#FF9800',
  Medium: '#FFE082',
  Low: '#9CCC65',
};

// ─────────────────────────────────────────────────────────────────────────────
// Drain status — deterministic seeded assignment per OSM way ID
// 60% Clear (blue) · 28% Partially Clogged (amber) · 12% Blocked (red)
// ─────────────────────────────────────────────────────────────────────────────
function drainStatusForId(id: number): 'clear' | 'partial' | 'blocked' {
  const h = (id * 2654435761) >>> 0; // Knuth hash
  const pct = h % 100;
  if (pct < 60) return 'clear';
  if (pct < 88) return 'partial';
  return 'blocked';
}

const STATUS_COLOR = {
  clear: '#3B82F6', // blue
  partial: '#F59E0B', // amber
  blocked: '#EF4444', // red
} as const;

const STATUS_LABEL = {
  clear: 'Clear — flowing normally',
  partial: 'Partially Clogged',
  blocked: 'Blocked — overflow risk',
} as const;

const STATUS_CAUSE: Record<string, string> = {
  clear: 'No obstructions detected. Inlet grates clear.',
  partial: 'Plastic carry bags, silt and leaf debris partially blocking flow.',
  blocked:
    'Solid waste blockage: polythene, thermocol, bottle caps. Road inundation risk.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Fetch Visakhapatnam road network from Overpass API
// Returns { ways: [[lat,lng][], ...], wayIds: number[] }
// ─────────────────────────────────────────────────────────────────────────────
interface OverpassElement {
  type: 'node' | 'way';
  id: number;
  lat?: number;
  lon?: number;
  nodes?: number[];
  tags?: Record<string, string>;
}

async function fetchVizagRoads(): Promise<
  { coords: [number, number][]; id: number }[]
> {
  const query = `[out:json][timeout:30];
(
  way["highway"~"^(primary|secondary|tertiary|residential|trunk|unclassified|service|living_street)$"]
    (17.660,83.170,17.810,83.430);
);
out body;
>;
out skel qt;`;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });

  if (!res.ok) throw new Error('Overpass fetch failed');
  const json = (await res.json()) as { elements: OverpassElement[] };

  // Build node lookup
  const nodes = new Map<number, [number, number]>();
  for (const el of json.elements) {
    if (el.type === 'node' && el.lat != null && el.lon != null) {
      nodes.set(el.id, [el.lat, el.lon]);
    }
  }

  // Build way polylines
  const ways: { coords: [number, number][]; id: number }[] = [];
  for (const el of json.elements) {
    if (el.type === 'way' && el.nodes && el.nodes.length >= 2) {
      const coords = el.nodes.map((nid) => nodes.get(nid)).filter(Boolean) as [
        number,
        number,
      ][];
      if (coords.length >= 2) ways.push({ coords, id: el.id });
    }
  }
  return ways;
}

export const LeafletMapContainer: React.FC<LeafletMapProps> = ({
  selectedWardId = 'w14',
  onSelectWard,
  height = '600px',
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);
  const tileLayerRef = React.useRef<L.TileLayer | null>(null);
  const polygonLayerGroupRef = React.useRef<L.LayerGroup | null>(null);
  const shelterLayerGroupRef = React.useRef<L.LayerGroup | null>(null);
  const reportLayerGroupRef = React.useRef<L.LayerGroup | null>(null);
  const drainageLayerGroupRef = React.useRef<L.LayerGroup | null>(null);

  const [lat, setLat] = React.useState(17.72);
  const [lng, setLng] = React.useState(83.29);
  const [zoom, setZoom] = React.useState(13);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStyle, setSelectedStyle] = React.useState('dark');
  const [severityFilter, setSeverityFilter] = React.useState('ALL');
  const [drainLoading, setDrainLoading] = React.useState(false);
  const [layers, setLayers] = React.useState({
    riskZones: true,
    shelters: true,
    reports: true,
    radar: false,
    stormwaterDrainage: true,
    floodSimulation: false,
  });

  // ─── Flood Simulation State ───────────────────────────────────────────
  const [simState, setSimState] = React.useState<SimulationState>(() =>
    initSimulation(MOCK_WARDS, 68),
  );
  const simRafRef = React.useRef<number>(0);
  const lastFrameRef = React.useRef<number>(0);

  const [activePopup, setActivePopup] = React.useState<{
    type: 'shelter' | 'report' | 'riskZone' | 'drainage';
    data: Record<string, unknown>;
  } | null>(null);

  // ─── Init map ───────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [17.72, 83.29],
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true, // canvas renderer = much faster for hundreds of polylines
    });

    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, CARTO | GVMC Drainage Data',
      },
    ).addTo(map);
    tileLayerRef.current = tileLayer;

    polygonLayerGroupRef.current = L.layerGroup().addTo(map);
    shelterLayerGroupRef.current = L.layerGroup().addTo(map);
    reportLayerGroupRef.current = L.layerGroup().addTo(map);
    drainageLayerGroupRef.current = L.layerGroup().addTo(map);

    map.on('move', () => {
      const c = map.getCenter();
      setLat(Number(c.lat.toFixed(4)));
      setLng(Number(c.lng.toFixed(4)));
      setZoom(Number(map.getZoom().toFixed(1)));
    });

    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      cancelAnimationFrame(simRafRef.current);
    };
  }, []);

  // ─── Tile switcher ──────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const urls: Record<string, string> = {
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite:
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    };
    tileLayerRef.current = L.tileLayer(urls[selectedStyle] || urls.dark, {
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [selectedStyle]);

  // ─── Risk Zone Polygons ──────────────────────────────────────────────────
  React.useEffect(() => {
    if (!mapInstanceRef.current || !polygonLayerGroupRef.current) return;
    polygonLayerGroupRef.current.clearLayers();
    if (!layers.riskZones) return;

    MOCK_WARDS.forEach((w) => {
      const fallback: [number, number][] = [
        [17.68 + w.number * 0.003, 83.21 + w.number * 0.003],
        [17.68 + w.number * 0.003, 83.23 + w.number * 0.003],
        [17.7 + w.number * 0.003, 83.23 + w.number * 0.003],
        [17.7 + w.number * 0.003, 83.21 + w.number * 0.003],
      ];
      const coords = VIZAG_WARD_POLYGONS[w.number] || fallback;
      const isSelected = w.id === selectedWardId;

      const polygon = L.polygon(coords, {
        color: '#D32F2F',
        weight: isSelected ? 3.5 : 2,
        fillColor: SURGE_COLORS[w.riskCategory] || '#FFB74D',
        fillOpacity: isSelected ? 0.85 : 0.65,
      });
      polygon.on('click', () => {
        if (onSelectWard) onSelectWard(w.id);
        setActivePopup({
          type: 'riskZone',
          data: w as unknown as Record<string, unknown>,
        });
      });
      polygonLayerGroupRef.current?.addLayer(polygon);

      const cLat = coords.reduce((a, c) => a + c[0], 0) / coords.length;
      const cLng = coords.reduce((a, c) => a + c[1], 0) / coords.length;
      const lbl = L.divIcon({
        className: '',
        html: `<div style="color:#111;background:rgba(255,255,255,0.9);font-weight:bold;font-size:10px;padding:2px 5px;border-radius:4px;border:1px solid #D32F2F;white-space:nowrap;font-family:sans-serif;cursor:pointer;">${w.name.toUpperCase()}</div>`,
        iconSize: [80, 20],
        iconAnchor: [40, 10],
      });
      const lm = L.marker([cLat, cLng], { icon: lbl });
      lm.on('click', () => {
        if (onSelectWard) onSelectWard(w.id);
        setActivePopup({
          type: 'riskZone',
          data: w as unknown as Record<string, unknown>,
        });
      });
      polygonLayerGroupRef.current?.addLayer(lm);
    });
  }, [layers.riskZones, selectedWardId, onSelectWard]);

  // ─── Drainage: fetch OSM roads → draw as drain lines ────────────────────
  React.useEffect(() => {
    if (!drainageLayerGroupRef.current) return;
    drainageLayerGroupRef.current.clearLayers();
    if (!layers.stormwaterDrainage) return;

    setDrainLoading(true);

    fetchVizagRoads()
      .then((ways) => {
        if (!drainageLayerGroupRef.current) return;
        drainageLayerGroupRef.current.clearLayers();

        const renderer = L.canvas({ padding: 0.5 });

        ways.forEach(({ coords, id }) => {
          const status = drainStatusForId(id);
          const color = STATUS_COLOR[status];

          const line = L.polyline(coords, {
            renderer,
            color,
            weight: 2,
            opacity: 0.75,
          });

          line.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            setActivePopup({
              type: 'drainage',
              data: {
                name: `Road Drain — Way #${id}`,
                drainType: 'Urban Roadside Drain (Alongside Road)',
                status: STATUS_LABEL[status],
                capacity: '0.5–1.0 m wide × 0.4–0.8 m deep',
                connectedWards: 'GVMC Municipal Zone',
                flowDirection:
                  'Road runoff → Nearest nallah / underground outlet',
                maintenanceStatus:
                  status === 'blocked'
                    ? '🚨 Emergency desilting required. GVMC team required.'
                    : status === 'partial'
                      ? '⚠️ Scheduled desilting pending.'
                      : '✅ Pre-monsoon cleaning completed.',
                capacityStatus:
                  status === 'blocked'
                    ? '100% Blocked — Overflow onto road surface'
                    : status === 'partial'
                      ? '70–85% Utilization — Reduced capacity'
                      : '30–55% Normal flow',
                congestionLevel: STATUS_CAUSE[status],
                overflowProbability:
                  status === 'blocked'
                    ? '92%'
                    : status === 'partial'
                      ? '55%'
                      : '14%',
                aiReason: STATUS_CAUSE[status],
              },
            });
          });

          drainageLayerGroupRef.current?.addLayer(line);
        });
      })
      .catch(() => {
        // Overpass API unavailable — leave layer empty, show no error
      })
      .finally(() => setDrainLoading(false));
  }, [layers.stormwaterDrainage]);

  // ─── Shelter markers ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!mapInstanceRef.current || !shelterLayerGroupRef.current) return;
    shelterLayerGroupRef.current.clearLayers();
    if (!layers.shelters) return;
    MOCK_SHELTERS.forEach((sh) => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:#059669;border:2px solid #34D399;color:white;border-radius:8px;padding:3px 6px;font-weight:bold;font-size:11px;box-shadow:0 4px 6px rgba(0,0,0,0.3);">🏠 ${sh.name.split(' ')[0]}</div>`,
        iconSize: [90, 26],
        iconAnchor: [45, 13],
      });
      const m = L.marker([sh.lat, sh.lng], { icon });
      m.on('click', () =>
        setActivePopup({
          type: 'shelter',
          data: sh as unknown as Record<string, unknown>,
        }),
      );
      shelterLayerGroupRef.current?.addLayer(m);
    });
  }, [layers.shelters]);

  // ─── Crowd reports ───────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!mapInstanceRef.current || !reportLayerGroupRef.current) return;
    reportLayerGroupRef.current.clearLayers();
    if (!layers.reports) return;
    MOCK_CROWD_REPORTS.filter(
      (r) => severityFilter === 'ALL' || r.severity === severityFilter,
    ).forEach((rep) => {
      const col =
        rep.severity === 'Critical'
          ? '#EF4444'
          : rep.severity === 'High'
            ? '#F97316'
            : '#F59E0B';
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${col};border:2px solid white;color:white;border-radius:50%;width:22px;height:22px;font-weight:bold;font-size:11px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.4);">!</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const repItem = rep as typeof rep & { lat?: number; lng?: number };
      const m = L.marker([repItem.lat ?? 17.685, repItem.lng ?? 83.21], {
        icon,
      });
      m.on('click', () =>
        setActivePopup({
          type: 'report',
          data: rep as unknown as Record<string, unknown>,
        }),
      );
      reportLayerGroupRef.current?.addLayer(m);
    });
  }, [layers.reports, severityFilter]);

  const handleFlyTo = (
    targetLat: number,
    targetLng: number,
    targetZoom = 14.5,
  ) => {
    mapInstanceRef.current?.flyTo([targetLat, targetLng], targetZoom, {
      duration: 1.5,
    });
  };

  // ─── Simulation RAF step loop ────────────────────────────────────────
  React.useEffect(() => {
    if (!layers.floodSimulation) {
      cancelAnimationFrame(simRafRef.current);
      return;
    }
    const step = (timestamp: number) => {
      const dt =
        lastFrameRef.current === 0
          ? 16
          : Math.min(timestamp - lastFrameRef.current, 100);
      lastFrameRef.current = timestamp;
      setSimState((prev) => stepSimulation(prev, dt));
      simRafRef.current = requestAnimationFrame(step);
    };
    simRafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(simRafRef.current);
      lastFrameRef.current = 0;
    };
  }, [layers.floodSimulation, simState.isPlaying]);

  const handleSimPlay = () => setSimState((s) => ({ ...s, isPlaying: true }));
  const handleSimPause = () => setSimState((s) => ({ ...s, isPlaying: false }));
  const handleSimReset = () => setSimState((s) => resetSimulation(s));
  const handleSimSpeed = (sp: 0.5 | 1 | 2) =>
    setSimState((s) => ({ ...s, speed: sp }));
  const handleSimScrub = (hour: number) => {
    setSimState((s) => ({
      ...s,
      currentHour: hour,
      timeSeconds: hour * 3600,
      globalProgress: hour / s.totalHours,
      isPlaying: false,
    }));
  };

  return (
    <div
      style={{ height }}
      className="relative w-full select-none overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 font-sans"
    >
      <MapToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        onSearchSelect={(q: string) => {
          const ward = MOCK_WARDS.find((w) =>
            w.name.toLowerCase().includes(q.toLowerCase()),
          );
          if (ward)
            handleFlyTo(
              17.6868 + ward.number * 0.003,
              83.2185 + ward.number * 0.003,
              14,
            );
        }}
      />

      <LayerManager
        layers={layers}
        onToggleLayer={(k: keyof typeof layers) =>
          setLayers((prev) => ({ ...prev, [k]: !prev[k] }))
        }
      />

      <MapControls
        onZoomIn={() => mapInstanceRef.current?.zoomIn()}
        onZoomOut={() => mapInstanceRef.current?.zoomOut()}
        onResetPitch={() => mapInstanceRef.current?.setView([17.72, 83.29], 13)}
        onToggleFullscreen={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
        }}
        onGeolocate={() => handleFlyTo(17.6868, 83.2185, 13)}
      />

      <div ref={mapContainerRef} className="z-0 h-full w-full" />

      {/* ── Flood Simulation Canvas Overlay ─────────────────────────── */}
      <FloodSimOverlay
        map={mapInstanceRef.current}
        simState={simState}
        active={layers.floodSimulation}
      />

      {/* Drain data loading indicator */}
      {drainLoading && layers.stormwaterDrainage && (
        <div className="absolute bottom-16 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-blue-800 bg-slate-950/90 px-4 py-1.5 font-mono text-[11px] text-blue-400 shadow-lg backdrop-blur-md">
          <span className="h-2 w-2 animate-ping rounded-full bg-blue-400" />
          Loading drain network from OSM…
        </div>
      )}

      {activePopup && (
        <Popup
          type={activePopup.type}
          data={activePopup.data}
          onClose={() => setActivePopup(null)}
        />
      )}

      {/* ── Flood Simulation Control Panel ──────────────────────────── */}
      {layers.floodSimulation && (
        <FloodSimPanel
          state={simState}
          onPlay={handleSimPlay}
          onPause={handleSimPause}
          onReset={handleSimReset}
          onSpeedChange={handleSimSpeed}
          onScrub={handleSimScrub}
        />
      )}

      <CoordinateDisplay
        lat={lat}
        lng={lng}
        zoom={zoom}
        pitch={0}
        bearing={0}
      />
      <Legend activeLayers={layers} />
    </div>
  );
};
