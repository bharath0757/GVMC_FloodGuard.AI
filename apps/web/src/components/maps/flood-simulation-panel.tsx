import * as React from 'react';
import { Play, Pause, RotateCcw, Gauge, ChevronDown, ChevronUp, Brain, AlertTriangle } from 'lucide-react';
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
  if (level < 0.40) return 'text-yellow-400';
  if (level < 0.65) return 'text-orange-400';
  return 'text-red-400';
}

function fillBg(level: number): string {
  if (level < 0.15) return 'bg-green-500';
  if (level < 0.40) return 'bg-yellow-400';
  if (level < 0.65) return 'bg-orange-500';
  return 'bg-red-500';
}

export const FloodSimPanel: React.FC<FloodSimPanelProps> = ({
  state, onPlay, onPause, onReset, onSpeedChange, onScrub,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const ai = buildAIPanel(state);
  const progressPct = (state.currentHour / state.totalHours) * 100;

  const wardList = Object.values(state.wards)
    .sort((a, b) => b.fillLevel - a.fillLevel);

  return (
    <div className="absolute bottom-3 left-3 z-30 w-80 rounded-2xl border border-blue-900 bg-slate-950/97 shadow-2xl backdrop-blur-xl text-xs font-mono text-slate-200 select-none overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-950/60 border-b border-blue-900">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="font-bold text-[11px] text-blue-300 uppercase tracking-wide">
            Dynamic Flood Flow Simulation
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-500 font-sans italic">AI-Assisted · Not validated</span>
          <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white p-0.5">
            {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* ── Timeline controls ──────────────────────────────────────── */}
          <div className="px-3 pt-2.5 pb-2 border-b border-slate-800 space-y-2">
            {/* Playback row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {state.isPlaying ? (
                  <button
                    onClick={onPause}
                    className="flex items-center gap-1 rounded-lg bg-blue-900/50 border border-blue-800 px-2 py-1 text-blue-300 hover:bg-blue-900 transition-colors"
                  >
                    <Pause className="h-3 w-3" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={onPlay}
                    className="flex items-center gap-1 rounded-lg bg-blue-600/80 border border-blue-500 px-2 py-1 text-white hover:bg-blue-500 transition-colors"
                  >
                    <Play className="h-3 w-3" /> Play
                  </button>
                )}
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 hover:text-white transition-colors"
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
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                      state.speed === s
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
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
                <span className="text-blue-400 font-bold">{formatHour(state.currentHour)}</span>
                <span>T+{state.totalHours}:00</span>
              </div>
              <input
                type="range"
                min={0}
                max={state.totalHours}
                step={0.1}
                value={state.currentHour}
                onChange={(e) => onScrub(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full bg-slate-800 accent-blue-500 cursor-pointer"
              />
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Rainfall badge */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Rainfall Intensity:</span>
              <span className="text-red-400 font-bold">{state.rainfallIntensityMmHr} mm/hr — 🌧️ RED ALERT</span>
            </div>
          </div>

          {/* ── AI Explanation Panel ──────────────────────────────────── */}
          <div className="px-3 py-2 border-b border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400 uppercase mb-1">
              <Brain className="h-3 w-3" />
              AI Simulation Summary
            </div>

            {[
              { label: 'Flow Direction', value: ai.flowDirection, color: 'text-cyan-400' },
              { label: 'Blocked Drains', value: ai.blockedDrains, color: 'text-amber-400' },
              { label: 'Affected Wards', value: ai.affectedWards, color: 'text-orange-400' },
              { label: 'Time to Overflow', value: ai.timeToOverflow, color: 'text-red-400' },
              { label: 'Primary Cause', value: ai.primaryCause, color: 'text-slate-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-[10px]">
                <span className="text-slate-500">{label}: </span>
                <span className={`${color} font-bold`}>{value}</span>
              </div>
            ))}

            {/* Recommendation */}
            <div className="mt-1.5 rounded-lg bg-slate-900 border border-slate-700 p-2 text-[10px] font-sans leading-snug">
              <span className="text-teal-400 font-bold font-mono block mb-0.5">Recommended Action</span>
              <span className="text-slate-300">{ai.recommendation}</span>
            </div>

            <div className="text-[9px] text-slate-600 italic">
              Confidence: {ai.confidence}
            </div>
          </div>

          {/* ── Ward inundation table ─────────────────────────────────── */}
          <div className="px-3 py-2 max-h-40 overflow-y-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1.5">
              <AlertTriangle className="h-3 w-3" />
              Ward Inundation Status
            </div>
            <div className="space-y-1">
              {wardList.map((ward) => (
                <div
                  key={ward.wardId}
                  className="flex items-center justify-between"
                >
                  <span className={`text-[10px] truncate w-28 ${fillColor(ward.fillLevel)}`}>
                    {ward.name}
                  </span>
                  <div className="flex items-center gap-1.5 flex-1 ml-1">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${fillBg(ward.fillLevel)}`}
                        style={{ width: `${Math.round(ward.fillLevel * 100)}%` }}
                      />
                    </div>
                    <span className={`text-[9px] w-10 text-right font-bold ${fillColor(ward.fillLevel)}`}>
                      {ward.waterDepthCm}cm
                    </span>
                    {ward.drainBlocked && (
                      <span className="text-[8px] text-red-400 font-bold">⛔</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Disclaimer ────────────────────────────────────────────── */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800">
            <p className="text-[8.5px] text-slate-600 italic font-sans leading-tight">
              ⚠️ AI-assisted visualization for decision support only. Not a validated hydraulic model.
              Do not use as a substitute for professional hydrodynamic modelling.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
