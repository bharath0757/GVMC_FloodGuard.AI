import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  ShieldAlert,
  CloudRain,
  Wind,
  Waves,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { Badge, Button, Progress } from '@floodguard/ui';
import { IncidentTimeline } from './incident-timeline';

interface RightIntelligencePanelProps {
  selectedWard?: {
    name: string;
    number: number;
    riskCategory: string;
    waterLevelCm: number;
    rainfallMmHr: number;
    elevationMeters: number;
    population: number;
  };
  weather?: {
    rainfall_mm_hr?: number;
    rainfallMmHr?: number;
    rainfall_cumulative_24h?: number;
    rainfallCumulative24h?: number;
    wind_speed_kmh?: number;
    tide_level_m?: number;
    forecast_summary?: string;
    forecast6h?: string;
  };
  sheltersCount?: number;
  reportsCount?: number;
  onDispatchTeam?: () => void;
}

export const RightIntelligencePanel: React.FC<RightIntelligencePanelProps> = ({
  selectedWard,
  weather,
  sheltersCount = 8,
  onDispatchTeam,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    'ai' | 'timeline' | 'telemetry'
  >('ai');

  const rainRate = weather?.rainfall_mm_hr ?? weather?.rainfallMmHr ?? 42.8;
  const rain24h =
    weather?.rainfall_cumulative_24h ?? weather?.rainfallCumulative24h ?? 184.2;
  const windSpeed = weather?.wind_speed_kmh ?? 34.5;
  const tideLevel = weather?.tide_level_m ?? 2.15;

  return (
    <aside className="flex h-full w-full shrink-0 flex-col space-y-4 overflow-y-auto border-l border-slate-800/80 bg-slate-950/90 p-4 lg:w-96">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-1.5 text-cyan-400">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">
              EOC Intelligence Hub
            </h3>
            <p className="font-mono text-[10px] text-slate-400">
              Real-time AI & Sensor Telemetry
            </p>
          </div>
        </div>
        <Badge variant="risk_critical" className="font-mono text-[10px]">
          STAGE 3 ALERT
        </Badge>
      </div>

      {/* Segmented Navigation Buttons */}
      <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center justify-center space-x-1 rounded-md px-2 py-1.5 transition-colors ${
            activeTab === 'ai'
              ? 'bg-cyan-600 font-bold text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Insights</span>
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center justify-center space-x-1 rounded-md px-2 py-1.5 transition-colors ${
            activeTab === 'telemetry'
              ? 'bg-cyan-600 font-bold text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CloudRain className="h-3.5 w-3.5" />
          <span>Telemetry</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center justify-center space-x-1 rounded-md px-2 py-1.5 transition-colors ${
            activeTab === 'timeline'
              ? 'bg-cyan-600 font-bold text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Timeline</span>
        </button>
      </div>

      {/* TAB 1: AI INSIGHTS & EXPLAINABILITY */}
      {activeTab === 'ai' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Main AI Flood Risk Prediction Card */}
          <div className="relative space-y-3 overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/40 via-slate-900/90 to-slate-900/90 p-4 shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/10 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5 animate-pulse text-red-500" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-400">
                  TFT Model Forecast (2h)
                </span>
              </div>
              <Badge variant="risk_critical">94.8% Conf</Badge>
            </div>

            <div>
              <div className="font-mono text-2xl font-black tracking-tight text-white">
                CRITICAL INUNDATION RISK
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                TFT Temporal Transformer predicts water surge to exceed{' '}
                <strong className="font-mono text-red-400">74cm</strong> in Ward
                #{selectedWard?.number || 14} (
                {selectedWard?.name || 'Gajuwaka Industrial Zone'}) within{' '}
                <strong className="font-mono text-amber-400">45 minutes</strong>
                .
              </p>
            </div>

            {/* Confidence & Risk Drivers */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">
                  TFT Neural Confidence Gauge
                </span>
                <span className="font-bold text-cyan-400">94.8%</span>
              </div>
              <Progress value={94.8} className="h-2 bg-slate-800" />
            </div>

            {/* Explainable AI Risk Drivers */}
            <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs">
              <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-slate-400">
                <Info className="h-3 w-3 text-cyan-400" /> Key Prediction
                Drivers
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    1. Sustained Rainfall Intensity
                  </span>
                  <span className="font-mono font-bold text-red-400">
                    48% impact
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    2. Tidal Backwater Lock (Spring Tide)
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    32% impact
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    3. Storm Drain Blockage Factor
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    20% impact
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Command Actions */}
            <div className="space-y-2">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
                RECOMMENDED NDMA ACTIONS:
              </span>
              <ul className="space-y-1.5 pl-1 font-sans text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>
                    Issue SMS evacuation warnings to residents in Ward 14
                    low-lying sectors.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>
                    Deploy high-capacity mobile dewatering pumps to NH-16
                    underpass.
                  </span>
                </li>
              </ul>
            </div>

            <Button
              variant="danger"
              size="sm"
              className="w-full text-xs font-bold"
              onClick={onDispatchTeam}
            >
              Execute Emergency Evacuation Order
            </Button>
          </div>

          {/* Active Ward Intelligence Snapshot */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span>TARGET SECTOR</span>
              <span className="font-bold text-cyan-400">
                WARD #{selectedWard?.number || 14}
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              {selectedWard?.name || 'Gajuwaka Industrial Zone'}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="rounded border border-slate-800 bg-slate-950 p-2">
                <span className="block text-[9px] uppercase text-slate-500">
                  Est Water Depth
                </span>
                <span className="text-sm font-bold text-red-400">
                  {selectedWard?.waterLevelCm || 68} cm
                </span>
              </div>
              <div className="rounded border border-slate-800 bg-slate-950 p-2">
                <span className="block text-[9px] uppercase text-slate-500">
                  Population Exposed
                </span>
                <span className="text-sm font-bold text-amber-400">
                  {(selectedWard?.population || 84000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: TELEMETRY & WEATHER */}
      {activeTab === 'telemetry' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-xs"
        >
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-white">
                <CloudRain className="h-4 w-4 text-cyan-400" /> IMD Telemetry
                Feeds
              </span>
              <Badge variant="safe">SENSORS ONLINE</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950 p-3">
                <span className="block font-mono text-[10px] uppercase text-slate-400">
                  Rainfall Rate
                </span>
                <span className="font-mono text-xl font-bold text-cyan-400">
                  {rainRate} mm/h
                </span>
                <span className="block font-mono text-[10px] text-amber-400">
                  Heavy Downpour
                </span>
              </div>

              <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950 p-3">
                <span className="block font-mono text-[10px] uppercase text-slate-400">
                  24h Cumulative
                </span>
                <span className="font-mono text-xl font-bold text-cyan-400">
                  {rain24h} mm
                </span>
                <span className="block font-mono text-[10px] text-red-400">
                  +42mm in 3h
                </span>
              </div>

              <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950 p-3">
                <span className="block flex items-center gap-1 font-mono text-[10px] uppercase text-slate-400">
                  <Wind className="h-3 w-3 text-slate-400" /> Wind Velocity
                </span>
                <span className="font-mono text-lg font-bold text-white">
                  {windSpeed} km/h
                </span>
                <span className="block font-mono text-[10px] text-slate-400">
                  NE Cyclonic
                </span>
              </div>

              <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950 p-3">
                <span className="block flex items-center gap-1 font-mono text-[10px] uppercase text-slate-400">
                  <Waves className="h-3 w-3 text-cyan-400" /> Tide Gauge
                </span>
                <span className="font-mono text-lg font-bold text-red-400">
                  {tideLevel} m
                </span>
                <span className="block font-mono text-[10px] text-red-400">
                  Spring Tide High
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
              <span className="block font-mono text-[10px] font-bold uppercase text-amber-400">
                Official IMD Weather Synopsis
              </span>
              <p className="mt-1 text-xs leading-relaxed">
                {weather?.forecast_summary ||
                  weather?.forecast6h ||
                  'Severe cyclonic storm system advancing toward coastal Andhra Pradesh. High risk of localized urban flash flooding and drainage inundation across low-elevation sectors.'}
              </p>
            </div>
          </div>

          {/* Shelter Capacity Summary */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Building2 className="h-4 w-4 text-emerald-400" /> Open Relief
                Shelters
              </span>
              <Badge variant="secondary">{sheltersCount} Active</Badge>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              PostgreSQL database synced with active relief shelters. 18,500
              total citizen capacity available with medical & food supplies.
            </p>
          </div>
        </motion.div>
      )}

      {/* TAB 3: REALTIME TIMELINE */}
      {activeTab === 'timeline' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <IncidentTimeline />
        </motion.div>
      )}
    </aside>
  );
};
