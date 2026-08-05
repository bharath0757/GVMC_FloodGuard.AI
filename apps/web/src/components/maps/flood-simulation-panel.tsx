import * as React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertTriangle,
} from 'lucide-react';
import type { SimulationState } from './flood-simulation-engine';
import { buildAIPanel } from './flood-simulation-engine';

interface FloodSimPanelProps {
  state: SimulationState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (s: 0.5 | 1 | 2) => void;
  onScrub: (hour: number) => void;
  onWardClick?: (wardId: string) => void;
}

function formatHour(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `T+${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function fillColor(level: number): string {
  if (level < 0.15) return 'text-green-400';
  if (level < 0.4) return 'text-yellow-400';
  if (level < 0.65) return 'text-orange-400';
  return 'text-red-400';
}

function fillBg(level: number): string {
  if (level < 0.15) return 'bg-green-500';
  if (level < 0.4) return 'bg-yellow-400';
  if (level < 0.65) return 'bg-orange-500';
  return 'bg-red-500';
}

export const FloodSimPanel: React.FC<FloodSimPanelProps> = ({
  state,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onScrub,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const ai = buildAIPanel(state);
  const progressPct = (state.currentHour / state.totalHours) * 100;

  const wardList = Object.values(state.wards).sort(
    (a, b) => b.fillLevel - a.fillLevel,
  );

  return (
    <div className="bg-slate-950/97 absolute bottom-3 left-3 z-30 w-80 select-none overflow-hidden rounded-2xl border border-blue-900 font-mono text-xs text-slate-200 shadow-2xl backdrop-blur-xl">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-blue-900 bg-blue-950/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-blue-300">
            Dynamic Flood Flow Simulation
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[9px] italic text-slate-500">
            AI-Assisted · Not validated
          </span>
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
      </div>

      {!collapsed && (
        <>
          {/* ── Timeline controls ──────────────────────────────────────── */}
          <div className="space-y-2 border-b border-slate-800 px-3 pb-2 pt-2.5">
            {/* Playback row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {state.isPlaying ? (
                  <button
                    onClick={onPause}
                    className="flex items-center gap-1 rounded-lg border border-blue-800 bg-blue-900/50 px-2 py-1 text-blue-300 transition-colors hover:bg-blue-900"
                  >
                    <Pause className="h-3 w-3" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={onPlay}
                    className="flex items-center gap-1 rounded-lg border border-blue-500 bg-blue-600/80 px-2 py-1 text-white transition-colors hover:bg-blue-500"
                  >
                    <Play className="h-3 w-3" /> Play
                  </button>
                )}
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 transition-colors hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* Speed buttons */}
              <div className="flex items-center gap-1">
                <Gauge className="h-3 w-3 text-slate-500" />
                {([0.5, 1, 2] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onSpeedChange(s)}
                    className={`rounded border px-2 py-0.5 text-[10px] font-bold transition-colors ${
                      state.speed === s
                        ? 'border-blue-400 bg-blue-600 text-white'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>T+00:00</span>
                <span className="font-bold text-blue-400">
                  {formatHour(state.currentHour)}
                </span>
                <span>T+{state.totalHours}:00</span>
              </div>
              <input
                type="range"
                min={0}
                max={state.totalHours}
                step={0.1}
                value={state.currentHour}
                onChange={(e) => onScrub(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-blue-500"
              />
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Rainfall badge */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Rainfall Intensity:</span>
              <span className="font-bold text-red-400">
                {state.rainfallIntensityMmHr} mm/hr — 🌧️ RED ALERT
              </span>
            </div>
          </div>

          {/* ── AI Explanation Panel ──────────────────────────────────── */}
          <div className="space-y-1.5 border-b border-slate-800 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase text-teal-400">
              <Brain className="h-3 w-3" />
              AI Simulation Summary
            </div>

            {[
              {
                label: 'Flow Direction',
                value: ai.flowDirection,
                color: 'text-cyan-400',
              },
              {
                label: 'Blocked Drains',
                value: ai.blockedDrains,
                color: 'text-amber-400',
              },
              {
                label: 'Affected Wards',
                value: ai.affectedWards,
                color: 'text-orange-400',
              },
              {
                label: 'Time to Overflow',
                value: ai.timeToOverflow,
                color: 'text-red-400',
              },
              {
                label: 'Primary Cause',
                value: ai.primaryCause,
                color: 'text-slate-300',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-[10px]">
                <span className="text-slate-500">{label}: </span>
                <span className={`${color} font-bold`}>{value}</span>
              </div>
            ))}

            {/* Recommendation */}
            <div className="mt-1.5 rounded-lg border border-slate-700 bg-slate-900 p-2 font-sans text-[10px] leading-snug">
              <span className="mb-0.5 block font-mono font-bold text-teal-400">
                Recommended Action
              </span>
              <span className="text-slate-300">{ai.recommendation}</span>
            </div>

            <div className="text-[9px] italic text-slate-600">
              Confidence: {ai.confidence}
            </div>
          </div>

          {/* ── Ward inundation table ─────────────────────────────────── */}
          <div className="max-h-40 overflow-y-auto px-3 py-2">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
              <AlertTriangle className="h-3 w-3" />
              Ward Inundation Status
            </div>
            <div className="space-y-1">
              {wardList.map((ward) => (
                <div
                  key={ward.wardId}
                  className="flex items-center justify-between"
                >
                  <span
                    className={`w-28 truncate text-[10px] ${fillColor(ward.fillLevel)}`}
                  >
                    {ward.name}
                  </span>
                  <div className="ml-1 flex flex-1 items-center gap-1.5">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${fillBg(ward.fillLevel)}`}
                        style={{
                          width: `${Math.round(ward.fillLevel * 100)}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`w-10 text-right text-[9px] font-bold ${fillColor(ward.fillLevel)}`}
                    >
                      {ward.waterDepthCm}cm
                    </span>
                    {ward.drainBlocked && (
                      <span className="text-[8px] font-bold text-red-400">
                        ⛔
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Disclaimer ────────────────────────────────────────────── */}
          <div className="border-t border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <p className="font-sans text-[8.5px] italic leading-tight text-slate-600">
              ⚠️ AI-assisted visualization for decision support only. Not a
              validated hydraulic model. Do not use as a substitute for
              professional hydrodynamic modelling.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
