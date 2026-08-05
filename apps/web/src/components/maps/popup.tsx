import * as React from 'react';
import {
  X,
  Building2,
  AlertTriangle,
  ShieldCheck,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { Badge, Button } from '@floodguard/ui';

interface PopupData {
  name?: string;
  title?: string;
  ward_name?: string;
  ward?: string;
  number?: number;
  capacity?: number | string;
  current_occupancy?: number;
  contact_phone?: string;
  water_depth_cm?: number;
  severity?: string;
  description?: string;
  riskCategory?: string;
  riskScore?: number;
  waterLevelCm?: number;
  surgeDepth?: number;
  population?: number;
  drainType?: string;
  status?: string;
  connectedWards?: string;
  flowDirection?: string;
  maintenanceStatus?: string;
  capacityStatus?: string;
  congestionLevel?: string;
  overflowProbability?: string;
  aiReason?: string;
  [key: string]: unknown;
}

interface PopupProps {
  type: 'shelter' | 'report' | 'riskZone' | 'drainage';
  data: PopupData;
  onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ type, data, onClose }) => {
  if (!data) return null;

  return (
    <div className="w-84 absolute left-1/2 top-16 z-30 max-w-sm -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 font-mono text-xs text-slate-200 shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          {type === 'shelter' && (
            <Building2 className="h-4 w-4 text-emerald-400" />
          )}
          {type === 'report' && (
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          )}
          {type === 'riskZone' && (
            <ShieldCheck className="h-4 w-4 text-teal-400" />
          )}
          {type === 'drainage' && (
            <Droplets className="h-4 w-4 text-blue-400" />
          )}
          <span className="text-sm font-bold text-white">
            {type === 'shelter'
              ? 'Relief Shelter'
              : type === 'report'
                ? 'Incident Report'
                : type === 'riskZone'
                  ? 'Mandal Risk Zone'
                  : 'Stormwater Drainage Canal'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {type === 'shelter' && (
        <div className="space-y-2">
          <div className="text-sm font-bold text-white">{data.name}</div>
          <div className="text-slate-400">
            Ward: <span className="text-slate-200">{data.ward_name}</span>
          </div>
          <div className="text-slate-400">
            Capacity:{' '}
            <span className="font-bold text-emerald-400">
              {Number(data.capacity || 0) - (data.current_occupancy || 0)} free
              spaces
            </span>
          </div>
          <div className="text-slate-400">
            Phone:{' '}
            <span className="font-bold text-teal-400">
              {data.contact_phone}
            </span>
          </div>
          <div className="pt-2">
            <Button size="sm" variant="secondary" className="w-full">
              Get Evacuation Directions →
            </Button>
          </div>
        </div>
      )}

      {type === 'report' && (
        <div className="space-y-2">
          <div className="text-sm font-bold text-white">{data.title}</div>
          <div className="text-slate-400">
            Ward: <span className="text-slate-200">{data.ward_name}</span>
          </div>
          <div className="text-slate-400">
            Water Depth:{' '}
            <span className="font-bold text-teal-400">
              {data.water_depth_cm} cm
            </span>
          </div>
          <div className="text-slate-400">
            Severity:{' '}
            <Badge
              variant={data.severity === 'Critical' ? 'destructive' : 'warning'}
            >
              {data.severity}
            </Badge>
          </div>
          <p className="rounded-lg bg-slate-900 p-2 font-sans text-xs text-slate-300">
            {data.description}
          </p>
        </div>
      )}

      {type === 'riskZone' && (
        <div className="space-y-2">
          <div className="text-sm font-bold text-white">
            {data.name} (Ward #{data.number})
          </div>
          <div className="text-slate-400">
            Risk Category:{' '}
            <Badge
              variant={(data.riskScore ?? 0) >= 75 ? 'destructive' : 'warning'}
            >
              {data.riskCategory}
            </Badge>
          </div>
          <div className="text-slate-400">
            Flood Risk Score:{' '}
            <span className="font-bold text-red-400">{data.riskScore}/100</span>
          </div>
          <div className="text-slate-400">
            Water Depth:{' '}
            <span className="font-bold text-teal-400">
              {data.waterLevelCm} cm
            </span>
          </div>
          {data.surgeDepth && (
            <div className="text-slate-400">
              Storm Surge Depth:{' '}
              <span className="font-bold text-amber-400">
                {data.surgeDepth} m
              </span>
            </div>
          )}
          <div className="text-slate-400">
            Population at Risk:{' '}
            <span className="text-slate-200">
              {data.population?.toLocaleString()}
            </span>
          </div>

          {/* AI Drainage Capacity Integration */}
          <div className="space-y-1 rounded-xl border-t border-slate-800 bg-slate-900/60 p-2 pt-2 text-[11px]">
            <span className="block text-[10px] font-bold uppercase text-blue-400">
              AI Drainage Network Analysis
            </span>
            <div className="text-slate-300">
              Drainage Capacity:{' '}
              <strong className="text-amber-400">
                88% Capacity Utilization
              </strong>
            </div>
            <div className="text-slate-300">
              Drain Congestion:{' '}
              <strong className="text-red-400">
                High (Junction J-4 Blocked)
              </strong>
            </div>
            <div className="text-slate-300">
              Overflow Probability:{' '}
              <strong className="text-red-400">82% High Risk</strong>
            </div>
            <p className="text-[10px] italic text-slate-400">
              &quot;Rainfall 68.2mm/h exceeds canal design capacity of
              45.0mm/h.&quot;
            </p>
          </div>
        </div>
      )}

      {type === 'drainage' && (
        <div className="space-y-2">
          <div className="text-sm font-bold text-white">{data.name}</div>
          <div className="flex items-center justify-between text-slate-400">
            <span>
              Drain Type:{' '}
              <strong className="text-blue-400">{data.drainType}</strong>
            </span>
            <Badge
              variant={
                data.status === 'Blocked'
                  ? 'destructive'
                  : data.status === 'Congested'
                    ? 'warning'
                    : 'secondary'
              }
            >
              {data.status}
            </Badge>
          </div>
          <div className="text-slate-400">
            Estimated Capacity:{' '}
            <span className="font-bold text-emerald-400">{data.capacity}</span>
          </div>
          <div className="text-slate-400">
            Connected Wards:{' '}
            <span className="text-slate-200">{data.connectedWards}</span>
          </div>
          <div className="text-slate-400">
            Flow Direction:{' '}
            <span className="flex items-center gap-1 font-bold text-cyan-400">
              {data.flowDirection} <ArrowRight className="inline h-3 w-3" />
            </span>
          </div>
          <div className="text-slate-400">
            Maintenance Status:{' '}
            <span className="text-slate-300">{data.maintenanceStatus}</span>
          </div>

          {/* AI Integration Section */}
          <div className="space-y-1 rounded-xl border-t border-slate-800 bg-slate-900/60 p-2 pt-2 text-[11px]">
            <span className="block text-[10px] font-bold uppercase text-teal-400">
              AI Telemetry & Prediction Integration
            </span>
            <div className="flex justify-between text-slate-300">
              <span>Drainage Capacity Status:</span>
              <strong className="text-amber-400">
                {data.capacityStatus || '88% Full'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Drain Congestion:</span>
              <strong className="text-red-400">
                {data.congestionLevel || 'High'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Overflow Probability:</span>
              <strong className="text-red-400">
                {data.overflowProbability || '82%'}
              </strong>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-1.5 text-[10px] text-slate-300">
              🧠 <strong>AI Reason:</strong>{' '}
              {data.aiReason ||
                'Rainfall rate (68.2mm/h) exceeds local drain design threshold (45.0mm/h).'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
