import * as React from 'react';
import { motion } from 'framer-motion';
import {
  CloudRain, FileText, ShieldCheck, Building2, Navigation, Bell, Clock, Activity
} from 'lucide-react';
import { Badge } from '@floodguard/ui';

export interface TimelineEvent {
  id: string;
  type: 'rainfall' | 'prediction' | 'report' | 'verification' | 'shelter' | 'route' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  badgeText?: string;
  badgeVariant?: 'destructive' | 'warning' | 'secondary' | 'default';
  location?: string;
}

const DEFAULT_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'ev-1',
    type: 'rainfall',
    title: 'Monsoon Depresson Telemetry Update',
    description: 'IMD Rain Telemetry Gauge #4 (Gajuwaka) records 85.0 mm/h cumulative precipitation.',
    timestamp: '18:45 IST',
    badgeText: '85.0 mm/h',
    badgeVariant: 'warning',
    location: 'Ward 14 (Gajuwaka)',
  },
  {
    id: 'ev-2',
    type: 'prediction',
    title: 'XGBoost Risk Score Escalation',
    description: 'AI model updated risk score for Ward 14 to 92.4/100 (Critical Level - Red Alert).',
    timestamp: '18:46 IST',
    badgeText: 'Risk 92.4 (Critical)',
    badgeVariant: 'destructive',
    location: 'Gajuwaka Industrial Zone',
  },
  {
    id: 'ev-3',
    type: 'report',
    title: 'Citizen Flood Report Submitted',
    description: "Ramesh Kumar reported 'Main Road Submerged' with photo evidence (65cm depth).",
    timestamp: '18:48 IST',
    badgeText: 'Report Submitted',
    badgeVariant: 'secondary',
    location: 'Gajuwaka Bus Station',
  },
  {
    id: 'ev-4',
    type: 'verification',
    title: 'GVMC Authority Report Verification',
    description: 'Municipal Officer Suresh verified report rep-101. Priority assigned: P0 (Critical).',
    timestamp: '18:50 IST',
    badgeText: 'P0 Verified',
    badgeVariant: 'destructive',
    location: 'GVMC Control Room',
  },
  {
    id: 'ev-5',
    type: 'shelter',
    title: 'Relief Shelter Capacity Activation',
    description: 'Gajuwaka Sports Stadium activated for evacuation (950 / 1200 occupied).',
    timestamp: '18:52 IST',
    badgeText: 'Shelter Active',
    badgeVariant: 'secondary',
    location: 'Gajuwaka Stadium',
  },
  {
    id: 'ev-6',
    type: 'route',
    title: 'A* Safe Route Polyline Calculation',
    description: 'A* routing engine computed safe path avoiding submerged NH-16 underpass.',
    timestamp: '18:54 IST',
    badgeText: 'Route Updated',
    badgeVariant: 'secondary',
    location: 'Ward 14 to Ward 11 Path',
  },
  {
    id: 'ev-7',
    type: 'alert',
    title: 'Public SMS & Siren Warning Broadcast',
    description: 'Multilingual emergency SMS sent to 45,000 residents in Ward 14 & Ward 22.',
    timestamp: '18:55 IST',
    badgeText: 'Broadcast Complete',
    badgeVariant: 'destructive',
    location: 'Visakhapatnam GVMC',
  },
];

interface Props {
  events?: TimelineEvent[];
}

export const IncidentTimeline: React.FC<Props> = ({ events = DEFAULT_TIMELINE_EVENTS }) => {
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'rainfall':
        return <CloudRain className="h-4 w-4 text-cyan-400" />;
      case 'prediction':
        return <Activity className="h-4 w-4 text-red-400 animate-pulse" />;
      case 'report':
        return <FileText className="h-4 w-4 text-amber-400" />;
      case 'verification':
        return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
      case 'shelter':
        return <Building2 className="h-4 w-4 text-blue-400" />;
      case 'route':
        return <Navigation className="h-4 w-4 text-teal-400" />;
      case 'alert':
        return <Bell className="h-4 w-4 text-red-500 animate-bounce" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal-400" />
          Realtime Incident Chronological Timeline ({events.length} Events)
        </span>
        <span className="text-[10px] font-mono text-teal-400 animate-pulse">● Live Stream Active</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((ev, index) => (
          <motion.div
            key={ev.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1 text-xs font-mono shadow-sm"
          >
            {/* Timeline node icon */}
            <div className="absolute -left-[31px] top-3.5 p-1 rounded-full bg-slate-950 border border-slate-700">
              {getIcon(ev.type)}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{ev.title}</span>
              <div className="flex items-center space-x-2">
                {ev.badgeText && (
                  <Badge variant={ev.badgeVariant || 'secondary'}>
                    {ev.badgeText}
                  </Badge>
                )}
                <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
              </div>
            </div>

            <p className="text-slate-300 text-xs font-sans leading-relaxed">{ev.description}</p>

            {ev.location && (
              <div className="text-[10px] text-slate-500 pt-0.5">
                📍 Location: <span className="text-slate-400">{ev.location}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
