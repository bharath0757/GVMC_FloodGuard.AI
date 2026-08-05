import * as React from 'react';
import { Layers, ChevronDown, ChevronUp, Droplets } from 'lucide-react';

interface LegendProps {
  activeLayers: {
    riskZones: boolean;
    shelters: boolean;
    reports: boolean;
    stormwaterDrainage?: boolean;
    waterFlowSim?: boolean;
    floodSimulation?: boolean;
  };
}

const INUNDATION_SCALE = [
  { range: '0 - 0.5 m', color: '#9CCC65', label: 'Very Low' },
  { range: '0.5 - 1 m', color: '#D4E157', label: 'Low' },
  { range: '1 - 1.5 m', color: '#FFF59D', label: 'Moderate' },
  { range: '1.5 - 2 m', color: '#FFE082', label: 'Significant' },
  { range: '2 - 2.5 m', color: '#FFCC80', label: 'High' },
  { range: '2.5 - 3.5 m', color: '#FFB74D', label: 'Severe' },
  { range: '3.5 - 4.5 m', color: '#FF9800', label: 'Critical' },
  { range: '4.5 - 7.8 m', color: '#E65100', label: 'Extreme Surge' },
];

export const Legend: React.FC<LegendProps> = ({ activeLayers }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="absolute bottom-3 right-3 z-20 w-72 rounded-xl border border-slate-700 bg-slate-950/95 p-3 text-xs text-slate-200 shadow-2xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-teal-400">
          <Layers className="h-3.5 w-3.5" />
          <span>GIS MAP & DRAINAGE LEGEND</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-0.5 text-slate-400 hover:text-white"
        >
          {collapsed ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="max-h-96 space-y-3 overflow-y-auto pr-1 pt-1">
          {/* Dynamic Flood Flow Legend */}
          {activeLayers.floodSimulation && (
            <div>
              <span className="mb-1.5 block flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-blue-400">
                🌊 Dynamic Flood Flow
              </span>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-blue-400 opacity-70" />
                  <span className="text-slate-300">
                    Animated water particle
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-blue-600 opacity-50" />
                  <span className="text-slate-300">
                    Water pooling (blocked drain)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 shrink-0 rounded-full border-2 border-blue-400" />
                  <span className="text-slate-300">
                    Ripple — overflow point
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-red-500" />
                  <span className="text-slate-300">
                    Active overflow hotspot
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-5 shrink-0 rounded bg-blue-400 opacity-40" />
                  <span className="text-slate-300">Road flood zone</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {[
                    { color: 'rgba(76,175,80,0.4)', label: 'Ward: Dry / Safe' },
                    { color: 'rgba(255,235,59,0.45)', label: 'Ward: Filling' },
                    {
                      color: 'rgba(255,152,0,0.5)',
                      label: 'Ward: High Inundation',
                    },
                    {
                      color: 'rgba(244,67,54,0.55)',
                      label: 'Ward: Critical / Flooded',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center space-x-2"
                    >
                      <span
                        className="h-3 w-5 shrink-0 rounded border border-slate-700"
                        style={{ background: item.color }}
                      />
                      <span className="text-slate-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-1.5 font-sans text-[8.5px] italic text-slate-600">
                AI-assisted visualization · Not a validated hydraulic model
              </p>
            </div>
          )}

          {/* Urban Roadside & Underground Drain Legend */}
          {activeLayers.stormwaterDrainage && (
            <div>
              <span className="mb-1.5 block flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-blue-400">
                <Droplets className="h-3 w-3" /> Urban Stormwater Drains
              </span>
              <p className="mb-1.5 text-[9px] leading-tight text-slate-500">
                Roadside &amp; underground drains prone to plastic clogging
              </p>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center space-x-2">
                  <span className="h-[3px] w-6 shrink-0 rounded-full bg-[#3B82F6]" />
                  <span className="text-slate-300">
                    Clear — flowing normally
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-[3px] w-6 shrink-0 rounded-full bg-[#F59E0B]" />
                  <span className="text-slate-300">Partially clogged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-[3px] w-6 shrink-0 rounded-full bg-[#EF4444]" />
                  <span className="text-slate-300">
                    Blocked — overflow risk
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg width="24" height="4" className="shrink-0">
                    <line
                      x1="0"
                      y1="2"
                      x2="24"
                      y2="2"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                      strokeDasharray="5 4"
                    />
                  </svg>
                  <span className="text-slate-300">
                    Underground piped drain
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Storm Surge Inundation Depth Scale */}
          {activeLayers.riskZones && (
            <div className="border-t border-slate-800 pt-2">
              <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase text-slate-400">
                Inundation Depth (Meters)
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                {INUNDATION_SCALE.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className="h-3 w-6 shrink-0 rounded border border-slate-600"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-slate-200">
                        {item.range}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shelters */}
          {activeLayers.shelters && (
            <div className="border-t border-slate-800 pt-2">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase text-slate-400">
                Relief Shelters
              </span>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="flex h-4 w-4 items-center justify-center rounded-md border border-emerald-400 bg-emerald-600 text-[10px] font-bold text-white">
                  🏠
                </span>
                <span>Active Relief Shelter</span>
              </div>
            </div>
          )}

          {/* Citizen Reports */}
          {activeLayers.reports && (
            <div className="border-t border-slate-800 pt-2">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase text-slate-400">
                Citizen Reports
              </span>
              <div className="flex items-center space-x-3 font-mono text-[10px]">
                <div className="flex items-center space-x-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span>Critical</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
